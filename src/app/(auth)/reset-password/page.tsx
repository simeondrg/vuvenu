'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)
  const router = useRouter()

  // Vérifier la présence d'un token valide
  useEffect(() => {
    const checkToken = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setTokenError(true)
      }
    }
    checkToken()
  }, [])

  const validateForm = () => {
    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères')
      return false
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return false
    }
    return true
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)

      // Redirection vers login après 3 secondes
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      if (error.message.includes('session') || error.message.includes('token')) {
        setTokenError(true)
      } else {
        setError(error.message || 'Erreur lors de la réinitialisation du mot de passe')
      }
    } finally {
      setLoading(false)
    }
  }

  // Affichage si le token est expiré/invalide
  if (tokenError) {
    return (
      <div className="min-h-screen bg-vuvenu-cream">
        <header className="p-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
              <span className="font-bold text-vuvenu-dark">V</span>
            </div>
            <span className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</span>
          </Link>
        </header>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
                Lien expiré
              </h2>

              <p className="text-vuvenu-dark/80 mb-6">
                Ce lien de réinitialisation a expiré ou n&apos;est plus valide.
                Les liens expirent après 1 heure pour des raisons de sécurité.
              </p>

              <div className="space-y-4">
                <Link href="/forgot-password">
                  <Button className="w-full bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold">
                    Demander un nouveau lien
                  </Button>
                </Link>

                <Link href="/login" className="block text-vuvenu-blue hover:underline">
                  Retour à la connexion
                </Link>
              </div>
            </div>

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

          {/* Success Message */}
          {success ? (
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20 text-center">
              <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
                Mot de passe modifié !
              </h2>

              <p className="text-vuvenu-dark/80 mb-6">
                Ton nouveau mot de passe a bien été enregistré.
                Tu vas être redirigé vers la page de connexion dans quelques secondes...
              </p>

              <Link href="/login">
                <Button className="w-full bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold">
                  Me connecter maintenant
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Titre */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
                  Nouveau{' '}
                  <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">mot de passe</span>
                </h1>
                <p className="text-lg text-vuvenu-dark/80">
                  Choisis un mot de passe sécurisé pour ton compte VuVenu.
                </p>
              </div>

              {/* Formulaire */}
              <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* Nouveau mot de passe */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-vuvenu-dark mb-2">
                      Nouveau mot de passe
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
                      Minimum 8 caractères
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
                    <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                      {error}
                    </div>
                  )}

                  {/* Critères de sécurité */}
                  <div className="bg-vuvenu-violet/20 p-4 rounded-lg">
                    <p className="text-sm font-medium text-vuvenu-dark mb-2">
                      Ton mot de passe doit contenir :
                    </p>
                    <ul className="text-xs text-vuvenu-dark/70 space-y-1">
                      <li className={password.length >= 8 ? 'text-green-600' : ''}>
                        ✓ Au moins 8 caractères
                      </li>
                      <li className={password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}>
                        ✓ Correspondance avec la confirmation
                      </li>
                    </ul>
                  </div>

                  {/* Bouton */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold py-3"
                  >
                    {loading ? 'Réinitialisation...' : 'Réinitialiser mon mot de passe'}
                  </Button>
                </form>

                {/* Lien */}
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-vuvenu-blue hover:underline"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            </>
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
    </div>
  )
}
