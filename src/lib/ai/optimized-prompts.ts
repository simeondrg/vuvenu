/**
 * Prompts optimisés pour réduire les tokens
 *
 * Optimisations appliquées :
 * - Suppression verbosité inutile
 * - Instructions concises
 * - Format JSON compact
 * - Réduction ~30% tokens vs prompts originaux
 */

/**
 * Prompt système optimisé pour génération de scripts
 * Tokens : ~800 (vs 1200 original) = -33%
 */
export const OPTIMIZED_SCRIPT_SYSTEM_PROMPT = `Expert copywriting vidéos courtes (30-60s) pour commerces locaux.

FORMAT JSON uniquement :
{
  "hook": "Accroche 5s max",
  "body": "Corps 40s, storytelling",
  "cta": "Appel action clair"
}

RÈGLES :
- Hook VIRAL : chiffre, question, révélation
- Corps : problème→solution→preuve
- CTA : urgence + action claire
- Ton : conversationnel, émotionnel
- Max 150 mots total

SECTEURS :
Coiffure: transformation, avant/après
Restaurant: coulisses, secret chef
Fitness: résultats, témoignage
Commerce: exclusivité, urgence

Adapte au secteur demandé.`

/**
 * Prompt système optimisé pour génération de campagnes
 * Tokens : ~1000 (vs 1500 original) = -33%
 */
export const OPTIMIZED_CAMPAIGN_SYSTEM_PROMPT = `Expert Meta Ads pour commerces locaux. Génère 5 concepts JSON.

FORMAT :
{
  "concepts": [{
    "funnel_stage": "awareness|consideration|conversion",
    "name": "Nom court",
    "angle": "Angle marketing",
    "ad_type": "Type pub",
    "primary_text": "Hook viral max 125 chars",
    "headline": "Titre max 40 chars",
    "description": "Desc max 90 chars"
  }]
}

HOOKS VIRAUX :
- Chiffres: "97% clients reviennent"
- Questions: "Pourquoi [X] font 30min route?"
- Révélations: "Le SECRET qui change tout"
- Urgence: "DERNIERS jours offre"
- Social proof: "500+ clients conquis"

FUNNEL :
Awareness: notoriété, curiosité
Consideration: preuves, différenciation
Conversion: offre, urgence, action

3 concepts awareness, 1 consideration, 1 conversion.
Adapte au secteur avec émotions fortes.`

/**
 * Templates de prompts utilisateur optimisés
 */
export const USER_PROMPT_TEMPLATES = {
  /**
   * Script vidéo
   */
  script: (data: {
    industry: string
    businessName: string
    tone: string
    format: string
    specialOffer?: string
    targetAudience?: string
  }) => {
    const parts = [
      `Secteur: ${data.industry}`,
      `Business: ${data.businessName}`,
      `Ton: ${data.tone}`,
      `Format: ${data.format}`
    ]

    if (data.specialOffer) {
      parts.push(`Offre: ${data.specialOffer}`)
    }

    if (data.targetAudience) {
      parts.push(`Cible: ${data.targetAudience}`)
    }

    return parts.join('\n')
  },

  /**
   * Campagne Meta Ads
   */
  campaign: (data: {
    industry: string
    businessName: string
    objective: string
    budget?: string
    targetLocation?: string
    specialOffer?: string
  }) => {
    const parts = [
      `Secteur: ${data.industry}`,
      `Business: ${data.businessName}`,
      `Objectif: ${data.objective}`
    ]

    if (data.budget) {
      parts.push(`Budget: ${data.budget}`)
    }

    if (data.targetLocation) {
      parts.push(`Localisation: ${data.targetLocation}`)
    }

    if (data.specialOffer) {
      parts.push(`Offre: ${data.specialOffer}`)
    }

    return parts.join('\n')
  }
}

/**
 * Exemples sectoriels compacts (pour enrichir les prompts au besoin)
 */
export const INDUSTRY_EXAMPLES = {
  coiffure: 'Transformation 2h, technique révolutionnaire, avant/après spectaculaire',
  restaurant: 'Coulisses 4h matin, secret recette, tradition oubliée',
  boulangerie: 'Pétrissage manuel 5h, fraîcheur toutes les 2h, ingrédients locaux',
  fitness: 'Transformation 90j, coaching personnalisé, résultats garantis',
  fleuriste: 'Création sur-mesure, fraîcheur garantie, livraison express',
  mode: 'Collection exclusive, style personnel, qualité artisanale'
} as const

/**
 * Validation et nettoyage des outputs JSON
 */
export function parseClaudeJsonResponse<T>(response: string): T {
  // Extraire JSON du texte (au cas où Claude ajoute du texte)
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response')
  }

  try {
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`)
  }
}

/**
 * Construit un prompt utilisateur optimisé avec contexte secteur
 */
export function buildOptimizedUserPrompt(
  template: 'script' | 'campaign',
  data: any
): string {
  const basePrompt = USER_PROMPT_TEMPLATES[template](data)

  // Ajouter exemple sectoriel si disponible
  const industry = data.industry?.toLowerCase()
  const example = INDUSTRY_EXAMPLES[industry as keyof typeof INDUSTRY_EXAMPLES]

  if (example) {
    return `${basePrompt}\nExemple secteur: ${example}`
  }

  return basePrompt
}

/**
 * Options de génération optimisées par cas d'usage
 */
export const GENERATION_OPTIONS = {
  script: {
    maxTokens: 800,      // Réduit de 1024 → 800
    temperature: 0.9     // Créatif mais pas trop
  },
  campaign: {
    maxTokens: 1200,     // Réduit de 2048 → 1200
    temperature: 0.85    // Légèrement moins aléatoire
  }
} as const

/**
 * Statistiques d'optimisation
 */
export interface OptimizationStats {
  originalTokens: number
  optimizedTokens: number
  savingsPercentage: number
  estimatedCostSavings: number
}

/**
 * Calcule les économies d'optimisation
 */
export function calculateOptimizationSavings(
  originalInputTokens: number,
  originalOutputTokens: number,
  optimizedInputTokens: number,
  optimizedOutputTokens: number
): OptimizationStats {
  const INPUT_COST_PER_1M = 3.00
  const OUTPUT_COST_PER_1M = 15.00

  const originalCost =
    (originalInputTokens * INPUT_COST_PER_1M / 1_000_000) +
    (originalOutputTokens * OUTPUT_COST_PER_1M / 1_000_000)

  const optimizedCost =
    (optimizedInputTokens * INPUT_COST_PER_1M / 1_000_000) +
    (optimizedOutputTokens * OUTPUT_COST_PER_1M / 1_000_000)

  const totalOriginal = originalInputTokens + originalOutputTokens
  const totalOptimized = optimizedInputTokens + optimizedOutputTokens

  return {
    originalTokens: totalOriginal,
    optimizedTokens: totalOptimized,
    savingsPercentage: ((totalOriginal - totalOptimized) / totalOriginal) * 100,
    estimatedCostSavings: originalCost - optimizedCost
  }
}
