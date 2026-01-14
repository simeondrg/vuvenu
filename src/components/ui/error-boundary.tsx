'use client'

/**
 * Error Boundary React pour VuVenu
 *
 * Capture les erreurs JavaScript côté client et affiche
 * une interface utilisateur de récupération élégante
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <MonComposant />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { errorHandler, isVuVenuError } from '@/lib/errors/handler'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

// =============================================
// TYPES & INTERFACES
// =============================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  level?: 'page' | 'component' // Niveau de l'Error Boundary
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorId: string | null
}

// =============================================
// ERROR BOUNDARY COMPONENT
// =============================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Met à jour le state pour déclencher l'affichage de l'UI de fallback
    return {
      hasError: true,
      error,
      errorId: `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur via notre gestionnaire centralisé
    errorHandler.logError(error, {
      url: window.location.href,
      userAgent: navigator.userAgent,
      additionalContext: {
        componentStack: errorInfo.componentStack,
        errorBoundaryLevel: this.props.level || 'component',
        retryCount: this.retryCount,
        errorId: this.state.errorId,
      },
    })

    // Callback optionnel
    this.props.onError?.(error, errorInfo)

    // Analytics (optionnel)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: this.props.level === 'page',
        error_id: this.state.errorId,
      })
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      this.setState({
        hasError: false,
        error: null,
        errorId: null,
      })
    } else {
      // Maximum de tentatives atteint, redirection ou reload
      if (this.props.level === 'page') {
        window.location.reload()
      } else {
        // Pour un composant, on peut essayer de rediriger vers la page d'accueil
        window.location.href = '/'
      }
    }
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Utiliser fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      // UI de fallback par défaut
      const isPageLevel = this.props.level === 'page'
      const canRetry = this.retryCount < this.maxRetries

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Icon et titre */}
            <div className="space-y-3">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
              <h2 className="text-xl font-semibold text-foreground">
                {isPageLevel ? 'Erreur de la page' : 'Erreur du composant'}
              </h2>
            </div>

            {/* Message d'erreur */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isVuVenuError(this.state.error)
                  ? this.state.error.getUserMessage()
                  : process.env.NODE_ENV === 'production'
                  ? 'Une erreur inattendue est survenue.'
                  : this.state.error.message}
              </p>

              {/* ID d'erreur pour le support */}
              {this.state.errorId && (
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {this.state.errorId}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réessayer{this.retryCount > 0 && ` (${this.retryCount}/${this.maxRetries})`}
                </Button>
              )}

              {isPageLevel ? (
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recharger la page
                </Button>
              ) : (
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Accueil
                </Button>
              )}
            </div>

            {/* Message de support */}
            <div className="text-xs text-muted-foreground">
              <p>
                Si le problème persiste, contactez le support avec l'ID d'erreur ci-dessus.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// =============================================
// HOOKS ET HELPERS
// =============================================

/**
 * Hook pour déclencher manuellement l'Error Boundary
 */
export function useErrorBoundary() {
  return (error: Error) => {
    throw error
  }
}

/**
 * Higher-Order Component pour wrapper automatiquement avec ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Error Boundary spécialisé pour les pages
 */
export function PageErrorBoundary({
  children,
  ...props
}: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <ErrorBoundary level="page" {...props}>
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error Boundary spécialisé pour les composants
 */
export function ComponentErrorBoundary({
  children,
  ...props
}: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <ErrorBoundary level="component" {...props}>
      {children}
    </ErrorBoundary>
  )
}

// =============================================
// EXPORTS
// =============================================

export default ErrorBoundary