/**
 * Tests critiques pour le système de gestion d'erreurs user-friendly
 * Vérifie que les erreurs techniques sont transformées en messages compréhensibles
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ErrorCode,
  classifyError,
  createUserFriendlyError,
  formatErrorForDisplay,
  logError,
  withErrorHandling
} from '@/lib/error-handler'

describe('Error Classification', () => {
  describe('classifyError', () => {
    // Tests erreurs Claude
    it('should classify Claude timeout errors', () => {
      const error = new Error('Request timeout from Claude API')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.CLAUDE_TIMEOUT)
    })

    it('should classify Claude rate limit errors', () => {
      const error = new Error('Rate limit exceeded for Anthropic API')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.CLAUDE_RATE_LIMIT)
    })

    it('should classify general Claude errors', () => {
      const error = new Error('Claude API unavailable')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.CLAUDE_UNAVAILABLE)
    })

    // Tests erreurs Gemini
    it('should classify Gemini timeout errors', () => {
      const error = new Error('Google AI timeout')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.GEMINI_TIMEOUT)
    })

    it('should classify Gemini rate limit errors', () => {
      const error = new Error('Gemini rate limit exceeded')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.GEMINI_RATE_LIMIT)
    })

    // Tests erreurs auth
    it('should classify authentication errors', () => {
      const error = new Error('Non authentifié')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.AUTH_REQUIRED)
    })

    it('should classify session expired errors', () => {
      const error = new Error('Session expired')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.AUTH_EXPIRED)
    })

    // Tests erreurs limites
    it('should classify script limit errors', () => {
      const error = new Error('Limite de scripts atteinte')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.SCRIPT_LIMIT_REACHED)
    })

    it('should classify campaign limit errors', () => {
      const error = new Error('Limite de campagnes atteinte')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.CAMPAIGN_LIMIT_REACHED)
    })

    it('should classify rate limit errors', () => {
      const error = new Error('Rate limit exceeded - 429')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED)
    })

    // Tests erreurs validation
    it('should classify validation errors', () => {
      const error = new Error('Données invalides')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.VALIDATION_FAILED)
    })

    it('should classify input too long errors', () => {
      const error = new Error('Texte trop long - max 10k chars')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.INPUT_TOO_LONG)
    })

    it('should classify dangerous content errors', () => {
      const error = new Error('Contenu non autorisé détecté')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.DANGEROUS_CONTENT)
    })

    // Tests erreurs BDD
    it('should classify profile not found errors', () => {
      const error = new Error('Profil utilisateur introuvable')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.PROFILE_NOT_FOUND)
    })

    it('should classify save failed errors', () => {
      const error = new Error('Erreur lors de la sauvegarde')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.SAVE_FAILED)
    })

    // Tests erreurs réseau
    it('should classify network errors', () => {
      const error = new Error('Network connection failed')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.NETWORK_ERROR)
    })

    it('should classify fetch errors', () => {
      const error = new Error('Fetch request failed')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.NETWORK_ERROR)
    })

    // Tests fallback
    it('should fallback to unknown error for unclassified errors', () => {
      const error = new Error('Something completely unexpected')
      const code = classifyError(error)
      expect(code).toBe(ErrorCode.UNKNOWN_ERROR)
    })

    it('should handle null/undefined errors', () => {
      expect(classifyError(null)).toBe(ErrorCode.UNKNOWN_ERROR)
      expect(classifyError(undefined)).toBe(ErrorCode.UNKNOWN_ERROR)
    })

    it('should handle non-Error objects', () => {
      expect(classifyError('string error')).toBe(ErrorCode.UNKNOWN_ERROR)
      expect(classifyError({ message: 'object error' })).toBe(ErrorCode.UNKNOWN_ERROR)
    })
  })
})

describe('User-Friendly Error Creation', () => {
  describe('createUserFriendlyError', () => {
    it('should create user-friendly error for Claude timeout', () => {
      const error = new Error('Claude API timeout')
      const userError = createUserFriendlyError(error, 'Script generation')

      expect(userError.code).toBe(ErrorCode.CLAUDE_TIMEOUT)
      expect(userError.title).toBe('Génération en cours...')
      expect(userError.message).toContain('génération prend plus de temps')
      expect(userError.action).toBeDefined()
      expect(userError.helpUrl).toBeDefined()
      expect(userError.technical).toContain('Script generation: Claude API timeout')
    })

    it('should create user-friendly error for rate limit', () => {
      const error = new Error('Rate limit exceeded')
      const userError = createUserFriendlyError(error)

      expect(userError.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED)
      expect(userError.title).toBe('Ralentissez un peu ! 🚦')
      expect(userError.message).toContain('très rapidement')
      expect(userError.action).toContain('30 secondes')
    })

    it('should create user-friendly error for script limits', () => {
      const error = new Error('Limite de scripts atteinte')
      const userError = createUserFriendlyError(error)

      expect(userError.code).toBe(ErrorCode.SCRIPT_LIMIT_REACHED)
      expect(userError.title).toBe('Limite de scripts atteinte')
      expect(userError.message).toContain('plan Pro')
      expect(userError.action).toContain('Upgrader')
    })

    it('should include context in technical field', () => {
      const error = new Error('Test error')
      const userError = createUserFriendlyError(error, 'User login flow')

      expect(userError.technical).toContain('User login flow: Test error')
    })
  })

  describe('formatErrorForDisplay', () => {
    it('should format error for UI display', () => {
      const userError = createUserFriendlyError(
        new Error('Rate limit exceeded'),
        'API call'
      )

      const formatted = formatErrorForDisplay(userError)

      expect(formatted.title).toBeDefined()
      expect(formatted.message).toBeDefined()
      expect(formatted.action).toBeDefined()
      expect(formatted.supportInfo).toContain('ERR-LIMIT-003')
      expect(formatted.supportInfo).toContain('/help/generation-rapide')
    })

    it('should handle errors without action', () => {
      const userError = createUserFriendlyError(
        new Error('Unknown issue'),
        'Background task'
      )

      const formatted = formatErrorForDisplay(userError)

      expect(formatted.action).toBeDefined() // Toujours définie selon ERROR_MESSAGES
      expect(formatted.supportInfo).toContain(userError.code)
    })
  })
})

describe('Error Logging', () => {
  describe('logError', () => {
    let consoleSpy: any

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('should log structured error information', () => {
      const userError = createUserFriendlyError(
        new Error('Test error'),
        'Test context'
      )

      logError(userError, 'user123', 'API endpoint')

      expect(consoleSpy).toHaveBeenCalledWith(
        '🚨 Erreur utilisateur:',
        expect.objectContaining({
          code: userError.code,
          title: userError.title,
          context: 'API endpoint',
          userId: 'user123',
          technical: expect.stringContaining('Test context: Test error'),
          timestamp: expect.any(String)
        })
      )
    })

    it('should handle anonymous users', () => {
      const userError = createUserFriendlyError(new Error('Test error'))

      logError(userError, undefined, 'Public page')

      expect(consoleSpy).toHaveBeenCalledWith(
        '🚨 Erreur utilisateur:',
        expect.objectContaining({
          userId: 'anonymous'
        })
      )
    })
  })
})

describe('Error Handler Wrapper', () => {
  describe('withErrorHandling', () => {
    it('should return result on success', async () => {
      const successFn = vi.fn().mockResolvedValue('success result')

      const { result, error } = await withErrorHandling(
        successFn,
        'Test function',
        'user123'
      )

      expect(result).toBe('success result')
      expect(error).toBeUndefined()
    })

    it('should return user-friendly error on failure', async () => {
      const failureFn = vi.fn().mockRejectedValue(new Error('Claude API timeout'))

      const { result, error } = await withErrorHandling(
        failureFn,
        'Script generation',
        'user123'
      )

      expect(result).toBeUndefined()
      expect(error).toBeDefined()
      expect(error!.code).toBe(ErrorCode.CLAUDE_TIMEOUT)
      expect(error!.title).toBe('Génération en cours...')
    })

    it('should handle synchronous errors', async () => {
      const failureFn = vi.fn().mockImplementation(() => {
        throw new Error('Sync error')
      })

      const { result, error } = await withErrorHandling(
        failureFn,
        'Sync operation'
      )

      expect(result).toBeUndefined()
      expect(error).toBeDefined()
    })
  })
})

describe('Error Messages Content Quality', () => {
  // Tests pour vérifier la qualité des messages user-friendly

  it('should have French messages for all error codes', () => {
    const allErrorCodes = Object.values(ErrorCode)

    allErrorCodes.forEach(errorCode => {
      const mockError = new Error('test')
      const userError = createUserFriendlyError(mockError)

      // Forcer le code d'erreur pour ce test
      const specificError = { ...userError, code: errorCode }
      const formatted = formatErrorForDisplay(specificError)

      expect(formatted.title).toBeTruthy()
      expect(formatted.message).toBeTruthy()
      expect(formatted.title.length).toBeGreaterThan(5)
      expect(formatted.message.length).toBeGreaterThan(10)
    })
  })

  it('should not contain technical jargon in user messages', () => {
    const technicalError = new Error('HTTP 502 Bad Gateway from upstream server')
    const userError = createUserFriendlyError(technicalError)
    const formatted = formatErrorForDisplay(userError)

    // Les messages utilisateur ne doivent pas contenir de jargon technique
    expect(formatted.message).not.toMatch(/HTTP|502|upstream|server/i)
    expect(formatted.message).not.toMatch(/API|endpoint|timeout/i)
    expect(formatted.message).not.toMatch(/authentication|authorization|middleware/i)
  })

  it('should provide actionable guidance', () => {
    const errors = [
      new Error('Rate limit exceeded'),
      new Error('Limite de scripts atteinte'),
      new Error('Session expired'),
      new Error('Validation failed')
    ]

    errors.forEach(error => {
      const userError = createUserFriendlyError(error)
      const formatted = formatErrorForDisplay(userError)

      expect(formatted.action).toBeTruthy()
      expect(formatted.action!.length).toBeGreaterThan(10)

      // L'action doit contenir des verbes d'action
      expect(formatted.action).toMatch(/réessayez|attendez|vérifiez|contactez|upgrader|passez|reconnectez/i)
    })
  })

  it('should include help URLs for guidance', () => {
    const userError = createUserFriendlyError(
      new Error('Limite de scripts atteinte')
    )

    expect(userError.helpUrl).toBeTruthy()
    expect(userError.helpUrl).toMatch(/^\/help\//)
  })
})