'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur pour monitoring (Sentry, LogRocket, etc.)
    console.error('Application error:', error)
  }, [error])

  // Déterminer le type d'erreur pour personnaliser le message
  const getErrorInfo = () => {
    if (error.message.includes('NEXT_NOT_FOUND')) {
      return {
        icon: '🔍',
        title: 'Page non trouvée',
        description: 'La page que vous cherchez n\'existe pas ou a été déplacée.',
        suggestion: 'Vérifiez l\'URL ou retournez à l\'accueil.'
      }
    }

    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return {
        icon: '📡',
        title: 'Problème de connexion',
        description: 'Impossible de se connecter à nos serveurs.',
        suggestion: 'Vérifiez votre connexion internet et réessayez.'
      }
    }

    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return {
        icon: '⚡',
        title: 'Erreur de chargement',
        description: 'Une mise à jour de l\'application est peut-être disponible.',
        suggestion: 'Rechargez la page ou videz votre cache.'
      }
    }

    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return {
        icon: '🔐',
        title: 'Session expirée',
        description: 'Votre session a expiré pour des raisons de sécurité.',
        suggestion: 'Reconnectez-vous pour continuer.'
      }
    }

    if (error.message.includes('Forbidden') || error.message.includes('403')) {
      return {
        icon: '🚫',
        title: 'Accès non autorisé',
        description: 'Vous n\'avez pas les permissions pour accéder à cette ressource.',
        suggestion: 'Vérifiez votre plan d\'abonnement ou contactez le support.'
      }
    }

    // Erreur générique
    return {
      icon: '⚠️',
      title: 'Une erreur inattendue s\'est produite',
      description: 'Nous avons rencontré un problème technique.',
      suggestion: 'Notre équipe a été notifiée. Réessayez dans quelques instants.'
    }
  }

  const errorInfo = getErrorInfo()

  return (
    <div className="min-h-screen bg-vuvenu-cream flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Illustration d'erreur */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-vuvenu-rose to-vuvenu-violet rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-6xl">{errorInfo.icon}</span>
          </div>
        </div>

        {/* Message principal */}
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-4">
          {errorInfo.title}
        </h1>
        <p className="text-lg text-vuvenu-dark/80 mb-4 max-w-md mx-auto">
          {errorInfo.description}
        </p>
        <p className="text-sm text-vuvenu-dark/60 mb-8">
          {errorInfo.suggestion}
        </p>

        {/* Actions de récupération */}
        <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20 mb-8">
          <h2 className="text-xl font-semibold text-vuvenu-dark mb-6">
            Solutions recommandées
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Réessayer */}
            <button
              onClick={reset}
              className="group p-6 border-2 border-vuvenu-lime/40 rounded-xl hover:border-vuvenu-lime hover:bg-vuvenu-lime/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-lime/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-lime group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Réessayer
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Relancer l&apos;opération qui a échoué
              </p>
            </button>

            {/* Recharger la page */}
            <button
              onClick={() => window.location.reload()}
              className="group p-6 border-2 border-vuvenu-blue/40 rounded-xl hover:border-vuvenu-blue hover:bg-vuvenu-blue/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-blue/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-blue group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">🔃</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Recharger la page
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Actualiser complètement l&apos;application
              </p>
            </button>

            {/* Retour au dashboard */}
            <Link
              href="/dashboard"
              className="group p-6 border-2 border-vuvenu-violet/40 rounded-xl hover:border-vuvenu-violet hover:bg-vuvenu-violet/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-violet/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-violet group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Retour au dashboard
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Aller vers un espace sûr
              </p>
            </Link>

            {/* Contacter le support */}
            <Link
              href="mailto:support@vuvenu.fr"
              className="group p-6 border-2 border-vuvenu-rose/40 rounded-xl hover:border-vuvenu-rose hover:bg-vuvenu-rose/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-rose/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-rose group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Signaler le problème
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Notre équipe technique vous aide
              </p>
            </Link>
          </div>
        </div>

        {/* Conseils selon le type d'erreur */}
        <div className="bg-vuvenu-blue/10 rounded-xl p-6 border border-vuvenu-blue/30 mb-8">
          <h3 className="font-semibold text-vuvenu-dark mb-4">
            💡 Que faire en attendant ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4">
              <span className="text-2xl mb-2 block">📱</span>
              <p className="text-vuvenu-dark/70">
                Essayez de rafraîchir la page ou de vider votre cache
              </p>
            </div>
            <div className="text-center p-4">
              <span className="text-2xl mb-2 block">🌐</span>
              <p className="text-vuvenu-dark/70">
                Vérifiez votre connexion internet et réessayez
              </p>
            </div>
            <div className="text-center p-4">
              <span className="text-2xl mb-2 block">🔄</span>
              <p className="text-vuvenu-dark/70">
                Le problème persiste ? Contactez notre support
              </p>
            </div>
          </div>
        </div>

        {/* Bouton principal */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-vuvenu-lime text-vuvenu-dark px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <span>🔄</span>
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-vuvenu-blue text-vuvenu-blue px-8 py-4 rounded-xl font-semibold hover:bg-vuvenu-blue hover:text-white transition-colors"
          >
            <span>🏠</span>
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Détails techniques pour debug (seulement en dev) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-12 pt-8 border-t border-vuvenu-rose/20 text-left">
            <summary className="text-xs text-vuvenu-dark/40 cursor-pointer hover:text-vuvenu-dark/60">
              Détails techniques (mode développement)
            </summary>
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-xs text-red-600 font-mono overflow-auto">
              <div><strong>Error:</strong> {error.message}</div>
              <div><strong>Digest:</strong> {error.digest || 'N/A'}</div>
              <div><strong>Stack:</strong></div>
              <pre className="whitespace-pre-wrap mt-2">{error.stack}</pre>
            </div>
          </details>
        )}

        {/* Message d'encouragement */}
        <div className="mt-8">
          <p className="text-sm text-vuvenu-dark/60">
            Les meilleurs créateurs de contenu surmontent tous les obstacles !
            <br />
            Vous aussi, vous allez rebondir de cette erreur ! 💪
          </p>
        </div>
      </div>
    </div>
  )
}