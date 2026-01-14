/**
 * Tests unitaires pour les fonctions utilitaires
 *
 * Tests pour lib/utils.ts - fonctions d'aide générales
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  cn,
  capitalize,
  truncate,
  formatPrice,
  formatDate,
  timeAgo
} from './utils'

// =============================================
// TESTS: Style Utilities
// =============================================

describe('Style Utilities', () => {
  describe('cn', () => {
    it('should combine classes correctly', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })
  })
})

// =============================================
// TESTS: String Utilities
// =============================================

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('should not change already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })
  })

  describe('truncate', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated'
      expect(truncate(longText, 20)).toBe('This is a very long...')
    })

    it('should not truncate short text', () => {
      const shortText = 'Short text'
      expect(truncate(shortText, 20)).toBe('Short text')
    })

    it('should handle exact length', () => {
      const text = 'Exact length'
      expect(truncate(text, 12)).toBe('Exact length')
    })

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('')
    })
  })
})

// =============================================
// TESTS: Number Utilities
// =============================================

describe('Number Utilities', () => {
  describe('formatPrice', () => {
    it('should format price with currency by default', () => {
      // Utiliser l'espace insécable (\u00A0) comme attendu par Intl.NumberFormat français
      expect(formatPrice(59.99)).toBe('59,99\u00A0€')
    })

    it('should format price without currency when requested', () => {
      expect(formatPrice(59.99, false)).toBe('59,99')
    })

    it('should handle whole numbers', () => {
      expect(formatPrice(59)).toBe('59\u00A0€')
    })

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('0\u00A0€')
    })

    it('should handle large numbers', () => {
      expect(formatPrice(1234.56)).toBe('1\u202F234,56\u00A0€')
    })

    it('should handle cents', () => {
      expect(formatPrice(0.99)).toBe('0,99\u00A0€')
    })
  })
})

// =============================================
// TESTS: Date Utilities
// =============================================

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date in French by default', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/15 janvier 2024/)
    })

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toMatch(/15 janvier 2024/)
    })

    it('should accept custom options', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      expect(formatted).toMatch(/15 janv\. 2024/)
    })
  })

  describe('timeAgo', () => {
    const now = new Date('2024-01-15T12:00:00Z')

    // Mock Date.now pour des tests déterministes
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(now)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should show "à l\'instant" for recent times', () => {
      const recent = new Date('2024-01-15T11:59:30Z') // 30 secondes avant
      expect(timeAgo(recent)).toBe('à l\'instant')
    })

    it('should show minutes ago', () => {
      const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z')
      expect(timeAgo(fiveMinutesAgo)).toBe('il y a 5 minutes')
    })

    it('should show single minute ago', () => {
      const oneMinuteAgo = new Date('2024-01-15T11:59:00Z')
      expect(timeAgo(oneMinuteAgo)).toBe('il y a 1 minute')
    })

    it('should show hours ago', () => {
      const twoHoursAgo = new Date('2024-01-15T10:00:00Z')
      expect(timeAgo(twoHoursAgo)).toBe('il y a 2 heures')
    })

    it('should show single hour ago', () => {
      const oneHourAgo = new Date('2024-01-15T11:00:00Z')
      expect(timeAgo(oneHourAgo)).toBe('il y a 1 heure')
    })

    it('should show days ago', () => {
      const threeDaysAgo = new Date('2024-01-12T12:00:00Z')
      expect(timeAgo(threeDaysAgo)).toBe('il y a 3 jours')
    })

    it('should show single day ago', () => {
      const oneDayAgo = new Date('2024-01-14T12:00:00Z')
      expect(timeAgo(oneDayAgo)).toBe('il y a 1 jour')
    })

    it('should handle string dates', () => {
      const fiveMinutesAgo = '2024-01-15T11:55:00Z'
      expect(timeAgo(fiveMinutesAgo)).toBe('il y a 5 minutes')
    })
  })
})