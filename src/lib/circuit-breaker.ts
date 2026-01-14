/**
 * Circuit Breaker et Retry Logic pour les APIs externes (Claude, Gemini)
 * Implémente le pattern Circuit Breaker pour éviter les appels inutiles
 * quand un service externe est down + retry avec backoff exponentiel
 */

interface CircuitBreakerConfig {
  failureThreshold: number    // Nombre d'échecs avant ouverture
  recoveryTimeout: number     // Temps avant tentative de récupération (ms)
  monitoringPeriod: number   // Période de surveillance (ms)
}

interface RetryConfig {
  maxRetries: number          // Nombre max de tentatives
  initialDelay: number        // Délai initial (ms)
  maxDelay: number           // Délai maximum (ms)
  backoffMultiplier: number  // Multiplicateur backoff exponentiel
  jitter: boolean            // Ajouter du jitter anti-thundering herd
}

export interface ApiCall<T> {
  (): Promise<T>
}

// États possibles du circuit breaker
export enum CircuitState {
  CLOSED = 'CLOSED',         // Fonctionnement normal
  OPEN = 'OPEN',             // Circuit ouvert, pas d'appels
  HALF_OPEN = 'HALF_OPEN'    // Test de récupération
}

// Configurations par service
export const CIRCUIT_CONFIGS = {
  claude: {
    failureThreshold: 3,      // 3 échecs consécutifs
    recoveryTimeout: 30000,   // 30s avant retry
    monitoringPeriod: 60000   // 1min de surveillance
  },
  gemini: {
    failureThreshold: 3,      // 3 échecs consécutifs
    recoveryTimeout: 45000,   // 45s avant retry (Gemini plus lent)
    monitoringPeriod: 60000   // 1min de surveillance
  }
} as const

export const RETRY_CONFIGS = {
  claude: {
    maxRetries: 3,
    initialDelay: 1000,       // 1s
    maxDelay: 8000,           // 8s max
    backoffMultiplier: 2,     // 1s -> 2s -> 4s -> 8s
    jitter: true
  },
  gemini: {
    maxRetries: 3,
    initialDelay: 2000,       // 2s (Gemini plus lent)
    maxDelay: 16000,          // 16s max
    backoffMultiplier: 2,
    jitter: true
  }
} as const

// Store global des circuit breakers (singleton par service)
const circuitBreakers = new Map<string, CircuitBreakerState>()

interface CircuitBreakerState {
  state: CircuitState
  failures: number
  lastFailureTime: number
  lastSuccessTime: number
  config: CircuitBreakerConfig
}

/**
 * Initialise un circuit breaker pour un service
 */
function initCircuitBreaker(serviceName: string, config: CircuitBreakerConfig): CircuitBreakerState {
  const state: CircuitBreakerState = {
    state: CircuitState.CLOSED,
    failures: 0,
    lastFailureTime: 0,
    lastSuccessTime: Date.now(),
    config
  }

  circuitBreakers.set(serviceName, state)
  return state
}

/**
 * Récupère l'état du circuit breaker pour un service
 */
function getCircuitBreaker(serviceName: string): CircuitBreakerState {
  let state = circuitBreakers.get(serviceName)

  if (!state) {
    const config = serviceName === 'claude'
      ? CIRCUIT_CONFIGS.claude
      : CIRCUIT_CONFIGS.gemini
    state = initCircuitBreaker(serviceName, config)
  }

  return state
}

/**
 * Met à jour l'état du circuit breaker après un appel
 */
