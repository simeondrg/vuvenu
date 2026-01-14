/**
 * Système de health checks pour VuVenu
 * Monitore l'état de tous les services critiques
 */

import { logger } from './logger'

export interface HealthStatus {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime: number
  lastCheck: string
  details?: Record<string, any>
  error?: string
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down'
  timestamp: string
  version: string
  uptime: number
  services: Record<string, HealthStatus>
}

/**
 * Health checker pour services externes
 */
export class HealthChecker {
  private checks: Map<string, () => Promise<HealthStatus>> = new Map()
  private cachedResults: Map<string, HealthStatus> = new Map()
  private readonly CACHE_TTL = 30000 // 30s cache

  constructor() {
    this.registerDefaultChecks()
  }

  /**
   * Enregistre les checks par défaut pour VuVenu
   */
  private registerDefaultChecks() {
    // Database (Supabase)
    this.register('database', this.checkSupabase.bind(this))

    // API Claude
    this.register('claude', this.checkClaude.bind(this))

    // API Gemini
    this.register('gemini', this.checkGemini.bind(this))

    // Stripe
    this.register('stripe', this.checkStripe.bind(this))

    // File system / Storage
    this.register('storage', this.checkStorage.bind(this))

    // Memory / CPU
    this.register('system', this.checkSystemResources.bind(this))
  }

  /**
   * Enregistre un nouveau health check
   */
  register(serviceName: string, checkFn: () => Promise<HealthStatus>) {
    this.checks.set(serviceName, checkFn)
  }

  /**
   * Exécute un health check spécifique
   */
  async check(serviceName: string): Promise<HealthStatus> {
    const cached = this.cachedResults.get(serviceName)
    if (cached && Date.now() - new Date(cached.lastCheck).getTime() < this.CACHE_TTL) {
      return cached
    }

    const checkFn = this.checks.get(serviceName)
    if (!checkFn) {
      return {
        service: serviceName,
        status: 'down',
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        error: 'Health check not registered'
      }
    }

    try {
      const result = await checkFn()
      this.cachedResults.set(serviceName, result)

      // Log si le statut change
      const previousStatus = cached?.status
      if (previousStatus && previousStatus !== result.status) {
        logger.warn(`Service status changed: ${serviceName}`, {
          from: previousStatus,
          to: result.status,
          responseTime: result.responseTime
        })
      }

      return result
    } catch (error) {
      const failedResult: HealthStatus = {
        service: serviceName,
        status: 'down',
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      }

      this.cachedResults.set(serviceName, failedResult)
      logger.error(`Health check failed: ${serviceName}`, error as Error)

      return failedResult
    }
  }

