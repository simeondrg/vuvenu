'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<any>(null)
  const [concepts, setConcepts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        // Charger les données de la campagne
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .eq('user_id', session.user.id)
          .single()

        if (campaignError || !campaignData) {
          setError('Campagne non trouvée')
          return
        }

        setCampaign(campaignData)

        // Charger les concepts
        const { data: conceptsData, error: conceptsError } = await supabase
          .from('campaign_concepts')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: true })

        if (conceptsError) {
          console.error('Erreur chargement concepts:', conceptsError)
        } else {
          setConcepts(conceptsData || [])
        }

      } catch (error) {
        console.error('Erreur chargement campagne:', error)
        setError('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    if (campaignId) {
      loadCampaignData()
    }
  }, [campaignId, router])

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

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'awareness': return '👁️'
      case 'consideration': return '🤔'
      case 'conversion': return '🎯'
      default: return '📊'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'bg-vuvenu-blue/20 text-vuvenu-blue'
      case 'consideration': return 'bg-vuvenu-violet/20 text-vuvenu-violet'
      case 'conversion': return 'bg-vuvenu-lime/20 text-vuvenu-dark'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">⚡</span>
          </div>
          <p>Chargement de la campagne...</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-vuvenu-dark mb-4">
            {error || 'Campagne non trouvée'}
          </h2>
          <Button
            onClick={() => router.push('/campaigns')}
            className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform"
          >
            ← Retour aux campagnes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/campaigns"
                className="text-vuvenu-blue hover:text-vuvenu-dark transition-colors"
              >
                ← Retour aux campagnes
              </Link>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-2">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(campaign.status)}`}>
                <span>{getStatusIcon(campaign.status)}</span>
                <span className="capitalize">{campaign.status || 'Draft'}</span>
              </div>
              <div className="text-sm text-vuvenu-dark/60">
                Créée le {new Date(campaign.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progression wizard */}
            <div className="bg-white rounded-xl p-4 shadow-vuvenu border border-vuvenu-rose/20">
              <div className="text-sm text-vuvenu-dark/70 mb-1">Wizard</div>
              <div className="text-xl font-bold text-vuvenu-dark">
                {campaign.wizard_step || 0}/7
              </div>
              <div className="text-xs text-vuvenu-dark/60">
                étapes
              </div>
            </div>

            {/* Actions */}
            {campaign.wizard_step < 7 && (
              <Button
                onClick={() => router.push(`/campaigns/${campaign.id}/launch`)}
                className="bg-vuvenu-blue text-white hover:bg-vuvenu-blue/90 font-semibold px-6 py-3"
              >
                Continuer le wizard →
              </Button>
            )}
          </div>
        </div>

        {/* Configuration de la campagne */}
        <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20 mb-8">
          <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
            📋 Configuration
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <span className="text-sm font-medium text-vuvenu-dark/70 block mb-1">Secteur</span>
              <div className="text-lg font-semibold text-vuvenu-dark capitalize">
                {campaign.input_data?.industry || 'Non défini'}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-vuvenu-dark/70 block mb-1">Objectif</span>
              <div className="text-lg font-semibold text-vuvenu-dark capitalize">
                {campaign.input_data?.objective || 'Non défini'}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-vuvenu-dark/70 block mb-1">Budget</span>
              <div className="text-lg font-semibold text-vuvenu-dark">
                {campaign.input_data?.customBudget
                  ? `${campaign.input_data.customBudget}€/jour`
                  : campaign.input_data?.budget === 'small' ? '10€/jour'
                  : campaign.input_data?.budget === 'medium' ? '20€/jour'
                  : campaign.input_data?.budget === 'large' ? '50€/jour'
                  : 'Non défini'
                }
              </div>
            </div>

            {campaign.input_data?.targetLocation && (
              <div>
                <span className="text-sm font-medium text-vuvenu-dark/70 block mb-1">Zone de ciblage</span>
                <div className="text-lg font-semibold text-vuvenu-dark">
                  {campaign.input_data.targetLocation}
                </div>
              </div>
            )}

            {campaign.input_data?.specialOffer && (
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-vuvenu-dark/70 block mb-1">Offre spéciale</span>
                <div className="text-lg font-semibold text-vuvenu-dark">
                  {campaign.input_data.specialOffer}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Concepts générés */}
        {concepts.length > 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-vuvenu-dark">
                🎯 Concepts publicitaires
              </h2>
              <div className="text-sm text-vuvenu-dark/60">
                {concepts.length} concept{concepts.length > 1 ? 's' : ''} généré{concepts.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concepts.map((concept, index) => (
                <div
                  key={concept.id}
                  className="border border-vuvenu-rose/40 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-vuvenu-lime/10 to-vuvenu-blue/10 flex items-center justify-center">
                    {concept.image_url ? (
                      <img
                        src={concept.image_url}
                        alt={`Concept ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg'
                        }}
                      />
                    ) : (
                      <div className="text-center text-vuvenu-dark/60">
                        <span className="text-4xl mb-2 block">🖼️</span>
                        <span className="text-sm">Image en cours de génération</span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStageIcon(concept.funnel_stage)}</span>
                        <div>
                          <div className="font-semibold text-vuvenu-dark text-sm">
                            {concept.name || `Concept #${index + 1}`}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${getStageColor(concept.funnel_stage)}`}>
                            {concept.funnel_stage}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Angle */}
                    {concept.angle && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide block">
                          Angle marketing
                        </span>
                        <div className="text-sm text-vuvenu-dark/80">
                          {concept.angle}
                        </div>
                      </div>
                    )}

                    {/* Type d'ad */}
                    {concept.ad_type && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide block">
                          Type de publicité
                        </span>
                        <div className="text-sm text-vuvenu-dark/80">
                          {concept.ad_type}
                        </div>
                      </div>
                    )}

                    {/* Titre principal */}
                    <div className="mb-3">
                      <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide block">
                        Titre principal
                      </span>
                      <div className="text-sm font-medium text-vuvenu-dark">
                        {concept.headline}
                      </div>
                    </div>

                    {/* Texte principal */}
                    <div className="mb-3">
                      <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide block">
                        Texte principal
                      </span>
                      <div className="text-sm text-vuvenu-dark/80 line-clamp-3">
                        {concept.primary_text}
                      </div>
                    </div>

                    {/* Description */}
                    {concept.description && (
                      <div>
                        <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide block">
                          Description
                        </span>
                        <div className="text-sm text-vuvenu-dark/80">
                          {concept.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions en bas */}
            <div className="border-t border-vuvenu-rose/20 pt-6 mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push(`/campaigns/${campaign.id}/launch`)}
                  className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold"
                >
                  🚀 Continuer vers la publication
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Fonction d'export/téléchargement
                    alert('Fonction d\'export en cours de développement')
                  }}
                  variant="outline"
                  className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                >
                  📁 Exporter les concepts
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* État sans concepts */
          <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-vuvenu-rose/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-vuvenu-dark mb-4">
                Aucun concept généré
              </h3>
              <p className="text-vuvenu-dark/80 max-w-md mx-auto mb-8">
                Cette campagne n&apos;a pas encore de concepts publicitaires.
                Utilisez le wizard pour générer automatiquement 5 concepts avec IA.
              </p>
              <Button
                onClick={() => router.push(`/campaigns/${campaign.id}/launch`)}
                className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold"
              >
                🚀 Lancer le wizard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}