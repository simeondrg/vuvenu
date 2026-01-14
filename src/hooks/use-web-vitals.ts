'use client'

import { useEffect, useRef } from 'react'

interface WebVitalsMetric {
  id: string
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: PerformanceEntry[]
}

interface WebVitalsOptions {
  /**
   * URL pour envoyer les métriques (optionnel)
   * Si non fourni, les métriques sont seulement loggées en console
   */
  reportingUrl?: string
  /**
   * Callback appelé à chaque métrique collectée
   */
  onMetric?: (metric: WebVitalsMetric) => void
  /**
   * Active le logging en console (utile pour le debug)
   */
  debug?: boolean
  /**
   * Seuils personnalisés pour les ratings
   */
  thresholds?: {
    [key in WebVitalsMetric['name']]?: {
      good: number
      poor: number
    }
  }
}

// Seuils par défaut selon les recommandations Google
const DEFAULT_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

/**
 * Hook pour mesurer et rapporter les Core Web Vitals
 *
 * Collecte automatiquement les métriques de performance critiques :
 * - LCP (Largest Contentful Paint) - Objectif : < 2.5s
 * - FID (First Input Delay) - Objectif : < 100ms
 * - CLS (Cumulative Layout Shift) - Objectif : < 0.1
 * - FCP (First Contentful Paint) - Objectif : < 1.8s
 * - TTFB (Time to First Byte) - Objectif : < 800ms
 * - INP (Interaction to Next Paint) - Objectif : < 200ms
 *
 * @param options Configuration pour le reporting et les seuils
 *
 * @example
 * ```tsx
 * function App() {
 *   useWebVitals({
 *     debug: process.env.NODE_ENV === 'development',
 *     onMetric: (metric) => {
 *       // Envoyer à votre service d'analytics
 *       analytics.track('web_vital', {
 *         name: metric.name,
 *         value: metric.value,
 *         rating: metric.rating
 *       })
 *     }
 *   })
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useWebVitals(options: WebVitalsOptions = {}) {
  const { reportingUrl, onMetric, debug = false, thresholds = {} } = options
  const sentMetrics = useRef(new Set<string>())

  useEffect(() => {
    // Vérifier si l'API Performance est disponible
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      if (debug) console.warn('Performance Observer API not available')
      return
    }

    // Fonction pour calculer le rating d'une métrique
    const getRating = (name: WebVitalsMetric['name'], value: number): WebVitalsMetric['rating'] => {
      const threshold = { ...DEFAULT_THRESHOLDS[name], ...thresholds[name] }
      if (value <= threshold.good) return 'good'
      if (value <= threshold.poor) return 'needs-improvement'
      return 'poor'
    }

    // Fonction pour traiter une métrique
    const handleMetric = (metric: Partial<WebVitalsMetric>) => {
      if (!metric.name || !metric.value) return

      // Éviter les doublons
      const metricKey = `${metric.name}-${metric.value}`
      if (sentMetrics.current.has(metricKey)) return
      sentMetrics.current.add(metricKey)

      const processedMetric: WebVitalsMetric = {
        id: metric.id || `${metric.name}-${Date.now()}`,
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        delta: metric.delta || 0,
        entries: metric.entries || [],
      }

      // Debug logging
      if (debug) {
        const emoji = processedMetric.rating === 'good' ? '✅' : processedMetric.rating === 'needs-improvement' ? '⚠️' : '❌'
        console.log(`${emoji} ${processedMetric.name}: ${processedMetric.value.toFixed(2)}ms (${processedMetric.rating})`)
      }

      // Callback utilisateur
      onMetric?.(processedMetric)

      // Reporting automatique
      if (reportingUrl) {
        fetch(reportingUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedMetric),
        }).catch((err) => {
          if (debug) console.error('Failed to send metric:', err)
        })
      }
    }

    // Observer pour LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime: number; loadTime: number }
      if (lastEntry) {
        handleMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          entries: [lastEntry],
        })
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    // Observer pour FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEntry & { processingStart: number }
          handleMetric({
            name: 'FID',
            value: fidEntry.processingStart - entry.startTime,
            entries: [entry],
          })
        }
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })

    // Observer pour CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'layout-shift') {
          const layoutEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value
          }
        }
      })
      handleMetric({
        name: 'CLS',
        value: clsValue,
        entries: entries,
      })
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // Observer pour FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          handleMetric({
            name: 'FCP',
            value: entry.startTime,
            entries: [entry],
          })
        }
      })
    })
    fcpObserver.observe({ type: 'paint', buffered: true })

    // Mesure TTFB via Navigation Timing
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        handleMetric({
          name: 'TTFB',
          value: navigation.responseStart - navigation.requestStart,
          entries: [navigation],
        })
      }
    }

    // Observer pour INP (Interaction to Next Paint) - Remplaçant de FID
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const interactionEntry = entry as PerformanceEntry & { duration: number }
        handleMetric({
          name: 'INP',
          value: interactionEntry.duration,
          entries: [entry],
        })
      })
    })

    // INP n'est pas encore dans tous les navigateurs
    try {
      inpObserver.observe({ type: 'event', buffered: true })
    } catch (e) {
      if (debug) console.warn('INP measurement not supported')
    }

    // Mesurer TTFB immédiatement si possible
    if (document.readyState === 'complete') {
      measureTTFB()
    } else {
      window.addEventListener('load', measureTTFB)
    }

    // Cleanup
    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      fcpObserver.disconnect()
      inpObserver.disconnect()
      window.removeEventListener('load', measureTTFB)
    }
  }, [reportingUrl, onMetric, debug, thresholds])
}

/**
 * Hook pour obtenir un résumé des performances en temps réel
 * Utile pour l'affichage dans l'interface utilisateur
 */
export function useWebVitalsSummary() {
  const vitals = useRef<Record<string, WebVitalsMetric>>({})

  useWebVitals({
    debug: process.env.NODE_ENV === 'development',
    onMetric: (metric) => {
      vitals.current[metric.name] = metric
    },
  })

  const getOverallRating = (): WebVitalsMetric['rating'] => {
    const metrics = Object.values(vitals.current)
    if (metrics.length === 0) return 'good'

    const poorCount = metrics.filter((m) => m.rating === 'poor').length
    const needsImprovementCount = metrics.filter((m) => m.rating === 'needs-improvement').length

    if (poorCount > 0) return 'poor'
    if (needsImprovementCount > 0) return 'needs-improvement'
    return 'good'
  }

  return {
    metrics: vitals.current,
    overallRating: getOverallRating(),
    hasData: Object.keys(vitals.current).length > 0,
  }
}