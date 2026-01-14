/**
 * API Route: Stripe Customer Portal
 *
 * Crée une session du portail client Stripe pour gérer l'abonnement
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'
import { STRIPE_SECRET_KEY } from '@/lib/stripe/config'

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured')
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'utilisateur authentifié
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Récupérer le customer ID Stripe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe first.' },
        { status: 400 }
      )
    }

    // 3. Créer la session du portail client
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || ''
    const returnUrl = `${origin}/dashboard/settings`

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    })

    console.log('[Portal] Session created:', {
      customerId: profile.stripe_customer_id,
      userId: user.id,
    })

    // 4. Retourner l'URL du portail
    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('[Portal] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create portal session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
