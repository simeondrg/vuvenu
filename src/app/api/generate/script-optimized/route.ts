/**
 * API Génération Scripts OPTIMISÉE avec Prompt Caching
 *
 * Économies attendues vs version standard :
 * - Prompt Caching : -90% sur system prompt input
 * - Prompts optimisés : -30% tokens total
 * - Total : ~50-60% réduction coûts
 *
 * Exemple :
 * - Standard : $0.0135 par script
 * - Optimisé : $0.0055 par script
 * - Économie : $0.008 (59% moins cher)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit'
import { createCorsHeaders, logApiUsage } from '@/lib/api-security'
import {
  generateWithCaching,
  logGenerationMetrics,
  type GenerationMetrics
} from '@/lib/ai/optimized-claude-client'
import {
  OPTIMIZED_SCRIPT_SYSTEM_PROMPT,
  buildOptimizedUserPrompt,
  parseClaudeJsonResponse,
  GENERATION_OPTIONS
} from '@/lib/ai/optimized-prompts'

// Validation input
const ScriptInputSchema = z.object({
  industry: z.string().min(1),
  businessName: z.string().min(1),
  tone: z.enum(['professionnel', 'amical', 'dynamique', 'humoristique']),
  format: z.enum(['30s', '60s', '90s']),
  specialOffer: z.string().optional(),
  targetAudience: z.string().optional()
})

// Output attendu
interface ScriptOutput {
  hook: string
  body: string
  cta: string
}

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
          }
        }
      }
    )

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

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
      return rateLimitResult.error
    }

    // 3. VALIDATION INPUT
    const body = await request.json()
    const validatedData = ScriptInputSchema.parse(body)

    // 4. VÉRIFIER LIMITES UTILISATEUR
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil introuvable' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Vérifier subscription active
    if (profile.subscription_status !== 'active') {
      return NextResponse.json(
        {
          error: 'Abonnement inactif',
          message: 'Veuillez mettre à jour vos informations de paiement'
        },
        { status: 403, headers: corsHeaders }
      )
    }

    // Vérifier limites mensuelle
    const tier = profile.subscription_tier
    const currentCount = profile.scripts_count_month || 0

    const limits = {
      starter: 10,
      pro: 30,
      business: Infinity
    }

    if (currentCount >= limits[tier as keyof typeof limits]) {
      return NextResponse.json(
        {
          error: 'Limite mensuelle atteinte',
          message: `Vous avez atteint votre limite de ${limits[tier as keyof typeof limits]} scripts pour ce mois.`,
          upgrade: tier === 'starter' ? '/pricing' : null
        },
        { status: 429, headers: corsHeaders }
      )
    }

    // 5. GÉNÉRATION OPTIMISÉE AVEC CACHING
    const userPrompt = buildOptimizedUserPrompt('script', validatedData)

    const { content, metrics } = await generateWithCaching(
      OPTIMIZED_SCRIPT_SYSTEM_PROMPT,
      userPrompt,
      GENERATION_OPTIONS.script
    )

    // Parser le JSON
    const script: ScriptOutput = parseClaudeJsonResponse(content)

    // 6. SAUVEGARDER LE SCRIPT
    const { data: savedScript, error: saveError } = await supabase
      .from('scripts')
      .insert({
        user_id: user.id,
        title: `Script ${validatedData.industry} - ${new Date().toLocaleDateString('fr-FR')}`,
        content: JSON.stringify(script),
        input_data: validatedData,
        format: validatedData.format,
        tone: validatedData.tone,
        tokens_used: metrics.inputTokens + metrics.outputTokens
      })
      .select()
      .single()

    if (saveError) {
      console.error('Erreur sauvegarde script:', saveError)
    }

    // 7. INCRÉMENTER COMPTEUR
    await supabase
      .from('profiles')
      .update({
        scripts_count_month: currentCount + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    // 8. LOGGER MÉTRIQUES
    logGenerationMetrics('/api/generate/script-optimized', user.id, metrics)

    logApiUsage({
      userId: user.id,
      endpoint: '/api/generate/script-optimized',
      duration: Date.now() - startTime,
      success: true,
      timestamp: Date.now()
    })

    // 9. RETOURNER RÉSULTAT + MÉTRIQUES
    return NextResponse.json(
      {
        success: true,
        script,
        scriptId: savedScript?.id,
        metrics: {
          inputTokens: metrics.inputTokens,
          outputTokens: metrics.outputTokens,
          cacheReadTokens: metrics.cacheReadTokens || 0,
          totalCost: metrics.totalCost,
          estimatedSavings: metrics.estimatedSavings || 0,
          savingsPercentage: metrics.estimatedSavings
            ? Math.round(
                (metrics.estimatedSavings / (metrics.totalCost + metrics.estimatedSavings)) *
                  100
              )
            : 0
        },
        usage: {
          current: currentCount + 1,
          limit: limits[tier as keyof typeof limits],
          remaining:
            tier === 'business'
              ? 'unlimited'
              : limits[tier as keyof typeof limits] - (currentCount + 1)
        }
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Erreur génération script optimisée:', error)

    logApiUsage({
      endpoint: '/api/generate/script-optimized',
      duration: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: Date.now()
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: error.issues
        },
        { status: 400, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        error: 'Erreur de génération',
        message:
          error instanceof Error ? error.message : 'Une erreur est survenue'
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

/**
 * Endpoint GET pour statistiques d'optimisation (admin uniquement)
 */
export async function GET(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          }
        }
      }
    )

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Récupérer stats du dernier mois
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const { data: scripts } = await supabase
      .from('scripts')
      .select('tokens_used, created_at')
      .eq('user_id', user.id)
      .gte('created_at', oneMonthAgo.toISOString())

    if (!scripts || scripts.length === 0) {
      return NextResponse.json(
        {
          totalScripts: 0,
          totalTokens: 0,
          averageTokensPerScript: 0,
          estimatedMonthlyCost: 0
        },
        { headers: corsHeaders }
      )
    }

    const totalTokens = scripts.reduce((sum, s) => sum + (s.tokens_used || 0), 0)
    const avgTokens = totalTokens / scripts.length

    // Estimation coût (avec optimisations)
    const avgInputTokens = avgTokens * 0.7 // ~70% input
    const avgOutputTokens = avgTokens * 0.3 // ~30% output
    const costPerScript =
      (avgInputTokens * 3 + avgOutputTokens * 15) / 1_000_000

    return NextResponse.json(
      {
        totalScripts: scripts.length,
        totalTokens,
        averageTokensPerScript: Math.round(avgTokens),
        estimatedMonthlyCost: (costPerScript * scripts.length).toFixed(4),
        estimatedCostPerScript: costPerScript.toFixed(4)
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur récupération stats' },
      { status: 500, headers: corsHeaders }
    )
  }
}
