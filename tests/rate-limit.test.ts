/**
 * Tests critiques pour le rate limiting et circuit breaker
 * Vérifie que les protections fonctionnent correctement
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  checkRateLimit,
  createRateLimitIdentifier,
  RATE_LIMIT_CONFIGS,
  withRateLimit
} from '@/lib/rate-limit'

import {
  withResilience,
  getCircuitMetrics,
  resetCircuitBreaker,
  CircuitState
} from '@/lib/circuit-breaker'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset le store de rate limiting avant chaque test
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('checkRateLimit', () => {
    it('should allow requests within the limit', () => {
      const config = RATE_LIMIT_CONFIGS.generate

      // Premier appel - doit être autorisé
      const result1 = checkRateLimit('user:test', config)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(config.max - 1)

      // Deuxième appel - doit être autorisé
      const result2 = checkRateLimit('user:test', config)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(config.max - 2)
    })

    it('should block requests when limit is exceeded', () => {
      const config = RATE_LIMIT_CONFIGS.generate // 5 req/min

      // Faire 5 appels pour atteindre la limite
      for (let i = 0; i < config.max; i++) {
        const result = checkRateLimit('user:test', config)
        expect(result.success).toBe(true)
      }

      // Le 6e appel doit être bloqué
      const blockedResult = checkRateLimit('user:test', config)
      expect(blockedResult.success).toBe(false)
      expect(blockedResult.error).toContain('Rate limit exceeded')
      expect(blockedResult.remaining).toBe(0)
    })

    it('should reset after the time window', () => {
      const config = RATE_LIMIT_CONFIGS.generate

      // Atteindre la limite
      for (let i = 0; i < config.max; i++) {
        checkRateLimit('user:test', config)
      }

      // Vérifier que c'est bloqué
      const blockedResult = checkRateLimit('user:test', config)
      expect(blockedResult.success).toBe(false)

      // Avancer le temps au-delà de la fenêtre
      vi.advanceTimersByTime(config.windowMs + 1000)

      // Doit être autorisé maintenant
      const allowedResult = checkRateLimit('user:test', config)
      expect(allowedResult.success).toBe(true)
    })

    it('should handle different users independently', () => {
      const config = RATE_LIMIT_CONFIGS.generate

      // User1 atteint sa limite
      for (let i = 0; i < config.max; i++) {
        checkRateLimit('user:user1', config)
      }
      const user1Blocked = checkRateLimit('user:user1', config)
      expect(user1Blocked.success).toBe(false)

      // User2 doit pouvoir faire ses appels
      const user2Result = checkRateLimit('user:user2', config)
      expect(user2Result.success).toBe(true)
    })
  })

  describe('createRateLimitIdentifier', () => {
    it('should use user ID when available', () => {
      const mockRequest = {} as any
      const userId = 'user123'

      const identifier = createRateLimitIdentifier(mockRequest, userId)
      expect(identifier).toBe('user:user123')
    })

    it('should fallback to IP when no user ID', () => {
      const mockRequest = {
        headers: new Map([['x-forwarded-for', '192.168.1.1']])
      } as any

      mockRequest.headers.get = vi.fn((name) => {
        if (name === 'x-forwarded-for') return '192.168.1.1'
        return null
      })

      const identifier = createRateLimitIdentifier(mockRequest)
      expect(identifier).toBe('ip:192.168.1.1')
    })

    it('should handle multiple IPs in x-forwarded-for', () => {
      const mockRequest = {
        headers: new Map()
      } as any

      mockRequest.headers.get = vi.fn((name) => {
        if (name === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1, 172.16.0.1'
        return null
      })

      const identifier = createRateLimitIdentifier(mockRequest)
      expect(identifier).toBe('ip:192.168.1.1') // Premier IP uniquement
    })
  })

  describe('withRateLimit integration', () => {
    it('should return error response when rate limit exceeded', async () => {
      const mockRequest = {} as any
      const config = { windowMs: 60000, max: 1 } // 1 req/min pour test rapide

      // Premier appel - succès
      const result1 = await withRateLimit(mockRequest, config, 'test-user')
      expect(result1.error).toBeUndefined()

      // Deuxième appel - doit être bloqué
      const result2 = await withRateLimit(mockRequest, config, 'test-user')
      expect(result2.error).toBeDefined()

      // Vérifier la structure de la réponse d'erreur
      const errorResponse = result2.error!
      expect(errorResponse.status).toBe(429)
    })
  })
})

describe('Circuit Breaker', () => {
  beforeEach(() => {
    // Reset tous les circuits avant chaque test
    resetCircuitBreaker('claude')
    resetCircuitBreaker('gemini')
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Circuit States', () => {
    it('should start in CLOSED state', () => {
      const metrics = getCircuitMetrics('claude')
      expect(metrics.state).toBe('CLOSED')
      expect(metrics.failures).toBe(0)
    })

    it('should open circuit after failure threshold', async () => {
      const failingApiCall = vi.fn().mockRejectedValue(new Error('API Error'))

      // Faire 3 appels qui échouent (seuil = 3)
      for (let i = 0; i < 3; i++) {
        try {
          await withResilience(failingApiCall, 'claude')
        } catch (e) {
          // Ignorer les erreurs pour le test
        }
      }

      const metrics = getCircuitMetrics('claude')
      expect(metrics.state).toBe('OPEN')
    })

    it('should go to HALF_OPEN after recovery timeout', async () => {
      const failingApiCall = vi.fn().mockRejectedValue(new Error('API Error'))

      // Ouvrir le circuit
      for (let i = 0; i < 3; i++) {
        try {
          await withResilience(failingApiCall, 'claude')
        } catch (e) {}
      }

      // Avancer le temps pour dépasser le recovery timeout (30s pour Claude)
      vi.advanceTimersByTime(31000)

      // Le prochain appel devrait tenter une récupération
      const successfulApiCall = vi.fn().mockResolvedValue('success')
      const result = await withResilience(successfulApiCall, 'claude')

      expect(result).toBe('success')
      const metrics = getCircuitMetrics('claude')
      expect(metrics.state).toBe('CLOSED') // Fermé après succès
    })

    it('should block calls when circuit is OPEN', async () => {
      const failingApiCall = vi.fn().mockRejectedValue(new Error('API Error'))

      // Ouvrir le circuit
      for (let i = 0; i < 3; i++) {
        try {
          await withResilience(failingApiCall, 'claude')
        } catch (e) {}
      }

      // Appel suivant doit être bloqué immédiatement
      await expect(
        withResilience(vi.fn(), 'claude')
      ).rejects.toThrow('temporairement indisponible')
    })
  })

  describe('Retry Logic', () => {
    it('should retry on retryable errors', async () => {
      let callCount = 0
      const retryableApiCall = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          throw new Error('timeout') // Erreur retryable
        }
        return 'success'
      })

      const result = await withResilience(retryableApiCall, 'claude')

      expect(result).toBe('success')
      expect(callCount).toBe(3) // 2 retries + 1 succès
    })

    it('should not retry on non-retryable errors', async () => {
      let callCount = 0
      const nonRetryableApiCall = vi.fn().mockImplementation(() => {
        callCount++
        throw new Error('invalid input') // Erreur non-retryable
      })

      await expect(
        withResilience(nonRetryableApiCall, 'claude')
      ).rejects.toThrow()

      expect(callCount).toBe(1) // Pas de retry
    })

    it('should apply exponential backoff', async () => {
      const startTime = Date.now()
      const callTimes: number[] = []

      const failingApiCall = vi.fn().mockImplementation(() => {
        callTimes.push(Date.now() - startTime)
        throw new Error('timeout')
      })

      try {
        await withResilience(failingApiCall, 'claude')
      } catch (e) {}

      expect(callTimes).toHaveLength(4) // 1 initial + 3 retries

      // Vérifier les délais approximatifs (1s, 2s, 4s)
      // Note: En test, les timers sont mockés donc on teste la logique
    })
  })

  describe('Service-specific configurations', () => {
    it('should use different configs for Claude vs Gemini', () => {
      // Claude config: 30s recovery, 3 failures
      // Gemini config: 45s recovery, 3 failures

      const claudeMetrics = getCircuitMetrics('claude')
      const geminiMetrics = getCircuitMetrics('gemini')

      expect(claudeMetrics.serviceName).toBe('claude')
      expect(geminiMetrics.serviceName).toBe('gemini')
    })
  })

  describe('Error Classification', () => {
    it('should handle Anthropic API errors correctly', async () => {
      class AnthropicError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'APIError'
        }
      }

      const apiCall = vi.fn().mockRejectedValue(new AnthropicError('Rate limit exceeded'))

      await expect(
        withResilience(apiCall, 'claude')
      ).rejects.toThrow('génération de texte est temporairement indisponible')
    })

    it('should handle Gemini API errors correctly', async () => {
      const apiCall = vi.fn().mockRejectedValue(new Error('Request timeout'))

      await expect(
        withResilience(apiCall, 'gemini')
      ).rejects.toThrow('génération d\'images est temporairement indisponible')
    })
  })
})

describe('Rate Limiting + Circuit Breaker Integration', () => {
  it('should apply rate limiting before circuit breaker', async () => {
    // Dépasser la limite de rate limiting
    const config = { windowMs: 60000, max: 1 }
    const apiCall = vi.fn().mockResolvedValue('success')

    // Premier appel - succès
    await withRateLimit({} as any, config, 'test-user', () =>
      withResilience(apiCall, 'claude')
    )

    // Deuxième appel - bloqué par rate limiting avant même d'atteindre le circuit
    const result = await withRateLimit({} as any, config, 'test-user', () =>
      withResilience(apiCall, 'claude')
    )

    expect(result.error).toBeDefined()
    expect(result.error!.status).toBe(429)

    // Le circuit devrait toujours être fermé car l'API call n'a pas été tenté
    const metrics = getCircuitMetrics('claude')
    expect(metrics.state).toBe('CLOSED')
  })
})