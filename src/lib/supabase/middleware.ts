import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware Supabase pour gestion automatique de l'authentification
 *
 * Fonctionnalités:
 * - Rafraîchissement automatique des tokens
 * - Mise à jour des cookies de session
 * - Gestion des redirections auth
 *
 * À utiliser dans middleware.ts à la racine du projet
 *
 * @param request - NextRequest
 * @returns NextResponse avec cookies mis à jour
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Éviter d'utiliser `await` ici pour éviter les bugs de performance
  // Le getUser() sera fait automatiquement lors du refresh si nécessaire
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // =============================================
  // ROUTES PUBLIQUES - Pas d'auth requise
  // =============================================
  const publicRoutes = [
    '/',
    '/cgv',
    '/confidentialite',
    '/mentions-legales',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ]

  const isPublicRoute = publicRoutes.includes(pathname)

  // =============================================
  // ROUTES AUTH - Redirection si déjà connecté
  // =============================================
  const authRoutes = ['/login', '/register', '/forgot-password']
  const isAuthRoute = authRoutes.includes(pathname)

  if (isAuthRoute && user) {
    // Utilisateur connecté sur page auth -> redirection dashboard
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // =============================================
  // ROUTES PROTÉGÉES - Auth requise
  // =============================================
  if (!isPublicRoute && !user) {
    // Utilisateur non connecté sur page protégée -> redirection login
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // =============================================
  // GESTION ONBOARDING
  // =============================================
  if (user && !isPublicRoute && !isAuthRoute) {
    // Vérifier si l'onboarding est complété
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, subscription_status')
        .eq('id', user.id)
        .single()

      // Forcer l'onboarding si pas complété (sauf sur les pages onboarding)
      if (
        profile &&
        !profile.onboarding_completed &&
        !pathname.startsWith('/onboarding') &&
        !pathname.startsWith('/choose-plan')
      ) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/onboarding'
        return NextResponse.redirect(redirectUrl)
      }

      // Redirection vers choose-plan si onboarding complété mais pas d'abonnement
      if (
        profile &&
        profile.onboarding_completed &&
        profile.subscription_status === 'none' &&
        pathname !== '/choose-plan'
      ) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/choose-plan'
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Erreur middleware - vérification profil:', error)
    }
  }

  // =============================================
  // API ROUTES PROTECTION
  // =============================================
  if (pathname.startsWith('/api/')) {
    // Routes API publiques
    const publicApiRoutes = ['/api/webhooks/stripe']
    const isPublicApiRoute = publicApiRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (!isPublicApiRoute && !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return supabaseResponse
}

/**
 * Configuration du matcher pour Next.js middleware
 *
 * Spécifie quelles routes doivent passer par le middleware
 */
export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - fichiers avec extensions (.png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

/**
 * Helper pour les Server Actions qui ont besoin d'authentification
 *
 * @returns user | null
 *
 * @example
 * ```tsx
 * 'use server'
 * import { getAuthenticatedUser } from '@/lib/supabase/middleware'
 *
 * export async function myServerAction() {
 *   const user = await getAuthenticatedUser()
 *   if (!user) throw new Error('Authentication required')
 * }
 * ```
 */
export async function getAuthenticatedUser() {
  const { createClient } = await import('./server')
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

/**
 * Helper pour vérifier les permissions dans Server Actions
 *
 * @param resourceUserId - ID du propriétaire de la ressource
 * @returns boolean
 *
 * @example
 * ```tsx
 * 'use server'
 * export async function updateScript(scriptId: string) {
 *   const script = await getScript(scriptId)
 *   const canAccess = await checkResourceAccess(script.user_id)
 *   if (!canAccess) throw new Error('Access denied')
 * }
 * ```
 */
export async function checkResourceAccess(
  resourceUserId: string
): Promise<boolean> {
  const user = await getAuthenticatedUser()
  return user?.id === resourceUserId
}