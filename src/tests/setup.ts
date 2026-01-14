/**
 * Configuration et setup pour les tests VuVenu
 *
 * Ce fichier configure l'environnement de test avec:
 * - Testing Library matchers
 * - Mocks pour Supabase et APIs externes
 * - Variables d'environnement de test
 * - Polyfills nécessaires
 */

import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// =============================================
// ENVIRONMENT VARIABLES
// =============================================

// Variables d'environnement pour les tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'
process.env.GOOGLE_AI_API_KEY = 'test-google-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// =============================================
// GLOBAL MOCKS
// =============================================

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  redirect: vi.fn(),
}))

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(() => []),
  }),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
class MockResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
}

window.ResizeObserver = MockResizeObserver

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
}

// @ts-ignore - Mock pour les tests
window.IntersectionObserver = MockIntersectionObserver

// =============================================
// SUPABASE MOCKS
// =============================================

// Mock data types for Supabase
const mockUser = {
  id: 'test-user-id',
  email: 'test@vuvenu.fr',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  email_confirmed_at: '2024-01-01T00:00:00Z',
}

const mockProfile = {
  id: 'test-user-id',
  business_name: 'Test Business',
  business_type: 'restaurant',
  target_audience: 'Familles locales',
  main_goal: 'Attirer plus de clients',
  subscription_status: 'active' as const,
  subscription_tier: 'pro' as const,
  scripts_count_month: 5,
  campaigns_count_month: 2,
  onboarding_completed: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(() =>
      Promise.resolve({
        data: { user: mockUser },
        error: null
      })
    ),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithOAuth: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    getSession: vi.fn(() =>
      Promise.resolve({
        data: { session: { user: mockUser } },
        error: null
      })
    ),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() =>
          Promise.resolve({
            data: mockProfile,
            error: null
          })
        ),
      })),
    })),
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => Promise.resolve({ data: null, error: null })),
    delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
  })),
  rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
}

// Mock Supabase modules
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => mockSupabaseClient),
  createServerClient: vi.fn(() => mockSupabaseClient),
}))

// =============================================
// API MOCKS
// =============================================

// Mock fetch pour les APIs externes
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock Anthropic API
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn(() => Promise.resolve({
        content: [{ text: 'Script généré par IA de test' }],
        usage: { input_tokens: 100, output_tokens: 200 },
      })),
    },
  })),
}))

// Mock Google AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn(() => Promise.resolve({
        response: {
          text: () => 'Contenu généré par Gemini de test',
        },
      })),
    })),
  })),
}))

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: vi.fn(() => Promise.resolve({
          id: 'cs_test_123',
          url: 'https://checkout.stripe.com/test'
        })),
      },
    },
    billingPortal: {
      sessions: {
        create: vi.fn(() => Promise.resolve({
          url: 'https://billing.stripe.com/test'
        })),
      },
    },
    customers: {
      create: vi.fn(() => Promise.resolve({ id: 'cus_test_123' })),
      retrieve: vi.fn(() => Promise.resolve({ id: 'cus_test_123' })),
    },
    subscriptions: {
      list: vi.fn(() => Promise.resolve({ data: [] })),
    },
  })),
}))

// =============================================
// TEST UTILITIES
// =============================================

/**
 * Reset tous les mocks entre les tests
 */
export function resetAllMocks() {
  vi.clearAllMocks()
  mockFetch.mockClear()
}

/**
 * Mock d'une session utilisateur authentifié
 */
export function mockAuthenticatedUser(user = mockUser, profile = mockProfile) {
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user },
    error: null,
  })

  mockSupabaseClient.from.mockReturnValue({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: profile, error: null })),
      })),
    })),
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => Promise.resolve({ data: null, error: null })),
    delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
  })
}

/**
 * Mock d'un utilisateur non authentifié
 */
export function mockUnauthenticatedUser() {
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: null,
  } as any)
}

/**
 * Mock d'une erreur Supabase
 */
export function mockSupabaseError(error: string) {
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: { message: error },
  } as any)
}

/**
 * Mock d'une réponse fetch
 */
export function mockFetchResponse(data: any, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  })
}

// =============================================
// LIFECYCLE HOOKS
// =============================================

beforeEach(() => {
  // Reset des mocks avant chaque test
  resetAllMocks()

  // Configuration par défaut: utilisateur authentifié
  mockAuthenticatedUser()
})

afterEach(() => {
  // Nettoyage après chaque test
  vi.clearAllTimers()
})

// =============================================
// EXPORTS
// =============================================

export {
  mockUser,
  mockProfile,
  mockSupabaseClient,
  mockFetch,
}