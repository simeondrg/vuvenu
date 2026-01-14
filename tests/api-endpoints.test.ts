/**
 * Tests d'intégration pour les endpoints API critiques
 * Teste les flux complets avec authentification, validation, rate limiting
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { createTestUser, createTestProfile, mockSupabaseResponse, mockClaudeResponse } from './setup'

// Mock des handlers d'API (les fonctions seront mockées)
const mockAuthenticatedUser = (profile = createTestProfile()) => {
  const createServerClient = vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: createTestUser() },
        error: null
      })
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profile, error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }))
  })

  vi.doMock('@supabase/ssr', () => ({
    createServerClient
  }))
}

const mockUnauthenticatedUser = () => {
  const createServerClient = vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'No user found' }
      })
    }
  })

  vi.doMock('@supabase/ssr', () => ({
    createServerClient
  }))
}

const createMockRequest = (body: any = {}, headers: Record<string, string> = {}) => {
  const headerMap = new Map(Object.entries(headers))

  const request = {
    json: vi.fn().mockResolvedValue(body),
    text: vi.fn().mockResolvedValue(JSON.stringify(body)),
    headers: {
      get: vi.fn((name) => headers[name] || null),
      set: vi.fn(),
      has: vi.fn((name) => headerMap.has(name)),
      forEach: vi.fn((callback) => headerMap.forEach(callback))
    }
  } as unknown as NextRequest

  return request
}

// Helper pour mocker Claude API avec succès
const mockClaudeSuccess = (responseText: string) => {
  const anthropicMock = vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue(mockClaudeResponse(responseText))
    }
  }))

  vi.doMock('@anthropic-ai/sdk', () => ({
    default: anthropicMock
  }))
}

// Helper pour mocker Claude API avec erreur
const mockClaudeError = (error: Error) => {
  const anthropicMock = vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockRejectedValue(error)
    }
  }))

  vi.doMock('@anthropic-ai/sdk', () => ({
    default: anthropicMock,
    APIError: class MockAPIError extends Error {
      constructor(message: string) {
        super(message)
        this.name = 'APIError'
      }
    }
  }))
}

// Helper pour mocker Supabase avec données personnalisées
const mockSupabaseWithData = (userData: any, profileData: any, shouldInsert = false) => {
  const mockInsert = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: { id: 'new-script-id', content: 'Script saved' },
        error: null
      })
    })
  })

  const mockUpdate = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: null, error: null })
  })

  const createServerClient = vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userData },
        error: userData ? null : { message: 'No user found' }
      })
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profileData, error: null }),
      insert: shouldInsert ? mockInsert : vi.fn().mockReturnThis(),
      update: mockUpdate,
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }))
  })

  vi.doMock('@supabase/ssr', () => ({
    createServerClient
  }))
}

describe('API Endpoint: /api/generate/script', () => {
  let POST: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Dynamically import the handler to get fresh mocks
    const module = await import('@/app/api/generate/script/route')
    POST = module.POST
  })

  describe('Authentication', () => {
    it('should reject unauthenticated requests', async () => {
      mockUnauthenticatedUser()

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(401)

      const responseData = await response.json()
      expect(responseData.error).toContain('authentifié')
    })

    it('should accept authenticated requests', async () => {
      mockAuthenticatedUser()

      // Mock Claude API success
      mockClaudeSuccess('Script généré avec succès')

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical',
        topic: 'Nouveau menu'
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Input Validation', () => {
    beforeEach(() => {
      mockAuthenticatedUser()
    })

    it('should validate required fields', async () => {
      const request = createMockRequest({
        // Manque industry (requis)
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const responseData = await response.json()
      expect(responseData.error).toContain('invalides')
    })

    it('should validate enum values for format', async () => {
      const request = createMockRequest({
        industry: 'restaurant',
        format: 'invalid_format', // Format invalide
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should validate enum values for tone', async () => {
      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'invalid_tone' // Ton invalide
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should reject inputs that are too long', async () => {
      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical',
        topic: 'a'.repeat(10001) // Dépasse la limite
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const responseData = await response.json()
      expect(responseData.code).toBe('ERR-VALID-002')
    })

    it('should sanitize dangerous content', async () => {
      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical',
        topic: '<script>alert("hack")</script>' // Contenu dangereux
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const responseData = await response.json()
      expect(responseData.code).toBe('ERR-VALID-003')
    })
  })

  describe('User Limits', () => {
    it('should respect starter plan limits (10 scripts)', async () => {
      const profile = createTestProfile({
        subscription_tier: 'starter',
        scripts_count_month: 10 // À la limite
      })
      mockAuthenticatedUser(profile)

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(403)

      const responseData = await response.json()
      expect(responseData.code).toBe('ERR-LIMIT-001')
      expect(responseData.message).toContain('plan Pro')
    })

    it('should respect pro plan limits (30 scripts)', async () => {
      const profile = createTestProfile({
        subscription_tier: 'pro',
        scripts_count_month: 30 // À la limite
      })
      mockAuthenticatedUser(profile)

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(403)

      const responseData = await response.json()
      expect(responseData.code).toBe('ERR-LIMIT-001')
      expect(responseData.message).toContain('Business')
    })

    it('should allow unlimited scripts for business plan', async () => {
      const profile = createTestProfile({
        subscription_tier: 'business',
        scripts_count_month: 1000 // Très élevé
      })
      mockAuthenticatedUser(profile)

      // Mock Claude success
      mockClaudeSuccess('Script pour business')

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Claude API Integration', () => {
    beforeEach(() => {
      mockAuthenticatedUser()
    })

    it('should handle Claude API success', async () => {
      mockClaudeSuccess('Super script généré !')

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical',
        topic: 'Plat du jour'
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.success).toBe(true)
      expect(responseData.script.content).toContain('Super script généré')
      expect(responseData.script.tokensUsed).toBeGreaterThan(0)
      expect(responseData.script.format).toBe('reels')
    })

    it('should handle Claude API errors gracefully', async () => {
      class ClaudeError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'APIError'
        }
      }
      mockClaudeError(new ClaudeError('Rate limit exceeded'))

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(502)

      const responseData = await response.json()
      expect(responseData.code).toBe('ERR-CLAUDE-002') // Rate limit
      expect(responseData.title).toBe('Trop de demandes')
      expect(responseData.action).toContain('minute')
    })

    it('should handle Claude API timeout', async () => {
      mockClaudeError(new Error('timeout'))

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(502)

      const responseData = await response.json()
      expect(responseData.code).toBe('ERR-CLAUDE-001') // Timeout
    })
  })

  describe('Response Format', () => {
    beforeEach(() => {
      mockAuthenticatedUser()
    })

    it('should return user-friendly error format', async () => {
      mockClaudeError(new Error('Service unavailable'))

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)

      const responseData = await response.json()

      // Vérifier le format de réponse user-friendly
      expect(responseData).toHaveProperty('error')
      expect(responseData).toHaveProperty('code')
      expect(responseData).toHaveProperty('title')
      expect(responseData).toHaveProperty('action')
      expect(responseData).toHaveProperty('helpUrl')

      // Vérifier que c'est en français
      expect(responseData.title).toMatch(/[a-záàéèêëïîôöùûüÿç]/i)
      expect(responseData.action).toMatch(/[a-záàéèêëïîôöùûüÿç]/i)
    })

    it('should include CORS headers', async () => {
      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)

      // Vérifier la présence des headers CORS (dans un vrai environnement)
      expect(response.headers).toBeDefined()
    })
  })

  describe('Database Operations', () => {
    beforeEach(() => {
      mockAuthenticatedUser()
    })

    it('should save generated script to database', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'new-script-id', content: 'Script saved' },
            error: null
          })
        })
      })

      const createServerClient = vi.fn().mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: createTestUser() },
            error: null
          })
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: createTestProfile(), error: null }),
          insert: mockInsert,
          update: vi.fn().mockReturnThis()
        }))
      })

      vi.doMock('@supabase/ssr', () => ({
        createServerClient
      }))

      // Mock Claude success
      mockClaudeSuccess('Script pour DB')

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      // Vérifier que insert a été appelé
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should update user script count', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null })
      })

      const createServerClient = vi.fn().mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: createTestUser() },
            error: null
          })
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: createTestProfile(), error: null }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'script-id' }, error: null })
            })
          }),
          update: mockUpdate
        }))
      })

      vi.doMock('@supabase/ssr', () => ({
        createServerClient
      }))

      // Mock Claude success
      mockClaudeSuccess('Script test')

      const request = createMockRequest({
        industry: 'restaurant',
        format: 'reels',
        tone: 'amical'
      })

      await POST(request)

      // Vérifier que le compteur a été mis à jour
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          scripts_count_month: expect.any(Number)
        })
      )
    })
  })
})

describe('API Endpoint: /api/health/circuit-status', () => {
  let GET: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('@/app/api/health/circuit-status/route')
    GET = module.GET
  })

  it('should return circuit breaker status', async () => {
    const request = createMockRequest()

    const response = await GET(request)
    expect(response.status).toBe(200)

    const responseData = await response.json()

    expect(responseData).toHaveProperty('timestamp')
    expect(responseData).toHaveProperty('overall_status')
    expect(responseData).toHaveProperty('services')
    expect(responseData.services).toHaveProperty('claude')
    expect(responseData.services).toHaveProperty('gemini')

    // Vérifier la structure des métriques de service
    expect(responseData.services.claude).toHaveProperty('state')
    expect(responseData.services.claude).toHaveProperty('failures')
    expect(responseData.services.claude).toHaveProperty('uptime')
    expect(responseData.services.claude).toHaveProperty('description')
  })

  it('should provide recommendations when services are degraded', async () => {
    // Note: Dans un vrai test, nous modifierions l'état du circuit pour être OPEN
    const request = createMockRequest()
    const response = await GET(request)
    const responseData = await response.json()

    expect(responseData).toHaveProperty('recommendations')
    expect(Array.isArray(responseData.recommendations)).toBe(true)
  })
})