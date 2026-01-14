import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

/**
 * Middleware principal de Next.js pour VuVenu
 *
 * Gère automatiquement:
 * - Authentification Supabase (refresh tokens, cookies)
 * - Redirections auth (login, onboarding, subscription)
 * - Protection des routes et API
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
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