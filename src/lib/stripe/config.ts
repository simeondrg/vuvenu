/**
 * Configuration Stripe pour VuVenu
 *
 * Contient les Price IDs et utilitaires pour gérer les abonnements
 */

import { BillingPeriod, PlanTier } from '@/lib/constants/pricing'

/**
 * Prix Stripe (Price IDs) pour chaque plan et période
 */
export const STRIPE_PRICES: Record<
  PlanTier,
  {
    monthlyPriceId: string
    yearlyPriceId: string
  }
> = {
  starter: {
    monthlyPriceId: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
    yearlyPriceId: process.env.STRIPE_PRICE_STARTER_YEARLY || '',
  },
  pro: {
    monthlyPriceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    yearlyPriceId: process.env.STRIPE_PRICE_PRO_YEARLY || '',
  },
  business: {
    monthlyPriceId: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '',
    yearlyPriceId: process.env.STRIPE_PRICE_BUSINESS_YEARLY || '',
  },
}

/**
 * Obtient le Price ID Stripe selon le plan et la période de facturation
 */
export function getStripePriceId(
  tier: PlanTier,
  period: BillingPeriod
): string {
  const prices = STRIPE_PRICES[tier]

  if (!prices) {
    throw new Error(`Invalid plan tier: ${tier}`)
  }

  const priceId = period === 'monthly' ? prices.monthlyPriceId : prices.yearlyPriceId

  if (!priceId) {
    throw new Error(
      `Stripe Price ID not configured for ${tier} ${period}. Check your .env.local file.`
    )
  }

  return priceId
}

/**
 * Détermine le tier et la période depuis un Price ID Stripe
 */
export function getPlanFromPriceId(priceId: string): {
  tier: PlanTier
  period: BillingPeriod
} | null {
  // Parcourir tous les plans pour trouver le bon price ID
  for (const [tier, prices] of Object.entries(STRIPE_PRICES)) {
    if (prices.monthlyPriceId === priceId) {
      return { tier: tier as PlanTier, period: 'monthly' }
    }
    if (prices.yearlyPriceId === priceId) {
      return { tier: tier as PlanTier, period: 'yearly' }
    }
  }

  return null
}

/**
 * Vérifie si tous les Price IDs sont configurés
 */
export function areStripePricesConfigured(): boolean {
  return Object.values(STRIPE_PRICES).every(
    (prices) => prices.monthlyPriceId && prices.yearlyPriceId
  )
}

/**
 * Constantes Stripe
 */
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

/**
 * URLs de callback Stripe
 */
export function getStripeUrls(origin: string) {
  return {
    successUrl: `${origin}/dashboard?subscription=success`,
    cancelUrl: `${origin}/choose-plan?subscription=canceled`,
    customerPortalUrl: `${origin}/dashboard/settings`,
  }
}
