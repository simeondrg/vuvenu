import { NextRequest } from 'next/server'
import { z } from 'zod'

// Configuration des limites de sécurité
export const SECURITY_LIMITS = {
  // Limites de taille des inputs pour éviter les abus
  MAX_PROMPT_LENGTH: 10000,     // 10k chars max
  MAX_TITLE_LENGTH: 200,        // 200 chars max pour les titres
  MAX_DESCRIPTION_LENGTH: 2000, // 2k chars max pour descriptions
  MAX_JSON_SIZE: 50000,         // 50k chars pour les JSON

  // Timeouts pour les APIs externes
  CLAUDE_TIMEOUT_MS: 30000,     // 30s timeout pour Claude
  GEMINI_TIMEOUT_MS: 45000,     // 45s timeout pour Gemini (images plus lentes)

  // Patterns dangereux à bloquer
  DANGEROUS_PATTERNS: [
    /script\s*:/i,              // Injection de script
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript\s*:/i,          // URL javascript:
    /vbscript\s*:/i,           // URL vbscript:
    /on\w+\s*=/i,              // Event handlers HTML
    /\${.*}/,                   // Template injection basique
    /\{\{.*\}\}/,              // Handlebars/Mustache injection
  ]
}

// Schema Zod pour validation des inputs de génération
export const GenerationInputSchema = z.object({
  // Champs communs
  industry: z.string()
    .min(1, 'Secteur requis')
    .max(100, 'Secteur trop long')
    .refine(val => !containsDangerousContent(val), 'Contenu non autorisé'),

  format: z.enum(['reels', 'tiktok', 'stories', 'youtube'])
    .refine(val => ['reels', 'tiktok', 'stories', 'youtube'].includes(val), 'Format vidéo invalide'),

  tone: z.enum(['amical', 'professionnel', 'fun', 'inspirant'])
    .refine(val => ['amical', 'professionnel', 'fun', 'inspirant'].includes(val), 'Ton invalide'),

  // Champs optionnels avec validation stricte
  topic: z.string()
    .max(SECURITY_LIMITS.MAX_TITLE_LENGTH, `Sujet trop long (max ${SECURITY_LIMITS.MAX_TITLE_LENGTH} chars)`)
    .refine(val => !val || !containsDangerousContent(val), 'Contenu non autorisé')
    .optional(),

  customPrompt: z.string()
    .max(SECURITY_LIMITS.MAX_PROMPT_LENGTH, `Prompt trop long (max ${SECURITY_LIMITS.MAX_PROMPT_LENGTH} chars)`)
    .refine(val => !val || !containsDangerousContent(val), 'Contenu non autorisé')
    .optional(),

  audience: z.string()
    .max(SECURITY_LIMITS.MAX_DESCRIPTION_LENGTH, `Description audience trop longue`)
    .refine(val => !val || !containsDangerousContent(val), 'Contenu non autorisé')
    .optional(),
})

// Schema pour les campagnes Meta Ads
export const CampaignInputSchema = z.object({
  industry: z.string().min(1).max(100),
  objective: z.enum(['awareness', 'traffic', 'leads', 'engagement']),
  budget: z.object({
    daily: z.number().min(5).max(1000), // 5€ à 1000€/jour
    duration: z.number().min(1).max(90) // 1 à 90 jours
  }),
  targetLocation: z.string().max(200).optional(),
  specialOffer: z.string().max(500).optional(),
  businessName: z.string().max(100)
}).refine(data => {
  return !Object.values(data).some(val =>
    typeof val === 'string' && containsDangerousContent(val)
  )
}, 'Contenu non autorisé détecté')

/**
 * Vérifie si un texte contient du contenu dangereux
 */
export function containsDangerousContent(text: string): boolean {
  if (!text || typeof text !== 'string') return false

  return SECURITY_LIMITS.DANGEROUS_PATTERNS.some(pattern => pattern.test(text))
}

/**
 * Nettoie et sanitise un texte
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .trim()
    // Supprimer les caractères de contrôle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Limiter les espaces consécutifs
    .replace(/\s+/g, ' ')
    // Supprimer les balises HTML basiques
    .replace(/<[^>]*>/g, '')
    // Limiter la longueur totale
    .substring(0, SECURITY_LIMITS.MAX_PROMPT_LENGTH)
}

/**
 * Valide les headers CORS
 */
export function validateCorsOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')

  if (!origin) return true // Pas d'origin = requête directe (Postman, etc.)

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://vuvenu.fr',
    'https://www.vuvenu.fr',
    'https://app.vuvenu.fr',
    // Ajouter les domaines de staging si nécessaire
    'https://vuvenu-staging.vercel.app'
  ]

  return allowedOrigins.includes(origin)
}

/**
 * Crée les headers CORS sécurisés
 */
export function createCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin')
  const isValidOrigin = validateCorsOrigin(request)

  return {
    'Access-Control-Allow-Origin': isValidOrigin && origin ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24h cache pour preflight
    // Headers de sécurité additionnels
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
}

/**
 * Middleware de validation et sécurité pour API
 */
export async function withSecurity<T>(
  request: NextRequest,
  schema: z.ZodSchema,
  handler: (data: any) => Promise<T>
): Promise<{ result?: T; error?: Response }> {
  try {
    // 1. Vérifier CORS
    if (!validateCorsOrigin(request)) {
      return {
        error: new Response(
          JSON.stringify({ error: 'Origin non autorisée' }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // 2. Valider la taille du body
    const body = await request.text()
    if (body.length > SECURITY_LIMITS.MAX_JSON_SIZE) {
      return {
        error: new Response(
          JSON.stringify({
            error: `Requête trop volumineuse (max ${SECURITY_LIMITS.MAX_JSON_SIZE} chars)`
          }),
          { status: 413, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // 3. Parser et valider JSON
    let data
    try {
      data = JSON.parse(body)
    } catch (e) {
      return {
        error: new Response(
          JSON.stringify({ error: 'JSON invalide' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // 4. Validation Zod
    const validationResult = schema.safeParse(data)
    if (!validationResult.success) {
      return {
        error: new Response(
          JSON.stringify({
            error: 'Données invalides',
            details: validationResult.error.issues.map(issue => ({
              path: issue.path.join('.'),
              message: issue.message
            }))
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // 5. Sanitiser les inputs string
    const sanitizedData = sanitizeObjectInputs(validationResult.data)

    // 6. Exécuter le handler avec les données validées
    const result = await handler(sanitizedData)
    return { result }

  } catch (error) {
    console.error('Security middleware error:', error)
    return {
      error: new Response(
        JSON.stringify({ error: 'Erreur interne du serveur' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
}

/**
 * Sanitise récursivement tous les strings dans un objet
 */
function sanitizeObjectInputs(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectInputs)
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObjectInputs(value)
    }
    return sanitized
  }

  return obj
}

/**
 * Logger les coûts et usage des APIs
 */
export interface ApiUsageLog {
  userId?: string
  endpoint: string
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  cost?: number
  duration: number
  success: boolean
  error?: string
  timestamp: number
}

export function logApiUsage(log: ApiUsageLog): void {
  // En développement, logger dans la console
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 API Usage:', {
      endpoint: log.endpoint,
      user: log.userId || 'anonymous',
      tokens: log.totalTokens || 0,
      cost: log.cost ? `$${log.cost.toFixed(4)}` : 'N/A',
      duration: `${log.duration}ms`,
      success: log.success ? '✅' : '❌'
    })
  }

  // En production, envoyer vers un service de monitoring
  // TODO: Implémenter l'envoi vers DataDog, Sentry, ou autre
}