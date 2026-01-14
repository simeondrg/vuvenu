/**
 * Configuration globale pour les tests Vitest
 * Mock des APIs externes et setup de l'environnement de test
 */

import { vi, beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Nettoyage automatique après chaque test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.clearAllTimers()
})

// Reset global avant chaque test
beforeEach(() => {
  vi.clearAllMocks()
})

// Mock de Next.js Navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/'),
  notFound: vi.fn(),
}))

// Mock de next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn(() => ({ value: 'mock-cookie-value' })),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))

// Mock des APIs Supabase
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      limit: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        download: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  })),
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  })),
}))

// Mock de l'API Anthropic Claude
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn(() => ({
    messages: {
      create: vi.fn(),
    },
  })),
  APIError: class MockAPIError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'APIError'
    }
  },
}))

// Mock de l'API Google Generative AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn(),
    })),
  })),
}))

// Variables d'environnement pour les tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'
process.env.GOOGLE_AI_API_KEY = 'test-google-ai-key'

// Mock des modules de sécurité et rate limiting
vi.mock('@/lib/rate-limit', () => ({
  withRateLimit: vi.fn().mockImplementation(async (request, config, userId, handler) => {
    // Simule un rate limit qui passe toujours dans les tests
    if (handler) {
      return { result: await handler(), error: undefined }
    }
    return { error: undefined }
  }),
  RATE_LIMIT_CONFIGS: {
    generate: { windowMs: 60000, max: 5 }
  },
  checkRateLimit: vi.fn().mockReturnValue({ success: true, remaining: 4 }),
  createRateLimitIdentifier: vi.fn().mockReturnValue('test-user')
}))

vi.mock('@/lib/api-security', () => ({
  withSecurity: vi.fn().mockImplementation((schema, handler) => handler),
  GenerationInputSchema: {
    parse: vi.fn().mockImplementation((data) => data)
  },
  createCorsHeaders: vi.fn().mockReturnValue(new Headers()),
  logApiUsage: vi.fn(),
  SECURITY_LIMITS: {
    CLAUDE_TIMEOUT_MS: 30000
  }
}))

vi.mock('@/lib/circuit-breaker', () => ({
  withResilience: vi.fn().mockImplementation(async (handler) => {
    return await handler()
  }),
  getCircuitMetrics: vi.fn().mockReturnValue({
    state: 'CLOSED',
    failures: 0,
    serviceName: 'test'
  }),
  resetCircuitBreaker: vi.fn()
}))

vi.mock('@/lib/error-handler', () => ({
  createUserFriendlyError: vi.fn().mockReturnValue({
    code: 'ERR-TEST',
    title: 'Test Error',
    message: 'Test error message',
    action: 'Test action'
  }),
  logError: vi.fn(),
  ErrorCode: {
    CLAUDE_TIMEOUT: 'ERR-CLAUDE-001'
  }
}))

// Mock des fetch globaux
global.fetch = vi.fn()

// Mock de window.location pour les tests de redirection
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Mock du clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('')),
  },
})

// Configuration des timers pour tester les timeouts/delays
// Note: useFakeTimers() doit être appelé individuellement dans chaque test qui en a besoin
// vi.useFakeTimers()

// Helper pour les mocks d'API
export const mockSupabaseResponse = (data: any, error?: any) => ({
  data,
  error,
})

export const mockClaudeResponse = (content: string) => ({
  content: [{ type: 'text', text: content }],
  usage: { input_tokens: 100, output_tokens: 200 },
})

export const mockGeminiResponse = (text: string) => ({
  response: {
    text: () => text,
    candidates: [{ content: { parts: [{ text }] } }],
  },
})

// Helper pour créer des utilisateurs de test
export const createTestUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@vuvenu.fr',
  ...overrides,
})

// Helper pour créer des profils utilisateur de test
export const createTestProfile = (overrides = {}) => ({
  id: 'test-user-id',
  business_name: 'Mon Commerce Test',
  business_type: 'restaurant',
  subscription_tier: 'starter',
  subscription_status: 'active',
  scripts_count_month: 0,
  campaigns_count_month: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

// Helper pour créer des scripts de test
export const createTestScript = (overrides = {}) => ({
  id: 'test-script-id',
  user_id: 'test-user-id',
  title: 'Script de test',
  content: 'Contenu de script de test...',
  format: 'reels',
  tone: 'amical',
  tokens_used: 150,
  created_at: new Date().toISOString(),
  input_data: {
    industry: 'restaurant',
    topic: 'Nouveau menu',
  },
  ...overrides,
})

// Helper pour créer des campagnes de test
export const createTestCampaign = (overrides = {}) => ({
  id: 'test-campaign-id',
  user_id: 'test-user-id',
  title: 'Campagne de test',
  status: 'draft',
  wizard_step: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  input_data: {
    industry: 'restaurant',
    objective: 'traffic',
    budget: { daily: 20, duration: 7 },
  },
  ...overrides,
})

// Console warn/error suppression pour les tests (sauf si explicitement testé)
const originalConsole = { ...console }
console.warn = vi.fn()
console.error = vi.fn()

// Restaurer console pour debug si nécessaire
export const restoreConsole = () => {
  Object.assign(console, originalConsole)
}