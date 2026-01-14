/**
 * Fonctions utilitaires pour VuVenu
 *
 * Collection d'helpers partagés dans l'application
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// =============================================
// STYLE UTILITIES
// =============================================

/**
 * Combine et merge les classes CSS avec Tailwind
 *
 * Utilise clsx pour la logique conditionnelle et twMerge
 * pour éviter les conflits de classes Tailwind
 *
 * @param inputs - Classes CSS à combiner
 * @returns string - Classes CSS finales
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =============================================
// STRING UTILITIES
// =============================================

/**
 * Capitalise la première lettre d'une chaîne
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Tronque un texte avec des points de suspension
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

// =============================================
// NUMBER UTILITIES
// =============================================

/**
 * Formate un prix en euros
 */
export function formatPrice(price: number, showCurrency = true): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)

  return formatted
}

// =============================================
// DATE UTILITIES
// =============================================

/**
 * Formate une date en format français
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const finalOptions = { ...defaultOptions, ...options }
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('fr-FR', finalOptions).format(dateObj)
}

/**
 * Calcule le temps écoulé depuis une date (relative)
 */
export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }
  if (diffInHours > 0) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
  }
  if (diffInMinutes > 0) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
  }
  return 'à l\'instant'
}
