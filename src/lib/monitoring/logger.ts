/**
 * Système de logging production pour VuVenu
 *
 * Fonctionnalités :
 * - Logging structuré avec niveaux
 * - Intégration Vercel/Datadog/Sentry
 * - Métriques business et techniques
 * - Alertes automatiques pour erreurs critiques
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  service: string
  userId?: string
  sessionId?: string
  requestId?: string
  context?: Record<string, any>
  tags?: string[]
  performance?: {
    duration?: number
    memory?: number
    cpu?: number
  }
}

interface BusinessMetric {
  event: string
  userId?: string
  plan?: 'starter' | 'pro' | 'business' | string
  value?: number
  properties?: Record<string, any>
  timestamp?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private serviceName = 'vuvenu-api'
  private version = process.env.npm_package_version || '1.0.0'

  /**
   * Log une entrée avec le niveau spécifié
   */
  private log(level: LogLevel, message: string, context: Partial<LogEntry> = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      ...context
    }

    // En développement : console formatée
    if (this.isDevelopment) {
      this.logToConsole(entry)
    }

    // En production : envoi aux services externes
    if (!this.isDevelopment) {
      this.sendToExternalServices(entry)
    }

    // Alertes pour erreurs critiques
    if (level === 'error' || level === 'fatal') {
      this.handleCriticalError(entry)
    }
  }

  /**
   * Logging de débogage (développement uniquement)
   */
  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, { context })
    }
  }

  /**
   * Informations générales
   */
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, { context })
  }

  /**
   * Avertissements
   */
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, { context })
  }

  /**
   * Erreurs non-critiques
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, {
      context: {
        ...context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : undefined
      }
    })
  }

  /**
   * Erreurs critiques (système down)
   */
  fatal(message: string, error?: Error, context?: Record<string, any>) {
    this.log('fatal', message, {
      context: {
        ...context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : undefined
      }
    })
  }

  /**
   * Log spécifique aux API endpoints
   */
  apiRequest({
    method,
    path,
    userId,
    duration,
    status,
    error
  }: {
    method: string
    path: string
    userId?: string
    duration: number
    status: number
    error?: Error
  }) {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'

    this.log(level, `API ${method} ${path}`, {
      userId,
      context: {
        method,
        path,
        status,
        duration,
        error: error ? {
          name: error.name,
          message: error.message
        } : undefined
      },
      tags: ['api', 'request'],
      performance: { duration }
    })
  }

  /**
   * Log des métriques business importantes
   */
  business(metric: BusinessMetric) {
    this.log('info', `Business: ${metric.event}`, {
      userId: metric.userId,
      context: {
        event: metric.event,
        plan: metric.plan,
        value: metric.value,
        properties: metric.properties
      },
      tags: ['business', 'metric']
    })

    // Envoyer aussi aux analytics
    this.sendToAnalytics(metric)
  }

  /**
   * Log de sécurité (tentatives malveillantes)
   */
  security(event: string, context: Record<string, any>) {
    this.log('warn', `Security: ${event}`, {
      context,
      tags: ['security', 'alert']
    })

    // Alertes immédiates pour la sécurité
    if (!this.isDevelopment) {
      this.sendSecurityAlert(event, context)
    }
  }

  /**
   * Métriques de performance
   */
  performance(operation: string, duration: number, context?: Record<string, any>) {
    this.log('info', `Performance: ${operation}`, {
      context,
      tags: ['performance'],
      performance: { duration }
    })
  }

  /**
   * Console formatée pour développement
   */
  private logToConsole(entry: LogEntry) {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[34m',  // Blue
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      fatal: '\x1b[35m'  // Magenta
    }

    const reset = '\x1b[0m'
    const timestamp = new Date(entry.timestamp).toLocaleTimeString()

    console.log(
      `${colors[entry.level]}[${entry.level.toUpperCase()}]${reset} ${timestamp} ${entry.message}`,
      entry.context ? entry.context : ''
    )
  }

  /**
   * Envoi vers services externes (Vercel, Datadog, etc.)
   */
  private sendToExternalServices(entry: LogEntry) {
    try {
      // Vercel Edge Functions logging
      console.log(JSON.stringify(entry))

      // TODO: Intégrations futures
      // - Datadog: this.sendToDatadog(entry)
      // - Sentry: this.sendToSentry(entry)
      // - Custom webhook: this.sendToWebhook(entry)

    } catch (error) {
      // Fallback si services externes échouent
      console.error('Failed to send log to external services:', error)
    }
  }

  /**
   * Gestion des erreurs critiques
   */
  private async handleCriticalError(entry: LogEntry) {
    try {
      // Notification d'équipe en production
      if (process.env.SLACK_WEBHOOK_URL && entry.level === 'fatal') {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 ERREUR CRITIQUE - VuVenu`,
            blocks: [
              {
                type: 'header',
                text: { type: 'plain_text', text: '🚨 Erreur Critique Détectée' }
              },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Service:* ${entry.service}` },
                  { type: 'mrkdwn', text: `*Niveau:* ${entry.level}` },
                  { type: 'mrkdwn', text: `*Message:* ${entry.message}` },
                  { type: 'mrkdwn', text: `*Utilisateur:* ${entry.userId || 'Anonyme'}` }
                ]
              }
            ]
          })
        })
      }
    } catch (error) {
      console.error('Failed to send critical error notification:', error)
    }
  }

  /**
   * Envoi vers analytics (mixpanel, amplitude, etc.)
   */
  private sendToAnalytics(metric: BusinessMetric) {
    // TODO: Intégrer avec service analytics
    if (this.isDevelopment) {
      console.log('📊 Business Metric:', metric)
    }
  }

  /**
   * Alertes de sécurité
   */
  private sendSecurityAlert(event: string, context: Record<string, any>) {
    // TODO: Intégrer système d'alertes sécurité
    console.warn('🔒 Security Alert:', { event, context })
  }
}

// Instance globale du logger
export const logger = new Logger()

/**
 * Hook pour le logging dans les composants React
 */
export function useLogger(component: string) {
  return {
    debug: (message: string, context?: Record<string, any>) =>
      logger.debug(`[${component}] ${message}`, context),
    info: (message: string, context?: Record<string, any>) =>
      logger.info(`[${component}] ${message}`, context),
    warn: (message: string, context?: Record<string, any>) =>
      logger.warn(`[${component}] ${message}`, context),
    error: (message: string, error?: Error, context?: Record<string, any>) =>
      logger.error(`[${component}] ${message}`, error, context),
  }
}

/**
 * Middleware de logging pour les API routes
 */
export function withLogging<T>(
  handler: T,
  operationName: string
): T {
  return (async (...args: any[]) => {
    const start = Date.now()
    const requestId = Math.random().toString(36).substring(7)

    try {
      logger.info(`Starting ${operationName}`, { requestId })
      const result = await (handler as any)(...args)
      const duration = Date.now() - start

      logger.performance(operationName, duration, { requestId })
      return result
    } catch (error) {
      const duration = Date.now() - start
      logger.error(`Failed ${operationName}`, error as Error, {
        requestId,
        duration
      })
      throw error
    }
  }) as T
}