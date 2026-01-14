'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, MessageCircle, ExternalLink } from 'lucide-react'
import { createUserFriendlyError, logError, formatErrorForDisplay } from '@/lib/error-handler'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  context?: string
}

interface State {
  hasError: boolean
  errorInfo: {
    title: string
    message: string
    action?: string
    supportInfo: string
    code: string
  } | null
}

/**
 * ErrorBoundary pour capturer et afficher les erreurs React de façon user-friendly
 * Utilise le système centralisé de gestion d'erreurs
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    const userFriendlyError = createUserFriendlyError(error, 'React Error Boundary')
    const formattedError = formatErrorForDisplay(userFriendlyError)

    return {
      hasError: true,
      errorInfo: {
        ...formattedError,
        code: userFriendlyError.code
      }
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const userFriendlyError = createUserFriendlyError(error, this.props.context || 'React Error')
    logError(userFriendlyError, undefined, `${this.props.context} - Component Stack: ${errorInfo.componentStack?.slice(0, 200) || 'Non disponible'}`)
  }

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      // Fallback custom si fourni
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Interface par défaut user-friendly
      return <ErrorDisplay errorInfo={this.state.errorInfo} onRetry={() => this.setState({ hasError: false, errorInfo: null })} />
    }

    return this.props.children
  }
}

/**
 * Composant d'affichage d'erreur user-friendly
 */
interface ErrorDisplayProps {
  errorInfo: {
    title: string
    message: string
    action?: string
    supportInfo: string
    code: string
  }
  onRetry: () => void
}

function ErrorDisplay({ errorInfo, onRetry }: ErrorDisplayProps) {
  const copyErrorCode = () => {
    navigator.clipboard.writeText(errorInfo.code)
  }

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
      <div className="max-w-md text-center space-y-6">
        {/* Icône d'erreur */}
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Titre et message principal */}
        <div className="space-y-3">
          <h3 className="text-xl font-display font-bold text-red-900">
            {errorInfo.title}
          </h3>

          <p className="text-red-800 leading-relaxed">
            {errorInfo.message}
          </p>

          {errorInfo.action && (
            <p className="text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
              💡 <strong>Que faire :</strong> {errorInfo.action}
            </p>
          )}
        </div>

        {/* Actions utilisateur */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-vuvenu-lime text-vuvenu-dark font-semibold rounded-lg hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>

          <button
            onClick={refreshPage}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recharger la page
          </button>
        </div>

        {/* Informations support */}
        <div className="pt-4 border-t border-red-200">
          <details className="text-sm text-red-600 space-y-2">
            <summary className="cursor-pointer hover:text-red-800 font-medium">
              🆘 Besoin d'aide ?
            </summary>

            <div className="mt-3 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-red-100 px-2 py-1 rounded">
                  {errorInfo.code}
                </span>
                <button
                  onClick={copyErrorCode}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Copier le code
                </button>
              </div>

              <div className="space-y-2">
                <a
                  href="/help"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Centre d'aide
                </a>

                <a
                  href="/contact"
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-3 h-3" />
                  Contacter le support
                </a>
              </div>

              <p className="text-xs text-red-500 mt-2">
                Mentionnez le code d'erreur <strong>{errorInfo.code}</strong> pour un support plus rapide.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook pour capturer les erreurs dans les composants fonctionnels
 */
export function useErrorHandler() {
  const handleError = (error: unknown, context?: string) => {
    const userFriendlyError = createUserFriendlyError(error, context)
    logError(userFriendlyError, undefined, context)

    // Ici on pourrait déclencher une toast notification
    console.error('Erreur capturée:', formatErrorForDisplay(userFriendlyError))
  }

  return { handleError }
}

/**
 * Composant ErrorBoundary spécialisé pour les pages critiques
 */
export function CriticalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="Critical Page"
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="max-w-lg text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-red-900 mb-2">
                Service temporairement indisponible
              </h1>
              <p className="text-red-700">
                Une erreur critique s'est produite. Notre équipe technique a été automatiquement alertée.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-vuvenu-lime text-vuvenu-dark font-semibold rounded-lg hover:scale-105 transition-transform"
              >
                Recharger l'application
              </button>

              <a
                href="/contact"
                className="block w-full px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Contacter le support technique
              </a>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}