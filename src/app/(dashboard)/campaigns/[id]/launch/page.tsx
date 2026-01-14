'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ConceptEditor } from '@/components/campaigns/concept-editor'
import { AudienceTargeting } from '@/components/campaigns/audience-targeting'
import { CampaignPublisher } from '@/components/campaigns/campaign-publisher'

// Étapes du wizard
const wizardSteps = [
  { id: 1, name: 'Configuration', description: 'Vérification des paramètres' },
  { id: 2, name: 'Génération IA', description: 'Création des concepts publicitaires' },
  { id: 3, name: 'Images IA', description: 'Génération des visuels' },
  { id: 4, name: 'Validation', description: 'Revue des créations' },
  { id: 5, name: 'Audiences Meta', description: 'Configuration du ciblage' },
  { id: 6, name: 'Budget final', description: 'Validation du budget' },
  { id: 7, name: 'Publication', description: 'Export vers Meta Ads Manager' }
]

// Types d'angles publicitaires selon le secteur
const adAngles = {
  coiffure: [
    { stage: 'awareness', angle: 'Transformation spectaculaire', copy: 'Cette technique révolutionnaire transforme vos cheveux en 2h' },
    { stage: 'awareness', angle: 'Expertise professionnelle', copy: 'Découvrez pourquoi nos clients font 30 minutes de route' },
    { stage: 'consideration', angle: 'Avant/après réel', copy: 'Transformation complète : de cheveux ternes à une chevelure de rêve' },
    { stage: 'conversion', angle: 'Offre première visite', copy: 'Première visite : coupe + couleur à -40% ce mois-ci uniquement' },
    { stage: 'conversion', angle: 'Urgence disponibilité', copy: 'Plus que 3 créneaux disponibles cette semaine' }
  ],
  restaurant: [
    { stage: 'awareness', angle: 'Coulisses chef', copy: '4h du matin : découvrez le secret de nos plats qui rendent fou' },
    { stage: 'awareness', angle: 'Spécialité unique', copy: 'Cette recette de grand-mère fait voyager vos papilles' },
    { stage: 'consideration', angle: 'Ambiance et qualité', copy: 'Pourquoi nos clients reviennent chaque semaine depuis 15 ans' },
    { stage: 'conversion', angle: 'Menu découverte', copy: 'Menu 3 services à 25€ : goûtez notre savoir-faire' },
    { stage: 'conversion', angle: 'Réservation facile', copy: 'Table pour ce soir ? Appelez-nous, on s&apos;arrange toujours' }
  ],
  boulangerie: [
    { stage: 'awareness', angle: 'Tradition artisanale', copy: 'Pétrissage à la main depuis 5h : le vrai savoir-faire' },
    { stage: 'awareness', angle: 'Fraîcheur quotidienne', copy: 'Nos viennoiseries sortent du four toutes les 2h' },
    { stage: 'consideration', angle: 'Ingrédients locaux', copy: 'Farine du moulin voisin, beurre de la ferme : 100% local' },
    { stage: 'conversion', angle: 'Commande spéciale', copy: 'Gâteau d&apos;anniversaire sur-mesure en 24h' },
    { stage: 'conversion', angle: 'Fidélité récompensée', copy: '10ème pain gratuit avec notre carte de fidélité' }
  ],
  fleuriste: [
    { stage: 'awareness', angle: 'Création sur-mesure', copy: 'Cette composition fait pleurer de joie nos clients' },
    { stage: 'awareness', angle: 'Fraîcheur garantie', copy: 'Nos fleurs arrivent directement du marché de Rungis' },
    { stage: 'consideration', angle: 'Conseils d&apos;expert', copy: 'Comment faire durer vos bouquets 2 semaines (technique secrète)' },
    { stage: 'conversion', angle: 'Livraison express', copy: 'Bouquet livré en 2h partout en ville' },
    { stage: 'conversion', angle: 'Occasion spéciale', copy: 'Saint-Valentin : compositions romantiques dès 35€' }
  ],
  fitness: [
    { stage: 'awareness', angle: 'Transformation membre', copy: 'Il a perdu 15kg en 3 mois : découvrez sa méthode' },
    { stage: 'awareness', angle: 'Coaching personnalisé', copy: 'Pourquoi 95% de nos membres atteignent leurs objectifs' },
    { stage: 'consideration', angle: 'Expertise nutrition', copy: 'Les 3 erreurs qui sabotent votre perte de poids' },
    { stage: 'conversion', angle: 'Essai gratuit', copy: 'Séance découverte gratuite + bilan forme offert' },
    { stage: 'conversion', angle: 'Promo nouveau membre', copy: 'Abonnement 3 mois à 99€ au lieu de 150€' }
  ],
  mode: [
    { stage: 'awareness', angle: 'Tendance exclusive', copy: 'Cette pièce unique va révolutionner votre style' },
    { stage: 'awareness', angle: 'Style personnel', copy: 'Trouvez VOTRE style en 30 minutes avec nos conseillères' },
    { stage: 'consideration', angle: 'Qualité artisanale', copy: 'Nos pièces sont sélectionnées chez 15 créateurs européens' },
    { stage: 'conversion', angle: 'Collection privée', copy: 'Vente privée -50% : accès VIP ce weekend uniquement' },
    { stage: 'conversion', angle: 'Personal shopping', copy: 'Séance shopping personnalisée gratuite sur RDV' }
  ]
}

