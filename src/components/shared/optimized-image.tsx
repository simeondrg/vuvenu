'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /**
   * Indicateur si c'est l'image LCP (Largest Contentful Paint)
   * Active le preload automatique et la priorité haute
   */
  isLCP?: boolean
  /**
   * Classe CSS appliquée pendant le chargement
   */
  loadingClassName?: string
  /**
   * Classe CSS appliquée quand l'image est chargée
   */
  loadedClassName?: string
  /**
   * Callback appelé quand l'image est entièrement chargée
   */
  onLoadComplete?: () => void
  /**
   * Fallback en cas d'erreur de chargement
   */
  fallback?: React.ReactNode
}

/**
 * Composant d'image optimisé pour les performances Web Vitals
 *
 * Fonctionnalités :
 * - Preload automatique pour les images LCP
 * - Lazy loading pour les autres images
 * - Transitions fluides de chargement
 * - Gestion d'erreurs avec fallback
 * - Optimisations format (WebP/AVIF automatiques)
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/hero-image.jpg"
 *   alt="Description"
 *   width={1200}
 *   height={600}
 *   isLCP={true}
 *   className="rounded-lg"
 * />
 * ```
 */
export function OptimizedImage({
  isLCP = false,
  loadingClassName = 'opacity-0 scale-105',
  loadedClassName = 'opacity-100 scale-100',
  className,
  onLoadComplete,
  fallback,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoadComplete?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Si erreur et fallback disponible
  if (hasError && fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="relative overflow-hidden">
      <Image
        {...props}
        className={cn(
          // Transition fluide entre les états
          'transition-all duration-700 ease-out',
          // État de chargement vs chargé
          isLoading ? loadingClassName : loadedClassName,
          // Classes personnalisées
          className
        )}
        // Optimisations de performance
        priority={isLCP}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        // Optimisation du loading
        loading={isLCP ? 'eager' : 'lazy'}
        // Gestion des événements
        onLoad={handleLoad}
        onError={handleError}
        // Optimisations supplémentaires
        decoding="async"
        fetchPriority={isLCP ? 'high' : 'auto'}
      />

      {/* Indicator de chargement optionnel */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="w-8 h-8 border-2 border-vuvenu-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

/**
 * Composant d'image hero optimisé spécialement pour les pages d'accueil
 * Préconfiguré pour être l'élément LCP avec les meilleures optimisations
 */
export function HeroImage({ className, ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      isLCP={true}
      className={cn('w-full h-auto', className)}
      loadingClassName="opacity-0 scale-110 blur-sm"
      loadedClassName="opacity-100 scale-100 blur-0"
    />
  )
}

/**
 * Hook pour détecter si une image doit être prioritaire
 * Basé sur la position dans le viewport et l'importance
 */
export function useImagePriority(elementRef: React.RefObject<HTMLElement>) {
  const [isPriority, setIsPriority] = useState(false)

  useState(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsPriority(true)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  })

  return isPriority
}