'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  loading: (title: string, description?: string) => string
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2)
    const newNotification = { ...notification, id }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove après la durée spécifiée (sauf pour les loading)
    if (notification.type !== 'loading') {
      const duration = notification.duration || 5000
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Helpers pour différents types
  const success = useCallback((title: string, description?: string) => {
    addNotification({ type: 'success', title, description })
  }, [addNotification])

  const error = useCallback((title: string, description?: string) => {
    addNotification({ type: 'error', title, description, duration: 7000 })
  }, [addNotification])

  const warning = useCallback((title: string, description?: string) => {
    addNotification({ type: 'warning', title, description })
  }, [addNotification])

  const info = useCallback((title: string, description?: string) => {
    addNotification({ type: 'info', title, description })
  }, [addNotification])

  const loading = useCallback((title: string, description?: string) => {
    return addNotification({ type: 'loading', title, description }) as string
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
        loading,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const { notifications } = useNotifications()

  if (typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>,
    document.body
  )
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications()

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      case 'loading': return '⏳'
      default: return 'ℹ️'
    }
  }

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'loading': return 'bg-vuvenu-lime/10 border-vuvenu-lime/30 text-vuvenu-dark'
      default: return 'bg-white border-gray-200 text-gray-800'
    }
  }

  return (
    <div
      className={`
        relative p-4 rounded-xl border shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-out
        animate-in slide-in-from-right-full
        ${getColorClasses()}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <span className="text-lg">{getIcon()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{notification.title}</div>
          {notification.description && (
            <div className="text-xs opacity-80 mt-1">{notification.description}</div>
          )}

          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-xs underline mt-2 hover:no-underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {notification.type !== 'loading' && (
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-xs opacity-50 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>

      {/* Animation de loading */}
      {notification.type === 'loading' && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-vuvenu-lime animate-pulse w-full"></div>
      )}
    </div>
  )
}

// Hook utilitaire pour les notifications de succès/erreur d'API
export function useApiNotifications() {
  const { success, error, loading, removeNotification } = useNotifications()

  const handleAsyncOperation = useCallback(async <T,>(
    operation: () => Promise<T>,
    {
      loadingMessage = 'Chargement...',
      successMessage = 'Opération réussie',
      errorMessage = 'Une erreur est survenue'
    }: {
      loadingMessage?: string
      successMessage?: string
      errorMessage?: string
    } = {}
  ): Promise<T> => {
    const loadingId = loading(loadingMessage)

    try {
      const result = await operation()
      removeNotification(loadingId)
      success(successMessage)
      return result
    } catch (err) {
      removeNotification(loadingId)
      error(errorMessage, err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    }
  }, [success, error, loading, removeNotification])

  return { handleAsyncOperation }
}

// Composants utilitaires pour notifications spécifiques à VuVenu
export function useVuVenuNotifications() {
  const { success, error, info } = useNotifications()

  return {
    scriptGenerated: () => success('Script généré ! 🎬', 'Votre script viral est prêt'),
    campaignCreated: () => success('Campagne créée ! 🚀', 'Votre campagne Meta Ads a été générée'),
    planUpgraded: () => success('Plan mis à niveau ! ⭐', 'Profitez de toutes les nouvelles fonctionnalités'),
    limitReached: () => error('Limite atteinte', 'Passez à un plan supérieur pour continuer'),
    welcomeUser: (name: string) => info(`Bienvenue ${name} ! 👋`, 'Prêt à créer du contenu viral ?'),
  }
}