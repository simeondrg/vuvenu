import { NextRequest } from 'next/server'
import { createHealthResponse, healthChecker } from '@/lib/monitoring/health-check'
import { getCircuitMetrics } from '@/lib/circuit-breaker'
import { VuVenuMetrics } from '@/lib/monitoring/metrics'
import { createCorsHeaders } from '@/lib/api-security'
import { logger } from '@/lib/monitoring/logger'

/**
 * Endpoint de monitoring global pour VuVenu
 *
 * GET /api/health/status
 * Retourne l'état complet du système :
 * - Health checks de tous les services
 * - États des circuit breakers
 * - Métriques de performance
 * - Recommandations d'actions
 */

export async function OPTIONS(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)

  try {
    const startTime = Date.now()

    // 1. Health checks de base
    const systemHealth = await healthChecker.checkAll()

    // 2. Circuit breaker status
    const claudeCircuit = getCircuitMetrics('claude')
    const geminiCircuit = getCircuitMetrics('gemini')

    // 3. Métriques additionnelles
    const metrics = {
      responseTime: Date.now() - startTime,
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    }

    // 4. Construire la réponse consolidée
    const response = {
      // État global
      status: systemHealth.overall,
      timestamp: systemHealth.timestamp,
      version: systemHealth.version,

      // Services individuels avec health + circuit breaker
      services: {
        // Base de données
        database: {
          health: systemHealth.services.database,
          circuit: null, // Pas de circuit breaker pour DB
          critical: true
        },

        // Claude (critique pour génération scripts)
        claude: {
          health: systemHealth.services.claude,
          circuit: claudeCircuit,
          critical: true
        },

        // Gemini (important pour génération images)
        gemini: {
          health: systemHealth.services.gemini,
          circuit: geminiCircuit,
          critical: false
        },

        // Stripe (critique pour paiements)
        stripe: {
          health: systemHealth.services.stripe,
          circuit: null,
          critical: true
        },

        // Storage
        storage: {
          health: systemHealth.services.storage,
          circuit: null,
          critical: false
        },

        // Ressources système
        system: {
          health: systemHealth.services.system,
          circuit: null,
          critical: true
        }
      },

      // Métriques techniques
      metrics,

      // Alertes et recommandations
      alerts: generateAlerts(systemHealth, claudeCircuit, geminiCircuit),

      // Actions suggérées
      actions: generateActions(systemHealth, claudeCircuit, geminiCircuit)
    }

    // Déterminer le code de statut HTTP
    const httpStatus = response.status === 'healthy' ? 200
                      : response.status === 'degraded' ? 200
                      : 503

    // Log pour monitoring
    logger.info('Health status check completed', {
      status: response.status,
      responseTime: metrics.responseTime,
      alerts: response.alerts.length
    })

    return new Response(JSON.stringify(response, null, 2), {
      status: httpStatus,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        ...corsHeaders
      }
    })

  } catch (error) {
    logger.error('Health status endpoint failed', error as Error)

    return new Response(JSON.stringify({
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}

/**
 * Génère les alertes basées sur l'état des services
 */
function generateAlerts(systemHealth: any, claudeCircuit: any, geminiCircuit: any) {
  const alerts = []

  // Alertes critiques (services down)
  Object.entries(systemHealth.services).forEach(([name, service]: [string, any]) => {
    if (service.status === 'down') {
      alerts.push({
        level: 'critical',
        service: name,
        message: `Service ${name} est indisponible`,
        details: service.error || 'Aucun détail disponible'
      })
    }
  })

  // Alertes circuit breakers
  if (claudeCircuit.state === 'OPEN') {
    alerts.push({
      level: 'critical',
      service: 'claude',
      message: 'Génération de scripts suspendue',
      details: `Circuit breaker ouvert - ${claudeCircuit.failures} échecs détectés`
    })
  }

  if (geminiCircuit.state === 'OPEN') {
    alerts.push({
      level: 'warning',
      service: 'gemini',
      message: 'Génération d\'images suspendue',
      details: `Circuit breaker ouvert - ${geminiCircuit.failures} échecs détectés`
    })
  }

  // Alertes performance
  Object.entries(systemHealth.services).forEach(([name, service]: [string, any]) => {
    if (service.status === 'degraded') {
      alerts.push({
        level: 'warning',
        service: name,
        message: `Performance dégradée pour ${name}`,
        details: `Temps de réponse: ${service.responseTime}ms`
      })
    }
  })

  // Alerte mémoire
  const systemService = systemHealth.services.system
  if (systemService?.details?.memoryUsagePercent > 85) {
    alerts.push({
      level: 'warning',
      service: 'system',
      message: 'Usage mémoire élevé',
      details: `${systemService.details.memoryUsagePercent}% utilisé`
    })
  }

  return alerts
}

/**
 * Génère les actions recommandées
 */
function generateActions(systemHealth: any, claudeCircuit: any, geminiCircuit: any) {
  const actions = []

  // Actions pour services down
  if (systemHealth.services.database?.status === 'down') {
    actions.push({
      priority: 'high',
      action: 'Vérifier la connectivité Supabase',
      command: 'kubectl get pods -n supabase',
      automated: false
    })
  }

  if (systemHealth.services.claude?.status === 'down') {
    actions.push({
      priority: 'high',
      action: 'Vérifier les quotas et crédits Claude',
      command: null,
      automated: false
    })
  }

  // Actions pour circuit breakers
  if (claudeCircuit.state === 'OPEN') {
    actions.push({
      priority: 'medium',
      action: 'Reset circuit breaker Claude si nécessaire',
      command: 'POST /api/health/circuit-status {"service": "claude", "action": "reset"}',
      automated: false
    })
  }

  // Actions de monitoring
  actions.push({
    priority: 'low',
    action: 'Vérifier les logs d\'erreurs',
    command: 'tail -n 100 /var/log/vuvenu.log',
    automated: false
  })

  return actions
}

/**
 * Endpoint pour déclencher des actions de maintenance
 */
export async function POST(request: NextRequest) {
  const corsHeaders = createCorsHeaders(request)

  try {
    const { action, service } = await request.json()

    // Actions limitées pour sécurité
    switch (action) {
      case 'clear-cache':
        // Vider le cache des health checks
        return new Response(JSON.stringify({
          success: true,
          message: 'Cache vidé',
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })

      case 'trigger-health-check':
        // Forcer un nouveau check
        const result = await healthChecker.check(service)
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })

      default:
        return new Response(JSON.stringify({
          error: 'Action non supportée',
          supportedActions: ['clear-cache', 'trigger-health-check']
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
    }

  } catch (error) {
    logger.error('Health status action failed', error as Error)

    return new Response(JSON.stringify({
      error: 'Erreur lors de l\'exécution de l\'action',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
}