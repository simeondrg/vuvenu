'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckIcon } from '@heroicons/react/24/solid'
import { PRICING_PLANS, BillingPeriod, formatPrice, ANNUAL_DISCOUNT_PERCENTAGE } from '@/lib/constants/pricing'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const router = useRouter()

  const plans = Object.values(PRICING_PLANS)

  const handleSelectPlan = (planId: string) => {
    router.push(`/register?plan=${planId}&billing=${billingPeriod}`)
  }

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
              <Link href="/about" className="text-vuvenu-dark hover:text-vuvenu-blue transition-colors">
                Notre Mission
              </Link>
              <Link href="/pricing" className="text-vuvenu-blue font-semibold">
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
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Pixels décoratifs */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-4 h-4 bg-vuvenu-lime animate-pixel-float"></div>
              <div className="w-4 h-4 bg-vuvenu-blue animate-pixel-float" style={{animationDelay: '0.5s'}}></div>
              <div className="w-4 h-4 bg-vuvenu-violet animate-pixel-float" style={{animationDelay: '1s'}}></div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-display font-bold text-vuvenu-dark leading-tight mb-6">
              Investis dans ta{' '}
              <span className="bg-vuvenu-lime px-3 py-1 rotate-1 inline-block">visibilité</span>
            </h1>

            <p className="text-xl text-vuvenu-dark/80 leading-relaxed mb-4">
              Des tarifs transparents pour faire grandir ton commerce.
            </p>

            <p className="text-lg text-vuvenu-dark/60 mb-12">
              <span className="bg-vuvenu-violet px-2 py-1 rounded">14 jours d&apos;essai gratuit</span> ·
              Sans engagement ·
              Résiliation en 1 clic
            </p>

            {/* Toggle Billing Period */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className={`text-lg font-medium transition-colors ${
                  billingPeriod === 'monthly' ? 'text-vuvenu-dark' : 'text-vuvenu-dark/50'
                }`}
              >
                Mensuel
              </span>

              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-16 h-8 bg-vuvenu-dark/20 rounded-full transition-colors hover:bg-vuvenu-dark/30 focus:outline-none focus:ring-2 focus:ring-vuvenu-lime focus:ring-offset-2"
                aria-label="Changer de période de facturation"
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-vuvenu-lime rounded-full transition-transform duration-300 ease-in-out ${
                    billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={`text-lg font-medium transition-colors ${
                    billingPeriod === 'yearly' ? 'text-vuvenu-dark' : 'text-vuvenu-dark/50'
                  }`}
                >
                  Annuel
                </span>
                {billingPeriod === 'yearly' && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                    Économisez {ANNUAL_DISCOUNT_PERCENTAGE}%
                  </span>
                )}
              </div>
            </div>

            {billingPeriod === 'yearly' && (
              <p className="text-sm text-green-600 font-medium mb-8 animate-in fade-in duration-300">
                🎉 2 mois offerts sur tous les plans annuels !
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const price = billingPeriod === 'monthly' ? plan.monthly.price : plan.yearly.price
              const priceDisplay = formatPrice(plan.id, billingPeriod)
              const savings = billingPeriod === 'yearly' ? plan.yearly.savings : 0

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl p-8 shadow-vuvenu-lg border-2 transition-all duration-300 hover:scale-105 ${
                    plan.recommended
                      ? 'border-vuvenu-lime transform scale-105'
                      : 'border-vuvenu-rose/20'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-vuvenu-lime text-vuvenu-dark font-semibold px-6 py-2 rounded-full text-sm">
                        ⭐ Plus populaire
                      </span>
                    </div>
                  )}

                  {/* Badge économie annuelle */}
                  {billingPeriod === 'yearly' && savings > 0 && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Économisez {savings}€/an
                      </span>
                    </div>
                  )}

                  {/* Header du plan */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-display font-bold text-vuvenu-dark mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-vuvenu-dark/60 mb-6">{plan.description}</p>

                    <div className="flex items-end justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold text-vuvenu-dark">{price}€</span>
                      <span className="text-vuvenu-dark/60 pb-2">
                        /{billingPeriod === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>

                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-vuvenu-dark/60 mb-6">
                        soit {Math.round(plan.yearly.pricePerMonth)}€/mois
                      </p>
                    )}

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-4 px-6 rounded-lg font-semibold transition-all ${
                        plan.recommended
                          ? 'bg-vuvenu-lime text-vuvenu-dark hover:scale-105'
                          : 'bg-vuvenu-blue text-white hover:bg-vuvenu-blue/90'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-vuvenu-dark mb-4">✅ Inclus :</h4>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-vuvenu-lime flex-shrink-0 mt-0.5" />
                        <span className="text-vuvenu-dark/80">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-vuvenu-dark mb-4 mt-6">❌ Non inclus :</h4>
                        {plan.limitations.map((limitation, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 text-vuvenu-dark/30 flex-shrink-0 mt-0.5">❌</div>
                            <span className="text-vuvenu-dark/50">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-center text-vuvenu-dark mb-16">
              Questions fréquentes
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-vuvenu-dark mb-2">
                    Puis-je changer de plan à tout moment ?
                  </h3>
                  <p className="text-vuvenu-dark/70">
                    Oui, tu peux upgrader ou downgrader ton plan à tout moment.
                    Les changements prennent effet immédiatement.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-vuvenu-dark mb-2">
                    Que se passe-t-il si je dépasse mes limites ?
                  </h3>
                  <p className="text-vuvenu-dark/70">
                    On te propose automatiquement d&apos;upgrader vers le plan supérieur.
                    Sinon, tu peux attendre le mois suivant.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-vuvenu-dark mb-2">
                    Puis-je passer d&apos;un abonnement mensuel à annuel ?
                  </h3>
                  <p className="text-vuvenu-dark/70">
                    Oui, à tout moment. Le changement se fait au prorata et tu bénéficieras
                    immédiatement de la réduction annuelle.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-vuvenu-dark mb-2">
                    Comment fonctionne l&apos;essai gratuit ?
                  </h3>
                  <p className="text-vuvenu-dark/70">
                    14 jours complets avec toutes les fonctionnalités Pro.
                    Aucun prélèvement avant la fin de la période d&apos;essai.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-vuvenu-dark mb-2">
                    Support technique inclus ?
                  </h3>
                  <p className="text-vuvenu-dark/70">
                    Email pour tous, chat prioritaire pour Pro+, et téléphone pour Business.
                    Réponse sous 24h garantie.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-vuvenu-dark mb-2">
                    L&apos;abonnement annuel est-il remboursable ?
                  </h3>
                  <p className="text-vuvenu-dark/70">
                    Oui, nous offrons une garantie satisfait ou remboursé de 30 jours
                    sur tous nos abonnements.
                  </p>
                </div>
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
