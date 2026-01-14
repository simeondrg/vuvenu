/**
 * Constantes de tarification VuVenu
 *
 * Tarifs mensuels et annuels avec réduction de 17% (2 mois offerts)
 */

export type BillingPeriod = 'monthly' | 'yearly'
export type PlanTier = 'starter' | 'pro' | 'business'

export interface PricingPlan {
  id: PlanTier
  name: string
  description: string
  monthly: {
    price: number // en euros
    display: string
  }
  yearly: {
    price: number // en euros
    pricePerMonth: number // prix mensuel équivalent
    savings: number // économie totale en euros
    savingsPercentage: number // pourcentage d'économie
    display: string
  }
  features: string[]
  limitations: string[]
  cta: string
  recommended?: boolean
  scriptsPerMonth: number | 'unlimited'
  campaignsPerMonth: number | 'unlimited'
}

/**
 * Plans de tarification VuVenu
 */
export const PRICING_PLANS: Record<PlanTier, PricingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Pour débuter en douceur',
    monthly: {
      price: 59,
      display: '59€/mois',
    },
    yearly: {
      price: 590,
      pricePerMonth: 49.17,
      savings: 118,
      savingsPercentage: 16.7,
      display: '590€/an',
    },
    features: [
      '10 scripts vidéo / mois',
      'Générateur de scripts IA',
      'Formats optimisés TikTok/Reels',
      '5 industries supportées',
      'Support email',
    ],
    limitations: [
      'Pas de campagnes publicitaires',
      'Pas de génération d\'images IA',
    ],
    cta: 'Commencer gratuitement',
    recommended: false,
    scriptsPerMonth: 10,
    campaignsPerMonth: 0,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Le choix des professionnels',
    monthly: {
      price: 119,
      display: '119€/mois',
    },
    yearly: {
      price: 1190,
      pricePerMonth: 99.17,
      savings: 238,
      savingsPercentage: 16.7,
      display: '1190€/an',
    },
    features: [
      '30 scripts vidéo / mois',
      '5 campagnes publicitaires / mois',
      'Générateur de publicités Meta',
      'Images IA incluses (Gemini Imagen)',
      'Analytics de performance',
      '22 industries supportées',
      'Templates personnalisables',
      'Support prioritaire',
    ],
    limitations: [],
    cta: 'Essayer 14 jours gratuits',
    recommended: true,
    scriptsPerMonth: 30,
    campaignsPerMonth: 5,
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'Croissance illimitée',
    monthly: {
      price: 249,
      display: '249€/mois',
    },
    yearly: {
      price: 2490,
      pricePerMonth: 207.5,
      savings: 498,
      savingsPercentage: 16.7,
      display: '2490€/an',
    },
    features: [
      'Scripts illimités',
      'Campagnes illimitées',
      'API access privé',
      'Formation personnalisée 1h',
      'Account manager dédié',
      'Intégrations sur mesure',
      'Rapports avancés',
      'Support téléphonique',
    ],
    limitations: [],
    cta: 'Demander une démo',
    recommended: false,
    scriptsPerMonth: 'unlimited',
    campaignsPerMonth: 'unlimited',
  },
}

/**
 * Calcule le prix selon le plan et la période de facturation
 */
export function getPrice(tier: PlanTier, period: BillingPeriod): number {
  const plan = PRICING_PLANS[tier]
  return period === 'monthly' ? plan.monthly.price : plan.yearly.price
}

/**
 * Calcule l'économie réalisée avec un abonnement annuel
 */
export function getAnnualSavings(tier: PlanTier): number {
  return PRICING_PLANS[tier].yearly.savings
}

/**
 * Calcule le pourcentage d'économie avec un abonnement annuel
 */
export function getAnnualSavingsPercentage(tier: PlanTier): number {
  return PRICING_PLANS[tier].yearly.savingsPercentage
}

/**
 * Obtient le prix mensuel équivalent pour un abonnement annuel
 */
export function getYearlyPricePerMonth(tier: PlanTier): number {
  return PRICING_PLANS[tier].yearly.pricePerMonth
}

/**
 * Formate un prix pour l'affichage
 */
export function formatPrice(
  tier: PlanTier,
  period: BillingPeriod,
  showMonthlyEquivalent = false
): string {
  const plan = PRICING_PLANS[tier]

  if (period === 'monthly') {
    return plan.monthly.display
  }

  if (showMonthlyEquivalent) {
    return `${plan.yearly.display} (soit ${Math.round(plan.yearly.pricePerMonth)}€/mois)`
  }

  return plan.yearly.display
}

/**
 * Constante de réduction annuelle (2 mois offerts)
 */
export const ANNUAL_DISCOUNT_MONTHS = 2
export const ANNUAL_DISCOUNT_PERCENTAGE = 16.7
