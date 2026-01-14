import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-vuvenu-cream flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Illustration d'erreur */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-vuvenu-lime to-vuvenu-blue rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-6xl">🕵️‍♂️</span>
          </div>
          <div className="text-8xl lg:text-9xl font-display font-bold text-vuvenu-dark/20 mb-4">
            404
          </div>
        </div>

        {/* Message principal */}
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-4">
          Oops ! Page introuvable
        </h1>
        <p className="text-lg text-vuvenu-dark/80 mb-8 max-w-md mx-auto">
          La page que vous cherchez s&apos;est volatilisée... Comme un script viral qui aurait disparu ! 🎬
        </p>

        {/* Suggestions d'actions */}
        <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20 mb-8">
          <h2 className="text-xl font-semibold text-vuvenu-dark mb-6">
            Que souhaitez-vous faire ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Retour accueil */}
            <Link
              href="/"
              className="group p-6 border-2 border-vuvenu-lime/40 rounded-xl hover:border-vuvenu-lime hover:bg-vuvenu-lime/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-lime/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-lime group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Retour à l&apos;accueil
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Découvrez VuVenu et ses fonctionnalités
              </p>
            </Link>

            {/* Créer un script */}
            <Link
              href="/scripts/new"
              className="group p-6 border-2 border-vuvenu-blue/40 rounded-xl hover:border-vuvenu-blue hover:bg-vuvenu-blue/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-blue/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-blue group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Créer un script
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Générez du contenu viral avec l&apos;IA
              </p>
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="group p-6 border-2 border-vuvenu-violet/40 rounded-xl hover:border-vuvenu-violet hover:bg-vuvenu-violet/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-violet/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-violet group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Mon dashboard
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Consultez vos stats et contenus
              </p>
            </Link>

            {/* Support */}
            <Link
              href="mailto:support@vuvenu.fr"
              className="group p-6 border-2 border-vuvenu-rose/40 rounded-xl hover:border-vuvenu-rose hover:bg-vuvenu-rose/5 transition-all"
            >
              <div className="w-16 h-16 bg-vuvenu-rose/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-rose group-hover:scale-110 transition-all mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">
                Contactez-nous
              </h3>
              <p className="text-sm text-vuvenu-dark/70">
                Une question ? Notre équipe répond
              </p>
            </Link>
          </div>
        </div>

        {/* Pages populaires */}
        <div className="bg-vuvenu-lime/10 rounded-xl p-6 border border-vuvenu-lime/30">
          <h3 className="font-semibold text-vuvenu-dark mb-4">
            📈 Pages populaires
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/scripts"
              className="text-sm bg-white text-vuvenu-dark px-4 py-2 rounded-lg hover:scale-105 transition-transform border border-vuvenu-rose/20"
            >
              Mes scripts
            </Link>
            <Link
              href="/campaigns"
              className="text-sm bg-white text-vuvenu-dark px-4 py-2 rounded-lg hover:scale-105 transition-transform border border-vuvenu-rose/20"
            >
              Mes campagnes
            </Link>
            <Link
              href="/settings"
              className="text-sm bg-white text-vuvenu-dark px-4 py-2 rounded-lg hover:scale-105 transition-transform border border-vuvenu-rose/20"
            >
              Paramètres
            </Link>
            <Link
              href="/pricing"
              className="text-sm bg-white text-vuvenu-dark px-4 py-2 rounded-lg hover:scale-105 transition-transform border border-vuvenu-rose/20"
            >
              Tarifs
            </Link>
          </div>
        </div>

        {/* Message d'encouragement */}
        <div className="mt-8">
          <p className="text-sm text-vuvenu-dark/60">
            Perdu ? Pas de panique ! Même les meilleurs créateurs se perdent parfois.
            <br />
            L&apos;important c&apos;est de continuer à créer du contenu viral ! 🚀
          </p>
        </div>

        {/* Bouton principal */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-vuvenu-lime text-vuvenu-dark px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <span>🏠</span>
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Code d'erreur pour debug */}
        <div className="mt-12 pt-8 border-t border-vuvenu-rose/20">
          <details className="text-left">
            <summary className="text-xs text-vuvenu-dark/40 cursor-pointer hover:text-vuvenu-dark/60">
              Informations techniques
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono">
              <div>Error: 404 - Page Not Found</div>
              <div>URL: {typeof window !== 'undefined' ? window.location.href : 'Unknown'}</div>
              <div>Timestamp: {new Date().toISOString()}</div>
              <div>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'}</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}