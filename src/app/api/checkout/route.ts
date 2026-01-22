import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Fixed packages - NEVER accept amounts from frontend
const PACKAGES = {
  solo: 25.00,  // 25€
  duo: 50.00,   // 50€
} as const;

type PackageType = keyof typeof PACKAGES;

// Initialize Stripe
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      return NextResponse.json(
        { error: 'Invalid package type. Must be "solo" or "duo"' },
        { status: 400 }
      );
    }

    // Validate origin URL
    if (!originUrl) {
      return NextResponse.json(
        { error: 'Origin URL is required' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const amount = PACKAGES[packageType];

    // Build success and cancel URLs
    const successUrl = `${originUrl}/discovery?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${originUrl}/discovery?payment=cancelled`;

    // Create Stripe Checkout Session
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

    // Log for tracking (in production, save to database)
    console.log('[Stripe] Checkout session created:', {
      sessionId: session.id,
      amount,
      packageType,
      metadata,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error);
    
    if (error instanceof Error && error.message.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
