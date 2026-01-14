/**
 * Tests critiques pour les limites utilisateur selon les plans
 * S'assure que les utilisateurs ne peuvent pas dépasser leurs quotas
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestProfile, mockSupabaseResponse } from './setup'

// Import de la fonction à tester
// Note: Cette fonction devra être extraite du code API pour être testable
function checkUserLimits(profile: any): { allowed: boolean; reason?: string } {
  const tier = profile.subscription_tier || 'starter'
  const scriptsCount = profile.scripts_count_month || 0
  const campaignsCount = profile.campaigns_count_month || 0

  // Vérification scripts
  switch (tier) {
    case 'business':
      // Illimité pour Business
      break

    case 'pro':
      if (scriptsCount >= 30) {
        return {
          allowed: false,
          reason: 'Limite de 30 scripts/mois atteinte. Passez au plan Business pour un accès illimité.'
        }
      }
      break

    case 'starter':
    default:
      if (scriptsCount >= 10) {
        return {
          allowed: false,
          reason: 'Limite de 10 scripts/mois atteinte. Passez au plan Pro ou Business pour plus de scripts.'
        }
      }
  }

  return { allowed: true }
}

function checkCampaignLimits(profile: any): { allowed: boolean; reason?: string } {
  const tier = profile.subscription_tier || 'starter'
  const campaignsCount = profile.campaigns_count_month || 0

  // Starter n'a pas accès aux campagnes
  if (tier === 'starter') {
    return {
      allowed: false,
      reason: 'Les campagnes Meta Ads sont disponibles avec les plans Pro et Business.'
    }
  }

  // Pro limité à 5 campagnes
  if (tier === 'pro' && campaignsCount >= 5) {
    return {
      allowed: false,
      reason: 'Limite de 5 campagnes/mois atteinte. Passez au plan Business pour un accès illimité.'
    }
  }

  // Business illimité
  return { allowed: true }
}

describe('User Limits - Scripts', () => {
  describe('Plan Starter', () => {
    it('should allow script generation when under limit (0/10)', () => {
      const profile = createTestProfile({
        subscription_tier: 'starter',
        scripts_count_month: 0
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(true)
    })

    it('should allow script generation when at 9/10', () => {
      const profile = createTestProfile({
        subscription_tier: 'starter',
        scripts_count_month: 9
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(true)
    })

    it('should reject script generation when at limit (10/10)', () => {
      const profile = createTestProfile({
        subscription_tier: 'starter',
        scripts_count_month: 10
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('Limite de 10 scripts/mois atteinte')
      expect(result.reason).toContain('plan Pro ou Business')
    })

    it('should reject script generation when over limit (15/10)', () => {
      const profile = createTestProfile({
        subscription_tier: 'starter',
        scripts_count_month: 15 // Situation anormale mais test sécurité
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(false)
    })
  })

  describe('Plan Pro', () => {
    it('should allow script generation when under limit (5/30)', () => {
      const profile = createTestProfile({
        subscription_tier: 'pro',
        scripts_count_month: 5
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(true)
    })

    it('should allow script generation when at 29/30', () => {
      const profile = createTestProfile({
        subscription_tier: 'pro',
        scripts_count_month: 29
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(true)
    })

    it('should reject script generation when at limit (30/30)', () => {
      const profile = createTestProfile({
        subscription_tier: 'pro',
        scripts_count_month: 30
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('Limite de 30 scripts/mois atteinte')
      expect(result.reason).toContain('plan Business')
    })
  })

  describe('Plan Business', () => {
    it('should allow script generation even with high count (100)', () => {
      const profile = createTestProfile({
        subscription_tier: 'business',
        scripts_count_month: 100
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(true)
    })

    it('should allow script generation even with very high count (1000)', () => {
      const profile = createTestProfile({
        subscription_tier: 'business',
        scripts_count_month: 1000
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null subscription_tier as starter', () => {
      const profile = createTestProfile({
        subscription_tier: null,
        scripts_count_month: 10
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(false) // Traité comme starter
    })

    it('should handle undefined scripts_count_month as 0', () => {
      const profile = createTestProfile({
        subscription_tier: 'starter',
        scripts_count_month: undefined
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(true) // 0 scripts utilisés
    })

    it('should handle unknown subscription tier as starter', () => {
      const profile = createTestProfile({
        subscription_tier: 'unknown_tier',
        scripts_count_month: 10
      })

      const result = checkUserLimits(profile)
      expect(result.allowed).toBe(false) // Traité comme starter
    })
  })
})

describe('User Limits - Campaigns', () => {
  describe('Plan Starter', () => {
    it('should always reject campaign creation', () => {
      const profile = createTestProfile({
        subscription_tier: 'starter',
        campaigns_count_month: 0
      })

      const result = checkCampaignLimits(profile)
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('plans Pro et Business')
    })
  })

  describe('Plan Pro', () => {
    it('should allow campaign creation when under limit (2/5)', () => {
      const profile = createTestProfile({
        subscription_tier: 'pro',
        campaigns_count_month: 2
      })

      const result = checkCampaignLimits(profile)
      expect(result.allowed).toBe(true)
    })

    it('should allow campaign creation at 4/5', () => {
      const profile = createTestProfile({
        subscription_tier: 'pro',
        campaigns_count_month: 4
      })

      const result = checkCampaignLimits(profile)
      expect(result.allowed).toBe(true)
    })

    it('should reject campaign creation at limit (5/5)', () => {
      const profile = createTestProfile({
        subscription_tier: 'pro',
        campaigns_count_month: 5
      })

      const result = checkCampaignLimits(profile)
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('Limite de 5 campagnes/mois atteinte')
      expect(result.reason).toContain('plan Business')
    })
  })

  describe('Plan Business', () => {
    it('should allow campaign creation with high count (20)', () => {
      const profile = createTestProfile({
        subscription_tier: 'business',
        campaigns_count_month: 20
      })

      const result = checkCampaignLimits(profile)
      expect(result.allowed).toBe(true)
    })
  })
})

describe('User Limits Integration', () => {
  it('should respect both script and campaign limits independently', () => {
    const profile = createTestProfile({
      subscription_tier: 'pro',
      scripts_count_month: 30, // À la limite scripts
      campaigns_count_month: 2  // Sous la limite campagnes
    })

    const scriptsResult = checkUserLimits(profile)
    const campaignsResult = checkCampaignLimits(profile)

    expect(scriptsResult.allowed).toBe(false) // Scripts bloqués
    expect(campaignsResult.allowed).toBe(true) // Campagnes OK
  })

  it('should handle tier upgrades correctly', () => {
    // Simuler un upgrade de starter à pro
    const starterProfile = createTestProfile({
      subscription_tier: 'starter',
      scripts_count_month: 10 // Limite atteinte en starter
    })

    const proProfile = {
      ...starterProfile,
      subscription_tier: 'pro' // Upgrade
    }

    const starterResult = checkUserLimits(starterProfile)
    const proResult = checkUserLimits(proProfile)

    expect(starterResult.allowed).toBe(false)
    expect(proResult.allowed).toBe(true) // Déblocké après upgrade
  })
})