export default function CampaignLaunchPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [concepts, setConcepts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [audienceConfig, setAudienceConfig] = useState<any>(null)
  const [publishConfig, setPublishConfig] = useState<any>(null)

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
          router.push('/campaigns')
          return
        }

        setCampaign(campaignData)
        setCurrentStep(campaignData.wizard_step || 1)

        // Charger le profil utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUserProfile(profile)

        // Charger les concepts existants
        const { data: conceptsData } = await supabase
          .from('campaign_concepts')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: true })

        if (conceptsData) {
          setConcepts(conceptsData)
        }

      } catch (error) {
        console.error('Erreur chargement campagne:', error)
        setError('Erreur lors du chargement')
      }
    }

    if (campaignId) {
      loadCampaignData()
    }
  }, [campaignId, router])

  const generateConcepts = async () => {
    if (!campaign || concepts.length > 0) return

    setLoading(true)
    setError('')

    try {
      const industry = campaign.input_data.industry
      const angles = adAngles[industry as keyof typeof adAngles] || adAngles.restaurant

      // Générer les 5 concepts
      const response = await fetch('/api/generate/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: campaign.id,
          industry: industry,
          objective: campaign.input_data.objective,
          budget: campaign.input_data.budget,
          customBudget: campaign.input_data.customBudget,
          targetLocation: campaign.input_data.targetLocation,
          specialOffer: campaign.input_data.specialOffer,
          businessName: userProfile?.business_name,
          angles: angles
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur génération')
      }

      setConcepts(data.concepts)

      // Passer à l'étape suivante
      await updateWizardStep(3)

    } catch (error) {
      console.error('Erreur génération concepts:', error)
      setError('Erreur lors de la génération. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const generateImages = async () => {
    if (!concepts.length) return

    setLoading(true)
    setError('')

    try {
      for (const concept of concepts) {
        if (concept.image_url) continue // Déjà généré

        const response = await fetch('/api/generate/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conceptId: concept.id,
            industry: campaign.input_data.industry,
            adType: concept.ad_type,
            businessName: userProfile?.business_name
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erreur génération image')
        }

        // Mettre à jour le concept avec l'URL de l'image
        const updatedConcepts = concepts.map(c =>
          c.id === concept.id
            ? { ...c, image_url: data.imageUrl, image_prompt: data.prompt }
            : c
        )
        setConcepts(updatedConcepts)
      }

      // Passer à l'étape suivante
      await updateWizardStep(4)

    } catch (error) {
      console.error('Erreur génération images:', error)
      setError('Erreur lors de la génération des images. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const updateWizardStep = async (step: number) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ wizard_step: step, updated_at: new Date().toISOString() })
        .eq('id', campaignId)

      if (!error) {
        setCurrentStep(step)
      }
    } catch (error) {
      console.error('Erreur mise à jour step:', error)
    }
  }

  const saveConceptsChanges = async () => {
    try {
      for (const concept of concepts) {
        await supabase
          .from('campaign_concepts')
          .update({
            headline: concept.headline,
            primary_text: concept.primary_text,
            description: concept.description,
            ad_type: concept.ad_type,
            angle: concept.angle,
            updated_at: new Date().toISOString()
          })
          .eq('id', concept.id)
      }
    } catch (error) {
      console.error('Erreur sauvegarde concepts:', error)
      throw error
    }
  }

  const handlePublishCampaign = async (publishConfigData: any) => {
    try {
      // In real implementation: Call Meta Ads API
      // For now, just simulate the process
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Update campaign status
      await supabase
        .from('campaigns')
        .update({
          status: 'launched',
          wizard_step: 7,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)

      setPublishConfig(publishConfigData)
    } catch (error) {
      console.error('Erreur publication:', error)
      throw error
    }
  }

  const handleExportCampaign = async (format: string) => {
    // In real implementation: Generate and download export file
    console.log(`Exporting campaign in ${format} format`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const nextStep = () => {
    if (currentStep < 7) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      updateWizardStep(newStep)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      updateWizardStep(newStep)
    }
  }

  if (!campaign) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">⚡</span>
          </div>
          <p>Chargement de la campagne...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-2">
                {campaign.title}
              </h1>
              <p className="text-lg text-vuvenu-dark/80">
                Wizard de lancement Meta Ads
              </p>
            </div>
            <div className="text-sm text-vuvenu-dark/60">
              Étape {currentStep}/7
            </div>
          </div>

          {/* Barre de progression */}
          <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20 mb-8">
            <div className="flex items-center justify-between mb-4">
              {wizardSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center text-center ${
                    step.id <= currentStep ? 'text-vuvenu-dark' : 'text-vuvenu-dark/40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                      step.id < currentStep
                        ? 'bg-vuvenu-lime text-vuvenu-dark'
                        : step.id === currentStep
                        ? 'bg-vuvenu-blue text-white'
                        : 'bg-vuvenu-rose/30'
                    }`}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <div className="text-xs font-medium">{step.name}</div>
                  <div className="text-xs text-vuvenu-dark/60">{step.description}</div>
                </div>
              ))}
            </div>

            <div className="w-full bg-vuvenu-rose/30 rounded-full h-2">
              <div
                className="bg-vuvenu-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Contenu selon l'étape */}
        <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">

          {/* Étape 1: Configuration */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
                📋 Vérification de la configuration
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-vuvenu-dark/70">Secteur d&apos;activité</span>
                    <div className="text-lg font-semibold text-vuvenu-dark capitalize">
                      {campaign.input_data.industry}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-vuvenu-dark/70">Objectif</span>
                    <div className="text-lg font-semibold text-vuvenu-dark capitalize">
                      {campaign.input_data.objective}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-vuvenu-dark/70">Budget</span>
                    <div className="text-lg font-semibold text-vuvenu-dark">
                      {campaign.input_data.customBudget
                        ? `${campaign.input_data.customBudget}€/jour`
                        : campaign.input_data.budget === 'small' ? '10€/jour'
                        : campaign.input_data.budget === 'medium' ? '20€/jour'
                        : '50€/jour'
                      }
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {campaign.input_data.targetLocation && (
                    <div>
                      <span className="text-sm font-medium text-vuvenu-dark/70">Zone de ciblage</span>
                      <div className="text-lg font-semibold text-vuvenu-dark">
                        {campaign.input_data.targetLocation}
                      </div>
                    </div>
                  )}
                  {campaign.input_data.specialOffer && (
                    <div>
                      <span className="text-sm font-medium text-vuvenu-dark/70">Offre spéciale</span>
                      <div className="text-lg font-semibold text-vuvenu-dark">
                        {campaign.input_data.specialOffer}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-vuvenu-lime/10 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-vuvenu-dark mb-3">
                  🚀 Prochaines étapes de génération automatique :
                </h3>
                <ul className="space-y-2 text-sm text-vuvenu-dark/80">
                  <li>✨ <strong>5 concepts publicitaires</strong> adaptés à votre secteur avec copy optimisé</li>
                  <li>🎨 <strong>Images IA professionnelles</strong> générées automatiquement avec Gemini Imagen</li>
                  <li>🎯 <strong>Configuration ciblage</strong> Meta Ads optimisée pour votre zone</li>
                  <li>📊 <strong>Export direct</strong> vers Meta Ads Manager avec guide étape par étape</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={nextStep}
                  className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                >
                  Commencer la génération IA →
                </Button>
              </div>
            </div>
          )}

          {/* Étape 2: Génération des concepts */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
                🤖 Génération des concepts publicitaires
              </h2>

              {concepts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-vuvenu-blue/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    {loading ? (
                      <span className="text-3xl animate-spin">⚡</span>
                    ) : (
                      <span className="text-3xl">🎯</span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-vuvenu-dark mb-4">
                    {loading ? 'Génération en cours...' : 'Prêt à générer vos concepts publicitaires'}
                  </h3>

                  <p className="text-vuvenu-dark/80 max-w-md mx-auto mb-8">
                    {loading
                      ? 'Notre IA crée 5 concepts publicitaires optimisés pour votre secteur et votre objectif.'
                      : 'Notre IA va analyser votre secteur et générer automatiquement 5 concepts publicitaires avec hooks viraux et copy optimisé.'
                    }
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                    >
                      ← Retour
                    </Button>
                    <Button
                      onClick={generateConcepts}
                      disabled={loading}
                      className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                    >
                      {loading ? 'Génération...' : '🚀 Générer les concepts'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-700 font-medium">
                      ✅ {concepts.length} concepts publicitaires générés avec succès !
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {concepts.map((concept, index) => (
                      <div key={concept.id} className="border border-vuvenu-rose/40 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">
                            {concept.funnel_stage === 'awareness' ? '👁️' :
                             concept.funnel_stage === 'consideration' ? '🤔' : '🎯'}
                          </span>
                          <div>
                            <div className="font-semibold text-vuvenu-dark">
                              Concept #{index + 1}
                            </div>
                            <div className="text-xs text-vuvenu-blue capitalize">
                              {concept.funnel_stage} • {concept.ad_type}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide">
                              Titre principal
                            </span>
                            <div className="text-sm font-medium text-vuvenu-dark">
                              {concept.headline}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide">
                              Texte principal
                            </span>
                            <div className="text-sm text-vuvenu-dark/80">
                              {concept.primary_text}
                            </div>
                          </div>

                          {concept.description && (
                            <div>
                              <span className="text-xs font-medium text-vuvenu-dark/70 uppercase tracking-wide">
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

                  <div className="flex justify-between">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                    >
                      ← Retour
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                    >
                      Générer les images →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Étape 3: Génération des images */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
                🎨 Génération des images IA
              </h2>

              {concepts.every(c => c.image_url) ? (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-700 font-medium">
                      ✅ Toutes les images ont été générées avec succès !
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {concepts.map((concept, index) => (
                      <div key={concept.id} className="border border-vuvenu-rose/40 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-vuvenu-lime/10 to-vuvenu-blue/10 flex items-center justify-center">
                          {concept.image_url ? (
                            <img
                              src={concept.image_url}
                              alt={`Concept ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl">🖼️</span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="font-semibold text-vuvenu-dark text-sm mb-1">
                            Concept #{index + 1}
                          </div>
                          <div className="text-xs text-vuvenu-blue capitalize mb-2">
                            {concept.ad_type}
                          </div>
                          <div className="text-xs text-vuvenu-dark/70">
                            {concept.headline}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                    >
                      ← Retour
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                    >
                      Valider les créations →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-vuvenu-violet/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    {loading ? (
                      <span className="text-3xl animate-spin">🎨</span>
                    ) : (
                      <span className="text-3xl">🖼️</span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-vuvenu-dark mb-4">
                    {loading ? 'Génération des images en cours...' : 'Prêt à générer les images'}
                  </h3>

                  <p className="text-vuvenu-dark/80 max-w-md mx-auto mb-8">
                    {loading
                      ? `Génération avec Gemini Imagen en cours... ${concepts.filter(c => c.image_url).length}/${concepts.length} terminées`
                      : 'Gemini Imagen va créer des visuels professionnels adaptés à chaque concept publicitaire.'
                    }
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                    >
                      ← Retour
                    </Button>
                    <Button
                      onClick={generateImages}
                      disabled={loading}
                      className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90 font-semibold px-8 py-3"
                    >
                      {loading ? 'Génération...' : '🎨 Générer les images'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Étape 4: Validation des concepts */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
                ✏️ Validation et édition des concepts
              </h2>

              <ConceptEditor
                concepts={concepts}
                onConceptsUpdate={setConcepts}
                onSave={saveConceptsChanges}
              />

              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                >
                  ← Retour
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                >
                  Configurer les audiences →
                </Button>
              </div>
            </div>
          )}

          {/* Étape 5: Configuration des audiences */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
                🎯 Configuration des audiences Meta
              </h2>

              <AudienceTargeting
                industry={campaign.input_data.industry}
                location={campaign.input_data.targetLocation}
                initialData={audienceConfig}
                onAudienceUpdate={setAudienceConfig}
              />

              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                >
                  ← Retour
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!audienceConfig}
                  className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                >
                  Valider le budget →
                </Button>
              </div>
            </div>
          )}

          {/* Étape 6: Validation du budget */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
                💰 Validation du budget final
              </h2>

              <div className="space-y-6">
                {/* Récapitulatif budget */}
                <div className="bg-white rounded-2xl p-6 border border-vuvenu-rose/20">
                  <h3 className="text-lg font-semibold text-vuvenu-dark mb-4">
                    Récapitulatif des coûts
                  </h3>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-vuvenu-blue/10 rounded-lg">
                      <div className="text-2xl font-bold text-vuvenu-dark">
                        {campaign.input_data.customBudget ||
                         (campaign.input_data.budget === 'small' ? '10' :
                          campaign.input_data.budget === 'medium' ? '20' : '50')}€
                      </div>
                      <div className="text-sm text-vuvenu-dark/70">Budget quotidien</div>
                    </div>

                    <div className="text-center p-4 bg-vuvenu-violet/10 rounded-lg">
                      <div className="text-2xl font-bold text-vuvenu-dark">
                        {concepts.length}
                      </div>
                      <div className="text-sm text-vuvenu-dark/70">Annonces créées</div>
                    </div>

                    <div className="text-center p-4 bg-vuvenu-lime/10 rounded-lg">
                      <div className="text-2xl font-bold text-vuvenu-dark">
                        {audienceConfig?.estimatedReach?.max ?
                          Math.round(audienceConfig.estimatedReach.max / 1000) + 'k' :
                          '5k'}
                      </div>
                      <div className="text-sm text-vuvenu-dark/70">Portée estimée</div>
                    </div>
                  </div>

                  <div className="bg-vuvenu-lime/10 rounded-lg p-4">
                    <h4 className="font-semibold text-vuvenu-dark mb-2">
                      💡 Recommandations budget
                    </h4>
                    <ul className="text-sm text-vuvenu-dark/80 space-y-1">
                      <li>• Commencez avec un budget modéré pour tester les performances</li>
                      <li>• Augmentez le budget sur les annonces les plus performantes</li>
                      <li>• Surveillez le coût par clic (CPC) et ajustez si nécessaire</li>
                      <li>• Pour La Réunion, 15-25€/jour est souvent optimal</li>
                    </ul>
                  </div>
                </div>

                {/* Prévisions */}
                <div className="bg-white rounded-2xl p-6 border border-vuvenu-rose/20">
                  <h3 className="text-lg font-semibold text-vuvenu-dark mb-4">
                    📊 Prévisions de performance
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-vuvenu-dark mb-3">Estimations hebdomadaires</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Impressions :</span>
                          <span className="font-medium">15 000 - 25 000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Clics :</span>
                          <span className="font-medium">300 - 800</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPC estimé :</span>
                          <span className="font-medium">0,35€ - 0,85€</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux de clic :</span>
                          <span className="font-medium">2% - 4%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-vuvenu-dark mb-3">Objectifs recommandés</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>CPC &lt; 1€</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>CTR &gt; 2%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>CPM &lt; 15€</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Fréquence &lt; 3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                >
                  ← Retour
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                >
                  Finaliser et publier →
                </Button>
              </div>
            </div>
          )}

          {/* Étape 7: Publication */}
          {currentStep === 7 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
                🚀 Publication sur Meta Ads
              </h2>

              <CampaignPublisher
                campaign={campaign}
                concepts={concepts}
                audienceConfig={audienceConfig}
                onPublish={handlePublishCampaign}
                onExport={handleExportCampaign}
              />

              {!publishConfig && (
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                  >
                    ← Retour
                  </Button>
                  <Button
                    onClick={() => router.push('/campaigns')}
                    variant="outline"
                    className="border-vuvenu-dark text-vuvenu-dark"
                  >
                    Retour aux campagnes
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}