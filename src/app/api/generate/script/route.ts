import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

// Schema de validation pour les données d'entrée
const GenerateScriptSchema = z.object({
  industry: z.string().min(1, 'Industrie requise'),
  topic: z.string().optional(),
  hook: z.string().optional(),
  format: z.enum(['reels', 'tiktok', 'youtube-shorts', 'story']),
  tone: z.enum(['amical', 'professionnel', 'fun', 'inspirant']),
  customInstructions: z.string().optional(),
})

// Initialiser Anthropic Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
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
        { status: 401 }
      )
    }

    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profil utilisateur introuvable' },
        { status: 404 }
      )
    }

    // Vérifier les limites d'utilisation
    const canGenerate = checkUserLimits(profile)
    if (!canGenerate.allowed) {
      return NextResponse.json(
        { error: canGenerate.reason },
        { status: 403 }
      )
    }

    // Valider les données d'entrée
    const body = await request.json()
    const validatedData = GenerateScriptSchema.parse(body)

    // Construire le prompt pour Claude
    const prompt = buildScriptPrompt(validatedData, profile)

    // Générer le script avec Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    // Extraire le contenu du script
    const scriptContent = extractScriptContent(message.content)

    if (!scriptContent) {
      throw new Error('Impossible d\'extraire le script généré')
    }

    // Calculer les tokens utilisés (approximation)
    const tokensUsed = Math.ceil(scriptContent.length / 4)

    // Sauvegarder le script en base
    const { data: savedScript, error: saveError } = await supabase
      .from('scripts')
      .insert({
        user_id: user.id,
        title: generateScriptTitle(validatedData),
        input_data: validatedData,
        content: scriptContent,
        format: validatedData.format,
        tone: validatedData.tone,
        tokens_used: tokensUsed,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Erreur sauvegarde script:', saveError)
      throw new Error('Erreur lors de la sauvegarde')
    }

    // Mettre à jour le compteur d'utilisation
    await supabase
      .from('profiles')
      .update({
        scripts_count_month: (profile.scripts_count_month || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      script: {
        id: savedScript.id,
        content: scriptContent,
        tokensUsed,
        format: validatedData.format,
        tone: validatedData.tone
      }
    })

  } catch (error) {
    console.error('Erreur génération script:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Anthropic.APIError) {
      console.error('Erreur API Claude:', error)
      return NextResponse.json(
        { error: 'Erreur de génération IA. Réessayez dans un moment.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
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
function buildScriptPrompt(data: z.infer<typeof GenerateScriptSchema>, profile: any): string {
  const formats = {
    'reels': { name: 'Instagram Reels', duration: '15-30 secondes', platform: 'Instagram' },
    'tiktok': { name: 'TikTok', duration: '15-60 secondes', platform: 'TikTok' },
    'youtube-shorts': { name: 'YouTube Shorts', duration: '30-60 secondes', platform: 'YouTube' },
    'story': { name: 'Stories Instagram', duration: '15 secondes', platform: 'Instagram' }
  }

  const tones = {
    'amical': 'chaleureux, accessible et proche',
    'professionnel': 'sérieux, expert et crédible',
    'fun': 'énergique, dynamique et enjoué',
    'inspirant': 'motivant, positif et encourageant'
  }

  const format = formats[data.format]
  const tone = tones[data.tone]

  return `Tu es un expert en marketing digital spécialisé dans la création de contenu viral pour les commerces locaux.

CONTEXTE BUSINESS:
- Nom du commerce: ${profile.business_name}
- Secteur d'activité: ${data.industry}
- Audience cible: ${profile.target_audience || 'Clientèle locale'}
- Objectifs: ${profile.main_goal || 'Attirer plus de clients'}

BRIEF CRÉATION VIDÉO:
- Plateforme: ${format.name} (${format.platform})
- Durée cible: ${format.duration}
- Sujet/Hook principal: ${data.hook || data.topic || 'Mettre en valeur le commerce'}
- Ton souhaité: ${tone}
- Instructions spéciales: ${data.customInstructions || 'Aucune instruction particulière'}

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

IMPORTANT: Génère UNIQUEMENT le script final, prêt à être tourné par ${profile.business_name}. Sois créatif mais professionnel.`
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
function generateScriptTitle(data: z.infer<typeof GenerateScriptSchema>): string {
  const format = data.format.charAt(0).toUpperCase() + data.format.slice(1)
  const subject = data.hook || data.topic || 'Script personnalisé'

  return `${format}: ${subject.slice(0, 50)}${subject.length > 50 ? '...' : ''}`
}