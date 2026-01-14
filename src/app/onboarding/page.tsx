'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { EnhancedOnboarding } from '@/components/onboarding/enhanced-onboarding'

/**
 * Page d'onboarding avec choix entre version simplifiée et version complète
 */
export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Par défaut, utiliser la version complète
  // Paramètre ?version=simple pour l'ancien onboarding
  const useEnhancedVersion = searchParams.get('version') !== 'simple'

  useEffect(() => {
    const checkAuth = async () => {
      try {
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
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <p className="text-gray-600">Préparation de votre parcours d'onboarding...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Utiliser le nouveau composant d'onboarding amélioré
  return (
    <EnhancedOnboarding
      onComplete={(data) => {
        console.log('Onboarding completed with data:', data)
        // Le composant redirige automatiquement vers /choose-plan
      }}
    />
  )
}