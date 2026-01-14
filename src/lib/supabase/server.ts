import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import type { Database } from '@/types/database'

/**
 * Client Supabase pour les Server Components et API Routes
 *
 * Utilise createServerClient avec gestion des cookies Next.js
 * Cache pour éviter les appels multiples pendant un request
 *
 * @example
 * ```tsx
 * // Dans un Server Component
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function Page() {
 *   const supabase = createClient()
 *   const { data: scripts } = await supabase.from('scripts').select('*')
 * }
 * ```
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore les erreurs de set cookie
          }
        },
      },
    }
  )
})

/**
 * Client Supabase avec clé service pour operations admin
 *
 * ⚠️ ATTENTION: Utiliser uniquement dans les API routes serveur
 * Bypass les politiques RLS - à utiliser avec précaution
 *
 * @example
 * ```tsx
 * // Dans /api/admin/route.ts
 * import { createAdminClient } from '@/lib/supabase/server'
 *
 * export async function GET() {
 *   const supabase = createAdminClient()
 *   // Accès admin sans RLS
 * }
 * ```
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Pas de cookies en mode admin
        },
      },
    }
  )
}

/**
 * Helper pour obtenir l'utilisateur dans les Server Components
 *
 * @returns Promise<User | null>
 *
 * @example
 * ```tsx
 * import { getUser } from '@/lib/supabase/server'
 *
 * export default async function ProtectedPage() {
 *   const user = await getUser()
 *   if (!user) redirect('/login')
 * }
 * ```
 */
export async function getUser() {
  const supabase = await createClient()
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Helper pour obtenir le profil utilisateur avec données business
 *
 * @returns Promise<Profile | null>
 *
 * @example
 * ```tsx
 * import { getUserProfile } from '@/lib/supabase/server'
 *
 * export default async function Dashboard() {
 *   const profile = await getUserProfile()
 *   if (!profile) redirect('/onboarding')
 * }
 * ```
 */
export async function getUserProfile() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return null

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return profile
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

/**
 * Helper pour obtenir les données du dashboard utilisateur
 *
 * Utilise la vue user_dashboard qui inclut:
 * - Profil + limites selon tier
 * - Compteurs d'usage actuels
 * - Statistiques totales
 *
 * @returns Promise<DashboardData | null>
 */
export async function getDashboardData() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return null

  try {
    const { data, error } = await supabase
      .from('user_dashboard')
      .select('*')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting dashboard data:', error)
    return null
  }
}

/**
 * Helper pour vérifier si un utilisateur peut effectuer une action
 *
 * @param action - Type d'action ('create_script' | 'create_campaign')
 * @returns Promise<{ canProceed: boolean, reason?: string }>
 *
 * @example
 * ```tsx
 * const { canProceed, reason } = await checkUserLimit('create_script')
 * if (!canProceed) {
 *   throw new Error(reason)
 * }
 * ```
 */
export async function checkUserLimit(
  action: 'create_script' | 'create_campaign'
): Promise<{ canProceed: boolean; reason?: string }> {
  const dashboardData = await getDashboardData()

  if (!dashboardData) {
    return { canProceed: false, reason: 'Profil utilisateur introuvable' }
  }

  const {
    subscription_tier,
    subscription_status,
    scripts_count_month,
    campaigns_count_month,
    scripts_limit_month,
    campaigns_limit_month,
  } = dashboardData

  // Vérifier statut abonnement
  if (subscription_status !== 'active' && subscription_tier !== 'business') {
    return {
      canProceed: false,
      reason: 'Abonnement requis pour cette fonctionnalité',
    }
  }

  // Vérifier limites selon action
  if (action === 'create_script') {
    if (scripts_count_month >= scripts_limit_month) {
      return {
        canProceed: false,
        reason: `Limite mensuelle atteinte (${scripts_limit_month} scripts)`,
      }
    }
  }

  if (action === 'create_campaign') {
    if (campaigns_count_month >= campaigns_limit_month) {
      return {
        canProceed: false,
        reason: `Limite mensuelle atteinte (${campaigns_limit_month} campagnes)`,
      }
    }
  }

  return { canProceed: true }
}

/**
 * Helper pour incrémenter les compteurs d'usage
 *
 * @param type - Type de compteur à incrémenter
 * @returns Promise<boolean> - Success
 *
 * @example
 * ```tsx
 * // Après génération d'un script
 * await incrementUsageCount('scripts')
 * ```
 */
export async function incrementUsageCount(
  type: 'scripts' | 'campaigns'
): Promise<boolean> {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return false

  try {
    const columnName =
      type === 'scripts' ? 'scripts_count_month' : 'campaigns_count_month'

    const { error } = await supabase.rpc('increment_usage', {
      user_id: user.id,
      column_name: columnName,
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error(`Error incrementing ${type} count:`, error)
    return false
  }
}

/**
 * Types pour TypeScript
 */
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Script = Database['public']['Tables']['scripts']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type CampaignConcept =
  Database['public']['Tables']['campaign_concepts']['Row']