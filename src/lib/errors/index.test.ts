/**
 * Tests unitaires pour le système d'erreurs
 *
 * Tests pour lib/errors/index.ts - classes d'erreurs et handlers
 */

import { describe, it, expect } from 'vitest'
import {
  VuVenuError,
  AuthError,
  SubscriptionError,
  AIError,
  DatabaseError,
  PaymentError,
  ValidationError,
  handleSupabaseError,
  handleStripeError,
  handleAIError,
  isVuVenuError,
  isAuthError,
  isSubscriptionError
} from './index'

// =============================================
// TESTS: Error Classes
// =============================================

describe('Error Classes', () => {
  describe('AuthError', () => {
    it('should create auth error with correct properties', () => {
      const error = new AuthError(
        'Invalid credentials',
        'AUTH_INVALID_CREDENTIALS',
        { email: 'test@example.com' }
      )

      expect(error.name).toBe('AuthError')
      expect(error.message).toBe('Invalid credentials')
      expect(error.code).toBe('AUTH_INVALID_CREDENTIALS')
      expect(error.context?.email).toBe('test@example.com')
      expect(error.severity).toBe('high')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should provide correct user messages', () => {
      const invalidCreds = new AuthError('Invalid', 'AUTH_INVALID_CREDENTIALS')
      expect(invalidCreds.getUserMessage()).toBe('Email ou mot de passe incorrect')

      const emailNotConfirmed = new AuthError('Not confirmed', 'AUTH_EMAIL_NOT_CONFIRMED')
      expect(emailNotConfirmed.getUserMessage()).toBe('Veuillez confirmer votre email avant de vous connecter')

      const generic = new AuthError('Some error', 'AUTH_UNKNOWN')
      expect(generic.getUserMessage()).toBe('Erreur d\'authentification')
    })

    it('should be serializable to JSON', () => {
      const error = new AuthError('Test error', 'AUTH_TEST')
      const json = error.toJSON()

      expect(json.name).toBe('AuthError')
      expect(json.message).toBe('Test error')
      expect(json.code).toBe('AUTH_TEST')
      expect(json.severity).toBe('high')
      expect(json.timestamp).toBeDefined()
    })
  })

  describe('SubscriptionError', () => {
    it('should create subscription error with correct properties', () => {
      const error = new SubscriptionError(
        'Limit reached',
        'SUBSCRIPTION_LIMIT_REACHED',
        { currentCount: 10, limit: 10 }
      )

      expect(error.name).toBe('SubscriptionError')
      expect(error.code).toBe('SUBSCRIPTION_LIMIT_REACHED')
      expect(error.severity).toBe('high')
    })

    it('should provide correct user messages', () => {
      const limitReached = new SubscriptionError('Limit', 'SUBSCRIPTION_LIMIT_REACHED')
      expect(limitReached.getUserMessage()).toBe('Limite mensuelle atteinte. Upgradez votre plan pour continuer')

      const expired = new SubscriptionError('Expired', 'SUBSCRIPTION_EXPIRED')
      expect(expired.getUserMessage()).toBe('Votre abonnement a expiré. Renouvelez pour continuer')
    })
  })

  describe('AIError', () => {
    it('should create AI error with provider info', () => {
      const error = new AIError(
        'Rate limit exceeded',
        'AI_RATE_LIMIT',
        { requestId: '123' },
        'claude',
        150
      )

      expect(error.name).toBe('AIError')
      expect(error.provider).toBe('claude')
      expect(error.tokensUsed).toBe(150)
      expect(error.severity).toBe('medium')
    })

    it('should provide correct user messages', () => {
      const rateLimit = new AIError('Rate limited', 'AI_RATE_LIMIT')
      expect(rateLimit.getUserMessage()).toBe('Trop de demandes simultanées. Réessayez dans quelques instants')

      const timeout = new AIError('Timeout', 'AI_TIMEOUT')
      expect(timeout.getUserMessage()).toBe('La génération prend trop de temps. Réessayez')
    })
  })

  describe('DatabaseError', () => {
    it('should provide correct user messages', () => {
      const notFound = new DatabaseError('Not found', 'DATABASE_RECORD_NOT_FOUND')
      expect(notFound.getUserMessage()).toBe('Les données demandées sont introuvables')

      const uniqueConstraint = new DatabaseError('Duplicate', 'DATABASE_UNIQUE_CONSTRAINT')
      expect(uniqueConstraint.getUserMessage()).toBe('Cette donnée existe déjà')
    })
  })

  describe('PaymentError', () => {
    it('should create payment error with Stripe code', () => {
      const error = new PaymentError(
        'Card declined',
        'PAYMENT_CARD_DECLINED',
        { attempt: 1 },
        'card_declined'
      )

      expect(error.stripeCode).toBe('card_declined')
    })

    it('should provide correct user messages', () => {
      const declined = new PaymentError('Declined', 'PAYMENT_CARD_DECLINED')
      expect(declined.getUserMessage()).toBe('Votre carte a été refusée. Vérifiez vos informations')

      const insufficientFunds = new PaymentError('No funds', 'PAYMENT_INSUFFICIENT_FUNDS')
      expect(insufficientFunds.getUserMessage()).toBe('Fonds insuffisants sur votre carte')
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with field info', () => {
      const error = new ValidationError(
        'Email is required',
        'email',
        'required'
      )

      expect(error.field).toBe('email')
      expect(error.validationRule).toBe('required')
      expect(error.severity).toBe('low')
    })

    it('should provide correct user messages', () => {
      const fieldError = new ValidationError('Required', 'email', 'required')
      expect(fieldError.getUserMessage()).toBe('Erreur dans le champ "email": Required')

      const genericError = new ValidationError('Invalid format')
      expect(genericError.getUserMessage()).toBe('Invalid format')
    })
  })
})

