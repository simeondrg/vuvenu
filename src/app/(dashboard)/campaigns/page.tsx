'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Charger le profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUserProfile(profile)

        // Charger toutes les campagnes
        const { data: campaignsData, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erreur chargement campagnes:', error)
        } else {
          setCampaigns(campaignsData || [])
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const canCreateCampaign = () => {
    if (!userProfile) return false

    const tier = userProfile.subscription_tier
    const count = userProfile.campaigns_count_month || 0

    // Campagnes disponibles seulement pour Pro et Business
    if (tier === 'starter') return false
    if (tier === 'business') return true
    if (tier === 'pro') return count < 5

    return false
  }

  const getRemainingCampaigns = () => {
    if (!userProfile) return 0

    const tier = userProfile.subscription_tier
    const count = userProfile.campaigns_count_month || 0

    if (tier === 'starter') return 'Upgrader vers Pro'
    if (tier === 'business') return '∞'
    if (tier === 'pro') return Math.max(0, 5 - count)

    return 0
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return '📝'
      case 'ready': return '✅'
      case 'launched': return '🚀'
      case 'paused': return '⏸️'
      default: return '📊'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'bg-vuvenu-rose/20 text-vuvenu-dark'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'launched': return 'bg-vuvenu-lime/20 text-vuvenu-dark'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-vuvenu-violet/20 text-vuvenu-dark'
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-vuvenu-rose/20 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-vuvenu-rose/20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Interface pour les utilisateurs Starter
  if (!canCreateCampaign() && userProfile?.subscription_tier === 'starter') {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-2">
            Campagnes Meta Ads
          </h1>
          <p className="text-lg text-vuvenu-dark/80">
            Créez des publicités Facebook et Instagram qui convertissent !
          </p>
        </div>

        {/* Upgrade prompt */}
        <div className="bg-gradient-to-br from-vuvenu-lime/20 to-vuvenu-blue/20 rounded-2xl p-8 border border-vuvenu-lime/40">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-vuvenu-lime/30 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
              Passez au niveau supérieur !
            </h2>

            <p className="text-lg text-vuvenu-dark/80 max-w-md mx-auto mb-8">
              Les campagnes Meta Ads sont disponibles à partir du plan <strong>Pro</strong>.
              Générez automatiquement des publicités Facebook et Instagram optimisées !
            </p>
          </div>

          {/* Features preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-vuvenu-blue/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">Concepts automatiques</h3>
              <p className="text-sm text-vuvenu-dark/70">
                IA génère 5 concepts publicitaires adaptés à votre secteur
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-vuvenu-violet/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">Images IA incluses</h3>
              <p className="text-sm text-vuvenu-dark/70">
                Génération automatique d&apos;images avec Gemini Imagen
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-vuvenu-rose/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-vuvenu-dark mb-2">Wizard de lancement</h3>
              <p className="text-sm text-vuvenu-dark/70">
                Guide étape par étape pour publier sur Meta Ads Manager
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/pricing')}
              className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-4 text-lg"
            >
              🚀 Passer au plan Pro (119€)
            </Button>
            <Button
              onClick={() => router.push('/about')}
              variant="outline"
              className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-2">
            Campagnes Meta Ads
          </h1>
          <p className="text-lg text-vuvenu-dark/80">
            Créez des publicités Facebook et Instagram qui convertissent !
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Compteur campagnes */}
          <div className="bg-white rounded-xl p-4 shadow-vuvenu border border-vuvenu-rose/20">
            <div className="text-sm text-vuvenu-dark/70 mb-1">Ce mois</div>
            <div className="text-2xl font-bold text-vuvenu-dark">
              {userProfile?.campaigns_count_month || 0}
            </div>
            <div className="text-xs text-vuvenu-dark/60">
              Reste: {getRemainingCampaigns()}
            </div>
          </div>

          {/* Bouton créer */}
          {canCreateCampaign() ? (
            <Button
              onClick={() => router.push('/campaigns/new')}
              className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-6 py-3"
            >
              🚀 Nouvelle campagne
            </Button>
          ) : (
            <div className="text-center">
              <div className="text-sm text-red-600 mb-2">Limite atteinte</div>
              <Button
                onClick={() => router.push('/settings')}
                className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90"
              >
                Upgrader mon plan
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Campaigns grid */}
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20 hover:shadow-vuvenu-lg transition-shadow group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-vuvenu-blue/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{getStatusIcon(campaign.status)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-vuvenu-dark">
                      {campaign.title || 'Campagne sans titre'}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status || 'Draft'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-vuvenu-dark/50">
                  {new Date(campaign.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>

              {/* Progress wizard */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-vuvenu-dark/70 mb-2">
                  <span>Progression wizard</span>
                  <span>{campaign.wizard_step || 0}/7 étapes</span>
                </div>
                <div className="w-full bg-vuvenu-rose/30 rounded-full h-2">
                  <div
                    className="bg-vuvenu-blue h-2 rounded-full transition-all"
                    style={{
                      width: `${((campaign.wizard_step || 0) / 7) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Métadonnées */}
              <div className="flex items-center gap-4 text-xs text-vuvenu-dark/60 mb-4">
                <span>Secteur: {campaign.input_data?.industry || 'Non défini'}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="flex-1 bg-vuvenu-lime text-vuvenu-dark text-sm font-medium px-4 py-2 rounded-lg hover:scale-105 transition-transform text-center"
                >
                  Voir la campagne
                </Link>
                {campaign.wizard_step < 7 && (
                  <Link
                    href={`/campaigns/${campaign.id}/launch`}
                    className="bg-vuvenu-blue text-white p-2 rounded-lg hover:bg-vuvenu-blue/90 transition-colors text-sm"
                  >
                    Continuer →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* État vide */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-vuvenu-blue/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
            Prêt à créer votre première campagne Meta Ads ?
          </h2>

          <p className="text-lg text-vuvenu-dark/80 max-w-md mx-auto mb-8">
            Notre IA génère automatiquement des concepts publicitaires optimisés,
            des images professionnelles et vous guide pour publier sur Facebook et Instagram !
          </p>

          {canCreateCampaign() ? (
            <Button
              onClick={() => router.push('/campaigns/new')}
              className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-4 text-lg"
            >
              🚀 Créer ma première campagne
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-red-800 mb-2">
                  Limite de campagnes atteinte
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  Vous avez utilisé toutes vos campagnes pour ce mois.
                  Passez au plan Business pour un accès illimité !
                </p>
                <Button
                  onClick={() => router.push('/settings')}
                  className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90"
                >
                  Voir les plans
                </Button>
              </div>
            </div>
          )}

          {/* Exemples */}
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-vuvenu-dark mb-6">
              Exemples de campagnes générées
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 border border-vuvenu-rose/20 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✂️</span>
                  <span className="text-sm font-medium text-vuvenu-dark">Coiffure</span>
                </div>
                <div className="text-sm text-vuvenu-dark/80">
                  &quot;Avant/Après incroyable : cette technique révolutionnaire transforme vos cheveux en 2h&quot;
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-vuvenu-rose/20 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🥖</span>
                  <span className="text-sm font-medium text-vuvenu-dark">Boulangerie</span>
                </div>
                <div className="text-sm text-vuvenu-dark/80">
                  &quot;4h du matin : découvrez le secret de notre pain qui rend fou tout le quartier&quot;
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-vuvenu-rose/20 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🌸</span>
                  <span className="text-sm font-medium text-vuvenu-dark">Fleuriste</span>
                </div>
                <div className="text-sm text-vuvenu-dark/80">
                  &quot;Pourquoi cette composition fait pleurer de joie nos clients (technique exclusive)&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}