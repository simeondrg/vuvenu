'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-vuvenu-rose/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                <span className="font-bold text-vuvenu-dark">V</span>
              </div>
              <span className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-vuvenu-dark hover:text-vuvenu-blue transition-colors">
                Accueil
              </Link>
              <Link href="/about" className="text-vuvenu-blue font-semibold">
                Notre Mission
              </Link>
              <Link href="/pricing" className="text-vuvenu-dark hover:text-vuvenu-blue transition-colors">
                Tarifs
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-vuvenu-dark hover:text-vuvenu-blue transition-colors">
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-vuvenu-lime text-vuvenu-dark font-semibold px-6 py-2 rounded-lg hover:scale-105 transition-transform"
              >
                Démarrer
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Pixels décoratifs */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-4 h-4 bg-vuvenu-lime animate-pixel-float"></div>
              <div className="w-4 h-4 bg-vuvenu-blue animate-pixel-float" style={{animationDelay: '0.5s'}}></div>
              <div className="w-4 h-4 bg-vuvenu-violet animate-pixel-float" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-6xl font-display font-bold text-vuvenu-dark leading-tight mb-6">
                Notre{' '}
                <span className="bg-vuvenu-lime px-3 py-1 rotate-1 inline-block">mission</span>
              </h1>

              <p className="text-xl text-vuvenu-dark/80 leading-relaxed max-w-4xl mx-auto">
                Donner aux commerces de proximité les{' '}
                <span className="bg-vuvenu-violet px-2 py-1 rounded">mêmes armes</span>{' '}
                que les grandes entreprises pour briller sur les réseaux sociaux.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Story */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
                  <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
                    🏪 Le problème qu&apos;on résout
                  </h2>
                  <p className="text-vuvenu-dark/80 leading-relaxed mb-4">
                    Pendant que les agences se battent pour des contrats avec des grosses boutiques
                    en ligne à <span className="font-semibold">100K€/mois</span>...
                  </p>
                  <p className="text-vuvenu-dark/80 leading-relaxed">
                    <span className="font-semibold text-vuvenu-blue">Marie (coiffeuse)</span>,
                    <span className="font-semibold text-vuvenu-violet"> Thomas (boulanger)</span>,
                    <span className="font-semibold text-vuvenu-lime"> Sophie (fleuriste)</span>{' '}
                    galèrent seuls face aux géants du web.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
                  <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
                    💡 Notre solution
                  </h2>
                  <p className="text-vuvenu-dark/80 leading-relaxed">
                    VuVenu démocratise le marketing digital en automatisant la création de contenu viral
                    et de campagnes publicitaires. En quelques clics, n&apos;importe quel commerçant peut
                    générer du contenu digne des plus grandes marques.
                  </p>
                </div>
              </div>

              {/* Right Column - Values */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-vuvenu-dark mb-4">
                    Nos valeurs
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-vuvenu-lime/20 to-vuvenu-blue/20 rounded-xl p-6">
                    <h3 className="font-semibold text-vuvenu-dark mb-2">🚀 Simplicité d&apos;abord</h3>
                    <p className="text-vuvenu-dark/70">
                      Pas besoin d&apos;être expert en marketing. Notre IA fait le travail à ta place.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-vuvenu-blue/20 to-vuvenu-violet/20 rounded-xl p-6">
                    <h3 className="font-semibold text-vuvenu-dark mb-2">🎯 Résultats concrets</h3>
                    <p className="text-vuvenu-dark/70">
                      Chaque script, chaque pub est optimisée pour convertir tes followers en clients.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-vuvenu-violet/20 to-vuvenu-rose/20 rounded-xl p-6">
                    <h3 className="font-semibold text-vuvenu-dark mb-2">🤝 Commerce humain</h3>
                    <p className="text-vuvenu-dark/70">
                      On croit au commerce de proximité et aux relations authentiques.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-vuvenu-rose/20 to-vuvenu-lime/20 rounded-xl p-6">
                    <h3 className="font-semibold text-vuvenu-dark mb-2">⚡ Innovation continue</h3>
                    <p className="text-vuvenu-dark/70">
                      On reste à la pointe des dernières tendances et technologies IA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-center text-vuvenu-dark mb-16">
              L&apos;équipe derrière VuVenu
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-vuvenu-lime to-vuvenu-blue rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-display font-bold text-vuvenu-dark mb-2">
                  Siméon (Founder)
                </h3>
                <p className="text-vuvenu-blue font-medium mb-4">Entrepreneur · La Réunion</p>
                <p className="text-vuvenu-dark/70 leading-relaxed">
                  Expert en marketing digital pour les commerces locaux réunionnais.
                  Spécialisé en Next.js, Supabase et IA générative.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
                  <h3 className="font-semibold text-vuvenu-dark mb-3">🎯 Notre objectif 2026</h3>
                  <p className="text-vuvenu-dark/80">
                    Accompagner <span className="font-bold text-vuvenu-lime">+1000 commerces locaux</span> dans
                    leur transformation digitale à travers le monde francophone.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
                  <h3 className="font-semibold text-vuvenu-dark mb-3">🌟 Pourquoi nous ?</h3>
                  <p className="text-vuvenu-dark/80">
                    Nous sommes nous-mêmes entrepreneurs locaux. On comprend tes défis parce qu&apos;on les vit.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
                  <h3 className="font-semibold text-vuvenu-dark mb-3">🚀 Stack technique</h3>
                  <p className="text-vuvenu-dark/80">
                    Next.js 16, Supabase, Claude AI, Gemini Imagen, Stripe.
                    Une technologie de pointe pour des résultats pro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-display font-bold text-vuvenu-dark mb-8">
              Prêt à rejoindre l&apos;aventure ?
            </h2>

            <p className="text-xl text-vuvenu-dark/80 leading-relaxed mb-12">
              Rejoins les commerces qui ont choisi de ne plus subir la concurrence digitale,
              mais de la <span className="bg-vuvenu-lime px-2 py-1 rounded">dominer</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-vuvenu-lime text-vuvenu-dark font-semibold px-8 py-4 rounded-lg hover:scale-105 transition-transform shadow-vuvenu"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-vuvenu-dark text-vuvenu-dark font-semibold px-8 py-4 rounded-lg hover:bg-vuvenu-dark hover:text-white transition-colors"
              >
                Voir nos tarifs
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-16 grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="font-semibold text-vuvenu-dark mb-2">📧 Email</h4>
                <p className="text-vuvenu-dark/70">hello@vuvenu.fr</p>
              </div>
              <div>
                <h4 className="font-semibold text-vuvenu-dark mb-2">🌍 Basé à</h4>
                <p className="text-vuvenu-dark/70">La Réunion, France</p>
              </div>
              <div>
                <h4 className="font-semibold text-vuvenu-dark mb-2">🕐 Support</h4>
                <p className="text-vuvenu-dark/70">Lun-Ven 9h-18h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vuvenu-dark text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                  <span className="font-bold text-vuvenu-dark">V</span>
                </div>
                <span className="font-display font-bold text-xl">VuVenu</span>
              </div>
              <p className="text-white/70">
                La solution marketing digital pour les commerces de proximité.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <div className="space-y-2">
                <Link href="/features" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Fonctionnalités
                </Link>
                <Link href="/pricing" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Tarifs
                </Link>
                <Link href="/case-studies" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Cas d&apos;usage
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  À propos
                </Link>
                <Link href="/blog" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Blog
                </Link>
                <Link href="/contact" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <div className="space-y-2">
                <Link href="/cgv" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  CGV
                </Link>
                <Link href="/confidentialite" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Confidentialité
                </Link>
                <Link href="/mentions-legales" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Mentions légales
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2026 VuVenu. Tous droits réservés. Made with ❤️ à La Réunion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}