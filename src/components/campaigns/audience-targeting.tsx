'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Users,
  MapPin,
  Heart,
  Briefcase,
  Smartphone,
  TrendingUp,
  Target,
  Globe,
  Calendar,
  UserCheck,
  Info
} from 'lucide-react'

interface AudienceTargetingProps {
  industry: string
  location?: string
  initialData?: AudienceConfig
  onAudienceUpdate: (audience: AudienceConfig) => void
  readonly?: boolean
}

interface AudienceConfig {
  // Démographie
  ageRange: [number, number]
  genders: ('male' | 'female' | 'all')[]

  // Géographie
  locations: Location[]
  radius: number

  // Intérêts
  interests: string[]
  behaviors: string[]

  // Paramètres avancés
  customAudiences: string[]
  excludeAudiences: string[]

  // Estimation
  estimatedReach: {
    min: number
    max: number
  }
}

interface Location {
  id: string
  name: string
  type: 'city' | 'region' | 'country'
  coordinates?: [number, number]
}

/**
 * Configuration du ciblage d'audience Meta Ads
 * Interface complète pour définir les audiences publicitaires
 */
export function AudienceTargeting({
  industry,
  location,
  initialData,
  onAudienceUpdate,
  readonly = false
}: AudienceTargetingProps) {
  const [audienceConfig, setAudienceConfig] = useState<AudienceConfig>({
    ageRange: [25, 55],
    genders: ['all'],
    locations: location ? [{ id: location.toLowerCase(), name: location, type: 'city' }] : [],
    radius: 25,
    interests: [],
    behaviors: [],
    customAudiences: [],
    excludeAudiences: [],
    estimatedReach: { min: 2000, max: 8000 },
    ...initialData
  })

  // Intérêts pré-définis par secteur
  const industryInterests = {
    restaurant: [
      'Restaurants', 'Food and drink', 'Cooking', 'Fine dining', 'Local restaurants',
      'Cuisine française', 'Gastronomie', 'Food delivery', 'Wine', 'Family dining'
    ],
    coiffure: [
      'Hair care', 'Beauty', 'Hair styling', 'Beauty salons', 'Haircuts',
      'Hair color', 'Beauty treatments', 'Personal care', 'Fashion', 'Cosmetics'
    ],
    fitness: [
      'Fitness and wellness', 'Gyms', 'Physical fitness', 'Weight training', 'Yoga',
      'Running', 'Health and wellness', 'Nutrition', 'Personal training', 'Sports'
    ],
    mode: [
      'Fashion', 'Clothing', 'Shopping', 'Style', 'Fashion accessories',
      'Boutique shopping', 'Designer clothing', 'Trends', 'Shoes', 'Jewelry'
    ],
    spa: [
      'Spas', 'Wellness', 'Massage therapy', 'Beauty treatments', 'Relaxation',
      'Skincare', 'Self-care', 'Aromatherapy', 'Meditation', 'Health and wellness'
    ],
    boulangerie: [
      'Bakeries', 'Bread', 'Pastries', 'French cuisine', 'Artisan food',
      'Local business', 'Breakfast', 'Coffee', 'Traditional food', 'Desserts'
    ]
  }

  // Comportements typiques par secteur
  const industryBehaviors = {
    restaurant: [
      'Frequent restaurant goers', 'Food delivery users', 'Local business supporters',
      'Weekend diners', 'Special occasion diners', 'Food enthusiasts'
    ],
    coiffure: [
      'Beauty service users', 'Frequent shoppers', 'Fashion followers',
      'Self-care focused', 'Beauty product buyers', 'Style conscious'
    ],
    fitness: [
      'Gym members', 'Health and fitness enthusiasts', 'Active lifestyle',
      'Fitness app users', 'Supplement buyers', 'Sports participants'
    ],
    mode: [
      'Fashion shoppers', 'Online shoppers', 'Brand followers',
      'Trend followers', 'Frequent buyers', 'Style influencer followers'
    ],
    spa: [
      'Spa and wellness users', 'Self-care focused', 'Stress management seekers',
      'Beauty treatment users', 'Relaxation seekers', 'Wellness product buyers'
    ],
    boulangerie: [
      'Local business supporters', 'Artisan food lovers', 'Morning shoppers',
      'Traditional food preferences', 'Quality food seekers', 'Breakfast buyers'
    ]
  }

  // Localisation La Réunion
  const reunionLocations: Location[] = [
    { id: 'saint-denis', name: 'Saint-Denis', type: 'city' },
    { id: 'saint-paul', name: 'Saint-Paul', type: 'city' },
    { id: 'saint-pierre', name: 'Saint-Pierre', type: 'city' },
    { id: 'le-tampon', name: 'Le Tampon', type: 'city' },
    { id: 'saint-louis', name: 'Saint-Louis', type: 'city' },
    { id: 'saint-andre', name: 'Saint-André', type: 'city' },
    { id: 'le-port', name: 'Le Port', type: 'city' },
    { id: 'petite-ile', name: 'Petite-Île', type: 'city' },
    { id: 'saint-benoit', name: 'Saint-Benoît', type: 'city' },
    { id: 'sainte-marie', name: 'Sainte-Marie', type: 'city' },
    { id: 'reunion-island', name: 'Île de La Réunion (complète)', type: 'region' }
  ]

  useEffect(() => {
    // Recalculer l'estimation de portée quand la configuration change
    const calculateReach = () => {
      let baseReach = 5000 // Base pour La Réunion

      // Ajustement par âge
      const ageSpan = audienceConfig.ageRange[1] - audienceConfig.ageRange[0]
      const ageMultiplier = Math.min(ageSpan / 30, 1.5)
      baseReach *= ageMultiplier

      // Ajustement par localisation
      const locationMultiplier = audienceConfig.locations.length > 0 ?
        audienceConfig.locations.reduce((acc, loc) => {
          return acc + (loc.type === 'region' ? 1.5 : 0.3)
        }, 0) : 1

      baseReach *= locationMultiplier

      // Ajustement par rayon
      const radiusMultiplier = audienceConfig.radius / 25
      baseReach *= radiusMultiplier

      // Ajustement par nombre d'intérêts (plus d'intérêts = audience plus petite)
      const interestsMultiplier = Math.max(0.3, 1 - (audienceConfig.interests.length * 0.1))
      baseReach *= interestsMultiplier

      const min = Math.round(baseReach * 0.6)
      const max = Math.round(baseReach * 1.8)

      setAudienceConfig(prev => ({
        ...prev,
        estimatedReach: { min, max }
      }))
    }

    calculateReach()
  }, [audienceConfig.ageRange, audienceConfig.locations, audienceConfig.radius, audienceConfig.interests])

  useEffect(() => {
    onAudienceUpdate(audienceConfig)
  }, [audienceConfig, onAudienceUpdate])

  const handleInterestToggle = (interest: string) => {
    if (readonly) return

    setAudienceConfig(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleBehaviorToggle = (behavior: string) => {
    if (readonly) return

    setAudienceConfig(prev => ({
      ...prev,
      behaviors: prev.behaviors.includes(behavior)
        ? prev.behaviors.filter(b => b !== behavior)
        : [...prev.behaviors, behavior]
    }))
  }

  const handleLocationToggle = (location: Location) => {
    if (readonly) return

    setAudienceConfig(prev => ({
      ...prev,
      locations: prev.locations.find(l => l.id === location.id)
        ? prev.locations.filter(l => l.id !== location.id)
        : [...prev.locations, location]
    }))
  }

  const currentInterests = industryInterests[industry as keyof typeof industryInterests] || industryInterests.restaurant
  const currentBehaviors = industryBehaviors[industry as keyof typeof industryBehaviors] || industryBehaviors.restaurant

  return (
    <div className="space-y-6">
      {/* Header avec estimation */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Configuration des audiences
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Définissez votre audience cible pour maximiser l'efficacité de vos publicités
          </p>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {audienceConfig.estimatedReach.min.toLocaleString('fr-FR')} - {audienceConfig.estimatedReach.max.toLocaleString('fr-FR')}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Portée estimée à La Réunion
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Démographie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Démographie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tranche d'âge */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Tranche d'âge</label>
                <span className="text-sm text-gray-600">
                  {audienceConfig.ageRange[0]} - {audienceConfig.ageRange[1]} ans
                </span>
              </div>
              <Slider
                value={audienceConfig.ageRange}
                onValueChange={(value) => !readonly && setAudienceConfig(prev => ({ ...prev, ageRange: [value[0], value[1]] }))}
                min={18}
                max={65}
                step={1}
                className="w-full"
                disabled={readonly}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>18 ans</span>
                <span>65 ans</span>
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="text-sm font-medium mb-3 block">Genre</label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Tous les genres', icon: '👥' },
                  { value: 'female', label: 'Femmes', icon: '👩' },
                  { value: 'male', label: 'Hommes', icon: '👨' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gender-${option.value}`}
                      checked={audienceConfig.genders.includes(option.value as any)}
                      onCheckedChange={(checked) => {
                        if (readonly) return
                        setAudienceConfig(prev => ({
                          ...prev,
                          genders: checked
                            ? [...prev.genders.filter(g => g !== 'all'), option.value as any]
                            : prev.genders.filter(g => g !== option.value)
                        }))
                      }}
                      disabled={readonly}
                    />
                    <label htmlFor={`gender-${option.value}`} className="text-sm flex items-center gap-2 cursor-pointer">
                      <span>{option.icon}</span>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Géographie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Géolocalisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Localisation */}
            <div>
              <label className="text-sm font-medium mb-3 block">Villes ciblées</label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {reunionLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${loc.id}`}
                      checked={audienceConfig.locations.some(l => l.id === loc.id)}
                      onCheckedChange={() => handleLocationToggle(loc)}
                      disabled={readonly}
                    />
                    <label htmlFor={`location-${loc.id}`} className="text-sm cursor-pointer flex items-center gap-1">
                      {loc.type === 'region' ? '🏝️' : '🏙️'}
                      {loc.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rayon */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Rayon d'action</label>
                <span className="text-sm text-gray-600">{audienceConfig.radius} km</span>
              </div>
              <Slider
                value={[audienceConfig.radius]}
                onValueChange={(value) => !readonly && setAudienceConfig(prev => ({ ...prev, radius: value[0] }))}
                min={5}
                max={50}
                step={5}
                className="w-full"
                disabled={readonly}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 km</span>
                <span>50 km</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intérêts et comportements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intérêts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Centres d'intérêt
              <Badge variant="secondary" className="ml-2">
                {audienceConfig.interests.length} sélectionnés
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recommandés pour le secteur {industry}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentInterests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={audienceConfig.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                    disabled={readonly}
                  />
                  <label htmlFor={`interest-${interest}`} className="text-sm cursor-pointer">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comportements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Comportements
              <Badge variant="secondary" className="ml-2">
                {audienceConfig.behaviors.length} sélectionnés
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Habitudes de consommation typiques
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentBehaviors.map((behavior) => (
                <div key={behavior} className="flex items-center space-x-2">
                  <Checkbox
                    id={`behavior-${behavior}`}
                    checked={audienceConfig.behaviors.includes(behavior)}
                    onCheckedChange={() => handleBehaviorToggle(behavior)}
                    disabled={readonly}
                  />
                  <label htmlFor={`behavior-${behavior}`} className="text-sm cursor-pointer">
                    {behavior}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé de l'audience */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Résumé de votre audience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>
                <strong>{audienceConfig.genders.includes('all') ? 'Tous les genres' : audienceConfig.genders.join(', ')}</strong>
                {' '}âgés de <strong>{audienceConfig.ageRange[0]} à {audienceConfig.ageRange[1]} ans</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>
                Situés dans un rayon de <strong>{audienceConfig.radius} km</strong> autour de{' '}
                <strong>
                  {audienceConfig.locations.length > 0
                    ? audienceConfig.locations.map(l => l.name).join(', ')
                    : 'toute La Réunion'
                  }
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-blue-600" />
              <span>
                Intéressés par <strong>{audienceConfig.interests.length} centres d'intérêt</strong> liés à votre secteur
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>
                Avec <strong>{audienceConfig.behaviors.length} comportements</strong> pertinents pour votre business
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Recommandations</span>
            </div>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Une audience de 3 000 à 15 000 personnes est optimale pour La Réunion</li>
              <li>• Trop large = coût élevé, trop restreinte = portée limitée</li>
              <li>• Testez 2-3 audiences différentes pour optimiser vos performances</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}