function updateCircuitState(serviceName: string, success: boolean): void {
  const state = getCircuitBreaker(serviceName)
  const now = Date.now()

  if (success) {
    // Succès - reset des compteurs
    state.failures = 0
    state.lastSuccessTime = now
    state.state = CircuitState.CLOSED

    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 Circuit ${serviceName}: SUCCESS - Reset to CLOSED`)
    }
  } else {
    // Échec - incrémenter compteur
    state.failures++
    state.lastFailureTime = now

    if (state.failures >= state.config.failureThreshold) {
      state.state = CircuitState.OPEN

      if (process.env.NODE_ENV === 'development') {
        console.log(`🔴 Circuit ${serviceName}: OPENED after ${state.failures} failures`)
      }
    }
  }
}

/**
 * Vérifie si un appel peut être effectué selon l'état du circuit
 */
function canCallService(serviceName: string): { allowed: boolean; reason?: string } {
  const state = getCircuitBreaker(serviceName)
  const now = Date.now()

  switch (state.state) {
    case CircuitState.CLOSED:
      return { allowed: true }

    case CircuitState.OPEN:
      // Vérifier si on peut passer en HALF_OPEN
      if (now - state.lastFailureTime >= state.config.recoveryTimeout) {
        state.state = CircuitState.HALF_OPEN

        if (process.env.NODE_ENV === 'development') {
          console.log(`🟡 Circuit ${serviceName}: HALF_OPEN - Testing recovery`)
        }

        return { allowed: true }
      }

      const waitTime = Math.ceil((state.config.recoveryTimeout - (now - state.lastFailureTime)) / 1000)
      return {
        allowed: false,
        reason: `Service ${serviceName} temporairement indisponible. Réessayez dans ${waitTime}s.`
      }

    case CircuitState.HALF_OPEN:
      // En test - autoriser un seul appel
      return { allowed: true }

    default:
      return { allowed: false, reason: 'État du circuit inconnu' }
  }
}

/**
 * Calcule le délai de retry avec backoff exponentiel et jitter
 */
function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  // Backoff exponentiel: initialDelay * (multiplier ^ attempt)
  let delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt)

  // Limiter au délai maximum
  delay = Math.min(delay, config.maxDelay)

  // Ajouter du jitter pour éviter l'effet "thundering herd"
  if (config.jitter) {
    // Jitter de ±25%
    const jitterRange = delay * 0.25
    const jitterOffset = (Math.random() - 0.5) * 2 * jitterRange
    delay = Math.max(0, delay + jitterOffset)
  }

  return Math.floor(delay)
}

/**
 * Pause d'attente asynchrone
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wrapper de retry avec backoff exponentiel
 */
export async function withRetry<T>(
  apiCall: ApiCall<T>,
  serviceName: string,
  retryConfig: RetryConfig = RETRY_CONFIGS.claude
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      // Premier appel ou attendre le délai de backoff
      if (attempt > 0) {
        const delay = calculateBackoffDelay(attempt - 1, retryConfig)

        if (process.env.NODE_ENV === 'development') {
          console.log(`⏳ ${serviceName} retry ${attempt}/${retryConfig.maxRetries} dans ${delay}ms`)
        }

        await sleep(delay)
      }

      const result = await apiCall()

      if (attempt > 0) {
        console.log(`✅ ${serviceName} récupéré après ${attempt} tentative(s)`)
      }

      return result

    } catch (error) {
      lastError = error as Error

      // Dernière tentative - on re-throw
      if (attempt === retryConfig.maxRetries) {
        console.error(`❌ ${serviceName} échec définitif après ${retryConfig.maxRetries + 1} tentatives:`, lastError.message)
        break
      }

      // Vérifier si l'erreur justifie un retry
      if (!shouldRetry(error)) {
        console.log(`🚫 ${serviceName} erreur non-retryable:`, lastError.message)
        break
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️  ${serviceName} tentative ${attempt + 1} échouée:`, lastError.message)
      }
    }
  }

  throw lastError || new Error(`${serviceName}: Échec après tous les retries`)
}

/**
 * Détermine si une erreur justifie un retry
 */
function shouldRetry(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const errorMessage = 'message' in error ? (error as Error).message.toLowerCase() : ''

  // Erreurs temporaires qui justifient un retry
  const retryableErrors = [
    'timeout',
    'network',
    'connection',
    'rate_limit_exceeded',
    'rate limit',
    'too many requests',
    '429',
    '502',
    '503',
    '504',
    'service unavailable',
    'temporary failure',
    'overloaded'
  ]

  return retryableErrors.some(pattern => errorMessage.includes(pattern))
}

/**
 * Wrapper complet : Circuit Breaker + Retry Logic
 *
 * Utilise ce wrapper pour tous les appels aux APIs externes
 */
export async function withResilience<T>(
  apiCall: ApiCall<T>,
  serviceName: 'claude' | 'gemini'
): Promise<T> {
  // 1. Vérifier l'état du circuit breaker
  const circuitCheck = canCallService(serviceName)

  if (!circuitCheck.allowed) {
    throw new Error(circuitCheck.reason || `Service ${serviceName} indisponible`)
  }

  try {
    // 2. Appel avec retry logic
    const result = await withRetry(
      apiCall,
      serviceName,
      serviceName === 'claude' ? RETRY_CONFIGS.claude : RETRY_CONFIGS.gemini
    )

    // 3. Marquer le succès dans le circuit breaker
    updateCircuitState(serviceName, true)

    return result

  } catch (error) {
    // 4. Marquer l'échec dans le circuit breaker
    updateCircuitState(serviceName, false)

    // Re-throw avec un message user-friendly
    const userMessage = serviceName === 'claude'
      ? 'Le service de génération de texte est temporairement indisponible.'
      : 'Le service de génération d\'images est temporairement indisponible.'

    throw new Error(`${userMessage} Réessayez dans quelques minutes.`)
  }
}

/**
 * Métriques et monitoring du circuit breaker
 */
export function getCircuitMetrics(serviceName: string) {
  const state = circuitBreakers.get(serviceName)

  if (!state) {
    return {
      serviceName,
      state: 'UNKNOWN',
      failures: 0,
      uptime: '100%',
      lastFailure: null
    }
  }

  const now = Date.now()
  const uptimePercent = state.failures === 0 ? 100 :
    Math.round(((now - state.lastFailureTime) / (now - state.lastSuccessTime)) * 100)

  return {
    serviceName,
    state: state.state,
    failures: state.failures,
    uptime: `${Math.max(0, Math.min(100, uptimePercent))}%`,
    lastFailure: state.lastFailureTime ? new Date(state.lastFailureTime).toISOString() : null,
    lastSuccess: new Date(state.lastSuccessTime).toISOString()
  }
}

/**
 * Reset manuel d'un circuit breaker (pour debug/admin)
 */
export function resetCircuitBreaker(serviceName: string): void {
  const state = circuitBreakers.get(serviceName)

  if (state) {
    state.state = CircuitState.CLOSED
    state.failures = 0
    state.lastSuccessTime = Date.now()

    console.log(`🔄 Circuit ${serviceName} manuellement reset à CLOSED`)
  }
}