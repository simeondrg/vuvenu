'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react'
import { createUserFriendlyError, formatErrorForDisplay, type UserFriendlyError } from '@/lib/error-handler'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

export interface ToastData {
  id: string
  type: ToastType
  title: string
  message: string
  action?: string
  code?: string
  helpUrl?: string
  duration?: number
  persistent?: boolean
}

interface ErrorToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

/**
 * Composant Toast individuel pour afficher les erreurs/notifications
 */
export function ErrorToast({ toast, onDismiss }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Auto-dismiss après la durée spécifiée
  useEffect(() => {
    if (!toast.persistent && toast.duration) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.persistent])

  const handleDismiss = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onDismiss(toast.id)
    }, 300) // Durée de l'animation de sortie
  }

  const getToastIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0"

    switch (toast.type) {
      case 'error':
        return <AlertTriangle className={`${iconClass} text-red-500`} />
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />
      default:
        return <Info className={`${iconClass} text-gray-500`} />
    }
  }

  const getToastColors = () => {
    switch (toast.type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isRemoving ? 'translate-x-full opacity-0' : ''}
      `}
    >
      <div className={`
        max-w-md w-full rounded-lg border p-4 shadow-lg backdrop-blur-sm
        ${getToastColors()}
      `}>
        <div className="flex items-start gap-3">
          {getToastIcon()}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold leading-tight">
                {toast.title}
              </h4>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm mt-1 leading-relaxed">
              {toast.message}
            </p>

            {toast.action && (
              <div className="mt-2 text-xs bg-white/50 rounded px-2 py-1">
                <strong>💡 Action :</strong> {toast.action}
              </div>
            )}

            {/* Code d'erreur et aide */}
            {toast.code && (
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-mono text-gray-600">
                  Code: {toast.code}
                </span>

                {toast.helpUrl && (
                  <a
                    href={toast.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Aide →
                  </a>
                )}
              </div>
            )}

            {/* Indicateur de durée pour les toasts temporaires */}
            {!toast.persistent && toast.duration && (
              <div className="mt-2">
                <div className="w-full bg-white/30 rounded-full h-1">
                  <div
                    className="bg-current h-1 rounded-full transition-all ease-linear"
                    style={{
                      animation: `shrink ${toast.duration}ms linear forwards`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

/**
 * Conteneur pour les toasts (positionnement fixe)
 */
interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function ToastContainer({
  toasts,
  onDismiss,
  position = 'top-right'
}: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      default:
        return 'top-4 right-4'
    }
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-[9999] pointer-events-none`}>
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ErrorToast
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Hooks pour gérer les toasts
 */
export function useErrorToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  // Ajouter un toast
  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? (toast.type === 'error' ? 8000 : 5000)
    }

    setToasts(prev => [...prev, newToast])

    // Limiter à 5 toasts max
    setToasts(prev => prev.slice(-5))
  }

  // Supprimer un toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Méthodes de convenance
  const showError = (error: unknown, context?: string) => {
    const userFriendlyError = createUserFriendlyError(error, context)
    const formattedError = formatErrorForDisplay(userFriendlyError)

    addToast({
      type: 'error',
      title: formattedError.title,
      message: formattedError.message,
      action: formattedError.action,
      code: userFriendlyError.code,
      helpUrl: userFriendlyError.helpUrl,
      persistent: true // Erreurs persistantes jusqu'à dismiss manuel
    })
  }

  const showSuccess = (title: string, message: string) => {
    addToast({
      type: 'success',
      title,
      message
    })
  }

  const showWarning = (title: string, message: string, action?: string) => {
    addToast({
      type: 'warning',
      title,
      message,
      action
    })
  }

  const showInfo = (title: string, message: string) => {
    addToast({
      type: 'info',
      title,
      message
    })
  }

  // Vider tous les toasts
  const clearAll = () => {
    setToasts([])
  }

  return {
    toasts,
    addToast,
    removeToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    clearAll
  }
}

/**
 * Provider pour les toasts au niveau global
 */
export function ErrorToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useErrorToasts()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  )
}