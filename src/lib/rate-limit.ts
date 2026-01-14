import { NextRequest } from 'next/server'

// Store en mémoire pour le rate limiting (pour un deployment simple)
// En production, utiliser Redis ou une base de données
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number // Fenêtre de temps en ms
  max: number      // Nombre max de requêtes par fenêtre
}

// Configurations par endpoint
export const RATE_LIMIT_CONFIGS = {
  // Endpoints IA - très restrictifs (coûts API)
  generate: {
    windowMs: 60 * 1000, // 1 minute
    max: 5               // 5 requêtes/min max
  },
  // Endpoints normaux - moins restrictifs
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 60              // 60 requêtes/min
  },
  // Webhooks - pas de limite (Stripe peut retry)
  webhook: {
    windowMs: 60 * 1000,
    max: 1000
  }
} as const

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  error?: string
}

/**
 * Vérifie si une requête respecte les limites de rate limiting
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  // Nettoyer les anciennes entrées (cleanup basique)
  for (const [storeKey, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(storeKey)
    }
  }

  const stored = rateLimitStore.get(key)

  // Première requête dans cette fenêtre
  if (!stored || now > stored.resetTime) {
    const resetTime = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetTime })

    return {
      success: true,
      remaining: config.max - 1,
      resetTime
    }
  }

  // Incrémenter le compteur
  if (stored.count >= config.max) {
    return {
      success: false,
      remaining: 0,
      resetTime: stored.resetTime,
      error: `Rate limit exceeded. Max ${config.max} requests per ${config.windowMs / 1000}s`
    }
  }

  stored.count++
  rateLimitStore.set(key, stored)

  return {
    success: true,
    remaining: config.max - stored.count,
    resetTime: stored.resetTime
  }
}

/**
 * Crée un identifiant unique pour l'utilisateur/IP
 */
export function createRateLimitIdentifier(
  request: NextRequest,
  userId?: string
): string {
  // Préférer l'ID utilisateur si disponible
  if (userId) {
    return `user:${userId}`
  }

  // Sinon utiliser l'IP
  const ip = request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || '127.0.0.1'

  return `ip:${ip.split(',')[0].trim()}`
}

/**
 * Middleware de rate limiting pour les API routes
 */
export async function withRateLimit<T>(
  request: NextRequest,
  config: RateLimitConfig,
  userId?: string,
  handler?: () => Promise<T>
): Promise<{ result?: T; error?: Response }> {
  const identifier = createRateLimitIdentifier(request, userId)
  const rateLimitResult = checkRateLimit(identifier, config)

  if (!rateLimitResult.success) {
    const error = new Response(
      JSON.stringify({
        error: rateLimitResult.error,
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
        }
      }
    )
    return { error }
  }

  // Exécuter le handler s'il y en a un
  if (handler) {
    const result = await handler()
    return { result }
  }

  return {}
}

/**
 * Headers de rate limiting à ajouter aux réponses success
 */
export function getRateLimitHeaders(
  config: RateLimitConfig,
  identifier: string
): Record<string, string> {
  const stored = rateLimitStore.get(identifier)

  if (!stored) {
    return {
      'X-RateLimit-Limit': config.max.toString(),
      'X-RateLimit-Remaining': (config.max - 1).toString(),
      'X-RateLimit-Reset': Math.ceil((Date.now() + config.windowMs) / 1000).toString()
    }
  }

  return {
    'X-RateLimit-Limit': config.max.toString(),
    'X-RateLimit-Remaining': Math.max(0, config.max - stored.count).toString(),
    'X-RateLimit-Reset': Math.ceil(stored.resetTime / 1000).toString()
  }
}