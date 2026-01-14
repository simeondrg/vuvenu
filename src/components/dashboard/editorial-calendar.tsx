'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar as CalendarIcon,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Target,
  Lightbulb,
  TrendingUp,
  Sun,
  Cloud,
  Snowflake,
  Leaf
} from 'lucide-react'
import { toast } from 'sonner'

interface ContentIdea {
  id: string
  date: string
  title: string
  format: string
  platform: string
  status: 'idea' | 'planned' | 'created' | 'published'
  description?: string
  priority: 'low' | 'medium' | 'high'
  seasonalTag?: string
}

interface EditorialCalendarProps {
  userProfile: any
  scripts: any[]
}

/**
 * Calendrier éditorial pour planifier le contenu VuVenu
 * Aide les utilisateurs à organiser leur stratégie de contenu
 */
export function EditorialCalendar({ userProfile, scripts }: EditorialCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingIdea, setEditingIdea] = useState<ContentIdea | null>(null)
  const [currentWeek, setCurrentWeek] = useState(0)

  // Formulaire pour nouvelle idée
  const [newIdea, setNewIdea] = useState({
    title: '',
    format: 'Reels',
    platform: 'Instagram',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  useEffect(() => {
    generateContentSuggestions()
  }, [userProfile])

  const generateContentSuggestions = () => {
    const suggestions = generateSeasonalSuggestions()
    const industrialSuggestions = generateIndustrySuggestions()

    setContentIdeas([...suggestions, ...industrialSuggestions])
  }

  const generateSeasonalSuggestions = (): ContentIdea[] => {
    const now = new Date()
    const month = now.getMonth()

    // Suggestions saisonnières
    const seasonalContent = {
      winter: [
        { title: "Offres spéciales hiver", tag: "❄️ Hiver" },
        { title: "Ambiance cocooning", tag: "❄️ Hiver" },
        { title: "Nouvelle année, nouveaux projets", tag: "🎊 Nouvel An" }
      ],
      spring: [
        { title: "Renouveau de printemps", tag: "🌸 Printemps" },
        { title: "Nettoyage de printemps", tag: "🌸 Printemps" },
        { title: "Couleurs de saison", tag: "🌸 Printemps" }
      ],
      summer: [
        { title: "Spécial vacances", tag: "☀️ Été" },
        { title: "Horaires d'été", tag: "☀️ Été" },
        { title: "Fraîcheur estivale", tag: "☀️ Été" }
      ],
      autumn: [
        { title: "Rentrée en beauté", tag: "🍂 Automne" },
        { title: "Couleurs automnales", tag: "🍂 Automne" },
        { title: "Préparation hiver", tag: "🍂 Automne" }
      ]
    }

    const currentSeason = month >= 3 && month <= 5 ? 'spring' :
                         month >= 6 && month <= 8 ? 'summer' :
                         month >= 9 && month <= 11 ? 'autumn' : 'winter'

    const currentSeasonContent = seasonalContent[currentSeason]

    return currentSeasonContent.map((content, index) => ({
      id: `seasonal-${index}`,
      date: new Date(now.getTime() + (index + 1) * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      title: content.title,
      format: 'Reels',
      platform: 'Instagram',
      status: 'idea' as const,
      priority: 'medium' as const,
      seasonalTag: content.tag,
      description: `Contenu saisonnier adapté à ${userProfile?.business_type || 'votre secteur'}`
    }))
  }

  const generateIndustrySuggestions = (): ContentIdea[] => {
    const industryIdeas = {
      restaurant: [
        { title: "Plat du jour en vidéo", desc: "Montrez la préparation de votre spécialité" },
        { title: "Coulisses cuisine matin", desc: "L'équipe prépare la journée" },
        { title: "Client satisfait témoigne", desc: "Avis authentique en story" }
      ],
      coiffure: [
        { title: "Transformation avant/après", desc: "Relooking spectaculaire" },
        { title: "Tutoriel coiffage rapide", desc: "Conseils pour clients" },
        { title: "Nouveaux produits", desc: "Présentation gamme professionnelle" }
      ],
      fitness: [
        { title: "Exercice du jour", desc: "Mouvement simple à reproduire" },
        { title: "Témoignage transformation", desc: "Membre partage ses résultats" },
        { title: "Nutrition tip", desc: "Conseil alimentaire rapide" }
      ],
      mode: [
        { title: "Look du jour", desc: "Association de pièces tendances" },
        { title: "Arrivage nouvelle collection", desc: "Première présentation" },
        { title: "Style selon morphologie", desc: "Conseils personnalisés" }
      ]
    }

    const businessType = userProfile?.business_type
    const ideas = industryIdeas[businessType as keyof typeof industryIdeas] || industryIdeas.restaurant

    return ideas.map((idea, index) => ({
      id: `industry-${index}`,
      date: new Date(Date.now() + (index + 4) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      title: idea.title,
      format: index % 2 === 0 ? 'Reels' : 'TikTok',
      platform: index % 2 === 0 ? 'Instagram' : 'TikTok',
      status: 'idea' as const,
      priority: 'high' as const,
      description: idea.desc
    }))
  }

  const getWeekDates = (weekOffset: number = 0) => {
    const today = new Date()
    const currentDay = today.getDay() || 7 // Lundi = 1, Dimanche = 7
    const monday = new Date(today.getTime() - (currentDay - 1) * 24 * 60 * 60 * 1000)
    monday.setDate(monday.getDate() + weekOffset * 7)

    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      week.push(date)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  const getContentForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return contentIdeas.filter(idea => idea.date === dateStr)
  }

  const addContentIdea = () => {
    if (!newIdea.title.trim()) {
      toast.error('Le titre est requis')
      return
    }

    const dateStr = selectedDate.toISOString().split('T')[0]

    const idea: ContentIdea = {
      id: `custom-${Date.now()}`,
      date: dateStr,
      title: newIdea.title,
      format: newIdea.format,
      platform: newIdea.platform,
      status: 'planned',
      priority: newIdea.priority,
      description: newIdea.description
    }

    setContentIdeas(prev => [...prev, idea])
    setNewIdea({ title: '', format: 'Reels', platform: 'Instagram', description: '', priority: 'medium' })
    setShowAddForm(false)
    toast.success('Idée ajoutée au calendrier !')
  }

  const deleteContentIdea = (id: string) => {
    setContentIdeas(prev => prev.filter(idea => idea.id !== id))
    toast.success('Idée supprimée')
  }

  const updateIdeaStatus = (id: string, status: ContentIdea['status']) => {
    setContentIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, status } : idea
      )
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-purple-100 text-purple-800'
      case 'planned': return 'bg-blue-100 text-blue-800'
      case 'created': return 'bg-orange-100 text-orange-800'
      case 'published': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idea': return <Lightbulb className="w-3 h-3" />
      case 'planned': return <CalendarIcon className="w-3 h-3" />
      case 'created': return <Edit3 className="w-3 h-3" />
      case 'published': return <TrendingUp className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            📅 Calendrier éditorial
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Planifiez et organisez votre stratégie de contenu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek - 1)}
          >
            ← Sem. précédente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(0)}
          >
            Aujourd'hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek + 1)}
          >
            Sem. suivante →
          </Button>
        </div>
      </div>

      {/* Vue calendrier hebdomadaire */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Semaine du {weekDates[0].toLocaleDateString('fr-FR')} au {weekDates[6].toLocaleDateString('fr-FR')}
            </CardTitle>
            <Button
              onClick={() => {
                setSelectedDate(new Date())
                setShowAddForm(true)
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter contenu
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString()
              const dayContent = getContentForDate(date)

              return (
                <div
                  key={date.toISOString()}
                  className={`
                    min-h-32 p-2 rounded-lg border-2 transition-colors cursor-pointer
                    ${isToday
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-center mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {weekDays[index]}
                    </div>
                    <div className={`text-lg font-semibold ${
                      isToday ? 'text-blue-600' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {date.getDate()}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {dayContent.map((idea, idx) => (
                      <div
                        key={idea.id}
                        className={`
                          text-xs p-1 rounded border-l-2 cursor-pointer
                          ${idea.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                            idea.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                            'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                          }
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingIdea(idea)
                        }}
                      >
                        <div className="font-medium truncate">{idea.title}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(idea.status)}
                          <span className="text-gray-600 dark:text-gray-400">
                            {idea.format}
                          </span>
                        </div>
                      </div>
                    ))}

                    {dayContent.length === 0 && (
                      <div
                        className="text-xs text-gray-400 text-center py-2 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDate(date)
                          setShowAddForm(true)
                        }}
                      >
                        + Ajouter contenu
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des idées de contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suggestions IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Suggestions IA pour {userProfile?.business_type || 'votre secteur'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentIdeas.filter(idea => idea.status === 'idea').slice(0, 5).map((idea) => (
              <div key={idea.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{idea.title}</h4>
                    {idea.seasonalTag && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {idea.seasonalTag}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateIdeaStatus(idea.id, 'planned')}
                      className="h-7 px-2 text-xs"
                    >
                      Planifier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteContentIdea(idea.id)}
                      className="h-7 px-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {idea.description}
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {idea.format}
                  </Badge>
                  <Badge className={`text-xs ${getPriorityColor(idea.priority)}`}>
                    {idea.priority}
                  </Badge>
                </div>
              </div>
            ))}

            {contentIdeas.filter(idea => idea.status === 'idea').length === 0 && (
              <div className="text-center py-6">
                <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Pas de nouvelles suggestions</p>
                <Button
                  onClick={generateContentSuggestions}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Générer nouvelles idées
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contenu planifié */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Contenu planifié
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentIdeas
              .filter(idea => ['planned', 'created'].includes(idea.status))
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 6)
              .map((idea) => (
                <div key={idea.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{idea.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {new Date(idea.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={`text-xs ${getStatusColor(idea.status)}`}>
                        {getStatusIcon(idea.status)}
                        {idea.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteContentIdea(idea.id)}
                        className="h-6 px-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {idea.format}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {idea.platform}
                    </Badge>
                  </div>

                  {idea.status === 'planned' && (
                    <Button
                      size="sm"
                      onClick={() => updateIdeaStatus(idea.id, 'created')}
                      className="w-full h-7 text-xs bg-green-600 hover:bg-green-700"
                    >
                      Marquer comme créé
                    </Button>
                  )}
                </div>
              ))}

            {contentIdeas.filter(idea => ['planned', 'created'].includes(idea.status)).length === 0 && (
              <div className="text-center py-6">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucun contenu planifié</p>
                <p className="text-xs text-gray-400 mt-1">
                  Planifiez des contenus depuis les suggestions
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal d'ajout de contenu */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Ajouter du contenu pour le {selectedDate.toLocaleDateString('fr-FR')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre *</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Ex: Nouvelle coupe tendance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Format</label>
                  <Select
                    value={newIdea.format}
                    onValueChange={(value) => setNewIdea({ ...newIdea, format: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reels">Reels</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Stories">Stories</SelectItem>
                      <SelectItem value="Posts">Posts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priorité</label>
                  <Select
                    value={newIdea.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => setNewIdea({ ...newIdea, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  placeholder="Décrivez votre idée de contenu..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={addContentIdea}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Ajouter
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}