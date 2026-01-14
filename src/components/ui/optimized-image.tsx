import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Génère un placeholder blur basique si pas fourni
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#FFFBEB' // Couleur vuvenu-cream
      ctx.fillRect(0, 0, w, h)
    }
    return canvas.toDataURL()
  }

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(width, height)

  // Si erreur, afficher un placeholder
  if (hasError) {
    return (
      <div
        className={`bg-vuvenu-cream border-2 border-dashed border-vuvenu-rose/40 rounded-lg flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <div className="text-center text-vuvenu-dark/60">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Image indisponible</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton de chargement */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-vuvenu-rose/20 via-vuvenu-lime/20 to-vuvenu-rose/20 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        sizes={sizes || (fill ? '100vw' : `${width}px`)}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${fill ? 'object-cover' : ''}`}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}

// Hook pour précharger les images importantes
export function useImagePreloader(imageSources: string[]) {
  useState(() => {
    if (typeof window !== 'undefined') {
      imageSources.forEach((src) => {
        const img = new window.Image()
        img.src = src
      })
    }
  })
}

// Composant pour le hero avec optimisation critique
export function HeroImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority={true}
      quality={90}
      placeholder="blur"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
    />
  )
}

// Composant pour les avatars avec cache optimisé
export function Avatar({
  src,
  alt,
  size = 48,
  className = '',
}: {
  src: string
  alt: string
  size?: number
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={80}
      placeholder="blur"
      className={`rounded-full ${className}`}
    />
  )
}