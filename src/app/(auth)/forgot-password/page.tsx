'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email')
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

          {/* Success Message */}
          {success ? (
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20 text-center">
              <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
                Email envoyé !
              </h2>

              <p className="text-vuvenu-dark/80 mb-6">
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
                Clique sur le lien dans l&apos;email pour créer un nouveau mot de passe.
              </p>

              <div className="bg-vuvenu-violet/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-vuvenu-dark/80">
                  💡 <strong>Conseil :</strong> Le lien expire dans 1 heure. Vérifie aussi ton dossier spam/indésirables.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  variant="outline"
                  className="w-full border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
                >
                  Renvoyer l&apos;email
                </Button>

                <Link href="/login" className="block text-vuvenu-blue hover:underline">
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Titre */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
                  Mot de passe{' '}
                  <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">oublié</span> ?
                </h1>
                <p className="text-lg text-vuvenu-dark/80">
                  Pas de souci ! Saisis ton email et on t&apos;envoie un lien pour le réinitialiser.
                </p>
              </div>

              {/* Formulaire */}
              <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-vuvenu-dark mb-2">
                      Email de ton compte
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

                  {/* Message d'erreur */}
                  {error && (
                    <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                      {error}
                    </div>
                  )}

                  {/* Bouton */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold py-3"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                  </Button>
                </form>

                {/* Liens */}
                <div className="mt-6 text-center space-y-2">
                  <Link
                    href="/login"
                    className="text-sm text-vuvenu-blue hover:underline block"
                  >
                    Retour à la connexion
                  </Link>
                  <div className="text-sm text-vuvenu-dark/60">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-vuvenu-blue font-medium hover:underline">
                      S&apos;inscrire
                    </Link>
                  </div>
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
