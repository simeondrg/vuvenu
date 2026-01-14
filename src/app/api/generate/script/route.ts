import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit'
import {
  withSecurity,
  GenerationInputSchema,
  createCorsHeaders,
  logApiUsage,
  SECURITY_LIMITS
} from '@/lib/api-security'
import { withResilience } from '@/lib/circuit-breaker'
import { createUserFriendlyError, logError, ErrorCode } from '@/lib/error-handler'

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
      corsHeaders && Object.entries(corsHeaders).forEach(([key, value]) => {
        errorResponse.headers.set(key, value)
      })
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

        // 5. GÉNÉRATION AVEC CLAUDE
        const prompt = buildScriptPrompt(validatedData, profile)
        const anthropic = getAnthropicClient()

        const generationStart = Date.now()
        const message = await withResilience(
          () => anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            temperature: 0.7,
            messages: [{
              role: 'user',
              content: prompt
            }]
          }),
          'claude'
        )
        const generationTime = Date.now() - generationStart

        const scriptContent = extractScriptContent(message.content)
        if (!scriptContent) {
          throw new Error('Impossible d\'extraire le script généré')
        }

        // 6. CALCULS MÉTRIQUES
        const inputTokens = Math.ceil(prompt.length / 4) // Approximation
        const outputTokens = Math.ceil(scriptContent.length / 4)
        const totalTokens = inputTokens + outputTokens
        const estimatedCost = (inputTokens * 0.000003) + (outputTokens * 0.000015) // Prix approximatif Claude

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
          inputTokens,
          outputTokens,
          totalTokens,
          cost: estimatedCost,
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
            estimatedCost
          }
        }
      }
    )

    if (securityResult.error) {
      // Ajouter CORS headers aux erreurs de validation
      const errorResponse = securityResult.error
      corsHeaders && Object.entries(corsHeaders).forEach(([key, value]) => {
        errorResponse.headers.set(key, value)
      })
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

// Vérifier les limites d'utilisation selon le plan
function checkUserLimits(profile: any): { allowed: boolean; reason?: string } {
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

// Construire le prompt optimisé pour Claude
function buildScriptPrompt(data: any, profile: any): string {
  const formats = {
    'reels': { name: 'Instagram Reels', duration: '15-30 secondes', platform: 'Instagram' },
    'tiktok': { name: 'TikTok', duration: '15-60 secondes', platform: 'TikTok' },
    'youtube': { name: 'YouTube Shorts', duration: '30-60 secondes', platform: 'YouTube' },
    'stories': { name: 'Stories Instagram', duration: '15 secondes', platform: 'Instagram' }
  }

  const tones = {
    'amical': 'chaleureux, accessible et proche',
    'professionnel': 'sérieux, expert et crédible',
    'fun': 'énergique, dynamique et enjoué',
    'inspirant': 'motivant, positif et encourageant'
  }

  const format = formats[data.format as keyof typeof formats] || formats.reels
  const tone = tones[data.tone as keyof typeof tones] || tones.amical

  return `Tu es un expert en marketing digital spécialisé dans la création de contenu viral pour les commerces locaux.

CONTEXTE BUSINESS:
- Nom du commerce: ${profile.business_name || 'Commerce local'}
- Secteur d'activité: ${data.industry}
- Audience cible: ${data.audience || profile.target_audience || 'Clientèle locale'}
- Objectifs: ${profile.main_goal || 'Attirer plus de clients'}

BRIEF CRÉATION VIDÉO:
- Plateforme: ${format.name} (${format.platform})
- Durée cible: ${format.duration}
- Sujet principal: ${data.topic || 'Mettre en valeur le commerce'}
- Ton souhaité: ${tone}
- Instructions spéciales: ${data.customPrompt || 'Aucune instruction particulière'}

MISSION:
Génère un script vidéo viral et professionnel qui respecte ces critères OBLIGATOIRES:

1. STRUCTURE OPTIMISÉE POUR ${format.platform}:
   - Hook percutant dans les 3 premières secondes (question, affirmation choc, teaser)
   - Développement avec valeur ajoutée concrète
   - Call-to-action clair incitant à l'action locale (visite, appel, suivi)

2. OPTIMISATIONS VIRALES:
   - Émotion forte (surprise, curiosité, joie, urgence)
   - Storytelling captivant avec moments "révélation"
   - Langage naturel et authentique adapté à l'audience

3. COMMERCE LOCAL:
   - Met en valeur l'expertise unique du commerce
   - Crée de la proximité et confiance
   - Incite concrètement à l'action (venir en magasin, contacter)

4. INDICATIONS TECHNIQUES:
   - Format ${format.duration} maximum
   - Inclure des [INDICATIONS DE TOURNAGE] claires
   - Suggestions de plans caméra et rythme de montage

IMPORTANT: Génère UNIQUEMENT le script final, prêt à être tourné par ${profile.business_name || 'ce commerce'}. Sois créatif mais professionnel.`
}

// Extraire le contenu du script de la réponse Claude
function extractScriptContent(content: any): string | null {
  if (Array.isArray(content)) {
    const textContent = content.find(item => item.type === 'text')
    return textContent?.text || null
  }

  if (typeof content === 'string') {
    return content
  }

  return null
}

// Générer un titre pour le script
function generateScriptTitle(data: any): string {
  const format = data.format.charAt(0).toUpperCase() + data.format.slice(1)
  const subject = data.topic || 'Script personnalisé'

  return `${format}: ${subject.slice(0, 50)}${subject.length > 50 ? '...' : ''}`
}