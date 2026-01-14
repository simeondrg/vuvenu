'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckIcon } from '@heroicons/react/24/solid'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 59,
    originalPrice: null,
    description: 'Parfait pour débuter',
    features: [
      '10 scripts vidéo / mois',
      'Générateur de scripts IA',
      'Formats optimisés TikTok/Reels',
      '5 industries supportées',
      'Modèles de contenus',
      'Support email',
    ],
    limitations: [
      'Pas de campagnes publicitaires',
      'Pas de génération d&apos;images IA',
      'Pas d&apos;analytics avancées',
    ],
    cta: 'Choisir Starter',
    recommended: false,
    color: 'blue',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 119,
    originalPrice: 149,
    description: 'Le plus choisi',
    features: [
      '30 scripts vidéo / mois',
      '5 campagnes publicitaires / mois',
      'Générateur de publicités Meta',
      'Images IA incluses (Gemini Imagen)',
      'Analytics de performance',
      'Toutes les industries (22+)',
      'Templates personnalisables',
      'Support chat prioritaire',
      'Formation vidéo incluse',
    ],
    limitations: [],
    cta: 'Essayer Pro gratuitement',
    recommended: true,
    color: 'lime',
  },
  {
    id: 'business',
    name: 'Business',
    price: 249,
    originalPrice: 299,
    description: 'Croissance illimitée',
    features: [
      'Scripts ILLIMITÉS',
      'Campagnes ILLIMITÉES',
      'API access privé',
      'Account manager dédié',
      'Formation personnalisée 1h',
      'Intégrations sur mesure',
      'Rapports avancés & insights',
      'Support téléphonique prioritaire',
      'Concierge service',
    ],
    limitations: [],
    cta: 'Demander une démo',
    recommended: false,
    color: 'violet',
  },
]

export default function ChoosePlanPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // Récupérer le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUserProfile(profile)

      // Si déjà un plan actif, rediriger vers dashboard
      if (profile?.subscription_status === 'active') {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const handleSelectPlan = async (planId: string) => {
    setLoading(true)

    try {
      if (planId === 'starter') {
        // Plan starter gratuit pour commencer
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_tier: 'starter',
            subscription_status: 'active',
            scripts_count_month: 0,
            campaigns_count_month: 0,
            counts_reset_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (error) throw error
        router.push('/dashboard')

      } else {
        // Pour Pro et Business, rediriger vers Stripe (à implémenter)
        // Pour l'instant, simulons une redirection
        alert(`Redirection vers Stripe pour le plan ${planId} (à implémenter)`)
      }
    } catch (error) {
      console.error('Erreur sélection plan:', error)
      alert('Erreur lors de la sélection du plan')
    } finally {
      setLoading(false)
    }
  }

  const handleFreeTrial = () => {
    // Commencer directement avec le plan starter gratuit
    handleSelectPlan('starter')
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-vuvenu-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-vuvenu-dark">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* Header */}
      <header className="p-6 bg-white/95 backdrop-blur-sm border-b border-vuvenu-rose/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                <span className="font-bold text-vuvenu-dark">V</span>
              </div>
              <span className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</span>
            </div>

            <div className="text-sm text-vuvenu-dark/60">
              Dernière étape !
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto mb-16">
            {/* Pixels décoratifs */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-4 h-4 bg-vuvenu-lime animate-pixel-float"></div>
              <div className="w-4 h-4 bg-vuvenu-blue animate-pixel-float" style={{animationDelay: '0.5s'}}></div>
              <div className="w-4 h-4 bg-vuvenu-violet animate-pixel-float" style={{animationDelay: '1s'}}></div>
            </div>

            <h1 className="text-5xl font-display font-bold text-vuvenu-dark leading-tight mb-6">
              Félicitations{' '}
              <span className="bg-vuvenu-lime px-3 py-1 rotate-1 inline-block">
                {userProfile.business_name?.split(' ')[0] || 'Champion'}
              </span> !
            </h1>

            <p className="text-xl text-vuvenu-dark/80 leading-relaxed mb-8">
              Ton profil <strong>{userProfile.business_name}</strong> est configuré.
              <br />
              Maintenant, choisis le plan qui correspond à tes ambitions.
            </p>

            <div className="bg-vuvenu-violet/20 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-vuvenu-dark mb-2">🎁 Offre de lancement</h3>
              <p className="text-sm text-vuvenu-dark/80">
                <strong>14 jours d&apos;essai gratuit</strong> sur tous les plans Pro et Business !
                Aucun prélèvement avant la fin de la période d&apos;essai.
              </p>
            </div>
          </div>

          {/* Bouton essai gratuit immédiat */}
          <div className="mb-16">
            <Button
              onClick={handleFreeTrial}
              className="bg-gradient-to-r from-vuvenu-lime to-vuvenu-blue text-vuvenu-dark font-bold px-8 py-4 text-lg rounded-xl hover:scale-105 transition-transform shadow-vuvenu-lg"
            >
              🚀 Commencer gratuitement maintenant
            </Button>
            <p className="text-sm text-vuvenu-dark/60 mt-2">
              Ou choisis un plan ci-dessous
            </p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 shadow-vuvenu-lg border-2 transition-transform hover:scale-105 ${
                  plan.recommended
                    ? `border-vuvenu-${plan.color} transform scale-105`
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

                {plan.originalPrice && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                    -20%
                  </div>
                )}

                {/* Header du plan */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-display font-bold text-vuvenu-dark mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-vuvenu-dark/60 mb-6">{plan.description}</p>

                  <div className="flex items-end justify-center gap-2 mb-6">
                    <span className="text-5xl font-bold text-vuvenu-dark">{plan.price}€</span>
                    <span className="text-vuvenu-dark/60 pb-2">/mois</span>
                  </div>

                  {plan.originalPrice && (
                    <div className="text-sm text-vuvenu-dark/50 mb-4">
                      <span className="line-through">{plan.originalPrice}€/mois</span>
                      <span className="text-red-600 font-medium ml-2">Économise 20%</span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-all ${
                      plan.recommended
                        ? 'bg-vuvenu-lime text-vuvenu-dark hover:scale-105'
                        : plan.color === 'violet'
                        ? 'bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90'
                        : 'bg-vuvenu-blue text-white hover:bg-vuvenu-blue/90'
                    }`}
                  >
                    {loading ? 'Chargement...' : plan.cta}
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-vuvenu-dark mb-4">✅ Inclus :</h4>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-vuvenu-lime flex-shrink-0 mt-0.5" />
                      <span className="text-vuvenu-dark/80 text-sm">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-vuvenu-dark mb-4 mt-6">❌ Non inclus :</h4>
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 text-vuvenu-dark/30 flex-shrink-0 mt-0.5">❌</div>
                          <span className="text-vuvenu-dark/50 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantie section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-vuvenu-dark mb-8">
              Garantie satisfait ou remboursé
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="font-semibold text-vuvenu-dark mb-2">Résiliation en 1 clic</h3>
                <p className="text-sm text-vuvenu-dark/70">
                  Change ou annule ton plan à tout moment depuis ton tableau de bord.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-vuvenu-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-vuvenu-dark mb-2">Remboursement 30 jours</h3>
                <p className="text-sm text-vuvenu-dark/70">
                  Pas satisfait ? On te rembourse intégralement sous 30 jours.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-vuvenu-violet rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="font-semibold text-vuvenu-dark mb-2">Support réactif</h3>
                <p className="text-sm text-vuvenu-dark/70">
                  Notre équipe t&apos;accompagne pour réussir ton marketing digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}