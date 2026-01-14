/**
 * Gestionnaire d'erreurs centralisé pour VuVenu
 *
 * Responsabilités:
 * - Logging unifié des erreurs (console, external services)
 * - Formatage des erreurs pour l'API
 * - Notifications d'erreurs critiques
 * - Métriques et monitoring
 */

import { isVuVenuError, type VuVenuError } from './index'

// =============================================
// TYPES & INTERFACES
// =============================================

export interface ErrorLogEntry {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info'
  message: string
  code?: string
  context?: Record<string, any>
  userId?: string
  userAgent?: string
  url?: string
  stack?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

export interface ErrorHandlerOptions {
  logToConsole: boolean
  logToExternal: boolean
  sendNotifications: boolean
  includeStack: boolean
  redactSensitiveData: boolean
}

// =============================================
// ERROR HANDLER CLASS
// =============================================

export class ErrorHandler {
  private static instance: ErrorHandler
  private options: ErrorHandlerOptions

  private constructor(options: Partial<ErrorHandlerOptions> = {}) {
    this.options = {
      logToConsole: true,
      logToExternal: process.env.NODE_ENV === 'production',
      sendNotifications: process.env.NODE_ENV === 'production',
      includeStack: process.env.NODE_ENV !== 'production',
      redactSensitiveData: true,
      ...options,
    }
  }

  /**
   * Singleton pattern pour une seule instance
   */
  public static getInstance(options?: Partial<ErrorHandlerOptions>): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(options)
    }
    return ErrorHandler.instance
  }

  /**
   * Log une erreur avec tous les enrichissements
   */
  public async logError(
    error: Error | VuVenuError,
    context?: {
      userId?: string
      userAgent?: string
      url?: string
      additionalContext?: Record<string, any>
    }
  ): Promise<void> {
    try {
      const logEntry = this.createLogEntry(error, context)

      // Log en console (développement)
      if (this.options.logToConsole) {
        this.logToConsole(logEntry)
      }

      // Log vers service externe (production)
      if (this.options.logToExternal) {
        await this.logToExternalService(logEntry)
      }

      // Notifications pour erreurs critiques
      if (this.options.sendNotifications && this.isCriticalError(logEntry)) {
        await this.sendCriticalNotification(logEntry)
      }
    } catch (loggingError) {
      // Fallback si le logging échoue
      console.error('Failed to log error:', loggingError)
      console.error('Original error:', error)
    }
  }

  /**
   * Traite une erreur pour les réponses API
   */
  public handleAPIError(error: Error | VuVenuError): {
    status: number
    body: {
      error: string
      code?: string
      details?: any
    }
  } {
    // Log l'erreur
    this.logError(error).catch(console.error)

    // Formater la réponse
    if (isVuVenuError(error)) {
      return {
        status: this.getHTTPStatusFromError(error),
        body: {
          error: error.getUserMessage(),
          code: error.code,
          details: this.options.includeStack
            ? {
                timestamp: error.timestamp.toISOString(),
                severity: error.severity,
              }
            : undefined,
        },
      }
    }

    // Erreur générique
    return {
      status: 500,
      body: {
        error: process.env.NODE_ENV === 'production'
          ? 'Une erreur inattendue est survenue'
          : error.message,
        details: this.options.includeStack ? { stack: error.stack } : undefined,
      },
    }
  }

  /**
   * Handler pour les erreurs non capturées
   */
  public setupGlobalHandlers(): void {
    // Erreurs non capturées (Node.js)
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error)
      this.logError(error, {
        additionalContext: { type: 'uncaughtException' },
      }).finally(() => {
        process.exit(1)
      })
    })

    // Promesses rejetées non gérées
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason)
      const error = reason instanceof Error ? reason : new Error(String(reason))
      this.logError(error, {
        additionalContext: { type: 'unhandledRejection' },
      })
    })
  }

  // =============================================
  // MÉTHODES PRIVÉES
  // =============================================

  private createLogEntry(
    error: Error | VuVenuError,
    context?: {
      userId?: string
      userAgent?: string
      url?: string
      additionalContext?: Record<string, any>
    }
  ): ErrorLogEntry {
    const id = this.generateErrorId()
    const timestamp = new Date().toISOString()

    if (isVuVenuError(error)) {
      return {
        id,
        timestamp,
        level: 'error',
        message: error.message,
        code: error.code,
        context: this.sanitizeContext({
          ...error.context,
          ...context?.additionalContext,
        }),
        userId: context?.userId,
        userAgent: context?.userAgent,
        url: context?.url,
        stack: this.options.includeStack ? error.stack : undefined,
        severity: error.severity,
      }
    }

    return {
      id,
      timestamp,
      level: 'error',
      message: error.message,
      context: this.sanitizeContext(context?.additionalContext),
      userId: context?.userId,
      userAgent: context?.userAgent,
      url: context?.url,
      stack: this.options.includeStack ? error.stack : undefined,
      severity: 'medium',
    }
  }

  private logToConsole(logEntry: ErrorLogEntry): void {
    const prefix = `[${logEntry.timestamp}] [${logEntry.level.toUpperCase()}]`
    const message = logEntry.code
      ? `${prefix} [${logEntry.code}] ${logEntry.message}`
      : `${prefix} ${logEntry.message}`

    console.error(message)

    if (logEntry.context && Object.keys(logEntry.context).length > 0) {
      console.error('Context:', logEntry.context)
    }

    if (logEntry.stack && this.options.includeStack) {
      console.error('Stack:', logEntry.stack)
    }
  }

  private async logToExternalService(logEntry: ErrorLogEntry): Promise<void> {
    // TODO: Intégrer avec un service de logging (Sentry, LogRocket, etc.)

    // Exemple avec une API de logging hypothétique
    try {
      // await fetch('/api/internal/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry),
      // })

      // Ou avec Sentry
      // Sentry.captureException(error, {
      //   contexts: {
      //     vuvenu: logEntry
      //   }
      // })

      console.log('Would log to external service:', logEntry)
    } catch (error) {
      console.error('Failed to log to external service:', error)
    }
  }

  private async sendCriticalNotification(logEntry: ErrorLogEntry): Promise<void> {
    // TODO: Intégrer notifications (Discord, Slack, email)

    try {
      // Exemple Discord webhook
      // await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content: `🚨 Erreur critique VuVenu:\n\`\`\`${logEntry.message}\`\`\``,
      //     embeds: [{
      //       title: `Erreur ${logEntry.code || 'UNKNOWN'}`,
      //       description: logEntry.message,
      //       color: 15158332, // Rouge
      //       timestamp: logEntry.timestamp
      //     }]
      //   })
      // })

      console.log('Would send critical notification:', logEntry)
    } catch (error) {
      console.error('Failed to send critical notification:', error)
    }
  }

  private sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context || !this.options.redactSensitiveData) {
      return context
    }

    const sanitized = { ...context }
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'credit_card',
      'ssn',
      'email', // Optionnel selon la réglementation
    ]

    const redactValue = (obj: any, key: string) => {
      if (typeof obj[key] === 'string') {
        obj[key] = '[REDACTED]'
      }
    }

    const traverse = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverse(obj[key])
        } else {
          const lowerKey = key.toLowerCase()
          if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
            redactValue(obj, key)
          }
        }
      }
    }

    traverse(sanitized)
    return sanitized
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private isCriticalError(logEntry: ErrorLogEntry): boolean {
    return (
      logEntry.severity === 'critical' ||
      (logEntry.code?.includes('DATABASE') && logEntry.severity === 'high') ||
      (logEntry.code?.includes('PAYMENT') ?? false)
    )
  }

  private getHTTPStatusFromError(error: VuVenuError): number {
    switch (error.code) {
      // Auth errors -> 401
      case 'AUTH_INVALID_CREDENTIALS':
      case 'AUTH_TOKEN_EXPIRED':
      case 'AUTH_USER_NOT_FOUND':
        return 401

      // Permission errors -> 403
      case 'AUTH_INSUFFICIENT_PERMISSIONS':
      case 'DATABASE_RLS_VIOLATION':
        return 403

      // Not found -> 404
      case 'DATABASE_RECORD_NOT_FOUND':
        return 404

      // Validation errors -> 400
      case 'VALIDATION_ERROR':
      case 'AI_INVALID_INPUT':
        return 400

      // Rate limiting -> 429
      case 'AI_RATE_LIMIT':
        return 429

      // Subscription/Payment -> 402 (Payment Required)
      case 'SUBSCRIPTION_LIMIT_REACHED':
      case 'SUBSCRIPTION_EXPIRED':
      case 'SUBSCRIPTION_TIER_INSUFFICIENT':
        return 402

      // Server errors -> 500
      default:
        return 500
    }
  }
}

