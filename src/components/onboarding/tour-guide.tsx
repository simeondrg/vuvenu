'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'

interface TourStep {
  id: string
  target: string // CSS selector de l'élément à highlighter
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: {
    label: string
    onClick: () => void
  }
  beforeStep?: () => void // Fonction à exécuter avant d'afficher l'étape
  afterStep?: () => void // Fonction à exécuter après l'étape
}

interface TourContextType {
  isActive: boolean
  currentStep: number
  steps: TourStep[]
  startTour: (tourName: string) => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  completeTour: () => void
}

const TourContext = createContext<TourContextType | null>(null)

export function useTour() {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within TourProvider')
  }
  return context
}

// Définition des tours disponibles
const TOURS = {
  firstLogin: [
    {
      id: 'welcome',
      target: 'body',
      title: '🎉 Bienvenue sur VuVenu !',
      content: 'Félicitations ! Vous venez de créer votre compte. Laissez-moi vous faire découvrir comment créer du contenu viral en quelques clics.',
      position: 'bottom' as const,
    },
    {
      id: 'dashboard',
      target: '[data-tour="dashboard-stats"]',
      title: '📊 Votre tableau de bord',
      content: 'Ici vous pouvez suivre vos statistiques : scripts générés, progression mensuelle et recommandations personnalisées.',
      position: 'bottom' as const,
    },
    {
      id: 'create-script',
      target: '[data-tour="create-script-btn"]',
      title: '✨ Créer votre premier script',
      content: 'Commençons ! Cliquez ici pour générer votre premier script vidéo viral avec notre IA.',
      position: 'left' as const,
      action: {
        label: 'Créer maintenant',
        onClick: () => window.location.href = '/scripts/new'
      }
    }
  ],

  scriptGeneration: [
    {
      id: 'industry-select',
      target: '[data-tour="industry-selector"]',
      title: '🏢 Votre secteur d\'activité',
      content: 'Sélectionnez votre secteur pour que notre IA génère du contenu adapté à votre audience.',
      position: 'top' as const,
    },
    {
      id: 'format-select',
      target: '[data-tour="format-selector"]',
      title: '📱 Format de vidéo',
      content: 'Choisissez le format optimal : Reels Instagram, TikTok, YouTube Shorts ou Stories.',
      position: 'top' as const,
    },
    {
      id: 'tone-select',
      target: '[data-tour="tone-selector"]',
      title: '🎭 Ton et style',
      content: 'Définissez le ton qui correspond à votre marque : amical, professionnel, fun ou inspirant.',
      position: 'top' as const,
    },
    {
      id: 'generate-btn',
      target: '[data-tour="generate-script-btn"]',
      title: '🚀 Génération magique',
      content: 'Une fois vos préférences définies, notre IA Claude créera un script viral personnalisé en 30 secondes !',
      position: 'top' as const,
    }
  ],

  campaignCreation: [
    {
      id: 'campaigns-intro',
      target: '[data-tour="campaigns-header"]',
      title: '🎯 Campagnes Meta Ads',
      content: 'Créez des publicités Facebook et Instagram automatiquement avec notre générateur IA !',
      position: 'bottom' as const,
    },
    {
      id: 'plan-required',
      target: '[data-tour="upgrade-prompt"]',
      title: '⭐ Fonctionnalité Premium',
      content: 'Les campagnes Meta Ads sont disponibles avec les plans Pro et Business. Générez des concepts + images automatiquement !',
      position: 'top' as const,
      action: {
        label: 'Voir les plans',
        onClick: () => window.location.href = '/settings'
      }
    }
  ]
}

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<TourStep[]>([])
  const [currentTour, setCurrentTour] = useState<string | null>(null)

  const startTour = (tourName: string) => {
    const tourSteps = TOURS[tourName as keyof typeof TOURS]
    if (!tourSteps) return

    setSteps(tourSteps)
    setCurrentStep(0)
    setCurrentTour(tourName)
    setIsActive(true)

    // Marquer le tour comme vu
    localStorage.setItem(`tour-${tourName}-seen`, 'true')
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1
      const step = steps[nextStepIndex]
      step.beforeStep?.()
      setCurrentStep(nextStepIndex)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    setIsActive(false)
    setCurrentTour(null)
  }

  const completeTour = () => {
    const step = steps[currentStep]
    step.afterStep?.()

    setIsActive(false)
    setCurrentTour(null)

    // Marquer le tour comme complété
    if (currentTour) {
      localStorage.setItem(`tour-${currentTour}-completed`, 'true')
    }
  }

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
      }}
    >
      {children}
      {isActive && <TourOverlay />}
    </TourContext.Provider>
  )
}