// =============================================
// TESTS: Error Handlers
// =============================================

describe('Error Handlers', () => {
  describe('handleSupabaseError', () => {
    it('should handle invalid login credentials', () => {
      const supabaseError = { message: 'Invalid login credentials' }
      const error = handleSupabaseError(supabaseError)

      expect(error).toBeInstanceOf(AuthError)
      expect(error.code).toBe('AUTH_INVALID_CREDENTIALS')
    })

    it('should handle email not confirmed', () => {
      const supabaseError = { message: 'Email not confirmed' }
      const error = handleSupabaseError(supabaseError)

      expect(error).toBeInstanceOf(AuthError)
      expect(error.code).toBe('AUTH_EMAIL_NOT_CONFIRMED')
    })

    it('should handle JWT expired', () => {
      const supabaseError = { message: 'JWT expired' }
      const error = handleSupabaseError(supabaseError)

      expect(error).toBeInstanceOf(AuthError)
      expect(error.code).toBe('AUTH_TOKEN_EXPIRED')
    })

    it('should handle database constraints', () => {
      const uniqueError = { message: 'duplicate key value violates unique constraint' }
      const error = handleSupabaseError(uniqueError)

      expect(error).toBeInstanceOf(DatabaseError)
      expect(error.code).toBe('DATABASE_UNIQUE_CONSTRAINT')
    })

    it('should handle generic database errors', () => {
      const genericError = { message: 'Database connection failed' }
      const error = handleSupabaseError(genericError)

      expect(error).toBeInstanceOf(DatabaseError)
      expect(error.code).toBe('DATABASE_ERROR')
    })

    it('should handle null/undefined errors', () => {
      const error = handleSupabaseError(null)
      expect(error).toBeInstanceOf(DatabaseError)
      expect(error.message).toBe('Unknown database error')
    })
  })

  describe('handleStripeError', () => {
    it('should handle card declined error', () => {
      const stripeError = {
        type: 'card_error',
        code: 'card_declined',
        message: 'Your card was declined'
      }
      const error = handleStripeError(stripeError)

      expect(error).toBeInstanceOf(PaymentError)
      expect(error.code).toBe('PAYMENT_CARD_DECLINED')
      expect(error.stripeCode).toBe('card_declined')
    })

    it('should handle insufficient funds error', () => {
      const stripeError = {
        type: 'card_error',
        code: 'insufficient_funds',
        message: 'Insufficient funds'
      }
      const error = handleStripeError(stripeError)

      expect(error.code).toBe('PAYMENT_INSUFFICIENT_FUNDS')
    })

    it('should handle API errors', () => {
      const stripeError = {
        type: 'api_error',
        message: 'Service temporarily unavailable'
      }
      const error = handleStripeError(stripeError)

      expect(error.code).toBe('PAYMENT_PROCESSING_ERROR')
    })

    it('should handle unknown errors', () => {
      const error = handleStripeError(null)
      expect(error.message).toBe('Unknown payment error')
    })
  })

  describe('handleAIError', () => {
    it('should handle rate limit errors', () => {
      const aiError = { status: 429, message: 'Rate limit exceeded' }
      const error = handleAIError(aiError, 'claude')

      expect(error).toBeInstanceOf(AIError)
      expect(error.code).toBe('AI_RATE_LIMIT')
      expect(error.provider).toBe('claude')
    })

    it('should handle timeout errors', () => {
      const aiError = { code: 'ECONNABORTED', message: 'Request timeout' }
      const error = handleAIError(aiError, 'gemini')

      expect(error.code).toBe('AI_TIMEOUT')
      expect(error.provider).toBe('gemini')
    })

    it('should handle quota exceeded', () => {
      const aiError = { message: 'quota exceeded for this month' }
      const error = handleAIError(aiError, 'claude')

      expect(error.code).toBe('AI_QUOTA_EXCEEDED')
    })

    it('should handle bad request errors', () => {
      const aiError = { status: 400, message: 'Invalid input parameters' }
      const error = handleAIError(aiError, 'claude')

      expect(error.code).toBe('AI_INVALID_INPUT')
    })

    it('should handle content blocked', () => {
      const aiError = { status: 403, message: 'Content policy violation' }
      const error = handleAIError(aiError, 'claude')

      expect(error.code).toBe('AI_CONTENT_BLOCKED')
    })

    it('should handle generic AI errors', () => {
      const aiError = { message: 'Unknown AI error' }
      const error = handleAIError(aiError, 'gemini')

      expect(error.code).toBe('AI_GENERATION_FAILED')
    })
  })
})

// =============================================
// TESTS: Type Guards
// =============================================

describe('Type Guards', () => {
  it('should correctly identify VuVenu errors', () => {
    const vuvenuerror = new AuthError('Test', 'AUTH_TEST')
    const regularError = new Error('Regular error')

    expect(isVuVenuError(vuvenuerror)).toBe(true)
    expect(isVuVenuError(regularError)).toBe(false)
  })

  it('should correctly identify specific error types', () => {
    const authError = new AuthError('Test', 'AUTH_TEST')
    const subError = new SubscriptionError('Test', 'SUB_TEST')

    expect(isAuthError(authError)).toBe(true)
    expect(isAuthError(subError)).toBe(false)

    expect(isSubscriptionError(subError)).toBe(true)
    expect(isSubscriptionError(authError)).toBe(false)
  })
})