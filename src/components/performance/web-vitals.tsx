'use client'

import { useEffect } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'

// Types pour les métriques Web Vitals
type MetricName = 'CLS' | 'INP' | 'FCP' | 'LCP' | 'TTFB'

interface VitalMetric {
  id: string
  name: MetricName
  value: number
  delta?: number
  navigationType?: string
}

// Configuration des seuils pour chaque métrique
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, needs_improvement: 0.25 },
  INP: { good: 200, needs_improvement: 500 },
  FCP: { good: 1800, needs_improvement: 3000 },
  LCP: { good: 2500, needs_improvement: 4000 },
  TTFB: { good: 800, needs_improvement: 1800 },
}

// Fonction pour envoyer les métriques à un service d'analytics
function sendToAnalytics(metric: VitalMetric) {
  // En production, envoyer vers Google Analytics, Vercel Analytics, etc.
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', metric)
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_parameter_1: getVitalRating(metric),
    })
  }

  // Vercel Analytics (si configuré)
  if (typeof window !== 'undefined' && 'va' in window) {
    (window as any).va('track', 'Web Vital', {
      name: metric.name,
      value: metric.value,
      rating: getVitalRating(metric),
      id: metric.id,
    })
  }
}

// Fonction pour déterminer la note d'une métrique
function getVitalRating(metric: VitalMetric): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = VITALS_THRESHOLDS[metric.name]

  if (metric.value <= thresholds.good) return 'good'
  if (metric.value <= thresholds.needs_improvement) return 'needs-improvement'
  return 'poor'
}

// Helper pour convertir Metric en VitalMetric
function createMetricHandler(name: MetricName) {
  return (metric: Metric) => {
    sendToAnalytics({
      id: metric.id || '',
      name,
      value: metric.value || 0,
      delta: metric.delta,
      navigationType: (metric as any).navigationType
    })
  }
}

// Hook pour mesurer les Web Vitals
export function useWebVitals() {
  useEffect(() => {
    // Mesurer toutes les métriques Core Web Vitals
    onCLS(createMetricHandler('CLS'))
    onINP(createMetricHandler('INP'))
    onFCP(createMetricHandler('FCP'))
    onLCP(createMetricHandler('LCP'))
    onTTFB(createMetricHandler('TTFB'))
  }, [])
}

// Composant pour afficher les métriques en développement
export function WebVitalsDebugger() {
  useWebVitals()

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="text-vuvenu-lime font-semibold mb-2">📊 Web Vitals</div>
      <div className="space-y-1">
        <div>LCP: Largest Contentful Paint</div>
        <div>INP: Interaction to Next Paint</div>
        <div>CLS: Cumulative Layout Shift</div>
        <div>FCP: First Contentful Paint</div>
        <div>TTFB: Time to First Byte</div>
      </div>
    </div>
  )
}

// Hook pour optimiser les performances selon la connexion
export function useNetworkOptimization() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Détecter le type de connexion
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      const { effectiveType, saveData } = connection

      // Adapter les performances selon la connexion
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || saveData) {
        // Connexion lente - optimisations agressives
        document.documentElement.classList.add('low-bandwidth')

        // Désactiver les animations non-critiques
        document.documentElement.style.setProperty('--animation-duration', '0ms')

        // Réduire la qualité des images
        const images = document.querySelectorAll('img')
        images.forEach(img => {
          if (img.dataset.lowBandwidth) {
            img.src = img.dataset.lowBandwidth
          }
        })
      }
    }

    // Précharger les ressources critiques avec requestIdleCallback
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Précharger les pages critiques
        const criticalPages = ['/dashboard', '/scripts/new']

        criticalPages.forEach(page => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = page
          document.head.appendChild(link)
        })
      })
    }
  }, [])
}

// Composant pour optimiser le chargement des images
export function ImageOptimizer({
  src,
  alt,
  width,
  height,
  priority = false,
  className = ''
}: {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}) {
  useEffect(() => {
    // Précharger les images critiques
    if (priority) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }
  }, [src, priority])

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        aspectRatio: `${width}/${height}`,
        objectFit: 'cover'
      }}
    />
  )
}

// Hook pour optimiser les polices
export function useFontOptimization() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Précharger les polices critiques
    const fontFaceObserver = new Promise((resolve) => {
      if ('fonts' in document) {
        Promise.all([
          (document as any).fonts.load('400 16px Inter'),
          (document as any).fonts.load('600 16px Inter'),
          (document as any).fonts.load('700 16px Inter'),
        ]).then(resolve)
      } else {
        // Fallback pour les navigateurs anciens
        setTimeout(resolve, 3000)
      }
    })

    fontFaceObserver.then(() => {
      document.documentElement.classList.add('fonts-loaded')
    })
  }, [])
}

// Composant pour injecter les optimisations critiques
export function CriticalResourceHints() {
  return (
    <>
      {/* DNS prefetch pour les domaines externes critiques */}
      <link rel="dns-prefetch" href="//api.anthropic.com" />
      <link rel="dns-prefetch" href="//api.stripe.com" />
      <link rel="dns-prefetch" href="//js.stripe.com" />

      {/* Preconnect pour les ressources critiques */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      {/* Resource hints pour les API critiques */}
      <link rel="preload" href="/api/auth/user" as="fetch" crossOrigin="anonymous" />

      {/* Optimisations pour les Core Web Vitals */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Optimisation CLS - éviter les layout shifts
            (function() {
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.tagName === 'IMG' && !node.width && !node.height) {
                        console.warn('Image sans dimensions détectée, peut causer un CLS:', node.src);
                      }
                    });
                  }
                });
              });

              observer.observe(document.body, {
                childList: true,
                subtree: true
              });

              // Auto-cleanup après 10 secondes
              setTimeout(() => observer.disconnect(), 10000);
            })();
          `,
        }}
      />
    </>
  )
}