import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit'
import {
  createCorsHeaders,
  logApiUsage
} from '@/lib/api-security'
import {
  generateWithCaching,
  logGenerationMetrics
} from '@/lib/ai/optimized-claude-client'
import {
  OPTIMIZED_CAMPAIGN_SYSTEM_PROMPT,
  buildOptimizedUserPrompt,
  parseClaudeJsonResponse,
  GENERATION_OPTIONS
} from '@/lib/ai/optimized-prompts'

// Handler OPTIONS pour CORS
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)
  return new Response(null, { status: 200, headers: corsHeaders })
}

const GenerateCampaignSchema = z.object({
  campaignId: z.string().uuid(),
  industry: z.string(),
  objective: z.string(),
  budget: z.string().optional(),
  customBudget: z.string().optional(),
  targetLocation: z.string().optional(),
  specialOffer: z.string().optional(),
  businessName: z.string().optional(),
  angles: z.array(z.object({
    stage: z.string(),
    angle: z.string(),
    copy: z.string()
  }))
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
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
          },
        },
      }
    )

    // 1. AUTHENTIFICATION
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
      const errorResponse = rateLimitResult.error
      if (corsHeaders) {
        Object.entries(corsHeaders).forEach(([key, value]) => {
          errorResponse.headers.set(key, value)
        })
      }
      return errorResponse
    }

    // Valider les données
    const body = await request.json()
    const validatedData = GenerateCampaignSchema.parse(body)

    // Vérifier que la campagne appartient à l'utilisateur
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', validatedData.campaignId)
      .eq('user_id', user.id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campagne non trouvée' },
        { status: 404 }
      )
    }

    // Créer le prompt utilisateur optimisé
    const userPromptData = buildOptimizedUserPrompt('campaign', {
      industry: validatedData.industry,
      businessName: validatedData.businessName || 'Mon commerce',
      objective: validatedData.objective,
      budget: validatedData.customBudget ? `${validatedData.customBudget}€/jour` : validatedData.budget,
      targetLocation: validatedData.targetLocation,
      specialOffer: validatedData.specialOffer
    })

    // Ajouter les angles pour inspiration
    const fullUserPrompt = `${userPromptData}

Angles suggérés:
${validatedData.angles.map(a => `- ${a.stage}: ${a.copy}`).join('\n')}

Génère 5 concepts Meta Ads DIFFÉRENTS et PERFORMANTS.`

    console.log('Génération concepts pour:', {
      industry: validatedData.industry,
      objective: validatedData.objective,
      campaignId: validatedData.campaignId
    })

    // Appeler Claude AI avec optimisations
    const { content: responseText, metrics } = await generateWithCaching(
      OPTIMIZED_CAMPAIGN_SYSTEM_PROMPT,
      fullUserPrompt,
      {
        model: 'claude-sonnet-4-5-20250929',
        maxTokens: GENERATION_OPTIONS.campaign.maxTokens,
        temperature: GENERATION_OPTIONS.campaign.temperature
      }
    )

    if (!responseText) {
      throw new Error('Pas de réponse de Claude AI')
    }

    // Logger les métriques
    logGenerationMetrics('/api/generate/campaign', user.id, metrics)

    interface ConceptData {
      funnel_stage: string
      name: string
      angle: string
      ad_type: string
      primary_text: string
      headline: string
      description: string
    }

    // Parser la réponse JSON avec la fonction optimisée
    let conceptsData
    try {
      conceptsData = parseClaudeJsonResponse<{ concepts: ConceptData[] }>(responseText)
    } catch {
      console.error('Erreur parsing JSON Claude:', responseText)
      throw new Error('Format de réponse invalide')
    }

    if (!conceptsData.concepts || !Array.isArray(conceptsData.concepts)) {
      throw new Error('Structure de réponse invalide')
    }

    // Sauvegarder les concepts en base
    const conceptsToInsert = conceptsData.concepts.map((concept: ConceptData) => ({
      campaign_id: validatedData.campaignId,
      funnel_stage: concept.funnel_stage,
      name: concept.name,
      angle: concept.angle,
      ad_type: concept.ad_type,
      primary_text: concept.primary_text,
      headline: concept.headline,
      description: concept.description,
      created_at: new Date().toISOString()
    }))

    const { data: savedConcepts, error: saveError } = await supabase
      .from('campaign_concepts')
      .insert(conceptsToInsert)
      .select()

    if (saveError) {
      console.error('Erreur sauvegarde concepts:', saveError)
      throw new Error('Erreur lors de la sauvegarde')
    }

    // Mettre à jour le statut de la campagne
    await supabase
      .from('campaigns')
      .update({
        status: 'ready',
        wizard_step: 2,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.campaignId)

    console.log(`Concepts générés avec succès pour campagne ${validatedData.campaignId}:`, savedConcepts?.length)

    // Logging succès avec métriques
    logApiUsage({
      userId: user.id,
      endpoint: '/api/generate/campaign',
      inputTokens: metrics.inputTokens,
      outputTokens: metrics.outputTokens,
      totalTokens: metrics.inputTokens + metrics.outputTokens,
      cost: metrics.totalCost,
      duration: Date.now() - startTime,
      success: true,
      timestamp: Date.now()
    })

    return NextResponse.json({
      success: true,
      concepts: savedConcepts,
      message: `${savedConcepts?.length} concepts générés avec succès`,
      // Inclure les métriques d'optimisation
      metrics: {
        inputTokens: metrics.inputTokens,
        outputTokens: metrics.outputTokens,
        cacheReadTokens: metrics.cacheReadTokens,
        totalCost: metrics.totalCost,
        estimatedSavings: metrics.estimatedSavings
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Erreur génération campagne:', error)

    // Logging échec
    logApiUsage({
      endpoint: '/api/generate/campaign',
      duration: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: Date.now()
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400, headers: corsHeaders }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500, headers: corsHeaders }
    )
  }
}