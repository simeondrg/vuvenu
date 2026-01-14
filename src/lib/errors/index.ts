/**
 * Classes d'erreurs personnalisées pour VuVenu
 *
 * Système centralisé de gestion d'erreurs avec types spécifiques
 * selon le contexte (auth, API, IA, Stripe, etc.)
 */

// =============================================
// BASE ERROR CLASS
// =============================================

export abstract class VuVenuError extends Error {
  public readonly code: string
  public readonly context?: Record<string, any>
  public readonly timestamp: Date
  public readonly severity: 'low' | 'medium' | 'high' | 'critical'

  constructor(
    message: string,
    code: string,
    context?: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context
    this.timestamp = new Date()
    this.severity = severity

    // Capture stack trace (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Sérialise l'erreur pour logging
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      severity: this.severity,
      stack: this.stack,
    }
  }

  /**
   * Message user-friendly pour l'affichage
   */
  public abstract getUserMessage(): string
}

// =============================================
// AUTHENTICATION ERRORS
// =============================================

export class AuthError extends VuVenuError {
  constructor(
    message: string,
    code: string = 'AUTH_ERROR',
    context?: Record<string, any>
  ) {
    super(message, code, context, 'high')
  }

  public getUserMessage(): string {
    switch (this.code) {
      case 'AUTH_INVALID_CREDENTIALS':
        return 'Email ou mot de passe incorrect'
      case 'AUTH_EMAIL_NOT_CONFIRMED':
        return 'Veuillez confirmer votre email avant de vous connecter'
      case 'AUTH_USER_NOT_FOUND':
        return 'Aucun compte trouvé avec cet email'
      case 'AUTH_TOKEN_EXPIRED':
        return 'Votre session a expiré, veuillez vous reconnecter'
      case 'AUTH_INSUFFICIENT_PERMISSIONS':
        return 'Vous n\'avez pas les permissions pour cette action'
      default:
        return 'Erreur d\'authentification'
    }
  }
}

// =============================================
// SUBSCRIPTION ERRORS
// =============================================

export class SubscriptionError extends VuVenuError {
  constructor(
    message: string,
    code: string = 'SUBSCRIPTION_ERROR',
    context?: Record<string, any>
  ) {
    super(message, code, context, 'high')
  }

  public getUserMessage(): string {
    switch (this.code) {
      case 'SUBSCRIPTION_LIMIT_REACHED':
        return 'Limite mensuelle atteinte. Upgradez votre plan pour continuer'
      case 'SUBSCRIPTION_EXPIRED':
        return 'Votre abonnement a expiré. Renouvelez pour continuer'
      case 'SUBSCRIPTION_PAYMENT_FAILED':
        return 'Problème de paiement. Vérifiez vos informations bancaires'
      case 'SUBSCRIPTION_TIER_INSUFFICIENT':
        return 'Cette fonctionnalité nécessite un plan supérieur'
      default:
        return 'Erreur d\'abonnement'
    }
  }
}

// =============================================
// AI GENERATION ERRORS
// =============================================

export class AIError extends VuVenuError {
  public readonly provider?: 'claude' | 'gemini'
  public readonly tokensUsed?: number

  constructor(
    message: string,
    code: string = 'AI_ERROR',
    context?: Record<string, any>,
    provider?: 'claude' | 'gemini',
    tokensUsed?: number
  ) {
    super(message, code, context, 'medium')
    this.provider = provider
    this.tokensUsed = tokensUsed
  }

  public getUserMessage(): string {
    switch (this.code) {
      case 'AI_RATE_LIMIT':
        return 'Trop de demandes simultanées. Réessayez dans quelques instants'
      case 'AI_QUOTA_EXCEEDED':
        return 'Limite de génération atteinte. Réessayez plus tard'
      case 'AI_INVALID_INPUT':
        return 'Les paramètres fournis ne sont pas valides'
      case 'AI_GENERATION_FAILED':
        return 'Échec de la génération. Réessayez avec des paramètres différents'
      case 'AI_TIMEOUT':
        return 'La génération prend trop de temps. Réessayez'
      case 'AI_CONTENT_BLOCKED':
        return 'Le contenu demandé ne peut pas être généré'
      default:
        return 'Erreur de génération IA'
    }
  }
}

