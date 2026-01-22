import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Fixed packages - NEVER accept amounts from frontend
const PACKAGES = {
  solo: 25.00,  // 25€
  duo: 50.00,   // 50€
} as const;

type PackageType = keyof typeof PACKAGES;

// Log environment status at module load
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
console.log('[Stripe Route] Module loaded, STRIPE_SECRET_KEY present:', !!STRIPE_KEY, STRIPE_KEY ? `(${STRIPE_KEY.substring(0, 10)}...)` : '(undefined)');

// Initialize Stripe lazily
let stripeInstance: Stripe | null = null;

const getStripe = (): Stripe => {
  if (stripeInstance) return stripeInstance;
  
  const apiKey = process.env.STRIPE_SECRET_KEY;
  console.log('[Stripe Route] getStripe called, key present:', !!apiKey);
  
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  
  stripeInstance = new Stripe(apiKey, {
    apiVersion: '2025-01-27.acacia',
  });
  return stripeInstance;
};

export async function POST(request: NextRequest) {
  console.log('[Stripe Route] POST request received');
  
  try {
    // Parse body with error handling
    let body;
    try {
      body = await request.json();
      console.log('[Stripe Route] Request body:', JSON.stringify(body));
    } catch (parseError) {
      console.error('[Stripe Route] JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { 
      packageType, 
      originUrl,
      metadata = {} 
    } = body as {
      packageType: PackageType;
      originUrl: string;
      metadata?: Record<string, string>;
    };

    // Validate package type
    if (!packageType || !PACKAGES[packageType]) {
      console.log('[Stripe Route] Invalid package type:', packageType);
      return NextResponse.json(
        { error: 'Invalid package type. Must be "solo" or "duo"' },
        { status: 400 }
      );
    }

    // Validate origin URL
    if (!originUrl) {
      console.log('[Stripe Route] Missing originUrl');
      return NextResponse.json(
        { error: 'Origin URL is required' },
        { status: 400 }
      );
    }

    console.log('[Stripe Route] Getting Stripe instance...');
    const stripe = getStripe();
    const amount = PACKAGES[packageType];
    console.log('[Stripe Route] Creating session for:', { packageType, amount, originUrl });

    // Build success and cancel URLs
    const successUrl = `${originUrl}/discovery?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${originUrl}/discovery?payment=cancelled`;
    console.log('[Stripe Route] URLs:', { successUrl, cancelUrl });

    // Create Stripe Checkout Session
    console.log('[Stripe Route] Calling stripe.checkout.sessions.create...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: packageType === 'duo' 
                ? 'Séance Duo Afroboost (2 places)' 
                : 'Séance Solo Afroboost',
              description: packageType === 'duo'
                ? 'Ticket pour 2 personnes - Offrez une séance à votre partenaire'
                : 'Ticket individuel pour une séance sportive',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        packageType,
        amount: amount.toString(),
      },
    });

    console.log('[Stripe Route] Session created successfully:', {
      sessionId: session.id,
      url: session.url?.substring(0, 50) + '...',
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('[Stripe Route] ERROR:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('[Stripe Route] Error details:', { message: errorMessage, stack: errorStack });
    
    if (errorMessage.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.', details: errorMessage },
        { status: 503 }
      );
    }

    // Always return JSON, never let it fall through to HTML error
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
