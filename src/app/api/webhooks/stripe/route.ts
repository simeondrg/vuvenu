import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')

    if (!sig) {
      console.error('Signature Stripe manquante')
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: any) {
      console.error('Erreur validation webhook Stripe:', err.message)
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      )
    }

    // Initialiser Supabase avec la service role key
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() { return undefined },
        },
      }
    )

    // Traiter l'événement selon son type
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break

      default:
        console.log(`Événement Stripe non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erreur webhook Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Gérer les mises à jour d'abonnement
async function handleSubscriptionUpdate(subscription: Stripe.Subscription, supabase: any) {
  try {
    const customerId = subscription.customer as string
    const status = subscription.status
    const priceId = subscription.items.data[0]?.price.id

    // Déterminer le tier d'abonnement basé sur le price ID
    const tier = getPlanTierFromPriceId(priceId)

    // Trouver l'utilisateur par customer ID Stripe
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (findError || !profile) {
      console.error('Utilisateur non trouvé pour customer ID:', customerId)
      return
    }

    // Mettre à jour le profil
    const updateData: any = {
      subscription_status: mapStripeStatusToApp(status),
      subscription_tier: tier,
      updated_at: new Date().toISOString(),
    }

    // Reset des compteurs si nouveau cycle ou upgrade
    if (status === 'active') {
      updateData.scripts_count_month = 0
      updateData.campaigns_count_month = 0
      updateData.counts_reset_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', profile.id)

    if (updateError) {
      console.error('Erreur mise à jour profil:', updateError)
    } else {
      console.log(`Abonnement mis à jour pour user ${profile.id}: ${tier} (${status})`)
    }

  } catch (error) {
    console.error('Erreur handleSubscriptionUpdate:', error)
  }
}

// Gérer la suppression d'abonnement
async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  try {
    const customerId = subscription.customer as string

    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (findError || !profile) {
      console.error('Utilisateur non trouvé pour customer ID:', customerId)
      return
    }

    // Rétrograder vers le plan gratuit
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'none',
        subscription_tier: 'starter',
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (updateError) {
      console.error('Erreur rétrogradation profil:', updateError)
    } else {
      console.log(`Abonnement supprimé pour user ${profile.id}`)
    }

  } catch (error) {
    console.error('Erreur handleSubscriptionDeleted:', error)
  }
}

// Gérer les paiements réussis
async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  try {
    const customerId = invoice.customer as string

    if (invoice.billing_reason === 'subscription_cycle') {
      // Nouveau cycle de facturation - reset des compteurs
      const { data: profile, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            scripts_count_month: 0,
            campaigns_count_month: 0,
            counts_reset_at: new Date().toISOString(),
          })
          .eq('id', profile.id)

        console.log(`Compteurs réinitialisés pour user ${profile.id}`)
      }
    }

  } catch (error) {
    console.error('Erreur handlePaymentSucceeded:', error)
  }
}

// Gérer les échecs de paiement
async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  try {
    const customerId = invoice.customer as string

    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      console.log(`Paiement échoué pour user ${profile.id}`)
    }

  } catch (error) {
    console.error('Erreur handlePaymentFailed:', error)
  }
}

// Gérer la completion du checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  try {
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    if (!customerId || !subscriptionId) {
      console.error('Customer ID ou Subscription ID manquant dans le checkout')
      return
    }

    // Récupérer les détails de l'abonnement
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id
    const tier = getPlanTierFromPriceId(priceId)

    // Mettre à jour le profil avec le nouveau customer ID et abonnement
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_tier: tier,
          scripts_count_month: 0,
          campaigns_count_month: 0,
          counts_reset_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      console.log(`Checkout complété pour user ${profile.id}: ${tier}`)
    }

  } catch (error) {
    console.error('Erreur handleCheckoutCompleted:', error)
  }
}

// Mapper les statuts Stripe vers les statuts application
function mapStripeStatusToApp(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'past_due':
      return 'past_due'
    case 'canceled':
    case 'incomplete_expired':
    case 'unpaid':
      return 'canceled'
    default:
      return 'none'
  }
}

// Déterminer le tier d'abonnement basé sur le price ID
function getPlanTierFromPriceId(priceId?: string): string {
  if (!priceId) return 'starter'

  // Mapper les price IDs aux tiers (configuration via env vars)
  if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY ||
      priceId === process.env.STRIPE_PRICE_STARTER_YEARLY) {
    return 'starter'
  }

  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
      priceId === process.env.STRIPE_PRICE_PRO_YEARLY) {
    return 'pro'
  }

  if (priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY ||
      priceId === process.env.STRIPE_PRICE_BUSINESS_YEARLY) {
    return 'business'
  }

  // Fallback basé sur les noms des prix (moins fiable)
  if (priceId.includes('pro')) return 'pro'
  if (priceId.includes('business')) return 'business'

  return 'starter'
}