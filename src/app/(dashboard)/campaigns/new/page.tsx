'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

// Industries avec spécificités Meta Ads
const industries = [
  {
    id: 'coiffure',
    name: 'Coiffure & Beauté',
    icon: '✂️',
    metaTargets: ['Femmes 25-55 ans', 'Intérêt beauté/soins'],
    adTypes: ['Avant/après transformations', 'Tutoriels coiffure', 'Promotions salon']
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Food',
    icon: '🍽️',
    metaTargets: ['Foodies locaux', 'Familles', 'Jeunes professionnels'],
    adTypes: ['Plats signature', 'Ambiance restaurant', 'Offres spéciales']
  },
  {
    id: 'boulangerie',
    name: 'Boulangerie & Pâtisserie',
    icon: '🥖',
    metaTargets: ['Familles locales', 'Gourmands', 'Matinaux'],
    adTypes: ['Coulisses fabrication', 'Nouveautés', 'Tradition artisanale']
  },
  {
    id: 'fleuriste',
    name: 'Fleuriste',
    icon: '🌸',
    metaTargets: ['Couples', 'Organisateurs événements', 'Passionnés déco'],
    adTypes: ['Créations sur-mesure', 'Conseils entretien', 'Occasions spéciales']
  },
  {
    id: 'fitness',
    name: 'Sport & Fitness',
    icon: '💪',
    metaTargets: ['Sportifs amateurs', 'Recherche forme', 'Bien-être'],
    adTypes: ['Transformations physiques', 'Coaching', 'Équipements']
  },
  {
    id: 'mode',
    name: 'Boutique Mode',
    icon: '👗',
    metaTargets: ['Fashion lovers', 'Femmes 20-50', 'Style conscientes'],
    adTypes: ['Nouvelles collections', 'Conseils style', 'Tendances']
  }
]

// Objectifs Meta Ads
const campaignObjectives = [
  {
    id: 'awareness',
    name: 'Notoriété locale',
    description: 'Faire connaître votre commerce dans votre zone',
    icon: '👁️',
    metaObjective: 'BRAND_AWARENESS'
  },
  {
    id: 'traffic',
    name: 'Visites en magasin',
    description: 'Inciter les gens à venir physiquement',
    icon: '🏪',
    metaObjective: 'STORE_VISITS'
  },
  {
    id: 'leads',
    name: 'Réservations / Contacts',
    description: 'Collecter des leads qualifiés',
    icon: '📞',
    metaObjective: 'LEAD_GENERATION'
  },
  {
    id: 'engagement',
    name: 'Engagement réseaux sociaux',
    description: 'Booster vos pages Facebook/Instagram',
    icon: '❤️',
    metaObjective: 'ENGAGEMENT'
  }
]

// Budgets suggérés
const budgetRanges = [
  {
    id: 'small',
    daily: 10,
    monthly: 300,
    description: 'Idéal pour commencer',
    reach: '1000-3000 personnes/jour'
  },
  {
    id: 'medium',
    daily: 20,
    monthly: 600,
    description: 'Recommandé pour impact',
    reach: '2000-6000 personnes/jour'
  },
  {
    id: 'large',
    daily: 50,
    monthly: 1500,
    description: 'Maximum de visibilité',
    reach: '5000-15000 personnes/jour'
  }
]

interface UserProfile {
  id: string
  subscription_tier: 'starter' | 'pro' | 'business' | null
  campaigns_count_month: number
  business_type?: string | null
  business_name?: string | null
  subscription_status: string
}

