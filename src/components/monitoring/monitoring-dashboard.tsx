'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface ServiceStatus {
  health: {
    status: 'healthy' | 'degraded' | 'down'
    responseTime: number
    lastCheck: string
    error?: string
  }
  circuit?: {
    state: 'CLOSED' | 'HALF_OPEN' | 'OPEN'
    failures: number
  }
  critical: boolean
}

interface MonitoringData {
  status: 'healthy' | 'degraded' | 'down'
  timestamp: string
  services: Record<string, ServiceStatus>
  alerts: Array<{
    level: 'critical' | 'warning' | 'info'
    service: string
    message: string
    details: string
  }>
  metrics: {
    responseTime: number
    uptime: number
    memoryUsage: any
  }
}

/**
 * Dashboard de monitoring pour VuVenu
 * Affiche l'état en temps réel de tous les services
 */
export function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)

  // Récupération des données
  const fetchMonitoringData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/health/status')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const monitoringData = await response.json()
      setData(monitoringData)
      setError(null)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
      console.error('Failed to fetch monitoring data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Rafraîchissement automatique toutes les 30s
  useEffect(() => {
    fetchMonitoringData()
    const interval = setInterval(fetchMonitoringData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !data) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-lg">Chargement du monitoring...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Erreur de monitoring
          </h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchMonitoringData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header avec status global */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Monitoring VuVenu</h2>
          <button
            onClick={fetchMonitoringData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard
            title="État Global"
            status={data.status}
            icon={getStatusIcon(data.status)}
          />
          <MetricCard
            title="Temps de Réponse"
            value={`${data.metrics.responseTime}ms`}
            good={data.metrics.responseTime < 500}
          />
          <MetricCard
            title="Uptime"
            value={formatUptime(data.metrics.uptime)}
            good={true}
          />
          <MetricCard
            title="Mémoire"
            value={`${Math.round(data.metrics.memoryUsage.heapUsed / 1024 / 1024)}MB`}
            good={data.metrics.memoryUsage.heapUsed < 500 * 1024 * 1024}
          />
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Dernière mise à jour : {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Alertes */}
      {data.alerts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Alertes Actives ({data.alerts.length})
          </h3>
          <div className="space-y-3">
            {data.alerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">État des Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.services).map(([name, service]) => (
            <ServiceCard key={name} name={name} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusCard({ title, status, icon }: {
  title: string
  status: 'healthy' | 'degraded' | 'down'
  icon: React.ReactNode
}) {
  const bgColor = status === 'healthy' ? 'bg-green-50 dark:bg-green-900/20'
                 : status === 'degraded' ? 'bg-yellow-50 dark:bg-yellow-900/20'
                 : 'bg-red-50 dark:bg-red-900/20'

  const borderColor = status === 'healthy' ? 'border-green-200 dark:border-green-800'
                    : status === 'degraded' ? 'border-yellow-200 dark:border-yellow-800'
                    : 'border-red-200 dark:border-red-800'

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="font-medium text-sm text-gray-600 dark:text-gray-300">{title}</div>
          <div className="capitalize font-semibold">{status}</div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, good }: {
  title: string
  value: string
  good: boolean
}) {
  return (
    <div className={`p-4 rounded-lg border ${
      good
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    }`}>
      <div className="font-medium text-sm text-gray-600 dark:text-gray-300">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function AlertCard({ alert }: {
  alert: { level: string; service: string; message: string; details: string }
}) {
  const levelColors = {
    critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
  }

  return (
    <div className={`p-4 rounded-lg border ${levelColors[alert.level as keyof typeof levelColors]}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{alert.service}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
              ${alert.level === 'critical' ? 'bg-red-600 text-white'
                : alert.level === 'warning' ? 'bg-yellow-600 text-white'
                : 'bg-blue-600 text-white'}`}>
              {alert.level}
            </span>
          </div>
          <div className="font-medium mb-1">{alert.message}</div>
          <div className="text-sm opacity-75">{alert.details}</div>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ name, service }: { name: string; service: ServiceStatus }) {
  const status = service.health.status
  const statusIcon = getStatusIcon(status)

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium capitalize">{name}</h4>
        {service.critical && (
          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded">
            Critique
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        {statusIcon}
        <span className="capitalize text-sm font-medium">{status}</span>
        {service.circuit && (
          <span className={`px-2 py-0.5 rounded text-xs ${
            service.circuit.state === 'CLOSED' ? 'bg-green-100 text-green-800'
            : service.circuit.state === 'HALF_OPEN' ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
          }`}>
            {service.circuit.state}
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <div>⏱️ {service.health.responseTime}ms</div>
        <div>🕐 {new Date(service.health.lastCheck).toLocaleTimeString()}</div>
        {service.circuit && service.circuit.failures > 0 && (
          <div>❌ {service.circuit.failures} échecs</div>
        )}
        {service.health.error && (
          <div className="text-red-600 truncate" title={service.health.error}>
            ⚠️ {service.health.error}
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusIcon(status: 'healthy' | 'degraded' | 'down') {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'degraded':
      return <Clock className="w-5 h-5 text-yellow-500" />
    case 'down':
      return <XCircle className="w-5 h-5 text-red-500" />
    default:
      return null
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) return `${days}j ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}