function TourOverlay() {
  const { currentStep, steps, nextStep, prevStep, skipTour, completeTour } = useTour()
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const currentStepData = steps[currentStep]

  useEffect(() => {
    if (!currentStepData) return

    const target = document.querySelector(currentStepData.target) as HTMLElement
    if (target) {
      setTargetElement(target)

      // Calculer la position du tooltip
      const rect = target.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      let top = rect.top + scrollTop
      let left = rect.left + scrollLeft

      // Ajuster selon la position souhaitée
      switch (currentStepData.position) {
        case 'top':
          top -= 20
          left += rect.width / 2
          break
        case 'bottom':
          top += rect.height + 20
          left += rect.width / 2
          break
        case 'left':
          top += rect.height / 2
          left -= 20
          break
        case 'right':
          top += rect.height / 2
          left += rect.width + 20
          break
        default:
          top += rect.height + 20
          left += rect.width / 2
      }

      setPosition({ top, left })

      // Scroll vers l'élément si nécessaire
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })

      // Ajouter une classe pour le highlight
      target.classList.add('tour-highlight')

      return () => {
        target.classList.remove('tour-highlight')
      }
    }
  }, [currentStep, currentStepData])

  if (!currentStepData || typeof window === 'undefined') return null

  return createPortal(
    <>
      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" />

      {/* Highlight de l'élément ciblé */}
      {targetElement && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-300"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.offsetWidth + 8,
            height: targetElement.offsetHeight + 8,
            boxShadow: '0 0 0 4px rgba(191, 255, 0, 0.5), 0 0 20px rgba(191, 255, 0, 0.3)',
            borderRadius: '12px',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-vuvenu-rose/20 p-6 max-w-sm transform transition-all duration-300"
        style={{
          top: position.top,
          left: Math.max(10, Math.min(position.left - 150, window.innerWidth - 320)),
        }}
      >
        {/* Contenu */}
        <div className="mb-6">
          <h3 className="text-lg font-display font-bold text-vuvenu-dark mb-3">
            {currentStepData.title}
          </h3>
          <p className="text-vuvenu-dark/80 text-sm leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Action personnalisée */}
        {currentStepData.action && (
          <div className="mb-4">
            <button
              onClick={currentStepData.action.onClick}
              className="w-full bg-vuvenu-lime text-vuvenu-dark py-2 px-4 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              {currentStepData.action.label}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-vuvenu-dark/60">
            {currentStep + 1} sur {steps.length}
          </div>

          <div className="flex gap-2">
            <button
              onClick={skipTour}
              className="text-xs text-vuvenu-dark/60 hover:text-vuvenu-dark px-3 py-1"
            >
              Passer
            </button>

            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="text-xs border border-vuvenu-rose/40 text-vuvenu-dark px-3 py-1 rounded-md hover:bg-vuvenu-rose/10"
              >
                Précédent
              </button>
            )}

            <button
              onClick={currentStep === steps.length - 1 ? completeTour : nextStep}
              className="text-xs bg-vuvenu-blue text-white px-3 py-1 rounded-md hover:bg-vuvenu-blue/90"
            >
              {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-4 w-full bg-vuvenu-rose/30 rounded-full h-1">
          <div
            className="bg-vuvenu-blue h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </>,
    document.body
  )
}

// Hook pour démarrer automatiquement les tours selon le contexte
export function useAutoTours() {
  const { startTour } = useTour()

  useEffect(() => {
    // Démarrer le tour de première connexion si pas encore vu
    if (!localStorage.getItem('tour-firstLogin-seen')) {
      const timer = setTimeout(() => startTour('firstLogin'), 2000)
      return () => clearTimeout(timer)
    }
  }, [startTour])
}

// CSS pour le highlight
const tourStyles = `
  .tour-highlight {
    position: relative;
    z-index: 51;
    animation: tour-pulse 2s infinite;
  }

  @keyframes tour-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(191, 255, 0, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(191, 255, 0, 0);
    }
  }
`

// Injecter les styles
if (typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = tourStyles
  document.head.appendChild(style)
}