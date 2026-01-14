import { NextRequest, NextResponse } from 'next/server'
import { getCircuitMetrics, resetCircuitBreaker } from '@/lib/circuit-breaker'
import { createCorsHeaders } from '@/lib/api-security'

/**
 * API de monitoring pour les circuit breakers
 * GET : Récupère l'état des circuits
 * POST : Reset manuel d'un circuit (admin/debug)
 */

// Handler OPTIONS pour CORS
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)
  return new Response(null, { status: 200, headers: corsHeaders })
}

// GET : État des circuit breakers
export async function GET(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)

  try {
    const claudeMetrics = getCircuitMetrics('claude')
    const geminiMetrics = getCircuitMetrics('gemini')

    const systemHealth = {
      timestamp: new Date().toISOString(),
      overall_status: (claudeMetrics.state === 'CLOSED' && geminiMetrics.state === 'CLOSED') ? 'HEALTHY' : 'DEGRADED',
      services: {
        claude: {
          ...claudeMetrics,
          description: 'Service de génération de texte (scripts, campagnes)'
        },
        gemini: {
          ...geminiMetrics,
          description: 'Service de génération d\'images'
        }
      },
      recommendations: [] as Array<{
        service: string
        action: string
        impact: string
      }>
    }

    // Ajouter des recommandations basées sur l'état
    if (claudeMetrics.state === 'OPEN') {
      systemHealth.recommendations.push({
        service: 'claude',
        action: 'Le service Claude est temporairement indisponible. Les générations de scripts sont suspendues.',
        impact: 'high'
      })
    }

    if (geminiMetrics.state === 'OPEN') {
      systemHealth.recommendations.push({
        service: 'gemini',
        action: 'Le service Gemini est temporairement indisponible. Les générations d\'images sont suspendues.',
        impact: 'medium'
      })
    }

    if (claudeMetrics.state === 'HALF_OPEN') {
      systemHealth.recommendations.push({
        service: 'claude',
        action: 'Le service Claude est en cours de récupération. Monitoring en cours.',
        impact: 'medium'
      })
    }

    if (geminiMetrics.state === 'HALF_OPEN') {
      systemHealth.recommendations.push({
        service: 'gemini',
        action: 'Le service Gemini est en cours de récupération. Monitoring en cours.',
        impact: 'low'
      })
    }

    return NextResponse.json(systemHealth, { headers: corsHeaders })

  } catch (error) {
    console.error('Erreur monitoring circuit breaker:', error)

    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération de l\'état des services',
        timestamp: new Date().toISOString()
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

// POST : Reset manuel d'un circuit breaker (pour admin/debug)
export async function POST(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)

  try {
    const { service, action } = await request.json()

    if (!service || !['claude', 'gemini'].includes(service)) {
      return NextResponse.json(
        { error: 'Service requis: "claude" ou "gemini"' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (action === 'reset') {
      resetCircuitBreaker(service)

      return NextResponse.json({
        success: true,
        message: `Circuit breaker ${service} remis à zéro`,
        timestamp: new Date().toISOString(),
        new_state: getCircuitMetrics(service)
      }, { headers: corsHeaders })
    }

    return NextResponse.json(
      { error: 'Action non supportée. Utilisez "reset"' },
      { status: 400, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Erreur reset circuit breaker:', error)

    return NextResponse.json(
      { error: 'Erreur lors du reset du circuit breaker' },
      { status: 500, headers: corsHeaders }
    )
  }
}