export default function NewCampaignPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Form data
  const [campaignName, setCampaignName] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedObjective, setSelectedObjective] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [customBudget, setCustomBudget] = useState('')
  const [targetLocation, setTargetLocation] = useState('')
  const [specialOffer, setSpecialOffer] = useState('')

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUserProfile(profile)

      // Vérifier les permissions
      if (profile?.subscription_tier === 'starter') {
        router.push('/campaigns')
        return
      }

      // Pré-remplir avec les données existantes
      if (profile?.business_type) {
        setSelectedIndustry(profile.business_type)
      }
      if (profile?.business_name) {
        setCampaignName(`Campagne ${profile.business_name}`)
      }
    }

    loadUserData()
  }, [router])

  const canCreateCampaign = () => {
    if (!userProfile) return false

    const tier = userProfile.subscription_tier
    const count = userProfile.campaigns_count_month || 0

    if (tier === 'starter') return false
    if (tier === 'business') return true
    if (tier === 'pro') return count < 5

    return false
  }

  const handleCreateCampaign = async () => {
    if (!canCreateCampaign()) {
      alert('Limite de campagnes atteinte. Passez à un plan supérieur !')
      router.push('/settings')
      return
    }

    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Créer la campagne en base
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: session.user.id,
          title: campaignName,
          input_data: {
            industry: selectedIndustry,
            objective: selectedObjective,
            budget: selectedBudget,
            customBudget: customBudget,
            targetLocation: targetLocation,
            specialOffer: specialOffer
          },
          status: 'draft',
          wizard_step: 1,
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur création campagne:', error)
        throw new Error('Erreur lors de la création')
      }

      // Incrémenter le compteur
      await supabase
        .from('profiles')
        .update({
          campaigns_count_month: (userProfile?.campaigns_count_month || 0) + 1
        })
        .eq('id', session.user.id)

      // Rediriger vers le wizard de lancement
      router.push(`/campaigns/${campaign.id}/launch`)

    } catch (error) {
      console.error('Erreur création campagne:', error)
      alert('Erreur lors de la création. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (!userProfile) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">⚡</span>
          </div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!canCreateCampaign()) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
            {userProfile.subscription_tier === 'starter'
              ? 'Les campagnes Meta Ads nécessitent un plan Pro ou Business'
              : 'Limite de campagnes atteinte'
            }
          </h1>
          <p className="text-vuvenu-dark/80 mb-8">
            {userProfile.subscription_tier === 'starter'
              ? 'Passez au plan Pro pour créer des campagnes publicitaires automatisées avec génération d\'images IA.'
              : 'Vous avez utilisé toutes vos campagnes pour ce mois. Passez au plan Business pour un accès illimité !'
            }
          </p>
          <Button
            onClick={() => router.push('/settings')}
            className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90"
          >
            Voir les plans disponibles
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark">
              Nouvelle Campagne Meta Ads
            </h1>
            <div className="text-sm text-vuvenu-dark/60">
              Configuration initiale
            </div>
          </div>

          <div className="bg-vuvenu-lime/10 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-vuvenu-dark">
              <span className="text-lg">🚀</span>
              <span>
                <strong>Prochaines étapes :</strong> Après création, notre wizard vous guidera
                pour générer automatiquement 5 concepts publicitaires avec images IA
                et publier sur Meta Ads Manager !
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Nom de campagne */}
          <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
            <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
              Nom de votre campagne
            </h2>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors text-lg"
              placeholder="Ex: Campagne Automne 2026, Promo Black Friday, etc."
            />
          </div>

          {/* Secteur */}
          <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
            <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
              Votre secteur d&apos;activité
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedIndustry === industry.id
                      ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                      : 'border-vuvenu-rose/40 hover:border-vuvenu-blue/60'
                  }`}
                >
                  <div className="text-2xl mb-2">{industry.icon}</div>
                  <div className="font-semibold text-vuvenu-dark text-sm mb-2">
                    {industry.name}
                  </div>
                  <div className="text-xs text-vuvenu-dark/60">
                    Cible: {industry.metaTargets[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Objectif */}
          {selectedIndustry && (
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
              <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                Objectif de votre campagne
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaignObjectives.map((objective) => (
                  <button
                    key={objective.id}
                    onClick={() => setSelectedObjective(objective.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedObjective === objective.id
                        ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                        : 'border-vuvenu-rose/40 hover:border-vuvenu-blue/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{objective.icon}</span>
                      <div>
                        <div className="font-semibold text-vuvenu-dark">
                          {objective.name}
                        </div>
                        <div className="text-xs text-vuvenu-blue">
                          Meta: {objective.metaObjective}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-vuvenu-dark/70">
                      {objective.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Budget */}
          {selectedObjective && (
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
              <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                Budget publicitaire
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {budgetRanges.map((budget) => (
                  <button
                    key={budget.id}
                    onClick={() => setSelectedBudget(budget.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedBudget === budget.id
                        ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                        : 'border-vuvenu-rose/40 hover:border-vuvenu-blue/60'
                    }`}
                  >
                    <div className="text-2xl font-bold text-vuvenu-dark mb-1">
                      {budget.daily}€/jour
                    </div>
                    <div className="text-sm text-vuvenu-dark/60 mb-2">
                      ({budget.monthly}€/mois)
                    </div>
                    <div className="text-xs font-medium text-vuvenu-dark mb-2">
                      {budget.description}
                    </div>
                    <div className="text-xs text-vuvenu-dark/60">
                      {budget.reach}
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-vuvenu-rose/20 pt-6">
                <label className="block">
                  <span className="text-sm font-medium text-vuvenu-dark mb-2 block">
                    Ou définissez un budget personnalisé :
                  </span>
                  <input
                    type="number"
                    value={customBudget}
                    onChange={(e) => {
                      setCustomBudget(e.target.value)
                      if (e.target.value) setSelectedBudget('')
                    }}
                    min="5"
                    max="200"
                    className="w-full md:w-48 px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors"
                    placeholder="Ex: 15"
                  />
                  <span className="text-sm text-vuvenu-dark/60 ml-2">€/jour</span>
                </label>
              </div>
            </div>
          )}

          {/* Localisation et offre */}
          {(selectedBudget || customBudget) && (
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
              <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                Informations complémentaires
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-vuvenu-dark mb-2">
                    Zone de chalandise (ville, quartier, rayon en km)
                  </label>
                  <input
                    type="text"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors"
                    placeholder="Ex: Marseille 13001, 5km autour de mon salon, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-vuvenu-dark mb-2">
                    Offre spéciale ou promotion (optionnel)
                  </label>
                  <textarea
                    value={specialOffer}
                    onChange={(e) => setSpecialOffer(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors resize-none"
                    placeholder="Ex: -20% sur première visite, consultation gratuite, forfait découverte à 49€..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bouton création */}
          {campaignName && selectedIndustry && selectedObjective && (selectedBudget || customBudget) && (
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-vuvenu-lime/20 to-vuvenu-blue/20 rounded-2xl p-8 border border-vuvenu-lime/40 mb-8">
                <h3 className="text-lg font-semibold text-vuvenu-dark mb-4">
                  🎯 Prêt pour la génération automatique !
                </h3>
                <p className="text-vuvenu-dark/80 mb-6">
                  Notre IA va générer <strong>5 concepts publicitaires</strong> adaptés à votre secteur,
                  avec <strong>images professionnelles</strong> et <strong>copy optimisé</strong>.
                  Ensuite, notre wizard vous guidera étape par étape pour publier sur Meta Ads Manager.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-vuvenu-dark/70">
                  <span>🤖 Génération IA</span>
                  <span>→</span>
                  <span>🖼️ Images incluses</span>
                  <span>→</span>
                  <span>🚀 Publication guidée</span>
                </div>
              </div>

              <Button
                onClick={handleCreateCampaign}
                disabled={loading}
                className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-4 text-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚡</span>
                    Création en cours...
                  </span>
                ) : (
                  '🚀 Créer ma campagne Meta Ads'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}