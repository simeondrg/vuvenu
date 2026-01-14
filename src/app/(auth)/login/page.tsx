'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Vérifier si l'utilisateur a complété l'onboarding
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Erreur profil:', profileError)
          router.push('/onboarding')
          return
        }

        if (profile?.onboarding_completed) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      setError('Lien magique envoyé ! Vérifiez votre email.')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l&apos;envoi du lien magique')
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

          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Content de te{' '}
              <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">revoir</span> !
            </h1>
            <p className="text-lg text-vuvenu-dark/80">
              Connecte-toi pour accéder à ton tableau de bord VuVenu.
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-vuvenu-dark mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors"
                  placeholder="ton@email.fr"
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

              {/* Boutons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold py-3"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-vuvenu-rose/40"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-vuvenu-dark/60">ou</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMagicLink}
                  disabled={loading || !email}
                  className="w-full border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white transition-colors"
                >
                  Recevoir un lien magique
                </Button>
              </div>
            </form>

            {/* Liens */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-vuvenu-blue hover:underline"
              >
                Mot de passe oublié ?
              </Link>
              <div className="text-sm text-vuvenu-dark/60">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-vuvenu-blue font-medium hover:underline">
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </div>

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
    </div>
  )
}