// =============================================
// DATABASE ERRORS
// =============================================

export class DatabaseError extends VuVenuError {
  constructor(
    message: string,
    code: string = 'DATABASE_ERROR',
    context?: Record<string, any>
  ) {
    super(message, code, context, 'high')
  }

  public getUserMessage(): string {
    switch (this.code) {
      case 'DATABASE_CONNECTION_FAILED':
        return 'Problème de connexion. Réessayez dans quelques instants'
      case 'DATABASE_RECORD_NOT_FOUND':
        return 'Les données demandées sont introuvables'
      case 'DATABASE_UNIQUE_CONSTRAINT':
        return 'Cette donnée existe déjà'
      case 'DATABASE_FOREIGN_KEY_CONSTRAINT':
        return 'Impossible de supprimer: des données liées existent'
      case 'DATABASE_RLS_VIOLATION':
        return 'Accès non autorisé aux données'
      default:
        return 'Erreur de base de données'
    }
  }
}

// =============================================
// STRIPE ERRORS
// =============================================

export class PaymentError extends VuVenuError {
  public readonly stripeCode?: string

  constructor(
    message: string,
    code: string = 'PAYMENT_ERROR',
    context?: Record<string, any>,
    stripeCode?: string
  ) {
    super(message, code, context, 'high')
    this.stripeCode = stripeCode
  }

  public getUserMessage(): string {
    switch (this.code) {
      case 'PAYMENT_CARD_DECLINED':
        return 'Votre carte a été refusée. Vérifiez vos informations'
      case 'PAYMENT_INSUFFICIENT_FUNDS':
        return 'Fonds insuffisants sur votre carte'
      case 'PAYMENT_EXPIRED_CARD':
        return 'Votre carte a expiré. Utilisez une autre carte'
      case 'PAYMENT_INVALID_CARD':
        return 'Numéro de carte invalide'
      case 'PAYMENT_PROCESSING_ERROR':
        return 'Erreur de traitement du paiement. Réessayez'
      case 'PAYMENT_WEBHOOK_FAILED':
        return 'Erreur de synchronisation du paiement'
      default:
        return 'Erreur de paiement'
    }
  }
}

// =============================================
// VALIDATION ERRORS
// =============================================

export class ValidationError extends VuVenuError {
  public readonly field?: string
  public readonly validationRule?: string

  constructor(
    message: string,
    field?: string,
    validationRule?: string,
    context?: Record<string, any>
  ) {
    super(message, 'VALIDATION_ERROR', context, 'low')
    this.field = field
    this.validationRule = validationRule
  }

  public getUserMessage(): string {
    if (this.field) {
      return `Erreur dans le champ "${this.field}": ${this.message}`
    }
    return this.message
  }
}

// =============================================
// EXTERNAL API ERRORS
// =============================================

export class ExternalAPIError extends VuVenuError {
  public readonly apiName: string
  public readonly statusCode?: number

  constructor(
    message: string,
    apiName: string,
    statusCode?: number,
    context?: Record<string, any>
  ) {
    super(message, 'EXTERNAL_API_ERROR', context, 'medium')
    this.apiName = apiName
    this.statusCode = statusCode
  }

