import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Client Supabase pour les composants côté navigateur
 *
 * Utilise createBrowserClient qui gère automatiquement:
 * - Les cookies de session
 * - Le rafraîchissement automatique des tokens
 * - La persistance de l'authentification
 *
 * @example
 * ```tsx
 * 'use client'
 * import { supabase } from '@/lib/supabase/client'
 *
 * const { data: scripts } = await supabase
 *   .from('scripts')
 *   .select('*')
 * ```
 */
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Hook pour écouter les changements d'état auth
 *
 * @example
 * ```tsx
 * 'use client'
 * import { useAuthStateChange } from '@/lib/supabase/client'
 *
 * export default function MyComponent() {
 *   useAuthStateChange((event, session) => {
 *     if (event === 'SIGNED_IN') {
 *       // Rediriger vers dashboard
 *     }
 *   })
 * }
 * ```
 */
export function useAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback)
}

/**
 * Fonctions utilitaires pour l'authentification côté client
 */
export const auth = {
  /**
   * Connexion avec email/password
   */
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  /**
   * Inscription avec email/password
   */
  signUp: async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
  },

  /**
   * Connexion avec Google OAuth
   */
  signInWithGoogle: async (redirectTo?: string) => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/dashboard`,
      },
    })
  },

  /**
   * Déconnexion
   */
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  /**
   * Réinitialisation mot de passe
   */
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  },

  /**
   * Mise à jour mot de passe
   */
  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password })
  },

  /**
   * Obtenir la session courante
   */
  getSession: async () => {
    return await supabase.auth.getSession()
  },

  /**
   * Obtenir l'utilisateur courant
   */
  getUser: async () => {
    return await supabase.auth.getUser()
  },
}

/**
 * Vérification des limites d'usage (côté client)
 *
 * @param tier - Tier d'abonnement
 * @param type - Type de limite à vérifier
 * @param currentCount - Compteur actuel
 * @returns boolean - true si limite atteinte
 */
export function checkUsageLimit(
  tier: 'starter' | 'pro' | 'business' | null,
  type: 'scripts' | 'campaigns',
  currentCount: number
): boolean {
  if (!tier || tier === 'business') return false

  const limits = {
    starter: { scripts: 10, campaigns: 0 },
    pro: { scripts: 30, campaigns: 5 },
  }

  return currentCount >= limits[tier][type]
}

/**
 * Helper pour gérer les erreurs Supabase
 */
export function handleSupabaseError(error: any): string {
  if (!error) return ''

  // Erreurs d'authentification communes
  if (error.message?.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect'
  }
  if (error.message?.includes('Email not confirmed')) {
    return 'Veuillez confirmer votre email avant de vous connecter'
  }
  if (error.message?.includes('User already registered')) {
    return 'Un compte existe déjà avec cet email'
  }

  // Erreur générique
  return error.message || 'Une erreur inattendue est survenue'
}