  /**
   * Exécute tous les health checks
   */
  async checkAll(): Promise<SystemHealth> {
    const startTime = Date.now()
    const serviceNames = Array.from(this.checks.keys())

    // Exécuter tous les checks en parallèle
    const results = await Promise.allSettled(
      serviceNames.map(async (name) => {
        const result = await this.check(name)
        return [name, result] as [string, HealthStatus]
      })
    )

    const services: Record<string, HealthStatus> = {}
    let healthyCount = 0
    let degradedCount = 0

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const [name, health] = result.value
        services[name] = health

        if (health.status === 'healthy') healthyCount++
        else if (health.status === 'degraded') degradedCount++
      }
    })

    // Déterminer l'état global
    const totalServices = serviceNames.length
    const downCount = totalServices - healthyCount - degradedCount

    let overall: SystemHealth['overall']
    if (downCount > 0) {
      overall = 'down'
    } else if (degradedCount > 0) {
      overall = 'degraded'
    } else {
      overall = 'healthy'
    }

    const systemHealth: SystemHealth = {
      overall,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime?.() || 0,
      services
    }

    // Log l'état global
    logger.info('System health check completed', {
      overall,
      healthy: healthyCount,
      degraded: degradedCount,
      down: downCount,
      checkDuration: Date.now() - startTime
    })

    return systemHealth
  }

  /**
   * Check Supabase Database
   */
  private async checkSupabase(): Promise<HealthStatus> {
    const start = Date.now()

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase credentials not configured')
      }

      // Simple ping to Supabase REST API
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      })

      const responseTime = Date.now() - start

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return {
        service: 'database',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date().toISOString(),
        details: { endpoint: 'REST API' }
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Check Claude API
   */
  private async checkClaude(): Promise<HealthStatus> {
    const start = Date.now()

    try {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Claude API key not configured')
      }

      // Simple API call to check availability
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'ping' }]
        })
      })

      const responseTime = Date.now() - start

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      return {
        service: 'claude',
        status: responseTime < 5000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date().toISOString(),
        details: { model: 'haiku' }
      }
    } catch (error) {
      return {
        service: 'claude',
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Check Gemini API
   */
  private async checkGemini(): Promise<HealthStatus> {
    const start = Date.now()

    try {
      if (!process.env.GOOGLE_AI_API_KEY) {
        throw new Error('Gemini API key not configured')
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_AI_API_KEY}`)
      const responseTime = Date.now() - start

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return {
        service: 'gemini',
        status: responseTime < 2000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date().toISOString(),
        details: { endpoint: 'models' }
      }
    } catch (error) {
      return {
        service: 'gemini',
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Check Stripe
   */
  private async checkStripe(): Promise<HealthStatus> {
    const start = Date.now()

    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Stripe secret key not configured')
      }

      // Simple balance check
      const response = await fetch('https://api.stripe.com/v1/balance', {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
        }
      })

      const responseTime = Date.now() - start

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return {
        service: 'stripe',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date().toISOString(),
        details: { endpoint: 'balance' }
      }
    } catch (error) {
      return {
        service: 'stripe',
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Check Storage
   */
  private async checkStorage(): Promise<HealthStatus> {
    const start = Date.now()

    try {
      // Test write access
      const testFile = '/tmp/health-check-test'
      const { writeFile, readFile, unlink } = await import('fs/promises')

      await writeFile(testFile, 'health-check')
      const content = await readFile(testFile, 'utf-8')
      await unlink(testFile)

      if (content !== 'health-check') {
        throw new Error('File content mismatch')
      }

      const responseTime = Date.now() - start

      return {
        service: 'storage',
        status: 'healthy',
        responseTime,
        lastCheck: new Date().toISOString(),
        details: { operation: 'write/read/delete' }
      }
    } catch (error) {
      return {
        service: 'storage',
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  /**
   * Check System Resources
   */
  private async checkSystemResources(): Promise<HealthStatus> {
    const start = Date.now()

    try {
      const memoryUsage = process.memoryUsage()
      const cpuUsage = process.cpuUsage()

      // Convertir en MB
      const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024
      const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024
      const memoryUsagePercent = (heapUsedMB / heapTotalMB) * 100

      // Déterminer l'état basé sur l'usage mémoire
      let status: HealthStatus['status']
      if (memoryUsagePercent > 90) {
        status = 'down'
      } else if (memoryUsagePercent > 75) {
        status = 'degraded'
      } else {
        status = 'healthy'
      }

      return {
        service: 'system',
        status,
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        details: {
          memoryUsedMB: Math.round(heapUsedMB),
          memoryTotalMB: Math.round(heapTotalMB),
          memoryUsagePercent: Math.round(memoryUsagePercent),
          uptime: process.uptime()
        }
      }
    } catch (error) {
      return {
        service: 'system',
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}

// Instance globale
export const healthChecker = new HealthChecker()

/**
 * Middleware pour exposer les health checks via API
 */
export async function createHealthResponse(): Promise<Response> {
  try {
    const health = await healthChecker.checkAll()

    const statusCode = health.overall === 'healthy' ? 200
                     : health.overall === 'degraded' ? 200
                     : 503

    return new Response(JSON.stringify(health, null, 2), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    logger.error('Health check endpoint failed', error as Error)

    return new Response(JSON.stringify({
      overall: 'down',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}