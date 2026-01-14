/**
 * Système de métriques business pour VuVenu
 * Suit les KPIs critiques pour le SaaS B2B
 */

import { logger } from './logger'

interface UserMetrics {
  userId: string
  plan: 'starter' | 'pro' | 'business'
  accountAge: number // jours depuis inscription
}

type SubscriptionTier = 'starter' | 'pro' | 'business'

interface ScriptGenerationMetrics {
  userId: string
  plan: SubscriptionTier | string
  format: 'reels' | 'posts' | 'stories'
  tone: string
  industry: string
  duration: number // ms
  tokensUsed: number
  success: boolean
  errorCode?: string
}

interface CampaignMetrics {
  userId: string
  plan: SubscriptionTier | string
  campaignType: 'traffic' | 'conversions' | 'awareness'
  budget: number
  concepts: number
  duration: number // ms
  success: boolean
}

interface ConversionMetrics {
  userId: string
  fromPlan: SubscriptionTier | string
  toPlan: SubscriptionTier | string
  revenue: number
  trigger: 'limit_reached' | 'features' | 'manual' | 'onboarding'
}

interface UsageMetrics {
  userId: string
  plan: SubscriptionTier | string
  scriptsThisMonth: number
  campaignsThisMonth: number
  daysActive: number
  lastActivity: string
}

export class VuVenuMetrics {
  /**
   * Métriques d'inscription utilisateur
   */
  static trackUserRegistration(data: {
    userId: string
    source: 'organic' | 'ads' | 'referral' | 'direct'
    device: 'mobile' | 'desktop' | 'tablet'
    location?: string
  }) {
    logger.business({
      event: 'user_registered',
      userId: data.userId,
      properties: {
        source: data.source,
        device: data.device,
        location: data.location
      }
    })

    // Métriques techniques
    logger.info('New user registration', {
      userId: data.userId,
      source: data.source
    })
  }

  /**
   * Métriques d'onboarding
   */
  static trackOnboardingStep(data: {
    userId: string
    step: 'welcome' | 'business_info' | 'goals' | 'plan_selection' | 'completed'
    duration: number
    abandoned?: boolean
  }) {
    logger.business({
      event: 'onboarding_step',
      userId: data.userId,
      properties: {
        step: data.step,
        duration: data.duration,
        abandoned: data.abandoned
      }
    })
  }

  /**
   * Métriques de génération de scripts (KPI principal)
   */
  static trackScriptGeneration(data: ScriptGenerationMetrics) {
    const event = data.success ? 'script_generated' : 'script_generation_failed'

    logger.business({
      event,
      userId: data.userId,
      plan: data.plan,
      value: data.success ? 1 : 0,
      properties: {
        format: data.format,
        tone: data.tone,
        industry: data.industry,
        duration: data.duration,
        tokensUsed: data.tokensUsed,
        errorCode: data.errorCode
      }
    })

    // Alertes si génération trop lente
    if (data.duration > 30000) { // > 30s
      logger.warn('Slow script generation', {
        userId: data.userId,
        duration: data.duration
      })
    }

    // Métriques de performance par industrie
    logger.performance(`script_generation_${data.industry}`, data.duration, {
      format: data.format,
      success: data.success
    })
  }

  /**
   * Métriques de génération de campagnes
   */
  static trackCampaignGeneration(data: CampaignMetrics) {
    const event = data.success ? 'campaign_generated' : 'campaign_generation_failed'

    logger.business({
      event,
      userId: data.userId,
      plan: data.plan,
      value: data.success ? data.budget : 0,
      properties: {
        type: data.campaignType,
        budget: data.budget,
        concepts: data.concepts,
        duration: data.duration
      }
    })
  }

  /**
   * Métriques de conversion (upgrade de plan)
   */
  static trackPlanUpgrade(data: ConversionMetrics) {
    logger.business({
      event: 'plan_upgraded',
      userId: data.userId,
      plan: data.toPlan,
      value: data.revenue,
      properties: {
        fromPlan: data.fromPlan,
        toPlan: data.toPlan,
        trigger: data.trigger,
        revenue: data.revenue
      }
    })

    // Calcul du LTV (approximatif)
    const monthlyValue = data.toPlan === 'business' ? 249 : data.toPlan === 'pro' ? 119 : 59
    logger.info('Revenue generated', {
      userId: data.userId,
      monthlyValue,
      trigger: data.trigger
    })
  }

  /**
   * Métriques d'usage mensuel (pour churn prediction)
   */
  static trackMonthlyUsage(data: UsageMetrics) {
    const utilizationRate = data.plan === 'starter'
      ? data.scriptsThisMonth / 10
      : data.plan === 'pro'
        ? data.scriptsThisMonth / 30
        : data.scriptsThisMonth / 100 // approximation pour business

    logger.business({
      event: 'monthly_usage',
      userId: data.userId,
      plan: data.plan,
      value: utilizationRate,
      properties: {
        scriptsUsed: data.scriptsThisMonth,
        campaignsUsed: data.campaignsThisMonth,
        daysActive: data.daysActive,
        utilizationRate,
        lastActivity: data.lastActivity
      }
    })

    // Alertes pour usage faible (risque churn)
    if (utilizationRate < 0.2 && data.daysActive > 7) {
      logger.warn('Low usage detected - potential churn', {
        userId: data.userId,
        utilizationRate,
        daysActive: data.daysActive
      })
    }
  }

