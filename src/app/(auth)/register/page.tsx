'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Récupérer le plan sélectionné depuis l'URL
  const selectedPlan = searchParams.get('plan')
  const selectedBilling = searchParams.get('billing')

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  const validateForm = () => {
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères')
      return false
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            email_confirmed: false,
          }
        },
      })

      if (error) throw error

      if (data.user) {
        // Stocker le plan sélectionné pour le récupérer après l'onboarding
        if (selectedPlan) {
          localStorage.setItem('vuvenu_selected_plan', selectedPlan)
          localStorage.setItem('vuvenu_selected_billing', selectedBilling || 'monthly')
        }
        setSuccess(true)
        setError('Email de confirmation envoyé ! Vérifiez votre boîte mail.')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l&apos;inscription'
      if (errorMessage.includes('already registered')) {
        setError('Cet email est déjà utilisé. Essayez de vous connecter.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* Header simple */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
            <span className="font-bold text-vuvenu-dark">V</span>
          </div>
          <span className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</span>
        </Link>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* Pixels décoratifs */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-4 h-4 bg-vuvenu-lime animate-pixel-float"></div>
            <div className="w-4 h-4 bg-vuvenu-blue animate-pixel-float" style={{animationDelay: '0.5s'}}></div>
            <div className="w-4 h-4 bg-vuvenu-violet animate-pixel-float" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Badge plan sélectionné */}
          {selectedPlan && (
            <div className="bg-vuvenu-lime/20 border border-vuvenu-lime rounded-lg p-3 mb-6 text-center">
              <p className="text-sm text-vuvenu-dark">
                Plan sélectionné : <strong className="capitalize">{selectedPlan}</strong>
                {selectedBilling === 'yearly' && ' (annuel)'}
              </p>
            </div>
          )}

          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Rejoins{' '}
              <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">VuVenu</span> !
            </h1>
            <p className="text-lg text-vuvenu-dark/80">
              Crée ton compte et démarre ton succès en ligne dès aujourd&apos;hui.
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20 text-center">
              <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
                Presque fini !
              </h2>

              <p className="text-vuvenu-dark/80 mb-6">
                Un email de confirmation a été envoyé à <strong>{email}</strong>.
                Clique sur le lien pour activer ton compte et commencer l&apos;onboarding.
              </p>

              <div className="bg-vuvenu-violet/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-vuvenu-dark/80">
                  💡 <strong>Conseil :</strong> Vérifie aussi ton dossier spam/indésirables.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-vuvenu-blue text-white hover:bg-vuvenu-blue/90"
                >
                  Renvoyer l&apos;email
                </Button>

                <Link href="/login" className="block text-vuvenu-blue hover:underline">
                  Déjà activé ? Se connecter
                </Link>
              </div>
            </div>
          ) : (
            /* Formulaire */
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-vuvenu-dark mb-2">
                    Email professionnel
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors"
                    placeholder="ton@commerce.fr"
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-vuvenu-dark mb-2">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-vuvenu-dark/60 mt-1">
                    Minimum 6 caractères
                  </p>
                </div>

                {/* Confirmation mot de passe */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-vuvenu-dark mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className={`p-4 rounded-lg text-sm ${
                    error.includes('envoyé')
                      ? 'bg-vuvenu-violet/20 text-vuvenu-dark border border-vuvenu-violet/40'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {error}
                  </div>
                )}

                {/* CGV et confidentialité */}
                <div className="bg-vuvenu-rose/20 p-4 rounded-lg text-xs text-vuvenu-dark/70">
                  En créant un compte, tu acceptes nos{' '}
                  <Link href="/cgv" className="text-vuvenu-blue underline">
                    conditions générales
                  </Link>{' '}
                  et notre{' '}
                  <Link href="/confidentialite" className="text-vuvenu-blue underline">
                    politique de confidentialité
                  </Link>.
                </div>

                {/* Bouton */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold py-3"
                >
                  {loading ? 'Création du compte...' : 'Créer mon compte gratuit'}
                </Button>
              </form>

              {/* Liens */}
              <div className="mt-6 text-center">
                <div className="text-sm text-vuvenu-dark/60">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-vuvenu-blue font-medium hover:underline">
                    Se connecter
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Retour accueil */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-vuvenu-dark/60 hover:text-vuvenu-dark transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="text-center py-16">
        <p className="text-vuvenu-dark/60 mb-8">
          Déjà <span className="font-bold text-vuvenu-lime">+50 commerces</span> font confiance à VuVenu
        </p>

        <div className="flex justify-center gap-8 opacity-60">
          <div className="text-center">
            <div className="w-12 h-12 bg-vuvenu-violet rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">✂️</span>
            </div>
            <p className="text-xs text-vuvenu-dark">Coiffure</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-vuvenu-blue rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">🥖</span>
            </div>
            <p className="text-xs text-vuvenu-dark">Boulangerie</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-vuvenu-rose rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">🌸</span>
            </div>
            <p className="text-xs text-vuvenu-dark">Fleuriste</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-vuvenu-lime rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">🍕</span>
            </div>
            <p className="text-xs text-vuvenu-dark">Restaurant</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vuvenu-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">V</span>
          </div>
          <p className="text-vuvenu-dark">Chargement...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}