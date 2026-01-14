/**
 * Client Claude optimisé avec Prompt Caching
 *
 * Économies attendues :
 * - Prompt Caching : -90% sur tokens input répétés
 * - Optimisation prompts : -20% sur tokens output
 * - Total : ~50% de réduction de coûts
 */

import Anthropic from '@anthropic-ai/sdk'
import { SECURITY_LIMITS } from '@/lib/api-security'

// Cache singleton pour éviter multiples initialisations
let anthropicClient: Anthropic | null = null

/**
 * Récupère le client Anthropic (singleton)
 */
export function getOptimizedAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: SECURITY_LIMITS.CLAUDE_TIMEOUT_MS
    })
  }

  return anthropicClient
}

/**
 * Interface pour les métriques de génération
 */
export interface GenerationMetrics {
  inputTokens: number
  outputTokens: number
  cacheCreationTokens?: number
  cacheReadTokens?: number
  totalCost: number
  estimatedSavings?: number
}

/**
 * Calcule le coût d'une génération Claude
 */
export function calculateClaudeCost(
  inputTokens: number,
  outputTokens: number,
  cacheCreationTokens: number = 0,
  cacheReadTokens: number = 0
): { cost: number; savings: number } {
  // Tarifs Claude 3.5 Sonnet (janvier 2026)
  const INPUT_COST_PER_1M = 3.00      // $3 / 1M tokens
  const OUTPUT_COST_PER_1M = 15.00    // $15 / 1M tokens
  const CACHE_WRITE_COST_PER_1M = 3.75 // $3.75 / 1M tokens (25% markup)
  const CACHE_READ_COST_PER_1M = 0.30  // $0.30 / 1M tokens (90% discount)

  // Coût sans cache
  const costWithoutCache =
    (inputTokens * INPUT_COST_PER_1M / 1_000_000) +
    (outputTokens * OUTPUT_COST_PER_1M / 1_000_000)

  // Coût avec cache
  const costWithCache =
    (cacheCreationTokens * CACHE_WRITE_COST_PER_1M / 1_000_000) +
    (cacheReadTokens * CACHE_READ_COST_PER_1M / 1_000_000) +
    ((inputTokens - cacheCreationTokens - cacheReadTokens) * INPUT_COST_PER_1M / 1_000_000) +
    (outputTokens * OUTPUT_COST_PER_1M / 1_000_000)

  const savings = costWithoutCache - costWithCache

  return {
    cost: costWithCache,
    savings
  }
}

/**
 * Génère avec Claude en utilisant le Prompt Caching
 *
 * @param systemPrompt - Prompt système (sera caché automatiquement)
 * @param userPrompt - Prompt utilisateur (dynamique)
 * @param options - Options additionnelles
 */
export async function generateWithCaching(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string
    maxTokens?: number
    temperature?: number
  } = {}
): Promise<{
  content: string
  metrics: GenerationMetrics
}> {
  const client = getOptimizedAnthropicClient()

  const response = await client.messages.create({
    model: options.model || 'claude-3-5-sonnet-20241022',
    max_tokens: options.maxTokens || 2048,
    temperature: options.temperature || 1.0,

    // 🔥 PROMPT CACHING : Le system prompt sera caché
    system: [
      {
        type: 'text',
        text: systemPrompt,
        // Cette annotation indique à Claude de cacher ce bloc
        cache_control: { type: 'ephemeral' }
      }
    ],

    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  })

  // Extraire les métriques
  const usage = response.usage
  const metrics: GenerationMetrics = {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheCreationTokens: usage.cache_creation_input_tokens || 0,
    cacheReadTokens: usage.cache_read_input_tokens || 0,
    totalCost: 0,
    estimatedSavings: 0
  }

  // Calculer le coût et économies
  const { cost, savings } = calculateClaudeCost(
    metrics.inputTokens,
    metrics.outputTokens,
    metrics.cacheCreationTokens,
    metrics.cacheReadTokens
  )

  metrics.totalCost = cost
  metrics.estimatedSavings = savings

  // Extraire le contenu
  const content = response.content[0].type === 'text'
    ? response.content[0].text
    : ''

  return { content, metrics }
}

/**
 * Génère plusieurs items en streaming optimisé
 * (Pas de batching réel car génération séquentielle nécessaire)
 */
export async function generateMultipleWithCaching(
  systemPrompt: string,
  userPrompts: string[],
  options: {
    model?: string
    maxTokens?: number
    temperature?: number
  } = {}
): Promise<Array<{
  content: string
  metrics: GenerationMetrics
}>> {
  const results = []

  // Générer séquentiellement pour bénéficier du cache
  for (const userPrompt of userPrompts) {
    const result = await generateWithCaching(systemPrompt, userPrompt, options)
    results.push(result)

    // Petit délai pour éviter rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return results
}

/**
 * Optimise un prompt en supprimant la verbosité inutile
 */
export function optimizePrompt(prompt: string): string {
  return prompt
    // Supprimer espaces multiples
    .replace(/\s+/g, ' ')
    // Supprimer lignes vides multiples
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Trim
    .trim()
}

/**
 * Construit les métriques agrégées
 */
export function aggregateMetrics(metrics: GenerationMetrics[]): {
  totalInputTokens: number
  totalOutputTokens: number
  totalCacheReadTokens: number
  totalCost: number
  totalSavings: number
  averageCostPerGeneration: number
} {
  const totals = metrics.reduce(
    (acc, m) => ({
      inputTokens: acc.inputTokens + m.inputTokens,
      outputTokens: acc.outputTokens + m.outputTokens,
      cacheReadTokens: acc.cacheReadTokens + (m.cacheReadTokens || 0),
      cost: acc.cost + m.totalCost,
      savings: acc.savings + (m.estimatedSavings || 0)
    }),
    { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cost: 0, savings: 0 }
  )

  return {
    totalInputTokens: totals.inputTokens,
    totalOutputTokens: totals.outputTokens,
    totalCacheReadTokens: totals.cacheReadTokens,
    totalCost: totals.cost,
    totalSavings: totals.savings,
    averageCostPerGeneration: totals.cost / metrics.length
  }
}

/**
 * Logger les métriques pour monitoring
 */
export function logGenerationMetrics(
  endpoint: string,
  userId: string,
  metrics: GenerationMetrics
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Generation Metrics:', {
      endpoint,
      userId: userId.substring(0, 8),
      inputTokens: metrics.inputTokens,
      outputTokens: metrics.outputTokens,
      cacheReadTokens: metrics.cacheReadTokens || 0,
      totalCost: `$${metrics.totalCost.toFixed(4)}`,
      estimatedSavings: `$${metrics.estimatedSavings?.toFixed(4) || '0'}`,
      savingsPercentage: metrics.estimatedSavings
        ? `${((metrics.estimatedSavings / (metrics.totalCost + metrics.estimatedSavings)) * 100).toFixed(1)}%`
        : '0%'
    })
  }

  // TODO: Envoyer vers système de monitoring (Sentry, Datadog, etc.)
}

// Export des types
export type { Anthropic }
