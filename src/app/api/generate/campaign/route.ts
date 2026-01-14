import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit'
import {
  CampaignInputSchema,
  createCorsHeaders,
  logApiUsage,
  SECURITY_LIMITS
} from '@/lib/api-security'
import { withResilience } from '@/lib/circuit-breaker'

// Initialisation différée d'Anthropic avec timeout
function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: SECURITY_LIMITS.CLAUDE_TIMEOUT_MS
  })
}

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

// Prompts système pour la génération
const CAMPAIGN_SYSTEM_PROMPT = `Tu es un expert en publicités Facebook/Instagram qui génère des concepts publicitaires performants pour des commerces locaux.

RÈGLES STRICTES :
1. Génère EXACTEMENT 5 concepts publicitaires différents
2. Chaque concept doit avoir : funnel_stage, name, angle, ad_type, primary_text, headline, description
3. Réponds UNIQUEMENT avec un JSON valide, aucun autre texte
4. Les textes doivent être COURTS et PERCUTANTS (max 125 caractères pour primary_text)
5. Utilise des HOOKS VIRAUX et des ÉMOTIONS fortes
6. Inclus des chiffres, urgence, exclusivité quand possible
7. Adapte le vocabulaire au secteur (familier pour resto, plus pro pour services)

STRUCTURE JSON ATTENDUE :
{
  "concepts": [
    {
      "funnel_stage": "awareness|consideration|conversion",
      "name": "Nom court du concept",
      "angle": "Angle marketing principal",
      "ad_type": "Type de publicité",
      "primary_text": "Texte principal accrocheur (max 125 chars)",
      "headline": "Titre percutant (max 40 chars)",
      "description": "Description courte (max 90 chars)"
    }
  ]
}

EXEMPLES DE HOOKS VIRAUX PAR SECTEUR :

COIFFURE :
- "Cette technique RÉVOLUTIONNAIRE transforme vos cheveux en 2h"
- "Avant/après INCROYABLE : -10 ans en une séance"
- "POURQUOI nos clients font 30min de route pour venir ?"

RESTAURANT :
- "4h du matin : le SECRET qui rend notre pain addictif"
- "Cette recette fait PLEURER DE JOIE nos clients"
- "INTERDIT de partir sans avoir goûté ça"

BOULANGERIE :
- "Pétrissage MANUEL depuis 5h : voilà la différence"
- "SCANDALE : nos viennoiseries sortent du four toutes les 2h"
- "Cette tradition OUBLIÉE va vous surprendre"

Adapte ces hooks au secteur demandé avec la même intensité émotionnelle.`

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
      corsHeaders && Object.entries(corsHeaders).forEach(([key, value]) => {
        errorResponse.headers.set(key, value)
      })
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

    // Créer le prompt pour Claude
    const userPrompt = `
SECTEUR : ${validatedData.industry}
OBJECTIF : ${validatedData.objective}
BUDGET : ${validatedData.customBudget ? validatedData.customBudget + '€/jour' : validatedData.budget}
COMMERCE : ${validatedData.businessName || 'Mon commerce'}
${validatedData.targetLocation ? `ZONE : ${validatedData.targetLocation}` : ''}
${validatedData.specialOffer ? `OFFRE SPÉCIALE : ${validatedData.specialOffer}` : ''}

Génère 5 concepts publicitaires Meta Ads en utilisant ces angles comme inspiration :
${validatedData.angles.map(a => `- ${a.stage}: ${a.copy}`).join('\n')}

Chaque concept doit :
1. Utiliser des hooks VIRAUX et émotionnels
2. Être adapté au funnel stage (awareness/consideration/conversion)
3. Inclure l'offre spéciale si fournie
4. Respecter les limites de caractères Facebook/Instagram
5. Utiliser le vocabulaire du secteur

Génère des concepts DIFFÉRENTS avec des angles variés pour maximiser les performances.`

    console.log('Génération concepts pour:', {
      industry: validatedData.industry,
      objective: validatedData.objective,
      campaignId: validatedData.campaignId
    })

    // Appeler Claude AI
    const anthropic = getAnthropicClient()
    const message = await withResilience(
      () => anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        temperature: 0.8,
        system: CAMPAIGN_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      }),
      'claude'
    )

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    if (!responseText) {
      throw new Error('Pas de réponse de Claude AI')
    }

    // Parser la réponse JSON
    let conceptsData
    try {
      conceptsData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Erreur parsing JSON Claude:', responseText)
      throw new Error('Format de réponse invalide')
    }

    if (!conceptsData.concepts || !Array.isArray(conceptsData.concepts)) {
      throw new Error('Structure de réponse invalide')
    }

    // Sauvegarder les concepts en base
    const conceptsToInsert = conceptsData.concepts.map((concept: any) => ({
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

    // Logging succès
    logApiUsage({
      userId: user.id,
      endpoint: '/api/generate/campaign',
      duration: Date.now() - startTime,
      success: true,
      timestamp: Date.now()
    })

    return NextResponse.json({
      success: true,
      concepts: savedConcepts,
      message: `${savedConcepts?.length} concepts générés avec succès`
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