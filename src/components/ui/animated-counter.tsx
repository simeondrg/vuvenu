'use client'

import { useState, useEffect } from 'react'

interface AnimatedCounterProps {
  value: number | string
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className = '',
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    // Si la valeur n'est pas numérique, l'afficher directement
    if (typeof value === 'string' && isNaN(Number(value))) {
      return
    }

    const numericValue = typeof value === 'string' ? parseInt(value) : value
    const startTime = Date.now()
    const startValue = displayValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Fonction d'easing pour une animation fluide
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.round(startValue + (numericValue - startValue) * easeOutQuart)

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, displayValue])

  // Si c'est une string non-numérique (comme "∞"), l'afficher avec animation d'opacité
  if (typeof value === 'string' && isNaN(Number(value))) {
    return (
      <span className={`inline-block transition-all duration-500 ease-out ${className}`}>
        {prefix}
        <span className="animate-pulse">{value}</span>
        {suffix}
      </span>
    )
  }

  return (
    <span className={`inline-block tabular-nums transition-all duration-300 ease-out ${className}`}>
      {prefix}
      <span className="relative">
        {displayValue}
        <span className="absolute inset-0 bg-gradient-to-r from-vuvenu-lime to-vuvenu-blue bg-clip-text text-transparent opacity-0 animate-pulse">
          {displayValue}
        </span>
      </span>
      {suffix}
    </span>
  )
}

// Composant pour afficher les pourcentages avec animation de progression
interface AnimatedProgressProps {
  percentage: number
  className?: string
  showValue?: boolean
  color?: 'green' | 'yellow' | 'red' | 'blue'
}

export function AnimatedProgress({
  percentage,
  className = '',
  showValue = true,
  color = 'blue'
}: AnimatedProgressProps) {
  const [currentPercentage, setCurrentPercentage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPercentage(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [percentage])

  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'bg-green-500'
      case 'yellow': return 'bg-yellow-500'
      case 'red': return 'bg-red-500'
      default: return 'bg-vuvenu-blue'
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showValue && (
        <div className="flex justify-between text-sm">
          <span>Progression</span>
          <AnimatedCounter value={percentage} suffix="%" />
        </div>
      )}
      <div className="w-full bg-vuvenu-rose/30 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${getColorClasses()}`}
          style={{
            width: `${currentPercentage}%`,
            transform: 'translateX(0)',
          }}
        />
      </div>
    </div>
  )
}

// Hook pour animer l'apparition des éléments au scroll
export function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const [element, setElement] = useState<Element | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element])

  return { isVisible, setElement }
}