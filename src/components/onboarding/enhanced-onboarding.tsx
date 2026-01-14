'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Target,
  Sparkles,
  Check,
  Star,
  TrendingUp,
  Heart,
  Zap,
  Camera,
  Share2,
  MessageCircle,
  BarChart
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * Onboarding Enhanced - Version améliorée avec plus d'étapes et de personnalisation
 */

// Données configurables
const INDUSTRIES = [
  {
    id: 'coiffure',
    name: 'Salon de Coiffure',
    icon: '✂️',
    description: 'Coupes, colorations, soins capillaires',
    examples: ['Coupes tendances', 'Avant/après transformations', 'Conseils capillaires'],
    challenges: ['Fidélisation clientèle', 'Concurrence locale', 'Saisonnalité']
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    description: 'Cuisine, gastronomie, plats à emporter',
    examples: ['Plats signature', 'Ambiance restaurant', 'Coulisses cuisine'],
    challenges: ['Réservations', 'Livraison', 'Avis clients']
  },
  {
    id: 'boulangerie',
    name: 'Boulangerie',
    icon: '🥖',
    description: 'Pain, pâtisserie, viennoiserie',
    examples: ['Produits frais du matin', 'Artisanat traditionnel', 'Spécialités locales'],
    challenges: ['Horaires matinaux', 'Fraîcheur produits', 'Concurrence grande surface']
  },
  {
    id: 'fitness',
    name: 'Salle de Sport',
    icon: '💪',
    description: 'Fitness, musculation, cours collectifs',
    examples: ['Transformations membres', 'Cours collectifs', 'Conseils nutrition'],
    challenges: ['Motivation membres', 'Fidélisation', 'Équipements']
  },
  {
    id: 'mode',
    name: 'Boutique Mode',
    icon: '👗',
    description: 'Vêtements, accessoires, style',
    examples: ['Nouvelles collections', 'Conseils style', 'Looks du jour'],
    challenges: ['Tendances saison', 'Taille stock', 'Concurrence en ligne']
  },
  {
    id: 'spa',
    name: 'Spa & Bien-être',
    icon: '🧘‍♀️',
    description: 'Massages, soins esthétiques, détente',
    examples: ['Ambiance zen', 'Soins relaxants', 'Témoignages bien-être'],
    challenges: ['Réservations', 'Ambiance relaxante', 'Expertise soins']
  },
  {
    id: 'immobilier',
    name: 'Immobilier',
    icon: '🏠',
    description: 'Vente, location, conseils immobiliers',
    examples: ['Visites virtuelles', 'Quartiers', 'Conseils achat'],
    challenges: ['Marché fluctuant', 'Concurrence agents', 'Réglementations']
  },
  {
    id: 'autre',
    name: 'Autre Commerce',
    icon: '🏪',
    description: 'Commerce de proximité spécialisé',
    examples: ['Expertise produits', 'Service client', 'Conseil personnalisé'],
    challenges: ['Différenciation', 'Fidélisation', 'Visibilité locale']
  }
]

const BUSINESS_GOALS = [
  {
    id: 'nouveaux-clients',
    name: 'Attirer de nouveaux clients',
    description: 'Augmenter la clientèle locale',
    icon: Users,
    priority: 'high'
  },
  {
    id: 'fideliser',
    name: 'Fidéliser ma clientèle',
    description: 'Garder mes clients actuels',
    icon: Heart,
    priority: 'high'
  },
  {
    id: 'notoriete',
    name: 'Améliorer ma notoriété',
    description: 'Être mieux connu localement',
    icon: Star,
    priority: 'medium'
  },
  {
    id: 'reseaux-sociaux',
    name: 'Réussir sur les réseaux sociaux',
    description: 'Instagram, TikTok, Facebook',
    icon: Share2,
    priority: 'high'
  },
  {
    id: 'ventes',
    name: 'Augmenter mes ventes',
    description: 'Chiffre d\'affaires et commandes',
    icon: TrendingUp,
    priority: 'high'
  },
  {
    id: 'communication',
    name: 'Améliorer ma communication',
    description: 'Messages et contenu plus impactant',
    icon: MessageCircle,
    priority: 'medium'
  }
]

