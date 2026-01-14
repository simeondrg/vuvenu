'use client'

import { useState } from 'react'
import { useWebVitalsSummary } from '@/hooks/use-web-vitals'

interface PerformanceMonitorProps {
  /**
   * Affichage compact ou détaillé
   */
  compact?: boolean
  /**
   * Position de l'indicateur
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * Moniteur de performance en temps réel
 * Affiche les Core Web Vitals actuelles de la page
 * Utile pour le développement et les tests de performance
 */
export function PerformanceMonitor({
  compact = false,
  position = 'bottom-right'
}: PerformanceMonitorProps) {
  const { metrics, overallRating, hasData } = useWebVitalsSummary()
  const [isExpanded, setIsExpanded] = useState(false)

  // N'afficher qu'en développement par défaut
  if (process.env.NODE_ENV === 'production' && !window.location.search.includes('debug=performance')) {
    return null
  }

  if (!hasData) {
    return (
      <div className={`fixed z-50 ${getPositionClasses(position)} bg-gray-900 text-white p-2 rounded-lg shadow-lg`}>
        <div className="text-xs">⏱️ Measuring...</div>
      </div>
    )
  }

  const ratingEmoji = {
    good: '✅',
    'needs-improvement': '⚠️',
    poor: '❌'
  }

  const ratingColor = {
    good: 'bg-green-500',
    'needs-improvement': 'bg-yellow-500',
    poor: 'bg-red-500'
  }

  if (compact && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed z-50 ${getPositionClasses(position)} ${ratingColor[overallRating]} text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform`}
        title="Voir les métriques de performance"
      >
        <span className="text-sm">{ratingEmoji[overallRating]}</span>
      </button>
    )
  }

  return (
    <div className={`fixed z-50 ${getPositionClasses(position)} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 min-w-[280px]`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span>{ratingEmoji[overallRating]}</span>
          Core Web Vitals
        </h3>
        {compact && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-2">
        {Object.entries(metrics).map(([name, metric]) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs">{ratingEmoji[metric.rating]}</span>
              <span className="font-mono text-xs font-medium">{name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">
                {formatMetricValue(name as any, metric.value)}
              </span>
              <div className={`w-2 h-2 rounded-full ${ratingColor[metric.rating]}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 space-y-1">
          <div>🎯 LCP: {metrics.LCP ? (metrics.LCP.value <= 2500 ? 'Target achieved!' : 'Needs optimization') : 'Measuring...'}</div>
          <div className="font-mono">Overall: {overallRating}</div>
        </div>
      </div>
    </div>
  )
}

function getPositionClasses(position: PerformanceMonitorProps['position']) {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4'
    case 'top-right':
      return 'top-4 right-4'
    case 'bottom-left':
      return 'bottom-4 left-4'
    case 'bottom-right':
      return 'bottom-4 right-4'
    default:
      return 'bottom-4 right-4'
  }
}

function formatMetricValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3)
    case 'FID':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
    case 'INP':
      return `${value.toFixed(0)}ms`
    default:
      return value.toFixed(2)
  }
}

/**
 * Badge simple de performance pour affichage discret
 */
export function PerformanceBadge() {
  const { overallRating, hasData } = useWebVitalsSummary()

  if (process.env.NODE_ENV === 'production' || !hasData) {
    return null
  }

  const ratingEmoji = {
    good: '✅',
    'needs-improvement': '⚠️',
    poor: '❌'
  }

  return (
    <div className="fixed bottom-2 left-2 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
      {ratingEmoji[overallRating]} Perf
    </div>
  )
}

/**
 * Hook pour déclencher des optimisations basées sur les métriques
 */
export function usePerformanceOptimizations() {
  const { metrics } = useWebVitalsSummary()

  // Si LCP > 2.5s, suggérer des optimisations
  const needsLCPOptimization = metrics.LCP && metrics.LCP.value > 2500

  // Si CLS > 0.1, suggérer des corrections de layout
  const needsCLSOptimization = metrics.CLS && metrics.CLS.value > 0.1

  // Si FID > 100ms, suggérer des optimisations JavaScript
  const needsFIDOptimization = metrics.FID && metrics.FID.value > 100

  return {
    suggestions: {
      lcp: needsLCPOptimization ? [
        'Preload critical images',
        'Optimize image formats (WebP/AVIF)',
        'Use next/image with priority',
        'Reduce server response time'
      ] : [],
      cls: needsCLSOptimization ? [
        'Set explicit dimensions on images',
        'Use aspect-ratio-box utility',
        'Avoid inserting content above existing content',
        'Preload custom fonts'
      ] : [],
      fid: needsFIDOptimization ? [
        'Reduce JavaScript bundle size',
        'Use code splitting',
        'Defer non-critical JavaScript',
        'Optimize third-party scripts'
      ] : []
    },
    needsOptimization: needsLCPOptimization || needsCLSOptimization || needsFIDOptimization
  }
}