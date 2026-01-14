'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

// Industries disponibles (extrait du MEGA-PROMPT)
const industries = [
  { id: 'coiffure', name: 'Salon de Coiffure', icon: '✂️', description: 'Coupes, colorations, soins capillaires' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', description: 'Cuisine, gastronomie, plats à emporter' },
  { id: 'boulangerie', name: 'Boulangerie', icon: '🥖', description: 'Pain, pâtisserie, viennoiserie' },
  { id: 'fleuriste', name: 'Fleuriste', icon: '🌸', description: 'Bouquets, compositions, événements' },
  { id: 'fitness', name: 'Salle de Sport', icon: '💪', description: 'Fitness, musculation, cours collectifs' },
  { id: 'mode', name: 'Boutique Mode', icon: '👗', description: 'Vêtements, accessoires, style' },
  { id: 'animaux', name: 'Toilettage/Animalerie', icon: '🐕', description: 'Soins animaux, accessoires, alimentation' },
  { id: 'bijouterie', name: 'Bijouterie', icon: '💍', description: 'Bijoux, montres, réparations' },
  { id: 'spa', name: 'Spa & Bien-être', icon: '🧘‍♀️', description: 'Massages, soins esthétiques, détente' },
  { id: 'immobilier', name: 'Immobilier', icon: '🏠', description: 'Vente, location, conseils immobiliers' },
  { id: 'photographie', name: 'Photographe', icon: '📸', description: 'Portraits, événements, mariages' },
  { id: 'autre', name: 'Autre', icon: '🏪', description: 'Commerce de proximité non listé' }
]

const businessGoals = [
  { id: 'nouveaux-clients', name: 'Attirer de nouveaux clients', description: 'Augmenter la clientèle locale' },
  { id: 'fideliser', name: 'Fidéliser ma clientèle existante', description: 'Garder mes clients actuels' },
  { id: 'notoriete', name: 'Améliorer ma notoriété locale', description: 'Être mieux connu dans ma ville' },
  { id: 'reseaux-sociaux', name: 'Réussir sur les réseaux sociaux', description: 'Instagram, TikTok, Facebook' },
  { id: 'ventes', name: 'Augmenter mes ventes', description: 'Chiffre d&apos;affaires et commandes' }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Données du formulaire
  const [businessName, setBusinessName] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [targetAudience, setTargetAudience] = useState('')

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
        .select('onboarding_completed, business_name')
        .eq('id', session.user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleComplete = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Créer ou mettre à jour le profil
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          business_name: businessName,
          business_type: selectedIndustry,
          main_goal: selectedGoals.join(','),
          target_audience: targetAudience,
          onboarding_completed: true,
          subscription_status: 'none',
          scripts_count_month: 0,
          campaigns_count_month: 0,
          counts_reset_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      router.push('/choose-plan')
    } catch (error) {
      console.error('Erreur onboarding:', error)
      alert('Erreur lors de la finalisation. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return businessName.trim().length > 0 && selectedIndustry
      case 2:
        return selectedGoals.length > 0
      case 3:
        return targetAudience.trim().length > 0
      default:
        return false
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-vuvenu-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-vuvenu-dark">Vérification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* Header avec progression */}
      <header className="p-6 bg-white/95 backdrop-blur-sm border-b border-vuvenu-rose/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                <span className="font-bold text-vuvenu-dark">V</span>
              </div>
              <span className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</span>
            </div>

            <div className="text-sm text-vuvenu-dark/60">
              Étape {currentStep} sur 3
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-vuvenu-rose/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-vuvenu-lime to-vuvenu-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Étape 1: Business Info */}
          {currentStep === 1 && (
            <div className="text-center mb-8">
              <div className="flex justify-center gap-2 mb-8">
                <div className="w-4 h-4 bg-vuvenu-lime animate-pixel-float"></div>
                <div className="w-4 h-4 bg-vuvenu-blue animate-pixel-float" style={{animationDelay: '0.5s'}}></div>
                <div className="w-4 h-4 bg-vuvenu-violet animate-pixel-float" style={{animationDelay: '1s'}}></div>
              </div>

              <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
                Parle-nous de ton{' '}
                <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">commerce</span>
              </h1>
              <p className="text-lg text-vuvenu-dark/80 mb-12">
                Pour te proposer du contenu sur-mesure, on a besoin d&apos;en savoir plus.
              </p>

              {/* Nom du commerce */}
              <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20 mb-8">
                <label className="block text-left mb-4">
                  <span className="text-lg font-semibold text-vuvenu-dark mb-2 block">
                    Nom de ton commerce
                  </span>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors text-lg"
                    placeholder="Ex: Coiffure Chez Marie, Boulangerie du Centre..."
                  />
                </label>
              </div>

              {/* Sélection industrie */}
              <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
                <h3 className="text-lg font-semibold text-vuvenu-dark mb-6 text-left">
                  Dans quel secteur ?
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                      <div className="font-semibold text-vuvenu-dark text-sm mb-1">
                        {industry.name}
                      </div>
                      <div className="text-xs text-vuvenu-dark/60">
                        {industry.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Objectifs */}
          {currentStep === 2 && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
                Tes{' '}
                <span className="bg-vuvenu-blue px-2 py-1 -rotate-1 inline-block text-white">objectifs</span>
              </h1>
              <p className="text-lg text-vuvenu-dark/80 mb-12">
                Sélectionne tous les objectifs qui t&apos;intéressent. On adaptera nos conseils !
              </p>

              <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
                <div className="space-y-4">
                  {businessGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        selectedGoals.includes(goal.id)
                          ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                          : 'border-vuvenu-rose/40 hover:border-vuvenu-blue/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-vuvenu-dark mb-1">
                            {goal.name}
                          </div>
                          <div className="text-sm text-vuvenu-dark/60">
                            {goal.description}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedGoals.includes(goal.id)
                            ? 'border-vuvenu-lime bg-vuvenu-lime'
                            : 'border-vuvenu-rose/60'
                        }`}>
                          {selectedGoals.includes(goal.id) && (
                            <span className="text-vuvenu-dark text-sm">✓</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Audience */}
          {currentStep === 3 && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
                Ta{' '}
                <span className="bg-vuvenu-violet px-2 py-1 rotate-1 inline-block text-white">clientèle</span>
              </h1>
              <p className="text-lg text-vuvenu-dark/80 mb-12">
                Décris-nous ta clientèle cible pour du contenu ultra-personnalisé.
              </p>

              <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
                <label className="block text-left">
                  <span className="text-lg font-semibold text-vuvenu-dark mb-4 block">
                    Qui sont tes clients ?
                  </span>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors resize-none"
                    placeholder="Ex: Femmes de 25-45 ans, familles avec enfants, jeunes professionnels du quartier, personnes âgées qui apprécient la qualité..."
                  />
                </label>

                <div className="mt-6 bg-vuvenu-violet/20 p-4 rounded-lg text-left">
                  <p className="text-sm text-vuvenu-dark/80">
                    💡 <strong>Conseil :</strong> Plus tu es précis, mieux on pourra t&apos;aider !
                    Pense à l&apos;âge, aux centres d&apos;intérêt, au budget, aux habitudes...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Boutons navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className={`border-vuvenu-dark text-vuvenu-dark ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              ← Précédent
            </Button>

            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step === currentStep
                      ? 'bg-vuvenu-lime'
                      : step < currentStep
                      ? 'bg-vuvenu-blue'
                      : 'bg-vuvenu-rose/40'
                  }`}
                />
              ))}
            </div>

            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform"
              >
                Suivant →
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || loading}
                className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform"
              >
                {loading ? 'Finalisation...' : 'Terminer ✨'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}