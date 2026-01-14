'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Charger le profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUserProfile(profile)

        // Charger tous les scripts
        const { data: scriptsData, error } = await supabase
          .from('scripts')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erreur chargement scripts:', error)
        } else {
          setScripts(scriptsData || [])
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    loadScripts()
  }, [])

  const canCreateScript = () => {
    if (!userProfile) return false

    const tier = userProfile.subscription_tier
    const count = userProfile.scripts_count_month || 0

    if (tier === 'business') return true
    if (tier === 'pro') return count < 30
    return count < 10 // starter
  }

  const getRemainingScripts = () => {
    if (!userProfile) return 0

    const tier = userProfile.subscription_tier
    const count = userProfile.scripts_count_month || 0

    if (tier === 'business') return '∞'
    if (tier === 'pro') return Math.max(0, 30 - count)
    return Math.max(0, 10 - count)
  }

  const getFormatIcon = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'reels': return '📸'
      case 'tiktok': return '🎵'
      case 'youtube-shorts': return '📺'
      case 'story': return '📱'
      default: return '🎬'
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-vuvenu-rose/20 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-vuvenu-rose/20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-2">
            Mes Scripts Vidéo
          </h1>
          <p className="text-lg text-vuvenu-dark/80">
            Contenus créés avec l&apos;IA pour faire exploser tes vues !
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Compteur scripts */}
          <div className="bg-white rounded-xl p-4 shadow-vuvenu border border-vuvenu-rose/20">
            <div className="text-sm text-vuvenu-dark/70 mb-1">Ce mois</div>
            <div className="text-2xl font-bold text-vuvenu-dark">
              {userProfile?.scripts_count_month || 0}
            </div>
            <div className="text-xs text-vuvenu-dark/60">
              Reste: {getRemainingScripts()}
            </div>
          </div>

          {/* Bouton créer */}
          {canCreateScript() ? (
            <Button
              onClick={() => router.push('/scripts/new')}
              className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-6 py-3"
            >
              ✨ Nouveau script
            </Button>
          ) : (
            <div className="text-center">
              <div className="text-sm text-red-600 mb-2">Limite atteinte</div>
              <Button
                onClick={() => router.push('/settings')}
                className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90"
              >
                Upgrader mon plan
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Scripts grid */}
      {scripts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <div
              key={script.id}
              className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20 hover:shadow-vuvenu-lg transition-shadow group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-vuvenu-lime/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{getFormatIcon(script.format)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-vuvenu-dark">
                      {script.title || 'Script sans titre'}
                    </div>
                    <div className="text-xs text-vuvenu-dark/60 capitalize">
                      {script.format || 'Format non spécifié'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-vuvenu-dark/50">
                  {new Date(script.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>

              {/* Aperçu du contenu */}
              <div className="mb-4">
                <div className="text-sm text-vuvenu-dark/80 line-clamp-3">
                  {script.content?.slice(0, 150) || 'Pas de contenu'}
                  {script.content?.length > 150 && '...'}
                </div>
              </div>

              {/* Métadonnées */}
              <div className="flex items-center gap-4 text-xs text-vuvenu-dark/60 mb-4">
                <span>Ton: {script.tone || 'Non spécifié'}</span>
                <span>•</span>
                <span>{script.tokens_used || 0} tokens</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/scripts/${script.id}`}
                  className="flex-1 bg-vuvenu-lime text-vuvenu-dark text-sm font-medium px-4 py-2 rounded-lg hover:scale-105 transition-transform text-center"
                >
                  Voir le script
                </Link>
                <button className="bg-vuvenu-rose/20 text-vuvenu-dark p-2 rounded-lg hover:bg-vuvenu-rose/40 transition-colors">
                  <span className="text-sm">📋</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* État vide */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-vuvenu-lime/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
            Prêt à créer du contenu viral ?
          </h2>

          <p className="text-lg text-vuvenu-dark/80 max-w-md mx-auto mb-8">
            Utilisez notre IA pour générer des scripts optimisés pour TikTok, Instagram Reels
            et YouTube Shorts en quelques secondes !
          </p>

          {canCreateScript() ? (
            <Button
              onClick={() => router.push('/scripts/new')}
              className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform font-semibold px-8 py-4 text-lg"
            >
              ✨ Créer mon premier script
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-red-800 mb-2">
                  Limite de scripts atteinte
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  Vous avez utilisé tous vos scripts pour ce mois.
                  Passez à un plan supérieur pour créer plus de contenu !
                </p>
                <Button
                  onClick={() => router.push('/settings')}
                  className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90"
                >
                  Voir les plans
                </Button>
              </div>
            </div>
          )}

          {/* Exemples */}
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-vuvenu-dark mb-6">
              Exemples de scripts générés
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 border border-vuvenu-rose/20 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📸</span>
                  <span className="text-sm font-medium text-vuvenu-dark">Instagram Reels</span>
                </div>
                <div className="text-sm text-vuvenu-dark/80">
                  &quot;3 astuces que ton coiffeur ne te dira jamais pour avoir des cheveux brillants...&quot;
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-vuvenu-rose/20 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎵</span>
                  <span className="text-sm font-medium text-vuvenu-dark">TikTok</span>
                </div>
                <div className="text-sm text-vuvenu-dark/80">
                  &quot;POV: Tu découvres le secret de notre pâtisserie qui rend tout le monde fou...&quot;
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-vuvenu-rose/20 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📺</span>
                  <span className="text-sm font-medium text-vuvenu-dark">YouTube Shorts</span>
                </div>
                <div className="text-sm text-vuvenu-dark/80">
                  &quot;Pourquoi cette fleur dure 3 fois plus longtemps que les autres (technique secrète)&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}