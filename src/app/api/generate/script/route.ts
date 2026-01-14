import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit'
import {
  withSecurity,
  GenerationInputSchema,
  createCorsHeaders,
  logApiUsage
} from '@/lib/api-security'
import { createUserFriendlyError, logError } from '@/lib/error-handler'
import {
  generateWithCaching,
  logGenerationMetrics
} from '@/lib/ai/optimized-claude-client'
import {
  OPTIMIZED_SCRIPT_SYSTEM_PROMPT,
  buildOptimizedUserPrompt,
  GENERATION_OPTIONS
} from '@/lib/ai/optimized-prompts'

// Handler OPTIONS pour CORS preflight
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const corsHeaders = createCorsHeaders(request)

  try {
    // 1. AUTHENTIFICATION
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401, headers: corsHeaders }
      )
    }

    // 2. RATE LIMITING
    const rateLimitResult = await withRateLimit(
      request,
      RATE_LIMIT_CONFIGS.generate,
      user.id
    )

    if (rateLimitResult.error) {
      // Ajouter CORS headers aux réponses d'erreur rate limit
      const errorResponse = rateLimitResult.error
      if (corsHeaders) {
        Object.entries(corsHeaders).forEach(([key, value]) => {
          errorResponse.headers.set(key, value)
        })
      }
      return errorResponse
    }

    // 3. VALIDATION & SANITIZATION
    const securityResult = await withSecurity(
      request,
      GenerationInputSchema,
      async (validatedData) => {
        // Cette fonction sera exécutée seulement si la validation passe

        // 4. PROFIL UTILISATEUR & LIMITES
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError || !profile) {
          throw new Error('Profil utilisateur introuvable')
        }

        const canGenerate = checkUserLimits(profile)
        if (!canGenerate.allowed) {
          throw new Error(canGenerate.reason)
        }

        // 5. GÉNÉRATION AVEC CLAUDE (optimisé avec caching)
        const userPrompt = buildOptimizedUserPrompt('script', {
          industry: validatedData.industry,
          businessName: profile.business_name || 'Commerce local',
          tone: validatedData.tone,
          format: validatedData.format,
          specialOffer: validatedData.customPrompt,
          targetAudience: validatedData.audience || profile.target_audience
        })

        const generationStart = Date.now()
        const { content: scriptContent, metrics } = await generateWithCaching(
          OPTIMIZED_SCRIPT_SYSTEM_PROMPT,
          userPrompt,
          {
            model: 'claude-sonnet-4-5-20250929',
            maxTokens: GENERATION_OPTIONS.script.maxTokens,
            temperature: GENERATION_OPTIONS.script.temperature
          }
        )
        const generationTime = Date.now() - generationStart

        if (!scriptContent) {
          throw new Error('Impossible d\'extraire le script généré')
        }

        // 6. LOGGING MÉTRIQUES D'OPTIMISATION
        logGenerationMetrics('/api/generate/script', user.id, metrics)

        // Calculs pour compatibilité
        const totalTokens = metrics.inputTokens + metrics.outputTokens

        // 7. SAUVEGARDE
        const { data: savedScript, error: saveError } = await supabase
          .from('scripts')
          .insert({
            user_id: user.id,
            title: generateScriptTitle(validatedData),
            input_data: validatedData,
            content: scriptContent,
            format: validatedData.format,
            tone: validatedData.tone,
            tokens_used: totalTokens,
          })
          .select()
          .single()

        if (saveError) {
          console.error('Erreur sauvegarde script:', saveError)
          throw new Error('Erreur lors de la sauvegarde')
        }

        // 8. MISE À JOUR COMPTEUR
        await supabase
          .from('profiles')
          .update({
            scripts_count_month: (profile.scripts_count_month || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        // 9. LOGGING
        logApiUsage({
          userId: user.id,
          endpoint: '/api/generate/script',
          inputTokens: metrics.inputTokens,
          outputTokens: metrics.outputTokens,
          totalTokens,
          cost: metrics.totalCost,
          duration: Date.now() - startTime,
          success: true,
          timestamp: Date.now()
        })

        return {
          success: true,
          script: {
            id: savedScript.id,
            content: scriptContent,
            tokensUsed: totalTokens,
            format: validatedData.format,
            tone: validatedData.tone,
            generationTime,
            estimatedCost: metrics.totalCost
          },
          // Inclure les métriques d'optimisation dans la réponse
          metrics: {
            inputTokens: metrics.inputTokens,
            outputTokens: metrics.outputTokens,
            cacheReadTokens: metrics.cacheReadTokens,
            totalCost: metrics.totalCost,
            estimatedSavings: metrics.estimatedSavings
          }
        }
      }
    )

    if (securityResult.error) {
      // Ajouter CORS headers aux erreurs de validation
      const errorResponse = securityResult.error
      if (corsHeaders) {
        Object.entries(corsHeaders).forEach(([key, value]) => {
          errorResponse.headers.set(key, value)
        })
      }
      return errorResponse
    }

    // Succès avec headers CORS et rate limiting
    const headers = {
      ...corsHeaders,
      // Headers de rate limiting pour le succès seront ajoutés automatiquement
    }

    return NextResponse.json(securityResult.result, { headers })

  } catch (error) {
    console.error('Erreur génération script:', error)

    // Logger l'échec
    logApiUsage({
      endpoint: '/api/generate/script',
      duration: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: Date.now()
    })

    // Créer une erreur user-friendly
    const userFriendlyError = createUserFriendlyError(error, 'Génération de script')
    logError(userFriendlyError, undefined, 'API /generate/script')

    // Déterminer le status code approprié
    let statusCode = 500
    if (userFriendlyError.code.startsWith('ERR-CLAUDE')) statusCode = 502
    else if (userFriendlyError.code.startsWith('ERR-AUTH')) statusCode = 401
    else if (userFriendlyError.code.startsWith('ERR-LIMIT')) statusCode = 429
    else if (userFriendlyError.code.startsWith('ERR-VALID')) statusCode = 400

    return NextResponse.json(
      {
        error: userFriendlyError.message,
        code: userFriendlyError.code,
        title: userFriendlyError.title,
        action: userFriendlyError.action,
        helpUrl: userFriendlyError.helpUrl
      },
      { status: statusCode, headers: corsHeaders }
    )
  }
}

interface UserProfile {
  subscription_tier?: string
  scripts_count_month?: number
}

// Vérifier les limites d'utilisation selon le plan
function checkUserLimits(profile: UserProfile): { allowed: boolean; reason?: string } {
  const tier = profile.subscription_tier || 'starter'
  const count = profile.scripts_count_month || 0

  switch (tier) {
    case 'business':
      return { allowed: true }

    case 'pro':
      if (count >= 30) {
        return {
          allowed: false,
          reason: 'Limite de 30 scripts/mois atteinte. Passez au plan Business pour un accès illimité.'
        }
      }
      return { allowed: true }

    case 'starter':
    default:
      if (count >= 10) {
        return {
          allowed: false,
          reason: 'Limite de 10 scripts/mois atteinte. Passez au plan Pro ou Business pour plus de scripts.'
        }
      }
      return { allowed: true }
  }
}


interface ScriptData {
  format: string
  topic?: string
}

// Générer un titre pour le script
function generateScriptTitle(data: ScriptData): string {
  const format = data.format.charAt(0).toUpperCase() + data.format.slice(1)
  const subject = data.topic || 'Script personnalisé'

  return `${format}: ${subject.slice(0, 50)}${subject.length > 50 ? '...' : ''}`
}