// =============================================
// HELPERS ET EXPORTS
// =============================================

/**
 * Instance globale du gestionnaire d'erreurs
 */
export const errorHandler = ErrorHandler.getInstance()

/**
 * Helper pour les API routes Next.js
 */
export function createErrorResponse(error: Error | VuVenuError) {
  return errorHandler.handleAPIError(error)
}

/**
 * Helper pour les Server Actions
 */
export async function handleServerActionError(
  error: Error | VuVenuError,
  context?: { userId?: string }
): Promise<{
  success: false
  error: string
  code?: string
}> {
  await errorHandler.logError(error, context)

  if (isVuVenuError(error)) {
    return {
      success: false,
      error: error.getUserMessage(),
      code: error.code,
    }
  }

  return {
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Une erreur inattendue est survenue'
      : error.message,
  }
}

/**
 * Wrapper try/catch pour Server Actions
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: { userId?: string }
) {
  return async (...args: T): Promise<R | { success: false; error: string; code?: string }> => {
    try {
      return await fn(...args)
    } catch (error) {
      return await handleServerActionError(
        error instanceof Error ? error : new Error(String(error)),
        context
      )
    }
  }
}

/**
 * Setup global error handlers (à appeler au démarrage de l'app)
 */
export function setupGlobalErrorHandling() {
  errorHandler.setupGlobalHandlers()
}

export * from './index'