  /**
   * Métriques de limites atteintes (triggers pour conversion)
   */
  static trackLimitReached(data: {
    userId: string
    plan: string
    limitType: 'scripts' | 'campaigns'
    currentCount: number
    limitValue: number
  }) {
    logger.business({
      event: 'limit_reached',
      userId: data.userId,
      plan: data.plan,
      properties: {
        limitType: data.limitType,
        currentCount: data.currentCount,
        limitValue: data.limitValue,
        utilizationRate: data.currentCount / data.limitValue
      }
    })

    // Trigger pour notifications d'upgrade
    logger.info('Upgrade opportunity', {
      userId: data.userId,
      plan: data.plan,
      limitType: data.limitType
    })
  }

  /**
   * Métriques d'erreurs utilisateur (UX)
   */
  static trackUserError(data: {
    userId: string
    errorType: 'validation' | 'api' | 'network' | 'timeout'
    operation: 'script_generation' | 'campaign_creation' | 'payment'
    errorCode: string
    userAgent?: string
  }) {
    logger.business({
      event: 'user_error',
      userId: data.userId,
      properties: {
        errorType: data.errorType,
        operation: data.operation,
        errorCode: data.errorCode,
        userAgent: data.userAgent
      }
    })

    // Alertes pour erreurs critiques
    if (data.errorType === 'timeout' || data.operation === 'payment') {
      logger.error('Critical user error', undefined, {
        userId: data.userId,
        errorType: data.errorType,
        operation: data.operation
      })
    }
  }

  /**
   * Métriques de satisfaction (NPS simulé)
   */
  static trackUserSatisfaction(data: {
    userId: string
    plan: string
    feature: 'script_generation' | 'campaign_creation' | 'ui_ux'
    rating: number // 1-10
    feedback?: string
  }) {
    logger.business({
      event: 'user_satisfaction',
      userId: data.userId,
      plan: data.plan,
      value: data.rating,
      properties: {
        feature: data.feature,
        rating: data.rating,
        feedback: data.feedback
      }
    })
  }

  /**
   * Méthode générique pour logger des événements business
   */
  static business(data: {
    event: string
    userId: string
    plan?: SubscriptionTier | string
    value?: number
    properties?: Record<string, any>
  }) {
    logger.business({
      event: data.event,
      userId: data.userId,
      plan: data.plan,
      value: data.value,
      properties: data.properties
    })
  }

  /**
   * Dashboard de métriques en temps réel
   */
  static getMetricsSummary(): Record<string, any> {
    // TODO: Implémenter agrégation des métriques
    return {
      activeUsers: 'TODO',
      conversionRate: 'TODO',
      churnRate: 'TODO',
      avgScriptsPerUser: 'TODO',
      revenue: 'TODO'
    }
  }

  /**
   * Alertes automatiques basées sur les seuils
   */
  static checkAlerts(): void {
    // TODO: Implémenter vérification automatique des seuils
    // - Taux de conversion < 5%
    // - Temps de génération > 30s
    // - Taux d'erreur > 2%
    // - Usage faible détecté
  }
}

/**
 * Hook pour tracking automatique dans les composants
 */
export function useVuVenuTracking(userId?: string) {
  return {
    trackScriptGeneration: (data: Omit<ScriptGenerationMetrics, 'userId'>) =>
      userId ? VuVenuMetrics.trackScriptGeneration({ ...data, userId }) : null,

    trackCampaignGeneration: (data: Omit<CampaignMetrics, 'userId'>) =>
      userId ? VuVenuMetrics.trackCampaignGeneration({ ...data, userId }) : null,

    trackError: (data: Omit<Parameters<typeof VuVenuMetrics.trackUserError>[0], 'userId'>) =>
      userId ? VuVenuMetrics.trackUserError({ ...data, userId }) : null,

    trackSatisfaction: (data: Omit<Parameters<typeof VuVenuMetrics.trackUserSatisfaction>[0], 'userId'>) =>
      userId ? VuVenuMetrics.trackUserSatisfaction({ ...data, userId }) : null,
  }
}

/**
 * Middleware pour tracking automatique des API calls
 */
export function withMetricsTracking<T>(
  handler: T,
  operation: string
): T {
  return (async (...args: any[]) => {
    const start = Date.now()

    try {
      const result = await (handler as any)(...args)
      const duration = Date.now() - start

      // Tracking automatique basé sur l'opération
      if (operation.includes('script')) {
        // TODO: Extraire les données de script depuis les args
      } else if (operation.includes('campaign')) {
        // TODO: Extraire les données de campagne depuis les args
      }

      return result
    } catch (error) {
      const duration = Date.now() - start

      // Log d'erreur automatique
      logger.error(`Operation failed: ${operation}`, error as Error, {
        duration,
        operation
      })

      throw error
    }
  }) as T
}