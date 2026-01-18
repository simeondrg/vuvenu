'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  BarChart,
  ChevronLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { INDUSTRY_GROUPS, INDUSTRY_CATEGORIES } from '@/lib/data/niche-mapping'

/**
 * Onboarding Enhanced - Version VuVenu avec 22 industries
 */

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
  selectedCategory: string    // Catégorie (10 options)
  selectedIndustry: string    // Groupe d'industrie (22 options)
  selectedNiche: string       // Niche spécifique
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
    selectedCategory: '',
    selectedIndustry: '',
    selectedNiche: '',
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
      case 1: return formData.businessName && formData.selectedIndustry && formData.selectedNiche && formData.location
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
          business_type: formData.selectedNiche || formData.selectedIndustry,
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
            selectedCategory: formData.selectedCategory,
            selectedIndustry: formData.selectedIndustry,
            selectedNiche: formData.selectedNiche,
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
      <div className="min-h-screen bg-vuvenu-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-vuvenu-dark">V</span>
          </div>
          <p className="text-vuvenu-dark/70">Préparation de votre parcours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* Header avec progression */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-vuvenu-rose/20 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          {/* Pixels décoratifs */}
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-vuvenu-lime animate-pixel-float"></div>
            <div className="w-3 h-3 bg-vuvenu-blue animate-pixel-float" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 bg-vuvenu-violet animate-pixel-float" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                <span className="font-bold text-vuvenu-dark text-lg">V</span>
              </div>
              <div>
                <div className="font-bold text-xl text-vuvenu-dark">VuVenu</div>
                <div className="text-sm text-vuvenu-dark/60">Configuration de votre compte</div>
              </div>
            </div>

            <div className="text-sm text-vuvenu-dark/60">
              Étape {currentStep + 1} sur {totalSteps}
            </div>
          </div>

          <Progress value={progress} className="h-2 bg-vuvenu-rose/30 [&>div]:bg-vuvenu-lime" />
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
                    <div className="w-20 h-20 bg-vuvenu-lime rounded-full mx-auto mb-6 flex items-center justify-center pixel-shadow">
                      <span className="text-3xl font-bold text-vuvenu-dark">V</span>
                    </div>
                    <h1 className="text-4xl font-bold text-vuvenu-dark mb-4">
                      Bienvenue sur{' '}
                      <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">VuVenu</span> !
                    </h1>
                    <p className="text-xl text-vuvenu-dark/70 mb-8">
                      En quelques minutes, nous allons configurer votre espace<br />
                      pour créer du contenu marketing parfaitement adapté à votre business.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="text-center p-6 border-2 border-vuvenu-dark/10 pixel-shadow bg-white">
                      <div className="w-12 h-12 bg-vuvenu-lime rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Target className="w-6 h-6 text-vuvenu-dark" />
                      </div>
                      <h3 className="font-semibold mb-2 text-vuvenu-dark">Contenu ciblé</h3>
                      <p className="text-sm text-vuvenu-dark/70">
                        Scripts et visuels adaptés à votre secteur et audience
                      </p>
                    </Card>

                    <Card className="text-center p-6 border-2 border-vuvenu-dark/10 pixel-shadow bg-white">
                      <div className="w-12 h-12 bg-vuvenu-violet rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-vuvenu-dark" />
                      </div>
                      <h3 className="font-semibold mb-2 text-vuvenu-dark">IA puissante</h3>
                      <p className="text-sm text-vuvenu-dark/70">
                        Claude & Gemini pour des résultats professionnels
                      </p>
                    </Card>

                    <Card className="text-center p-6 border-2 border-vuvenu-dark/10 pixel-shadow bg-white">
                      <div className="w-12 h-12 bg-vuvenu-blue rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2 text-vuvenu-dark">Résultats mesurés</h3>
                      <p className="text-sm text-vuvenu-dark/70">
                        Plus de clients grâce au marketing digital efficace
                      </p>
                    </Card>
                  </div>

                  <div className="bg-vuvenu-violet/20 border border-vuvenu-violet/30 rounded-2xl p-6">
                    <p className="text-vuvenu-dark mb-4">
                      <strong>⏱️ 5 minutes chrono</strong> pour un setup complet !
                    </p>
                    <p className="text-sm text-vuvenu-dark/70">
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
                    <h2 className="text-3xl font-bold text-vuvenu-dark mb-4">
                      Parlez-nous de votre business
                    </h2>
                    <p className="text-lg text-vuvenu-dark/70">
                      Ces informations nous aident à personnaliser vos contenus
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Nom du business */}
                    <Card className="p-6 border-2 border-vuvenu-dark/10 bg-white">
                      <div className="space-y-4">
                        <label className="block">
                          <span className="text-lg font-semibold text-vuvenu-dark mb-2 block">
                            Nom de votre commerce *
                          </span>
                          <Input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData({ businessName: e.target.value })}
                            placeholder="Ex: Coiffure Chez Marie, Restaurant Le Palmier..."
                            className="text-lg border-vuvenu-rose/40 focus:ring-vuvenu-lime"
                          />
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="block">
                            <span className="font-medium text-vuvenu-dark mb-2 block">
                              <MapPin className="w-4 h-4 inline mr-1" />
                              Localisation *
                            </span>
                            <Input
                              type="text"
                              value={formData.location}
                              onChange={(e) => updateFormData({ location: e.target.value })}
                              placeholder="Ex: Saint-Denis, Saint-Paul..."
                              className="border-vuvenu-rose/40 focus:ring-vuvenu-lime"
                            />
                          </label>

                          <label className="block">
                            <span className="font-medium text-vuvenu-dark mb-2 block">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Depuis quand ?
                            </span>
                            <Select
                              value={formData.businessAge}
                              onValueChange={(value) => updateFormData({ businessAge: value })}
                            >
                              <SelectTrigger className="border-vuvenu-rose/40">
                                <SelectValue placeholder="Âge du business" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="moins-1an">Moins d&apos;un an</SelectItem>
                                <SelectItem value="1-3ans">1 à 3 ans</SelectItem>
                                <SelectItem value="3-10ans">3 à 10 ans</SelectItem>
                                <SelectItem value="plus-10ans">Plus de 10 ans</SelectItem>
                              </SelectContent>
                            </Select>
                          </label>
                        </div>
                      </div>
                    </Card>

                    {/* Sélection catégorie */}
                    <Card className="p-6 border-2 border-vuvenu-dark/10 bg-white">
                      <h3 className="text-lg font-semibold text-vuvenu-dark mb-6">
                        Dans quelle catégorie se situe votre commerce ? *
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {INDUSTRY_CATEGORIES.map((category) => (
                          <div
                            key={category.name}
                            onClick={() => updateFormData({
                              selectedCategory: category.name,
                              selectedIndustry: '',
                              selectedNiche: ''
                            })}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all text-center hover:scale-105
                              ${formData.selectedCategory === category.name
                                ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                                : 'border-vuvenu-rose/30 hover:border-vuvenu-lime/50 bg-white'
                              }
                            `}
                          >
                            <div className="text-3xl mb-2">{category.icon}</div>
                            <div className="font-medium text-sm text-vuvenu-dark">{category.name}</div>
                          </div>
                        ))}
                      </div>

                      {/* Sélection industrie après choix de catégorie */}
                      {formData.selectedCategory && (
                        <div className="mt-8">
                          <div className="flex items-center gap-2 mb-4">
                            <button
                              onClick={() => updateFormData({
                                selectedCategory: '',
                                selectedIndustry: '',
                                selectedNiche: ''
                              })}
                              className="text-vuvenu-blue hover:text-vuvenu-dark flex items-center gap-1 text-sm"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Changer de catégorie
                            </button>
                          </div>
                          <h4 className="font-semibold text-vuvenu-dark mb-4">
                            Précisez votre secteur dans &quot;{formData.selectedCategory}&quot;
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {INDUSTRY_CATEGORIES
                              .find(c => c.name === formData.selectedCategory)
                              ?.groups.map((groupId) => {
                                const group = INDUSTRY_GROUPS.find(g => g.id === groupId)
                                if (!group) return null
                                return (
                                  <div
                                    key={group.id}
                                    onClick={() => updateFormData({
                                      selectedIndustry: group.id,
                                      selectedNiche: ''
                                    })}
                                    className={`
                                      cursor-pointer p-4 rounded-lg border-2 transition-all
                                      ${formData.selectedIndustry === group.id
                                        ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                                        : 'border-vuvenu-rose/30 hover:border-vuvenu-lime/50 bg-white'
                                      }
                                    `}
                                  >
                                    <div className="font-medium text-vuvenu-dark">{group.name}</div>
                                    {formData.selectedIndustry === group.id && (
                                      <div className="text-xs text-vuvenu-dark/60 mt-1">✓ Sélectionné</div>
                                    )}
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      )}

                      {/* Sélection niche après choix d'industrie */}
                      {formData.selectedIndustry && (
                        <div className="mt-8">
                          <h4 className="font-semibold text-vuvenu-dark mb-4">
                            Quel est votre commerce exactement ?
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {INDUSTRY_GROUPS
                              .find(g => g.id === formData.selectedIndustry)
                              ?.niches.map((niche) => (
                                <div
                                  key={niche}
                                  onClick={() => updateFormData({ selectedNiche: niche })}
                                  className={`
                                    cursor-pointer px-3 py-2 rounded-lg border transition-all text-sm
                                    ${formData.selectedNiche === niche
                                      ? 'border-vuvenu-lime bg-vuvenu-lime text-vuvenu-dark font-medium'
                                      : 'border-vuvenu-rose/30 hover:border-vuvenu-lime/50 text-vuvenu-dark/80'
                                    }
                                  `}
                                >
                                  {niche}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Résumé de la sélection */}
                      {formData.selectedNiche && (
                        <div className="mt-6 p-4 bg-vuvenu-lime/20 border border-vuvenu-lime rounded-lg">
                          <p className="text-sm text-vuvenu-dark">
                            <strong>Secteur sélectionné :</strong> {formData.selectedCategory} → {INDUSTRY_GROUPS.find(g => g.id === formData.selectedIndustry)?.name} → <span className="font-semibold">{formData.selectedNiche}</span>
                          </p>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )}

              {/* Étape 2: Objectifs & Expérience */}
              {currentStep === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-vuvenu-dark mb-4">
                      Vos objectifs marketing
                    </h2>
                    <p className="text-lg text-vuvenu-dark/70">
                      Que souhaitez-vous accomplir avec VuVenu ?
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Objectifs business */}
                    <Card className="p-6 border-2 border-vuvenu-dark/10 bg-white">
                      <h3 className="text-lg font-semibold text-vuvenu-dark mb-6">
                        Quels sont vos principaux objectifs ? *
                        <span className="text-sm font-normal text-vuvenu-dark/60 ml-2">(Plusieurs choix possibles)</span>
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
                                  ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                                  : 'border-vuvenu-rose/30 hover:border-vuvenu-lime/50'
                                }
                              `}
                              onClick={() => updateFormData({
                                selectedGoals: toggleArrayValue(formData.selectedGoals, goal.id)
                              })}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`
                                  w-10 h-10 rounded-lg flex items-center justify-center
                                  ${isSelected ? 'bg-vuvenu-lime text-vuvenu-dark' : 'bg-vuvenu-rose/30 text-vuvenu-dark/60'}
                                `}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-vuvenu-dark mb-1 flex items-center gap-2">
                                    {goal.name}
                                    {goal.priority === 'high' && (
                                      <Badge className="text-xs bg-vuvenu-violet/30 text-vuvenu-dark border-0">
                                        Recommandé
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-vuvenu-dark/70">
                                    {goal.description}
                                  </div>
                                  {isSelected && (
                                    <div className="text-xs text-vuvenu-dark/60 mt-2">
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
                    <Card className="p-6 border-2 border-vuvenu-dark/10 bg-white">
                      <h3 className="text-lg font-semibold text-vuvenu-dark mb-6">
                        Votre expérience en marketing digital ? *
                      </h3>

                      <div className="space-y-3">
                        {MARKETING_EXPERIENCE.map((exp) => (
                          <div
                            key={exp.id}
                            className={`
                              cursor-pointer rounded-lg border-2 p-4 transition-all
                              ${formData.marketingExperience === exp.id
                                ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                                : 'border-vuvenu-rose/30 hover:border-vuvenu-lime/50'
                              }
                            `}
                            onClick={() => updateFormData({ marketingExperience: exp.id })}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-vuvenu-dark mb-1">
                                  {exp.name}
                                </div>
                                <div className="text-sm text-vuvenu-dark/70">
                                  {exp.description}
                                </div>
                              </div>
                              {formData.marketingExperience === exp.id && (
                                <Check className="w-5 h-5 text-vuvenu-lime" />
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
                    <h2 className="text-3xl font-bold text-vuvenu-dark mb-4">
                      Votre clientèle cible
                    </h2>
                    <p className="text-lg text-vuvenu-dark/70">
                      Mieux nous connaissons vos clients, mieux nous vous aidons !
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6 border-2 border-vuvenu-dark/10 bg-white">
                      <div className="space-y-6">
                        <label className="block">
                          <span className="text-lg font-semibold text-vuvenu-dark mb-2 block">
                            Décrivez votre clientèle type *
                          </span>
                          <Textarea
                            value={formData.targetAudience}
                            onChange={(e) => updateFormData({ targetAudience: e.target.value })}
                            rows={4}
                            placeholder="Ex: Femmes de 25-45 ans, familles avec enfants, jeunes professionnels du quartier, personnes âgées qui apprécient la qualité..."
                            className="border-vuvenu-rose/40 focus:ring-vuvenu-lime"
                          />
                          <div className="mt-2 text-sm text-vuvenu-dark/60">
                            💡 Plus vous êtes précis, mieux nous pourrons personnaliser vos contenus !
                          </div>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <label className="block">
                            <span className="font-medium text-vuvenu-dark mb-2 block">
                              Tranche d&apos;âge principale *
                            </span>
                            <Select
                              value={formData.audienceAge}
                              onValueChange={(value) => updateFormData({ audienceAge: value })}
                            >
                              <SelectTrigger className="border-vuvenu-rose/40">
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
                            <span className="font-medium text-vuvenu-dark mb-2 block">
                              Budget moyen de vos clients
                            </span>
                            <Select
                              value={formData.audienceBudget}
                              onValueChange={(value) => updateFormData({ audienceBudget: value })}
                            >
                              <SelectTrigger className="border-vuvenu-rose/40">
                                <SelectValue placeholder="Pouvoir d&apos;achat" />
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
                      <Card className="p-6 bg-vuvenu-violet/20 border border-vuvenu-violet/30">
                        <h4 className="font-semibold text-vuvenu-dark mb-3">
                          💡 Insights pour le secteur &quot;{INDUSTRY_GROUPS.find(g => g.id === formData.selectedIndustry)?.name}&quot;
                        </h4>
                        <div className="text-sm text-vuvenu-dark/80 space-y-2">
                          <p><strong>Types de commerces similaires :</strong></p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {INDUSTRY_GROUPS.find(g => g.id === formData.selectedIndustry)?.niches.slice(0, 5).map((niche, idx) => (
                              <span key={idx} className="bg-vuvenu-lime/30 px-2 py-1 rounded text-xs">{niche}</span>
                            ))}
                          </div>
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
                    <h2 className="text-3xl font-bold text-vuvenu-dark mb-4">
                      Vos préférences de contenu
                    </h2>
                    <p className="text-lg text-vuvenu-dark/70">
                      Quel type de contenu vous intéresse le plus ?
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Types de contenu */}
                    <Card className="p-6 border-2 border-vuvenu-dark/10 bg-white">
                      <h3 className="text-lg font-semibold text-vuvenu-dark mb-6">
                        Quels formats de contenu préférez-vous ? *
                        <span className="text-sm font-normal text-vuvenu-dark/60 ml-2">(Plusieurs choix possibles)</span>
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
                                  ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                                  : 'border-vuvenu-rose/30 hover:border-vuvenu-lime/50'
                                }
                              `}
                              onClick={() => updateFormData({
                                contentTypes: toggleArrayValue(formData.contentTypes, content.id)
                              })}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`
                                  w-10 h-10 rounded-lg flex items-center justify-center
                                  ${isSelected ? 'bg-vuvenu-lime text-vuvenu-dark' : 'bg-vuvenu-rose/30 text-vuvenu-dark/60'}
                                `}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-semibold text-vuvenu-dark mb-1">
                                    {content.name}
                                  </div>
                                  <div className="text-sm text-vuvenu-dark/70">
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
                    <Card className="p-6 border-2 border-vuvenu-dark/10 bg-white">
                      <h3 className="text-lg font-semibold text-vuvenu-dark mb-6">
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
                                ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                                : 'border-vuvenu-rose/30 hover:border-vuvenu-lime/50'
                              }
                            `}
                            onClick={() => updateFormData({ postingFrequency: freq.id })}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-vuvenu-dark mb-1">
                                  {freq.name}
                                </div>
                                <div className="text-sm text-vuvenu-dark/70">
                                  {freq.desc}
                                </div>
                              </div>
                              {formData.postingFrequency === freq.id && (
                                <Check className="w-5 h-5 text-vuvenu-lime" />
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
                    <h2 className="text-3xl font-bold text-vuvenu-dark mb-4">
                      Prêt pour votre premier contenu ? 🚀
                    </h2>
                    <p className="text-lg text-vuvenu-dark/70">
                      Choisissons ensemble votre premier script personnalisé !
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-vuvenu-dark mb-4">
                        Quel sujet pour votre premier script vidéo ? *
                      </h3>

                      <Textarea
                        value={formData.firstScriptTopic}
                        onChange={(e) => updateFormData({ firstScriptTopic: e.target.value })}
                        rows={3}
                        placeholder="Ex: Présentation de mon salon, nouvelle collection automne, spécialité du chef, offre de bienvenue..."
                      />

                      <div className="mt-4 text-sm text-vuvenu-dark/60">
                        💡 Nous générerons ce script automatiquement après votre inscription !
                      </div>
                    </Card>

                    {/* Récapitulatif */}
                    <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                      <h3 className="text-lg font-semibold text-vuvenu-dark mb-4">
                        📋 Récapitulatif de votre configuration
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Business:</strong> {formData.businessName}<br />
                          <strong>Secteur:</strong> {formData.selectedNiche || INDUSTRY_GROUPS.find(g => g.id === formData.selectedIndustry)?.name}<br />
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
                    <Card className="p-6 bg-vuvenu-lime border-2 border-vuvenu-dark/10 pixel-shadow">
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2 text-vuvenu-dark">
                          Félicitations !
                        </h3>
                        <p className="mb-4 text-vuvenu-dark/80">
                          Votre profil VuVenu est prêt. Il est temps de choisir votre plan
                          et commencer à créer du contenu qui convertit !
                        </p>
                        <div className="text-sm text-vuvenu-dark/70">
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
              className={`border-vuvenu-dark/20 text-vuvenu-dark hover:bg-vuvenu-rose/20 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
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
                      ? 'bg-vuvenu-lime'
                      : i < currentStep
                      ? 'bg-vuvenu-blue'
                      : 'bg-vuvenu-rose'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform disabled:opacity-50"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || loading}
                className="bg-vuvenu-blue text-white hover:scale-105 transition-transform disabled:opacity-50"
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