  public getUserMessage(): string {
    return `Service ${this.apiName} temporairement indisponible. Réessayez plus tard`
  }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Convertit les erreurs Supabase en erreurs VuVenu
 */
export function handleSupabaseError(error: any): VuVenuError {
  if (!error) {
    return new DatabaseError('Unknown database error')
  }

  const message = error.message || 'Database error'

  // Erreurs d'authentification
  if (message.includes('Invalid login credentials')) {
    return new AuthError(message, 'AUTH_INVALID_CREDENTIALS')
  }
  if (message.includes('Email not confirmed')) {
    return new AuthError(message, 'AUTH_EMAIL_NOT_CONFIRMED')
  }
  if (message.includes('JWT expired')) {
    return new AuthError(message, 'AUTH_TOKEN_EXPIRED')
  }

  // Erreurs de base de données
  if (message.includes('duplicate key')) {
    return new DatabaseError(message, 'DATABASE_UNIQUE_CONSTRAINT')
  }
  if (message.includes('foreign key')) {
    return new DatabaseError(message, 'DATABASE_FOREIGN_KEY_CONSTRAINT')
  }
  if (message.includes('RLS')) {
    return new DatabaseError(message, 'DATABASE_RLS_VIOLATION')
  }

  // Erreur générique de base de données
  return new DatabaseError(message, 'DATABASE_ERROR')
}

/**
 * Convertit les erreurs Stripe en erreurs VuVenu
 */
export function handleStripeError(error: any): PaymentError {
  if (!error || !error.type) {
    return new PaymentError('Unknown payment error')
  }

  const message = error.message || 'Payment error'
  const stripeCode = error.code

  switch (error.type) {
    case 'card_error':
      switch (error.code) {
        case 'card_declined':
          return new PaymentError(message, 'PAYMENT_CARD_DECLINED', { error }, stripeCode)
        case 'insufficient_funds':
          return new PaymentError(message, 'PAYMENT_INSUFFICIENT_FUNDS', { error }, stripeCode)
        case 'expired_card':
          return new PaymentError(message, 'PAYMENT_EXPIRED_CARD', { error }, stripeCode)
        case 'invalid_number':
          return new PaymentError(message, 'PAYMENT_INVALID_CARD', { error }, stripeCode)
        default:
          return new PaymentError(message, 'PAYMENT_CARD_DECLINED', { error }, stripeCode)
      }
    case 'api_error':
    case 'api_connection_error':
      return new PaymentError(message, 'PAYMENT_PROCESSING_ERROR', { error }, stripeCode)
    default:
      return new PaymentError(message, 'PAYMENT_ERROR', { error }, stripeCode)
  }
}

/**
 * Convertit les erreurs d'API IA en erreurs VuVenu
 */
export function handleAIError(
  error: any,
  provider: 'claude' | 'gemini'
): AIError {
  if (!error) {
    return new AIError('Unknown AI error', 'AI_ERROR', {}, provider)
  }

  const message = error.message || 'AI generation error'

  // Erreurs de rate limiting
  if (error.status === 429 || message.includes('rate limit')) {
    return new AIError(message, 'AI_RATE_LIMIT', { error }, provider)
  }

  // Erreurs de quota
  if (message.includes('quota') || message.includes('limit exceeded')) {
    return new AIError(message, 'AI_QUOTA_EXCEEDED', { error }, provider)
  }

  // Erreurs de timeout
  if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
    return new AIError(message, 'AI_TIMEOUT', { error }, provider)
  }

  // Erreurs de validation input
  if (error.status === 400) {
    return new AIError(message, 'AI_INVALID_INPUT', { error }, provider)
  }

  // Contenu bloqué
  if (error.status === 403 || message.includes('content')) {
    return new AIError(message, 'AI_CONTENT_BLOCKED', { error }, provider)
  }

  return new AIError(message, 'AI_GENERATION_FAILED', { error }, provider)
}

// =============================================
// ERROR TYPE GUARDS
// =============================================

export function isVuVenuError(error: any): error is VuVenuError {
  return error instanceof VuVenuError
}

export function isAuthError(error: any): error is AuthError {
  return error instanceof AuthError
}

export function isSubscriptionError(error: any): error is SubscriptionError {
  return error instanceof SubscriptionError
}

export function isAIError(error: any): error is AIError {
  return error instanceof AIError
}

export function isDatabaseError(error: any): error is DatabaseError {
  return error instanceof DatabaseError
}

export function isPaymentError(error: any): error is PaymentError {
  return error instanceof PaymentError
}

export function isValidationError(error: any): error is ValidationError {
  return error instanceof ValidationError
}