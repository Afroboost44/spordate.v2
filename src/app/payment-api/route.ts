import { NextRequest, NextResponse } from 'next/server';

// This route bypasses the /api prefix that might be routed to the backend
// It creates Stripe checkout sessions directly

const PACKAGES = {
  solo: 25.00,
  duo: 50.00,
} as const;

type PackageType = keyof typeof PACKAGES;

export async function POST(request: NextRequest) {
  console.log('[Payment API] Request received');
  
  try {
    const body = await request.json();
    const { packageType, originUrl, metadata = {} } = body;
    
    console.log('[Payment API] Body:', { packageType, originUrl });
    
    // Validate
    if (!packageType || !PACKAGES[packageType as PackageType]) {
      return NextResponse.json(
        { error: 'Invalid package type. Must be "solo" or "duo"' },
        { status: 400 }
      );
    }
    
    if (!originUrl) {
      return NextResponse.json(
        { error: 'Origin URL is required' },
        { status: 400 }
      );
    }
    
    const Stripe = (await import('stripe')).default;
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      console.error('[Payment API] STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }
    
    console.log('[Payment API] Creating Stripe session...');
    
    const stripe = new Stripe(apiKey, { apiVersion: '2025-01-27.acacia' });
    const amount = PACKAGES[packageType as PackageType];
    
    const successUrl = `${originUrl}/discovery?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${originUrl}/discovery?payment=cancelled`;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: packageType === 'duo' ? 'Séance Duo Afroboost (2 places)' : 'Séance Solo Afroboost',
            description: packageType === 'duo' 
              ? 'Ticket pour 2 personnes - Offrez une séance à votre partenaire'
              : 'Ticket individuel pour une séance sportive',
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { ...metadata, packageType, amount: amount.toString() },
    });
    
    console.log('[Payment API] Session created:', session.id);
    
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
    
  } catch (error) {
    console.error('[Payment API] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Use POST to create a checkout session',
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
  });
}
