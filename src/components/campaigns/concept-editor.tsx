'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Edit3,
  Check,
  X,
  RotateCcw,
  Eye,
  Trash2,
  Copy,
  Sparkles,
  Target,
  Users,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

interface Concept {
  id: string
  campaign_id: string
  funnel_stage: 'awareness' | 'consideration' | 'conversion'
  name: string
  angle: string
  ad_type: string
  primary_text: string
  headline: string
  description?: string
  image_url?: string
  image_prompt?: string
  created_at: string
}

interface ConceptEditorProps {
  concepts: Concept[]
  onConceptsUpdate: (concepts: Concept[]) => void
  onSave?: () => Promise<void>
  readonly?: boolean
}

/**
 * Éditeur de concepts publicitaires
 * Permet de modifier, réorganiser et valider les concepts générés
 */
export function ConceptEditor({
  concepts,
  onConceptsUpdate,
  onSave,
  readonly = false
}: ConceptEditorProps) {
  const [editingConcept, setEditingConcept] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<Partial<Concept>>({})
  const [saving, setSaving] = useState(false)

  const handleEditStart = (concept: Concept) => {
    if (readonly) return

    setEditingConcept(concept.id)
    setEditedData({
      headline: concept.headline,
      primary_text: concept.primary_text,
      description: concept.description || '',
      ad_type: concept.ad_type,
      angle: concept.angle
    })
  }

  const handleEditCancel = () => {
    setEditingConcept(null)
    setEditedData({})
  }

  const handleEditSave = async (conceptId: string) => {
    const updatedConcepts = concepts.map(concept =>
      concept.id === conceptId
        ? { ...concept, ...editedData }
        : concept
    )

    onConceptsUpdate(updatedConcepts)
    setEditingConcept(null)
    setEditedData({})

    // Sauvegarder en base si fonction fournie
    if (onSave) {
      setSaving(true)
      try {
        await onSave()
        toast.success('Concept mis à jour avec succès')
      } catch (error) {
        toast.error('Erreur lors de la sauvegarde')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleDuplicate = (concept: Concept) => {
    if (readonly) return

    const duplicatedConcept: Concept = {
      ...concept,
      id: `${concept.id}-copy-${Date.now()}`,
      name: `${concept.name} (copie)`,
      headline: `${concept.headline} (copie)`
    }

    const updatedConcepts = [...concepts, duplicatedConcept]
    onConceptsUpdate(updatedConcepts)
    toast.success('Concept dupliqué')
  }

  const handleDelete = (conceptId: string) => {
    if (readonly || concepts.length <= 1) return

    const updatedConcepts = concepts.filter(c => c.id !== conceptId)
    onConceptsUpdate(updatedConcepts)
    toast.success('Concept supprimé')
  }

  const getFunnelStageInfo = (stage: string) => {
    switch (stage) {
      case 'awareness':
        return {
          label: 'Notoriété',
          icon: '👁️',
          color: 'bg-blue-100 text-blue-800',
          description: 'Faire connaître votre marque'
        }
      case 'consideration':
        return {
          label: 'Considération',
          icon: '🤔',
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Susciter l\'intérêt'
        }
      case 'conversion':
        return {
          label: 'Conversion',
          icon: '🎯',
          color: 'bg-green-100 text-green-800',
          description: 'Inciter à l\'action'
        }
      default:
        return {
          label: stage,
          icon: '📝',
          color: 'bg-gray-100 text-gray-800',
          description: 'Concept personnalisé'
        }
    }
  }

  const getAdTypeInfo = (adType: string) => {
    const types = {
      'video': { label: 'Vidéo', icon: '🎬' },
      'image': { label: 'Image', icon: '🖼️' },
      'carousel': { label: 'Carrousel', icon: '🎠' },
      'story': { label: 'Story', icon: '📱' },
      'collection': { label: 'Collection', icon: '📚' }
    }
    return types[adType as keyof typeof types] || { label: adType, icon: '📝' }
  }

  const conceptsByStage = concepts.reduce((acc, concept) => {
    const stage = concept.funnel_stage
    if (!acc[stage]) acc[stage] = []
    acc[stage].push(concept)
    return acc
  }, {} as Record<string, Concept[]>)

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Concepts publicitaires générés
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {concepts.length} concepts • {Object.keys(conceptsByStage).length} étapes du funnel
          </p>
        </div>

        {!readonly && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Réinitialiser les modifications
                window.location.reload()
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Concepts organisés par étape du funnel */}
      {Object.entries(conceptsByStage).map(([stage, stageConcepts]) => {
        const stageInfo = getFunnelStageInfo(stage)

        return (
          <div key={stage} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stageInfo.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {stageInfo.label}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {stageInfo.description}
                  </p>
                </div>
              </div>
              <Badge className={stageInfo.color}>
                {stageConcepts.length} concept{stageConcepts.length > 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {stageConcepts.map((concept) => {
                const isEditing = editingConcept === concept.id
                const adTypeInfo = getAdTypeInfo(concept.ad_type)

                return (
                  <Card key={concept.id} className={`
                    transition-all duration-200
                    ${isEditing ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}
                  `}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{adTypeInfo.icon}</span>
                          <div>
                            <CardTitle className="text-sm">
                              {concept.name || `Concept ${adTypeInfo.label}`}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {adTypeInfo.label}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {concept.angle}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {!readonly && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStart(concept)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(concept)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            {concepts.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(concept.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Image preview */}
                      {concept.image_url && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={concept.image_url}
                            alt={concept.headline}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Édition ou affichage */}
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Titre principal
                            </label>
                            <Input
                              value={editedData.headline || ''}
                              onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Texte principal
                            </label>
                            <Textarea
                              value={editedData.primary_text || ''}
                              onChange={(e) => setEditedData({ ...editedData, primary_text: e.target.value })}
                              rows={3}
                              className="mt-1"
                            />
                          </div>

                          {concept.description && (
                            <div>
                              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Description
                              </label>
                              <Textarea
                                value={editedData.description || ''}
                                onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                                rows={2}
                                className="mt-1"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Type d'annonce
                              </label>
                              <Select
                                value={editedData.ad_type || concept.ad_type}
                                onValueChange={(value) => setEditedData({ ...editedData, ad_type: value })}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="image">Image</SelectItem>
                                  <SelectItem value="video">Vidéo</SelectItem>
                                  <SelectItem value="carousel">Carrousel</SelectItem>
                                  <SelectItem value="story">Story</SelectItem>
                                  <SelectItem value="collection">Collection</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Angle publicitaire
                              </label>
                              <Input
                                value={editedData.angle || concept.angle}
                                onChange={(e) => setEditedData({ ...editedData, angle: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleEditSave(concept.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              disabled={saving}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Button>
                            <Button
                              onClick={handleEditCancel}
                              variant="outline"
                              size="sm"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Titre principal
                            </span>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                              {concept.headline}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Texte principal
                            </span>
                            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                              {concept.primary_text}
                            </div>
                          </div>

                          {concept.description && (
                            <div>
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Description
                              </span>
                              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                {concept.description}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Conseils d'optimisation */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                💡 Conseils pour optimiser vos concepts
              </h4>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <li>• <strong>Titres accrocheurs :</strong> Utilisez des questions, des chiffres, ou des bénéfices clairs</li>
                <li>• <strong>Call-to-action :</strong> Incitez à l'action avec des verbes d'action forts</li>
                <li>• <strong>Test A/B :</strong> Gardez plusieurs variantes pour tester les performances</li>
                <li>• <strong>Authenticité :</strong> Les témoignages et preuves sociales augmentent la conversion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}