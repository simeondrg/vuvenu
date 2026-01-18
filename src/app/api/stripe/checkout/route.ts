/**
 * API Route: Stripe Checkout Session
 *
 * Crée une session de paiement Stripe pour un abonnement (mensuel ou annuel)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getStripePriceId, getStripeUrls, STRIPE_SECRET_KEY } from '@/lib/stripe/config'
import { BillingPeriod, PlanTier } from '@/lib/constants/pricing'

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured')
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
})

// Validation du body de la requête
const checkoutSchema = z.object({
  tier: z.enum(['starter', 'pro', 'business']),
  billingPeriod: z.enum(['monthly', 'yearly']).default('monthly'),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Parser et valider le body
    const body = await request.json()
    const validation = checkoutSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { tier, billingPeriod } = validation.data

    // 2. Vérifier l'utilisateur authentifié
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 3. Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[Checkout] Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // 4. Obtenir le Price ID Stripe selon le plan et la période
    let priceId: string
    try {
      priceId = getStripePriceId(tier, billingPeriod)
    } catch (error) {
      console.error('[Checkout] Price ID error:', error)
      return NextResponse.json(
        {
          error: 'Stripe price not configured',
          message:
            error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }

    // 5. Préparer les URLs de callback
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || ''
    const { successUrl, cancelUrl } = getStripeUrls(origin)

    // 6. Créer ou réutiliser le customer Stripe
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Sauvegarder le customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // 7. Créer la session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        supabase_user_id: user.id,
        plan_tier: tier,
        billing_period: billingPeriod,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          supabase_user_id: user.id,
          plan_tier: tier,
          billing_period: billingPeriod,
        },
      },
    })

    console.log('[Checkout] Session created:', {
      sessionId: session.id,
      tier,
      billingPeriod,
      priceId,
      userId: user.id,
    })

    // 8. Retourner l'URL de la session
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[Checkout] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