const MARKETING_EXPERIENCE = [
  { id: 'debutant', name: 'Débutant', description: 'Je n\'ai jamais fait de marketing digital' },
  { id: 'basique', name: 'Quelques bases', description: 'J\'ai essayé Facebook/Instagram parfois' },
  { id: 'intermediaire', name: 'Intermédiaire', description: 'Je poste régulièrement, quelques pubs' },
  { id: 'avance', name: 'Expérimenté', description: 'Je connais bien les réseaux et la pub' }
]

const CONTENT_PREFERENCES = [
  { id: 'videos', name: 'Vidéos courtes', description: 'Reels, TikTok, Stories', icon: Camera },
  { id: 'photos', name: 'Photos pro', description: 'Images de qualité pour posts', icon: Sparkles },
  { id: 'carousel', name: 'Carrousels', description: 'Plusieurs images avec infos', icon: BarChart },
  { id: 'stories', name: 'Stories interactives', description: 'Sondages, questions, coulisses', icon: Zap }
]

interface OnboardingData {
  // Étape 1: Business Info
  businessName: string
  selectedIndustry: string
  businessAge: string
  location: string

  // Étape 2: Objectifs
  selectedGoals: string[]
  marketingExperience: string

  // Étape 3: Audience
  targetAudience: string
  audienceAge: string
  audienceBudget: string

  // Étape 4: Préférences Marketing
  contentTypes: string[]
  postingFrequency: string
  brandPersonality: string[]

  // Étape 5: Première Action
  firstScriptTopic: string
  firstCampaignGoal: string
}

interface EnhancedOnboardingProps {
  onComplete?: (data: OnboardingData) => void
}

