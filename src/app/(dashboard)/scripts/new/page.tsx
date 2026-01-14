'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

// Industries disponibles avec leurs hooks viraux
const industries = [
  {
    id: 'coiffure',
    name: 'Coiffure & Beauté',
    icon: '✂️',
    hooks: [
      '3 erreurs que 90% des gens font avec leurs cheveux',
      'Ce que votre coiffeur ne vous dit jamais',
      'Avant/après : transformation incroyable',
      'Le secret pour des cheveux brillants naturellement'
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Food',
    icon: '🍽️',
    hooks: [
      'L&apos;ingrédient secret de notre recette signature',
      'Pourquoi notre burger fait sensation sur TikTok',
      'La technique de chef que personne ne connaît',
      'Ce plat change la vie de nos clients'
    ]
  },
  {
    id: 'boulangerie',
    name: 'Boulangerie & Pâtisserie',
    icon: '🥖',
    hooks: [
      'Le secret pour un pain parfait tous les jours',
      'Cette pâtisserie rend fou notre quartier',
      '4h du matin : dans les coulisses de votre boulanger',
      'Pourquoi notre croissant est différent des autres'
    ]
  },
  {
    id: 'fleuriste',
    name: 'Fleuriste',
    icon: '🌸',
    hooks: [
      'Comment faire durer vos fleurs 2 fois plus longtemps',
      'Cette composition florale fait pleurer de joie',
      'Le langage secret des fleurs que peu connaissent',
      'Pourquoi cette fleur coûte 50€ et les autres 5€'
    ]
  },
  {
    id: 'fitness',
    name: 'Sport & Fitness',
    icon: '💪',
    hooks: [
      '30 jours pour transformer votre corps',
      'L&apos;exercice que 99% des gens font mal',
      'Comment j&apos;ai aidé Marie à perdre 20kg',
      'Le secret des athlètes pros que personne ne dit'
    ]
  },
  {
    id: 'autre',
    name: 'Autre secteur',
    icon: '🏪',
    hooks: [
      'Le secret que nos concurrents ne veulent pas que vous sachiez',
      'Pourquoi nos clients nous recommandent à leurs amis',
      'Cette technique change tout dans notre secteur',
      'Ce que j&apos;aurais aimé savoir avant de commencer'
    ]
  }
]

const formats = [
  {
    id: 'reels',
    name: 'Instagram Reels',
    icon: '📸',
    description: '15-30 secondes, vertical, trending audio',
    duration: '15-30s'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    description: '15-60 secondes, trends et défis',
    duration: '15-60s'
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts',
    icon: '📺',
    description: '60 secondes max, contenu éducatif',
    duration: '30-60s'
  },
  {
    id: 'story',
    name: 'Stories Instagram',
    icon: '📱',
    description: '15 secondes, éphémère, authentique',
    duration: '15s'
  }
]

const tones = [
  { id: 'amical', name: 'Amical & Accessible', description: 'Chaleureux et proche' },
  { id: 'professionnel', name: 'Professionnel & Expert', description: 'Sérieux et crédible' },
  { id: 'fun', name: 'Fun & Énergique', description: 'Dynamique et enjoué' },
  { id: 'inspirant', name: 'Inspirant & Motivant', description: 'Positif et encourageant' }
]

export default function NewScriptPage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [generatedScript, setGeneratedScript] = useState<string>('')
  const router = useRouter()

  // Form data
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [selectedHook, setSelectedHook] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedTone, setSelectedTone] = useState('')
  const [customInstructions, setCustomInstructions] = useState('')

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUserProfile(profile)

      // Pré-sélectionner l'industrie de l'utilisateur
      if (profile?.business_type) {
        setSelectedIndustry(profile.business_type)
      }
    }

    loadUserData()
  }, [router])

  const canGenerateScript = () => {
    if (!userProfile) return false

    const tier = userProfile.subscription_tier
    const count = userProfile.scripts_count_month || 0

    if (tier === 'business') return true
    if (tier === 'pro') return count < 30
    return count < 10 // starter
  }

  const generateScript = async () => {
    if (!canGenerateScript()) {
      alert('Limite de scripts atteinte. Passez à un plan supérieur !')
      router.push('/settings')
      return
    }

    setLoading(true)

    try {
      const industry = industries.find(i => i.id === selectedIndustry)
      const format = formats.find(f => f.id === selectedFormat)
      const tone = tones.find(t => t.id === selectedTone)

      // Préparer le prompt pour Claude
      const prompt = `Tu es un expert en marketing digital et création de contenu viral pour les réseaux sociaux.

CONTEXTE BUSINESS:
- Secteur: ${industry?.name}
- Business: ${userProfile.business_name}
- Audience cible: ${userProfile.target_audience}

BRIEF CRÉATION:
- Format: ${format?.name} (${format?.duration})
- Sujet/Hook: ${selectedHook || customTopic}
- Ton: ${tone?.name} - ${tone?.description}
- Instructions spéciales: ${customInstructions || 'Aucune'}

MISSION:
Génère un script vidéo viral et engageant qui respecte ces critères:

1. STRUCTURE OPTIMISÉE:
   - Hook percutant dans les 3 premières secondes
   - Contenu de valeur ou divertissement
   - Call-to-action clair à la fin

2. STYLE ${format?.name}:
   - Adapté aux codes de la plateforme
   - Durée respectée (${format?.duration})
   - Language naturel et authentique

3. OPTIMISATIONS VIRALES:
   - Émotion forte (surprise, curiosité, joie)
   - Storytelling captivant
   - Moments "wow" ou révélations

4. COMMERCE LOCAL:
   - Met en valeur l'expertise
   - Crée de la proximité avec l'audience
   - Incite à l'action (visite, appel, suivi)

Génère UNIQUEMENT le script final, prêt à être tourné. Utilise des indications [PLAN], [ACTION] si nécessaire pour la réalisation.`

      // Appel API de génération (simulé pour le moment)
      // TODO: Remplacer par l'appel réel à l'API Claude
      const mockResponse = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(`🎬 SCRIPT ${format?.name?.toUpperCase()} - ${industry?.name}

**HOOK (0-3s)**
[PLAN SERRÉ VISAGE - REGARD DIRECT CAMÉRA]
"Attendez... vous faites VRAIMENT cette erreur avec ${selectedHook.includes('cheveux') ? 'vos cheveux' : 'ça'} ?"

**DÉVELOPPEMENT (3-20s)**
[PLAN DÉMONSTRATION - MONTRER L'ERREUR]
"90% des gens font exactement ça... et c'est pourquoi ça ne marche jamais !"

[TRANSITION RAPIDE - MONTRER LA BONNE MÉTHODE]
"Mais voici comment on fait VRAIMENT chez ${userProfile.business_name}..."

[PLAN RÉSULTAT - AVANT/APRÈS OU DÉMONSTRATION]
"Et regardez la différence ! C'est exactement pourquoi nos clients..."

**CALL-TO-ACTION (20-30s)**
[RETOUR PLAN SERRÉ]
"Si tu veux le même résultat, passe nous voir chez ${userProfile.business_name} !
Et dis-moi en commentaire : est-ce que toi aussi tu faisais cette erreur ? 👇"

**NOTES RÉALISATION:**
- Montage rythmé (changement plan toutes les 2-3s)
- Musique trending énergique
- Sous-titres pour accessibilité
- Hashtags: #${selectedIndustry} #${userProfile.business_name.replace(/\s+/g, '')} #astuce #viral`)
        }, 3000)
      })

      setGeneratedScript(mockResponse)

      // Sauvegarder en base
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { error } = await supabase.from('scripts').insert({
          user_id: session.user.id,
          title: selectedHook || customTopic || `Script ${format?.name}`,
          input_data: {
            industry: selectedIndustry,
            topic: customTopic,
            hook: selectedHook,
            format: selectedFormat,
            tone: selectedTone,
            instructions: customInstructions
          },
          content: mockResponse,
          format: selectedFormat,
          tone: selectedTone,
          tokens_used: 450 // Mock
        })

        if (!error) {
          // Incrémenter le compteur
          await supabase
            .from('profiles')
            .update({
              scripts_count_month: (userProfile.scripts_count_month || 0) + 1
            })
            .eq('id', session.user.id)
        }
      }

      setCurrentStep(3)
    } catch (error) {
      console.error('Erreur génération:', error)
      alert('Erreur lors de la génération. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewScript = () => {
    setCurrentStep(1)
    setSelectedIndustry(userProfile?.business_type || '')
    setCustomTopic('')
    setSelectedHook('')
    setSelectedFormat('')
    setSelectedTone('')
    setCustomInstructions('')
    setGeneratedScript('')
  }

  if (!userProfile) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">⚡</span>
          </div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!canGenerateScript()) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
            Limite de scripts atteinte
          </h1>
          <p className="text-vuvenu-dark/80 mb-8">
            Vous avez utilisé tous vos scripts pour ce mois. Passez à un plan supérieur pour continuer à créer du contenu !
          </p>
          <Button
            onClick={() => router.push('/settings')}
            className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90"
          >
            Voir les plans disponibles
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark">
              Générer un Script Viral
            </h1>
            <div className="text-sm text-vuvenu-dark/60">
              Étape {currentStep} sur 3
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-vuvenu-rose/30 rounded-full h-2 mb-8">
            <div
              className="bg-gradient-to-r from-vuvenu-lime to-vuvenu-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Étape 1: Configuration */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Industrie */}
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
              <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                Votre secteur d&apos;activité
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="font-semibold text-vuvenu-dark text-sm">
                      {industry.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sujet/Hook */}
            {selectedIndustry && (
              <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
                <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                  Choisissez votre angle d&apos;attaque
                </h2>

                {/* Hooks prédéfinis */}
                <div className="space-y-3 mb-6">
                  {industries.find(i => i.id === selectedIndustry)?.hooks.map((hook, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedHook(hook)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedHook === hook
                          ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                          : 'border-vuvenu-rose/40 hover:border-vuvenu-blue/60'
                      }`}
                    >
                      <span className="text-vuvenu-dark font-medium">{hook}</span>
                    </button>
                  ))}
                </div>

                {/* Sujet personnalisé */}
                <div className="border-t border-vuvenu-rose/20 pt-6">
                  <label className="block">
                    <span className="text-sm font-medium text-vuvenu-dark mb-2 block">
                      Ou créez votre propre sujet :
                    </span>
                    <textarea
                      value={customTopic}
                      onChange={(e) => {
                        setCustomTopic(e.target.value)
                        if (e.target.value) setSelectedHook('')
                      }}
                      className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors resize-none"
                      rows={3}
                      placeholder="Ex: Comment notre technique secrète fait des miracles..."
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Bouton continuer */}
            {(selectedHook || customTopic) && (
              <div className="text-center">
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                >
                  Continuer →
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Étape 2: Format et style */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {/* Format */}
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
              <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                Format de votre vidéo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedFormat === format.id
                        ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                        : 'border-vuvenu-rose/40 hover:border-vuvenu-blue/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{format.icon}</span>
                      <div>
                        <div className="font-semibold text-vuvenu-dark">
                          {format.name}
                        </div>
                        <div className="text-xs text-vuvenu-blue">
                          {format.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-vuvenu-dark/70">
                      {format.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ton */}
            {selectedFormat && (
              <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
                <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                  Ton de communication
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTone === tone.id
                          ? 'border-vuvenu-lime bg-vuvenu-lime/10'
                          : 'border-vuvenu-rose/40 hover:border-vuvenu-blue/60'
                      }`}
                    >
                      <div className="font-semibold text-vuvenu-dark mb-1">
                        {tone.name}
                      </div>
                      <div className="text-sm text-vuvenu-dark/70">
                        {tone.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions personnalisées */}
            {selectedTone && (
              <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
                <h2 className="text-xl font-display font-bold text-vuvenu-dark mb-6">
                  Instructions spéciales (optionnel)
                </h2>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors resize-none"
                  rows={4}
                  placeholder="Ex: Mentionner notre promo du mois, inclure notre adresse, parler de notre équipe..."
                />
              </div>
            )}

            {/* Boutons navigation */}
            {selectedTone && (
              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="border-vuvenu-dark text-vuvenu-dark"
                >
                  ← Retour
                </Button>

                <Button
                  onClick={generateScript}
                  disabled={loading}
                  className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⚡</span>
                      Génération en cours...
                    </span>
                  ) : (
                    '✨ Générer mon script'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Étape 3: Script généré */}
        {currentStep === 3 && generatedScript && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-vuvenu-lime rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-2">
                Votre script est prêt !
              </h2>
              <p className="text-vuvenu-dark/80">
                Script optimisé pour {formats.find(f => f.id === selectedFormat)?.name}
              </p>
            </div>

            {/* Script affiché */}
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-vuvenu-dark">
                  Votre script viral
                </h3>
                <Button
                  onClick={() => navigator.clipboard.writeText(generatedScript)}
                  variant="outline"
                  size="sm"
                  className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                >
                  📋 Copier
                </Button>
              </div>

              <div className="bg-vuvenu-cream p-6 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm text-vuvenu-dark font-mono leading-relaxed">
                  {generatedScript}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleNewScript}
                className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform"
              >
                ✨ Créer un autre script
              </Button>
              <Button
                onClick={() => router.push('/scripts')}
                variant="outline"
                className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
              >
                📚 Voir tous mes scripts
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}