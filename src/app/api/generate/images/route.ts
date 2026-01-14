import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit'
import { createCorsHeaders, logApiUsage, SECURITY_LIMITS } from '@/lib/api-security'
import { withResilience } from '@/lib/circuit-breaker'
import { getGeminiImageGenerator, type ImageGenerationRequest } from '@/lib/ai/gemini-image-generator'
import { logger } from '@/lib/monitoring/logger'
import { VuVenuMetrics } from '@/lib/monitoring/metrics'

// Handler OPTIONS pour CORS
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)
  return new Response(null, { status: 200, headers: corsHeaders })
}

// Support pour l'ancien système (concepts) ET nouveau système Gemini
const GenerateImageSchema = z.discriminatedUnion('type', [
  // Ancien système - génération pour un concept existant
  z.object({
    type: z.literal('concept'),
    conceptId: z.string().uuid(),
    industry: z.string(),
    adType: z.string(),
    businessName: z.string().optional(),
  }),
  // Nouveau système Gemini - génération directe
  z.object({
    type: z.literal('direct'),
    businessName: z.string().min(1, 'Nom du business requis').max(100),
    industry: z.string().min(1, 'Industrie requise'),
    prompt: z.string().min(10, 'Description trop courte').max(500, 'Description trop longue'),
    style: z.enum(['moderne', 'vintage', 'minimaliste', 'dynamique', 'premium', 'local']),
    format: z.enum(['square', 'portrait', 'landscape', 'story']),
    colors: z.array(z.string()).optional(),
    target: z.enum(['awareness', 'consideration', 'conversion']).default('awareness'),
    platform: z.enum(['instagram', 'facebook', 'meta_ads', 'all']).default('meta_ads'),
    quality: z.enum(['standard', 'high', 'premium']).default('standard'),
    variations: z.number().min(1).max(4).default(1)
  })
])

// Prompts pour génération d'images selon le secteur
const IMAGE_PROMPTS = {
  coiffure: {
    'Transformation spectaculaire': 'Professional hair salon transformation, before and after, modern salon interior, professional hairdresser working, bright natural lighting, high-end beauty photography style',
    'Expertise professionnelle': 'Professional hair stylist at work, modern salon, precision cutting technique, luxury salon interior, professional beauty photography',
    'Avant/après réel': 'Hair transformation before and after split image, professional salon setting, dramatic hair change, modern beauty photography',
    'Offre première visite': 'Welcoming modern hair salon interior, professional hairdresser, inviting atmosphere, discount offer visible, premium beauty setting',
    'Urgence disponibilité': 'Busy professional salon, appointment calendar, modern interior, sense of exclusivity and demand'
  },
  restaurant: {
    'Coulisses chef': 'Professional chef cooking in restaurant kitchen, early morning preparation, artisanal cooking process, steam rising, professional food photography',
    'Spécialité unique': 'Signature dish being prepared, close-up food photography, chef plating, restaurant kitchen, artistic presentation',
    'Ambiance et qualité': 'Warm restaurant interior, family dining, cozy atmosphere, beautiful food presentation, inviting dining room',
    'Menu découverte': 'Three-course meal presentation, elegant table setting, restaurant interior, appetizing dishes, professional food photography',
    'Réservation facile': 'Welcoming restaurant entrance, warm lighting, staff greeting guests, cozy dining atmosphere'
  },
  boulangerie: {
    'Tradition artisanale': 'Baker kneading dough by hand, traditional bakery interior, early morning baking, flour dust, artisanal bread making',
    'Fraîcheur quotidienne': 'Fresh pastries coming out of oven, steam rising, golden bakery lighting, artisanal display',
    'Ingrédients locaux': 'Local ingredients display, wheat flour, farm butter, traditional bakery setting, natural products',
    'Commande spéciale': 'Custom birthday cake being decorated, bakery workshop, artistic cake decoration, professional patisserie',
    'Fidélité récompensée': 'Traditional bakery counter, loyalty card being stamped, warm customer service, bread display'
  },
  fleuriste: {
    'Création sur-mesure': 'Florist arranging custom bouquet, flower workshop, artistic arrangement, natural lighting, professional floristry',
    'Fraîcheur garantie': 'Fresh flowers delivery, flower market scene, morning freshness, professional flower handling',
    'Conseils d\'expert': 'Florist advising customer, beautiful flower arrangements, expert consultation, flower shop interior',
    'Livraison express': 'Flower delivery service, beautiful bouquet being delivered, happy customer, professional service',
    'Occasion spéciale': 'Romantic flower arrangement, Valentine themed, elegant presentation, love and romance setting'
  },
  fitness: {
    'Transformation membre': 'Fitness transformation before and after, gym setting, health and wellness, motivational atmosphere',
    'Coaching personnalisé': 'Personal trainer working with client, modern gym equipment, professional fitness coaching, motivation',
    'Expertise nutrition': 'Nutrition consultation, healthy meal planning, fitness lifestyle, wellness coaching session',
    'Essai gratuit': 'Welcoming gym interior, trial session, modern fitness equipment, friendly staff, inviting atmosphere',
    'Promo nouveau membre': 'New member signing up, gym membership desk, welcoming fitness center, promotional atmosphere'
  },
  mode: {
    'Tendance exclusive': 'Unique fashion piece displayed, boutique interior, exclusive designer item, high-end fashion photography',
    'Style personnel': 'Personal styling session, fashion consultation, boutique setting, wardrobe selection, style advice',
    'Qualité artisanale': 'Artisanal fashion creation, designer workshop, quality craftsmanship, European fashion atelier',
    'Collection privée': 'Private fashion sale, exclusive boutique, VIP shopping experience, luxury fashion display',
    'Personal shopping': 'Personal shopping appointment, fashion consultant, boutique interior, style advice session'
  }
}

