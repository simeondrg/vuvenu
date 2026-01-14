'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Rocket,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Target,
  CreditCard,
  FileText,
  Copy,
  Share2,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface CampaignPublisherProps {
  campaign: any
  concepts: any[]
  audienceConfig: any
  onPublish?: (publishConfig: PublishConfig) => Promise<void>
  onExport?: (exportFormat: 'csv' | 'json' | 'pdf') => Promise<void>
  readonly?: boolean
}

interface PublishConfig {
  startDate: string
  endDate?: string
  selectedConcepts: string[]
  metaAccount?: string
  adSetName: string
  campaignObjective: string
  optimizeFor: string
  bidStrategy: string
  scheduledLaunch: boolean
}

/**
 * Composant de publication et export de campagnes Meta Ads
 * Gère la finalisation et le lancement des campagnes publicitaires
 */
export function CampaignPublisher({
  campaign,
  concepts,
  audienceConfig,
  onPublish,
  onExport,
  readonly = false
}: CampaignPublisherProps) {
  const [publishConfig, setPublishConfig] = useState<PublishConfig>({
    startDate: new Date().toISOString().split('T')[0],
    selectedConcepts: concepts.map(c => c.id),
    adSetName: `${campaign?.title || 'Campagne'} - ${new Date().toLocaleDateString('fr-FR')}`,
    campaignObjective: campaign?.input_data?.objective || 'traffic',
    optimizeFor: 'link_clicks',
    bidStrategy: 'lowest_cost',
    scheduledLaunch: false
  })

  const [isPublishing, setIsPublishing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [publishStep, setPublishStep] = useState<'config' | 'preview' | 'confirm' | 'publishing' | 'completed'>('config')

  // Simulated Meta accounts (in real implementation, fetch from Meta API)
  const metaAccounts = [
    { id: 'account_1', name: 'Mon Business - Compte Principal', status: 'active' },
    { id: 'account_2', name: 'Mon Business - Test', status: 'active' }
  ]

  const handleConceptToggle = (conceptId: string) => {
    if (readonly) return

    setPublishConfig(prev => ({
      ...prev,
      selectedConcepts: prev.selectedConcepts.includes(conceptId)
        ? prev.selectedConcepts.filter(id => id !== conceptId)
        : [...prev.selectedConcepts, conceptId]
    }))
  }

  const handlePublish = async () => {
    if (!onPublish || publishConfig.selectedConcepts.length === 0) return

    setIsPublishing(true)
    setPublishStep('publishing')

    try {
      await onPublish(publishConfig)
      setPublishStep('completed')
      toast.success('Campagne publiée avec succès sur Meta Ads !')
    } catch (error) {
      toast.error('Erreur lors de la publication')
      setPublishStep('config')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    if (!onExport) return

    setIsExporting(true)

    try {
      await onExport(format)
      toast.success(`Export ${format.toUpperCase()} téléchargé avec succès`)
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    } finally {
      setIsExporting(false)
    }
  }

  const getTotalBudget = () => {
    const dailyBudget = campaign?.input_data?.customBudget ||
      (campaign?.input_data?.budget === 'small' ? 10 :
       campaign?.input_data?.budget === 'medium' ? 20 : 50)

    return publishConfig.endDate ?
      dailyBudget * Math.ceil((new Date(publishConfig.endDate).getTime() - new Date(publishConfig.startDate).getTime()) / (1000 * 60 * 60 * 24)) :
      dailyBudget * 7 // Default to 1 week
  }

  const getCampaignSummary = () => {
    const selectedConceptsData = concepts.filter(c => publishConfig.selectedConcepts.includes(c.id))
    const audienceSize = audienceConfig?.estimatedReach?.max || 0

    return {
      concepts: selectedConceptsData.length,
      audience: audienceSize,
      budget: getTotalBudget(),
      duration: publishConfig.endDate ?
        Math.ceil((new Date(publishConfig.endDate).getTime() - new Date(publishConfig.startDate).getTime()) / (1000 * 60 * 60 * 24)) :
        7
    }
  }

  const campaignSummary = getCampaignSummary()

  if (publishStep === 'completed') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🎉 Campagne lancée avec succès !
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Votre campagne publicitaire est maintenant active sur Meta Ads.
          Vous pouvez suivre ses performances dans votre gestionnaire publicitaire Meta.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{campaignSummary.concepts}</div>
            <div className="text-sm text-gray-600">Annonces créées</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">{campaignSummary.audience.toLocaleString('fr-FR')}</div>
            <div className="text-sm text-gray-600">Portée estimée</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">{campaignSummary.budget}€</div>
            <div className="text-sm text-gray-600">Budget total</div>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => window.open('https://business.facebook.com/adsmanager', '_blank')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Voir dans Meta Ads Manager
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/campaigns'}
          >
            Retour aux campagnes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Publication & Export
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lancez votre campagne ou exportez vos créations
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Export...' : 'Export PDF'}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Configuration de publication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres de lancement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres de lancement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date de début</label>
                <input
                  type="date"
                  value={publishConfig.startDate}
                  onChange={(e) => setPublishConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={readonly}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date de fin (optionnel)</label>
                <input
                  type="date"
                  value={publishConfig.endDate || ''}
                  onChange={(e) => setPublishConfig(prev => ({ ...prev, endDate: e.target.value || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={readonly}
                  min={publishConfig.startDate}
                />
              </div>
            </div>

            {/* Nom de l'ensemble d'annonces */}
            <div>
              <label className="text-sm font-medium mb-2 block">Nom de l'ensemble d'annonces</label>
              <input
                type="text"
                value={publishConfig.adSetName}
                onChange={(e) => setPublishConfig(prev => ({ ...prev, adSetName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                disabled={readonly}
                placeholder="Mon ensemble d'annonces"
              />
            </div>

            {/* Optimisation */}
            <div>
              <label className="text-sm font-medium mb-2 block">Optimiser pour</label>
              <Select
                value={publishConfig.optimizeFor}
                onValueChange={(value) => setPublishConfig(prev => ({ ...prev, optimizeFor: value }))}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link_clicks">Clics sur le lien</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="reach">Portée</SelectItem>
                  <SelectItem value="landing_page_views">Consultations de page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stratégie d'enchère */}
            <div>
              <label className="text-sm font-medium mb-2 block">Stratégie d'enchère</label>
              <Select
                value={publishConfig.bidStrategy}
                onValueChange={(value) => setPublishConfig(prev => ({ ...prev, bidStrategy: value }))}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lowest_cost">Coût le plus bas</SelectItem>
                  <SelectItem value="cost_cap">Limitation du coût</SelectItem>
                  <SelectItem value="bid_cap">Limitation de l'enchère</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sélection des concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Concepts à publier
              <Badge variant="secondary">{publishConfig.selectedConcepts.length} sélectionnés</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-64 overflow-y-auto space-y-3">
              {concepts.map((concept) => (
                <div key={concept.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`concept-${concept.id}`}
                    checked={publishConfig.selectedConcepts.includes(concept.id)}
                    onCheckedChange={() => handleConceptToggle(concept.id)}
                    disabled={readonly}
                  />
                  <div className="flex-1 min-w-0">
                    {concept.image_url && (
                      <img
                        src={concept.image_url}
                        alt={concept.headline}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                    )}
                    <h4 className="font-medium text-sm truncate">{concept.headline}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{concept.primary_text}</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {concept.funnel_stage}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {concept.ad_type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé de campagne */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Résumé de campagne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{campaignSummary.concepts}</div>
              <div className="text-sm text-gray-600">Concepts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {campaignSummary.audience.toLocaleString('fr-FR')}
              </div>
              <div className="text-sm text-gray-600">Portée estimée</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{campaignSummary.budget}€</div>
              <div className="text-sm text-gray-600">Budget total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{campaignSummary.duration}j</div>
              <div className="text-sm text-gray-600">Durée</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-sm space-y-2">
            <div><strong>Objectif :</strong> {campaign?.input_data?.objective}</div>
            <div><strong>Audience :</strong> {audienceConfig?.ageRange?.[0]}-{audienceConfig?.ageRange?.[1]} ans à La Réunion</div>
            <div><strong>Optimisation :</strong> {publishConfig.optimizeFor}</div>
            <div><strong>Début :</strong> {new Date(publishConfig.startDate).toLocaleDateString('fr-FR')}</div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes importantes */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important :</strong> Assurez-vous d'avoir vérifié tous les paramètres avant publication.
          Une fois la campagne lancée, certains éléments ne pourront plus être modifiés sans créer une nouvelle campagne.
        </AlertDescription>
      </Alert>

      {/* Actions de publication */}
      {!readonly && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h4 className="text-lg font-semibold">Prêt à lancer votre campagne ?</h4>

              {/* Checklist */}
              <div className="text-left max-w-md mx-auto space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Concepts publicitaires validés</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Images générées</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Audience configurée</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Budget défini</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({
                      campaign: campaign?.title,
                      concepts: concepts.length,
                      budget: campaignSummary.budget,
                      audience: campaignSummary.audience
                    }, null, 2))
                    toast.success('Résumé copié dans le presse-papiers')
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier résumé
                </Button>

                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || publishConfig.selectedConcepts.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  {isPublishing ? 'Publication...' : 'Publier sur Meta Ads'}
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                La publication peut prendre quelques minutes. Vous recevrez une confirmation une fois la campagne active.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}