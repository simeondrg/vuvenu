'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  // Vérifier si l'email est déjà vérifié via URL token
  useEffect(() => {
    const checkVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user?.email_confirmed_at) {
        setIsVerifying(true)
        // Email déjà vérifié, redirection vers onboarding
        setTimeout(() => {
          router.push('/onboarding')
        }, 2000)
      } else if (session?.user?.email) {
        setEmail(session.user.email)
      }
    }
    checkVerification()
  }, [router])

  const handleResendVerification = async () => {
    if (!email) {
      setError('Aucune adresse email trouvée. Connecte-toi pour renvoyer l\'email.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        }
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email')
    } finally {
      setLoading(false)
    }
  }

  // Affichage pendant la vérification auto
  if (isVerifying) {
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
              <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
                <span className="text-2xl">✅</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
                Email vérifié !
              </h2>

              <p className="text-vuvenu-dark/80 mb-6">
                Ton email a été confirmé avec succès.
                Redirection vers l&apos;onboarding...
              </p>

              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-vuvenu-lime border-t-transparent rounded-full animate-spin"></div>
              </div>
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

          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Vérifie{' '}
              <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">ton email</span>
            </h1>
            <p className="text-lg text-vuvenu-dark/80">
              Pour commencer avec VuVenu, confirme ton adresse email.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-vuvenu-violet/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">📧</span>
              </div>

              {email && (
                <p className="text-sm text-vuvenu-dark/70 mb-4">
                  Email envoyé à <strong className="text-vuvenu-dark">{email}</strong>
                </p>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-vuvenu-lime rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-vuvenu-dark">1</span>
                </div>
                <p className="text-sm text-vuvenu-dark/80">
                  Ouvre ta boîte mail et cherche un email de <strong>VuVenu</strong>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-vuvenu-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
                <p className="text-sm text-vuvenu-dark/80">
                  Clique sur le lien de vérification dans l&apos;email
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-vuvenu-violet rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                <p className="text-sm text-vuvenu-dark/80">
                  Tu seras automatiquement redirigé vers ton tableau de bord
                </p>
              </div>
            </div>

            <div className="bg-vuvenu-rose/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-vuvenu-dark/80">
                💡 <strong>Conseil :</strong> Si tu ne trouves pas l&apos;email, vérifie ton dossier spam/indésirables.
              </p>
            </div>

            {/* Messages de feedback */}
            {success && (
              <div className="p-4 rounded-lg text-sm bg-vuvenu-lime/20 text-vuvenu-dark border border-vuvenu-lime mb-6">
                ✅ Email de vérification renvoyé avec succès !
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200 mb-6">
                {error}
              </div>
            )}

            {/* Boutons */}
            <div className="space-y-4">
              <Button
                onClick={handleResendVerification}
                disabled={loading || !email}
                className="w-full bg-vuvenu-blue text-white hover:bg-vuvenu-blue/90 transition-colors"
              >
                {loading ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
              </Button>

              <div className="text-center text-sm text-vuvenu-dark/60">
                Déjà vérifié ?{' '}
                <Link href="/login" className="text-vuvenu-blue font-medium hover:underline">
                  Se connecter
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

      {/* Section aide */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-vuvenu-violet/10 rounded-xl p-6 border border-vuvenu-violet/20">
            <h3 className="font-display font-bold text-vuvenu-dark mb-3">
              Besoin d&apos;aide ?
            </h3>
            <p className="text-sm text-vuvenu-dark/70 mb-4">
              Si tu rencontres des problèmes avec la vérification de ton email, contacte-nous à{' '}
              <a href="mailto:support@vuvenu.fr" className="text-vuvenu-blue underline">
                support@vuvenu.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