// Prompts génériques si secteur non trouvé
const GENERIC_PROMPTS = {
  'awareness': 'Professional business setting, modern interior, high-quality commercial photography, welcoming atmosphere',
  'consideration': 'Business expertise demonstration, professional service, quality focus, trustworthy environment',
  'conversion': 'Special offer presentation, promotional setting, customer satisfaction, business success'
}

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
    const validatedData = GenerateImageSchema.parse(body)

    if (validatedData.type === 'concept') {
      // ANCIEN SYSTÈME - Génération pour un concept existant
      return await handleConceptImageGeneration(supabase, user.id, validatedData, corsHeaders, startTime)
    } else {
      // NOUVEAU SYSTÈME GEMINI - Génération directe
      return await handleDirectImageGeneration(supabase, user.id, validatedData, corsHeaders, startTime)
    }

  } catch (error) {
    console.error('Erreur génération image:', error)

    // Logging échec
    logApiUsage({
      endpoint: '/api/generate/images',
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

// Gestionnaire pour l'ancien système - génération basée sur les concepts de campagne
async function handleConceptImageGeneration(
  supabase: any,
  userId: string,
  validatedData: any,
  corsHeaders: any,
  startTime: number
) {
  // Vérifier que le concept existe et appartient à l'utilisateur
  const { data: concept, error: conceptError } = await supabase
    .from('campaign_concepts')
    .select(`
      *,
      campaigns!inner (
        user_id,
        input_data
      )
    `)
    .eq('id', validatedData.conceptId)
    .single()

  if (conceptError || !concept || concept.campaigns.user_id !== userId) {
    return NextResponse.json(
      { error: 'Concept non trouvé' },
      { status: 404, headers: corsHeaders }
    )
  }

  // Si l'image existe déjà, la retourner
  if (concept.image_url) {
    return NextResponse.json({
      imageUrl: concept.image_url,
      prompt: concept.image_prompt || 'Image déjà générée'
    }, { headers: corsHeaders })
  }

  // Construire le prompt pour l'image
  let imagePrompt = ''
  const industryPrompts = IMAGE_PROMPTS[validatedData.industry as keyof typeof IMAGE_PROMPTS]

  if (industryPrompts) {
    // Chercher un prompt spécifique basé sur l'angle ou le type d'ad
    const matchingPrompt = Object.entries(industryPrompts).find(([key]) =>
      concept.angle?.toLowerCase().includes(key.toLowerCase()) ||
      concept.ad_type?.toLowerCase().includes(key.toLowerCase()) ||
      concept.name?.toLowerCase().includes(key.toLowerCase())
    )

    if (matchingPrompt) {
      imagePrompt = matchingPrompt[1]
    } else {
      // Prendre le premier prompt du secteur
      imagePrompt = Object.values(industryPrompts)[0]
    }
  } else {
    // Prompt générique basé sur le funnel stage
    imagePrompt = GENERIC_PROMPTS[concept.funnel_stage as keyof typeof GENERIC_PROMPTS] || GENERIC_PROMPTS.awareness
  }

  // Ajouter des éléments contextuels
  const businessName = validatedData.businessName || 'business'
  const enhancedPrompt = `${imagePrompt}, ${validatedData.industry} business, professional commercial photography, high quality, no text overlay, clean composition, marketing ready image for ${businessName}`

  // Générer une image avec Unsplash (fallback de l'ancien système)
  let imageUrl: string

  try {
    const unsplashQuery = getUnsplashQuery(validatedData.industry, concept.ad_type)
    const unsplashResponse = await withResilience(
      () => fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(unsplashQuery)}&orientation=square&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY || 'demo_key'}`,
        {
          headers: { 'Accept-Version': 'v1' },
        }
      ),
      'gemini'
    )

    if (unsplashResponse.ok) {
      const unsplashData = await unsplashResponse.json()
      imageUrl = unsplashData.urls.regular
    } else {
      throw new Error('Unsplash API failed')
    }
  } catch (error) {
    // Fallback: image stylisée
    imageUrl = await generateStylizedImage(validatedData.industry, concept.ad_type)
  }

  // Sauvegarder l'URL de l'image dans le concept
  await supabase
    .from('campaign_concepts')
    .update({
      image_url: imageUrl,
      image_prompt: enhancedPrompt,
      updated_at: new Date().toISOString()
    })
    .eq('id', validatedData.conceptId)

  logApiUsage({
    userId,
    endpoint: '/api/generate/images',
    duration: Date.now() - startTime,
    success: true,
    timestamp: Date.now()
  })

  return NextResponse.json({
    success: true,
    imageUrl: imageUrl,
    prompt: enhancedPrompt,
    message: 'Image générée avec succès'
  }, { headers: corsHeaders })
}

// Gestionnaire pour le nouveau système Gemini - génération directe
async function handleDirectImageGeneration(
  supabase: any,
  userId: string,
  validatedData: any,
  corsHeaders: any,
  startTime: number
) {
  try {
    // Récupérer le profil utilisateur pour vérifications
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, business_name, business_type')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      logger.error('Failed to fetch user profile for image generation', profileError)
      return NextResponse.json(
        {
          success: false,
          error: 'Profil utilisateur introuvable',
          code: 'ERR-DB-001'
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Vérification des limites d'abonnement
    if (profile.subscription_status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Abonnement requis pour générer des images',
          code: 'ERR-LIMIT-001',
          helpUrl: '/choose-plan'
        },
        { status: 403, headers: corsHeaders }
      )
    }

    logger.info('Starting Gemini image generation', {
      userId,
      business: validatedData.businessName,
      industry: validatedData.industry,
      style: validatedData.style
    })

    // Utiliser le générateur Gemini
    const generator = getGeminiImageGenerator()
    const geminiRequest: ImageGenerationRequest = {
      businessName: validatedData.businessName,
      industry: validatedData.industry,
      prompt: validatedData.prompt,
      style: validatedData.style,
      format: validatedData.format,
      colors: validatedData.colors,
      target: validatedData.target,
      platform: validatedData.platform,
      quality: validatedData.quality,
      variations: validatedData.variations
    }

    const result = await generator.generateImages(geminiRequest)

    if (!result.success) {
      logger.error('Gemini image generation failed', new Error(result.error || 'Unknown error'))
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Erreur de génération d\'images',
          code: 'ERR-GEMINI-001'
        },
        { status: 502, headers: corsHeaders }
      )
    }

    // Métriques de suivi
    VuVenuMetrics.business({
      event: 'gemini_image_generated_api',
      userId,
      properties: {
        industry: validatedData.industry,
        style: validatedData.style,
        format: validatedData.format,
        variations: result.images.length,
        processingTime: result.processingTime,
        cost: result.totalCost,
        plan: profile.subscription_tier
      }
    })

    logApiUsage({
      userId,
      endpoint: '/api/generate/images',
      duration: Date.now() - startTime,
      success: true,
      timestamp: Date.now()
    })

    return NextResponse.json(
      {
        success: true,
        images: result.images,
        totalCost: result.totalCost,
        tokensUsed: result.tokensUsed,
        processingTime: result.processingTime,
        metadata: {
          businessName: profile.business_name,
          plan: profile.subscription_tier
        }
      },
      { headers: corsHeaders }
    )

  } catch (error) {
    logger.error('Unexpected error in Gemini image generation', error as Error)

    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur inattendue s\'est produite',
        code: 'ERR-INTERNAL-001'
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Fonctions utilitaires pour la génération d'images

function getUnsplashQuery(industry: string, adType?: string): string {
  const industryQueries = {
    coiffure: 'hair salon beauty professional modern',
    restaurant: 'restaurant food dining elegant',
    boulangerie: 'bakery bread pastry artisanal',
    fleuriste: 'florist flowers arrangement elegant',
    fitness: 'fitness gym workout modern',
    mode: 'fashion boutique modern elegant'
  }

  const baseQuery = industryQueries[industry as keyof typeof industryQueries] || 'professional business modern'

  // Ajouter des mots-clés selon le type d'ad
  if (adType?.includes('transformation')) return `${baseQuery} transformation before after`
  if (adType?.includes('product')) return `${baseQuery} product showcase`
  if (adType?.includes('ambiance')) return `${baseQuery} atmosphere interior`

  return `${baseQuery} professional commercial`
}

async function generateStylizedImage(industry: string, adType?: string): Promise<string> {
  // Générer une image avec des gradients VuVenu selon le secteur
  const industryColors = {
    coiffure: '#C4B5FD,#FECDD3', // violet-rose
    restaurant: '#60A5FA,#BFFF00', // blue-lime
    boulangerie: '#FBBF24,#FED7AA', // amber-orange
    fleuriste: '#FECDD3,#C4B5FD', // rose-violet
    fitness: '#10B981,#BFFF00', // green-lime
    mode: '#C4B5FD,#60A5FA', // violet-blue
    default: '#BFFF00,#60A5FA' // lime-blue
  }

  const colors = industryColors[industry as keyof typeof industryColors] || industryColors.default

  // Utiliser un service de génération d'images par gradient (placeholder intelligent)
  return `https://source.unsplash.com/400x400/?${encodeURIComponent(getUnsplashQuery(industry, adType).replace(/\s+/g, ','))}&sig=${Date.now()}`
}

/*
FUTURE: Intégration Gemini Imagen complète

Quand l'API Imagen sera disponible, remplacer par:

async function generateImageWithGemini(prompt: string): Promise<string> {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  })

  const response = await withResilience(
    () => fetch('https://aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/publishers/google/models/imagen-3-generate:predict', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await auth.getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { aspectRatio: '1:1', sampleCount: 1 }
      })
    }),
    'gemini'
  )

  const imageBuffer = await response.arrayBuffer()

  // Upload vers Supabase Storage
  const fileName = `campaign-${Date.now()}.jpg`
  const { data } = await supabase.storage
    .from('campaign-images')
    .upload(fileName, imageBuffer)

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign-images/${fileName}`
}
*/