export function EnhancedOnboarding({ onComplete }: EnhancedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // État du formulaire
  const [formData, setFormData] = useState<OnboardingData>({
    businessName: '',
    selectedIndustry: '',
    businessAge: '',
    location: '',
    selectedGoals: [],
    marketingExperience: '',
    targetAudience: '',
    audienceAge: '',
    audienceBudget: '',
    contentTypes: [],
    postingFrequency: '',
    brandPersonality: [],
    firstScriptTopic: '',
    firstCampaignGoal: ''
  })

  const totalSteps = 6 // 0: Welcome, 1: Business, 2: Goals, 3: Audience, 4: Marketing, 5: Action
  const progress = ((currentStep + 1) / totalSteps) * 100

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // Vérifier si l'onboarding est déjà complété
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return true // Welcome screen
      case 1: return formData.businessName && formData.selectedIndustry && formData.location
      case 2: return formData.selectedGoals.length > 0 && formData.marketingExperience
      case 3: return formData.targetAudience && formData.audienceAge
      case 4: return formData.contentTypes.length > 0 && formData.postingFrequency
      case 5: return formData.firstScriptTopic
      default: return false
    }
  }

  const handleComplete = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Sauvegarder les données complètes
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          business_name: formData.businessName,
          business_type: formData.selectedIndustry,
          main_goal: formData.selectedGoals.join(','),
          target_audience: formData.targetAudience,
          onboarding_completed: true,
          subscription_status: 'none',
          scripts_count_month: 0,
          campaigns_count_month: 0,
          counts_reset_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Données enrichies dans metadata JSON
          onboarding_data: {
            businessAge: formData.businessAge,
            location: formData.location,
            marketingExperience: formData.marketingExperience,
            audienceAge: formData.audienceAge,
            audienceBudget: formData.audienceBudget,
            contentTypes: formData.contentTypes,
            postingFrequency: formData.postingFrequency,
            brandPersonality: formData.brandPersonality,
            firstScriptTopic: formData.firstScriptTopic,
            firstCampaignGoal: formData.firstCampaignGoal,
            completedAt: new Date().toISOString()
          }
        })

      if (error) throw error

      toast.success('Onboarding terminé ! 🎉', {
        description: 'Bienvenue dans VuVenu, prêt à créer du contenu ?'
      })

      onComplete?.(formData)
      router.push('/choose-plan')
    } catch (error) {
      console.error('Erreur onboarding:', error)
      toast.error('Erreur lors de la finalisation', {
        description: 'Réessayez dans quelques instants'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value]
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Préparation de votre parcours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header avec progression */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">V</span>
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900">VuVenu</div>
                <div className="text-sm text-gray-500">Configuration de votre compte</div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Étape {currentStep + 1} sur {totalSteps}
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Contenu des étapes */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Étape 0: Bienvenue */}
              {currentStep === 0 && (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Bienvenue sur VuVenu ! 👋
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                      En quelques minutes, nous allons configurer votre espace<br />
                      pour créer du contenu marketing parfaitement adapté à votre business.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="text-center p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Contenu ciblé</h3>
                      <p className="text-sm text-gray-600">
                        Scripts et visuels adaptés à votre secteur et audience
                      </p>
                    </Card>

                    <Card className="text-center p-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">IA puissante</h3>
                      <p className="text-sm text-gray-600">
                        Claude & Gemini pour des résultats professionnels
                      </p>
                    </Card>

                    <Card className="text-center p-6">
                      <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Résultats mesurés</h3>
                      <p className="text-sm text-gray-600">
                        Plus de clients grâce au marketing digital efficace
                      </p>
                    </Card>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <p className="text-gray-700 mb-4">
                      <strong>⏱️ 5 minutes chrono</strong> pour un setup complet !
                    </p>
                    <p className="text-sm text-gray-600">
                      Nous allons vous poser quelques questions sur votre business, vos objectifs,
                      et vos préférences pour vous proposer le contenu le plus pertinent possible.
                    </p>
                  </div>
                </div>
              )}

              {/* Étape 1: Informations Business */}
              {currentStep === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Parlez-nous de votre business 🏪
                    </h2>
                    <p className="text-lg text-gray-600">
                      Ces informations nous aident à personnaliser vos contenus
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Nom du business */}
                    <Card className="p-6">
                      <div className="space-y-4">
                        <label className="block">
                          <span className="text-lg font-semibold text-gray-900 mb-2 block">
                            Nom de votre commerce *
                          </span>
                          <Input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData({ businessName: e.target.value })}
                            placeholder="Ex: Coiffure Chez Marie, Restaurant Le Palmier..."
                            className="text-lg"
                          />
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="block">
                            <span className="font-medium text-gray-700 mb-2 block">
                              <MapPin className="w-4 h-4 inline mr-1" />
                              Localisation *
                            </span>
                            <Input
                              type="text"
                              value={formData.location}
                              onChange={(e) => updateFormData({ location: e.target.value })}
                              placeholder="Ex: Saint-Denis, Saint-Paul..."
                            />
                          </label>

                          <label className="block">
                            <span className="font-medium text-gray-700 mb-2 block">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Depuis quand ?
                            </span>
                            <Select
                              value={formData.businessAge}
                              onValueChange={(value) => updateFormData({ businessAge: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Âge du business" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="moins-1an">Moins d'un an</SelectItem>
                                <SelectItem value="1-3ans">1 à 3 ans</SelectItem>
                                <SelectItem value="3-10ans">3 à 10 ans</SelectItem>
                                <SelectItem value="plus-10ans">Plus de 10 ans</SelectItem>
                              </SelectContent>
                            </Select>
                          </label>
                        </div>
                      </div>
                    </Card>

                    {/* Sélection industrie */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Dans quel secteur évoluez-vous ? *
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {INDUSTRIES.map((industry) => (
                          <div
                            key={industry.id}
                            className={`
                              cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md
                              ${formData.selectedIndustry === industry.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                            onClick={() => updateFormData({ selectedIndustry: industry.id })}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{industry.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 mb-1">
                                  {industry.name}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  {industry.description}
                                </div>
                                {formData.selectedIndustry === industry.id && (
                                  <div className="text-xs text-blue-600">
                                    ✓ Secteur sélectionné
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Étape 2: Objectifs & Expérience */}
              {currentStep === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Vos objectifs marketing 🎯
                    </h2>
                    <p className="text-lg text-gray-600">
                      Que souhaitez-vous accomplir avec VuVenu ?
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Objectifs business */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Quels sont vos principaux objectifs ? *
                        <span className="text-sm font-normal text-gray-500 ml-2">(Plusieurs choix possibles)</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BUSINESS_GOALS.map((goal) => {
                          const Icon = goal.icon
                          const isSelected = formData.selectedGoals.includes(goal.id)

                          return (
                            <div
                              key={goal.id}
                              className={`
                                cursor-pointer rounded-lg border-2 p-4 transition-all
                                ${isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                                }
                              `}
                              onClick={() => updateFormData({
                                selectedGoals: toggleArrayValue(formData.selectedGoals, goal.id)
                              })}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`
                                  w-10 h-10 rounded-lg flex items-center justify-center
                                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                                `}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                    {goal.name}
                                    {goal.priority === 'high' && (
                                      <Badge variant="secondary" className="text-xs">
                                        Recommandé
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {goal.description}
                                  </div>
                                  {isSelected && (
                                    <div className="text-xs text-blue-600 mt-2">
                                      ✓ Objectif sélectionné
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Card>

                    {/* Expérience marketing */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Votre expérience en marketing digital ? *
                      </h3>

                      <div className="space-y-3">
                        {MARKETING_EXPERIENCE.map((exp) => (
                          <div
                            key={exp.id}
                            className={`
                              cursor-pointer rounded-lg border-2 p-4 transition-all
                              ${formData.marketingExperience === exp.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                            onClick={() => updateFormData({ marketingExperience: exp.id })}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">
                                  {exp.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {exp.description}
                                </div>
                              </div>
                              {formData.marketingExperience === exp.id && (
                                <Check className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Étape 3: Audience cible */}
              {currentStep === 3 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Votre clientèle cible 👥
                    </h2>
                    <p className="text-lg text-gray-600">
                      Mieux nous connaissons vos clients, mieux nous vous aidons !
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="space-y-6">
                        <label className="block">
                          <span className="text-lg font-semibold text-gray-900 mb-2 block">
                            Décrivez votre clientèle type *
                          </span>
                          <Textarea
                            value={formData.targetAudience}
                            onChange={(e) => updateFormData({ targetAudience: e.target.value })}
                            rows={4}
                            placeholder="Ex: Femmes de 25-45 ans, familles avec enfants, jeunes professionnels du quartier, personnes âgées qui apprécient la qualité..."
                          />
                          <div className="mt-2 text-sm text-gray-500">
                            💡 Plus vous êtes précis, mieux nous pourrons personnaliser vos contenus !
                          </div>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <label className="block">
                            <span className="font-medium text-gray-700 mb-2 block">
                              Tranche d'âge principale *
                            </span>
                            <Select
                              value={formData.audienceAge}
                              onValueChange={(value) => updateFormData({ audienceAge: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Âge de vos clients" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="18-25">18-25 ans</SelectItem>
                                <SelectItem value="25-35">25-35 ans</SelectItem>
                                <SelectItem value="35-50">35-50 ans</SelectItem>
                                <SelectItem value="50-65">50-65 ans</SelectItem>
                                <SelectItem value="65+">65+ ans</SelectItem>
                                <SelectItem value="mixte">Public mixte</SelectItem>
                              </SelectContent>
                            </Select>
                          </label>

                          <label className="block">
                            <span className="font-medium text-gray-700 mb-2 block">
                              Budget moyen de vos clients
                            </span>
                            <Select
                              value={formData.audienceBudget}
                              onValueChange={(value) => updateFormData({ audienceBudget: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pouvoir d'achat" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="budget-serre">Budget serré (économies)</SelectItem>
                                <SelectItem value="moyen">Moyen (équilibre qualité/prix)</SelectItem>
                                <SelectItem value="confortable">Confortable (privilégie qualité)</SelectItem>
                                <SelectItem value="premium">Premium (luxe et exclusivité)</SelectItem>
                                <SelectItem value="varie">Ça varie selon les clients</SelectItem>
                              </SelectContent>
                            </Select>
                          </label>
                        </div>
                      </div>
                    </Card>

                    {/* Insights basés sur l'industrie sélectionnée */}
                    {formData.selectedIndustry && (
                      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          💡 Insights pour le secteur "{INDUSTRIES.find(i => i.id === formData.selectedIndustry)?.name}"
                        </h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p><strong>Défis typiques:</strong></p>
                          <ul className="list-disc ml-5 space-y-1">
                            {INDUSTRIES.find(i => i.id === formData.selectedIndustry)?.challenges.map((challenge, idx) => (
                              <li key={idx}>{challenge}</li>
                            ))}
                          </ul>
                          <p className="mt-3"><strong>Contenus qui marchent bien:</strong></p>
                          <ul className="list-disc ml-5 space-y-1">
                            {INDUSTRIES.find(i => i.id === formData.selectedIndustry)?.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 4: Préférences Marketing */}
              {currentStep === 4 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Vos préférences de contenu 🎨
                    </h2>
                    <p className="text-lg text-gray-600">
                      Quel type de contenu vous intéresse le plus ?
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Types de contenu */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Quels formats de contenu préférez-vous ? *
                        <span className="text-sm font-normal text-gray-500 ml-2">(Plusieurs choix possibles)</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CONTENT_PREFERENCES.map((content) => {
                          const Icon = content.icon
                          const isSelected = formData.contentTypes.includes(content.id)

                          return (
                            <div
                              key={content.id}
                              className={`
                                cursor-pointer rounded-lg border-2 p-4 transition-all
                                ${isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                                }
                              `}
                              onClick={() => updateFormData({
                                contentTypes: toggleArrayValue(formData.contentTypes, content.id)
                              })}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`
                                  w-10 h-10 rounded-lg flex items-center justify-center
                                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                                `}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 mb-1">
                                    {content.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {content.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Card>

                    {/* Fréquence de publication */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        À quelle fréquence souhaitez-vous publier ? *
                      </h3>

                      <div className="space-y-3">
                        {[
                          { id: 'quotidien', name: 'Tous les jours', desc: 'Maximum de visibilité' },
                          { id: '3-4-semaine', name: '3-4 fois par semaine', desc: 'Bon compromis régularité/qualité' },
                          { id: 'hebdomadaire', name: 'Une fois par semaine', desc: 'Contenu travaillé, moins de pression' },
                          { id: 'occasionnel', name: 'Occasionnellement', desc: 'Selon les opportunités et événements' }
                        ].map((freq) => (
                          <div
                            key={freq.id}
                            className={`
                              cursor-pointer rounded-lg border-2 p-4 transition-all
                              ${formData.postingFrequency === freq.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                            onClick={() => updateFormData({ postingFrequency: freq.id })}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">
                                  {freq.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {freq.desc}
                                </div>
                              </div>
                              {formData.postingFrequency === freq.id && (
                                <Check className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Étape 5: Première Action */}
              {currentStep === 5 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Prêt pour votre premier contenu ? 🚀
                    </h2>
                    <p className="text-lg text-gray-600">
                      Choisissons ensemble votre premier script personnalisé !
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Quel sujet pour votre premier script vidéo ? *
                      </h3>

                      <Textarea
                        value={formData.firstScriptTopic}
                        onChange={(e) => updateFormData({ firstScriptTopic: e.target.value })}
                        rows={3}
                        placeholder="Ex: Présentation de mon salon, nouvelle collection automne, spécialité du chef, offre de bienvenue..."
                      />

                      <div className="mt-4 text-sm text-gray-500">
                        💡 Nous générerons ce script automatiquement après votre inscription !
                      </div>
                    </Card>

                    {/* Récapitulatif */}
                    <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        📋 Récapitulatif de votre configuration
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Business:</strong> {formData.businessName}<br />
                          <strong>Secteur:</strong> {INDUSTRIES.find(i => i.id === formData.selectedIndustry)?.name}<br />
                          <strong>Localisation:</strong> {formData.location}<br />
                          <strong>Expérience:</strong> {MARKETING_EXPERIENCE.find(e => e.id === formData.marketingExperience)?.name}
                        </div>
                        <div>
                          <strong>Objectifs:</strong> {formData.selectedGoals.length} sélectionné(s)<br />
                          <strong>Audience:</strong> {formData.audienceAge}<br />
                          <strong>Contenus:</strong> {formData.contentTypes.length} format(s)<br />
                          <strong>Publication:</strong> {[
                            { id: 'quotidien', name: 'Quotidien' },
                            { id: '3-4-semaine', name: '3-4/semaine' },
                            { id: 'hebdomadaire', name: 'Hebdomadaire' },
                            { id: 'occasionnel', name: 'Occasionnel' }
                          ].find(f => f.id === formData.postingFrequency)?.name}
                        </div>
                      </div>
                    </Card>

                    {/* Call to action final */}
                    <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">
                          🎉 Félicitations !
                        </h3>
                        <p className="mb-4">
                          Votre profil VuVenu est prêt. Il est temps de choisir votre plan
                          et commencer à créer du contenu qui convertit !
                        </p>
                        <div className="text-sm opacity-90">
                          Configuration terminée à 100% • {formData.businessName} • {formData.selectedGoals.length} objectifs
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button
              onClick={handlePrev}
              variant="outline"
              className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentStep
                      ? 'bg-blue-500'
                      : i < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || loading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Finalisation...
                  </>
                ) : (
                  <>
                    Terminer la configuration
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}