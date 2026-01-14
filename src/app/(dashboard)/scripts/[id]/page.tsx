'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function ScriptDetailPage() {
  const [script, setScript] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const loadScript = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        const { data: scriptData, error } = await supabase
          .from('scripts')
          .select('*')
          .eq('id', params.id as string)
          .eq('user_id', session.user.id)
          .single()

        if (error || !scriptData) {
          console.error('Erreur chargement script:', error)
          router.push('/scripts')
          return
        }

        setScript(scriptData)
      } catch (error) {
        console.error('Erreur:', error)
        router.push('/scripts')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadScript()
    }
  }, [params.id, router])

  const handleCopyScript = async () => {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(script.content)
      // Petite animation de feedback
      setTimeout(() => setCopying(false), 1000)
    } catch (error) {
      console.error('Erreur copie:', error)
      setCopying(false)
    }
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

  const getFormatName = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'reels': return 'Instagram Reels'
      case 'tiktok': return 'TikTok'
      case 'youtube-shorts': return 'YouTube Shorts'
      case 'story': return 'Stories Instagram'
      default: return format || 'Format inconnu'
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-vuvenu-rose/20 rounded-lg w-1/3"></div>
          <div className="bg-white rounded-2xl p-8">
            <div className="space-y-4">
              <div className="h-6 bg-vuvenu-rose/20 rounded w-1/2"></div>
              <div className="h-4 bg-vuvenu-rose/20 rounded w-full"></div>
              <div className="h-4 bg-vuvenu-rose/20 rounded w-3/4"></div>
              <div className="h-4 bg-vuvenu-rose/20 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!script) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
            Script introuvable
          </h1>
          <p className="text-vuvenu-dark/80 mb-8">
            Ce script n&apos;existe pas ou vous n&apos;avez pas l&apos;autorisation de le voir.
          </p>
          <Button
            onClick={() => router.push('/scripts')}
            className="bg-vuvenu-lime text-vuvenu-dark"
          >
            ← Retour aux scripts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.push('/scripts')}
            variant="outline"
            size="sm"
            className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
          >
            ← Retour
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vuvenu-lime/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">{getFormatIcon(script.format)}</span>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-vuvenu-dark">
                {script.title || 'Script sans titre'}
              </h1>
              <p className="text-sm text-vuvenu-dark/60">
                {getFormatName(script.format)} • {new Date(script.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
        <h2 className="text-lg font-semibold text-vuvenu-dark mb-4">
          Informations du script
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-vuvenu-dark/60 mb-1">Format</div>
            <div className="font-medium text-vuvenu-dark">
              {getFormatName(script.format)}
            </div>
          </div>

          <div>
            <div className="text-sm text-vuvenu-dark/60 mb-1">Ton</div>
            <div className="font-medium text-vuvenu-dark capitalize">
              {script.tone || 'Non spécifié'}
            </div>
          </div>

          <div>
            <div className="text-sm text-vuvenu-dark/60 mb-1">Tokens utilisés</div>
            <div className="font-medium text-vuvenu-dark">
              {script.tokens_used || 0}
            </div>
          </div>
        </div>

        {script.input_data && (
          <div className="mt-6 pt-6 border-t border-vuvenu-rose/20">
            <div className="text-sm text-vuvenu-dark/60 mb-2">Paramètres de génération</div>
            <div className="bg-vuvenu-cream rounded-lg p-4 text-sm">
              {script.input_data.industry && (
                <div className="mb-2">
                  <strong>Secteur :</strong> {script.input_data.industry}
                </div>
              )}
              {script.input_data.hook && (
                <div className="mb-2">
                  <strong>Hook :</strong> {script.input_data.hook}
                </div>
              )}
              {script.input_data.topic && (
                <div className="mb-2">
                  <strong>Sujet :</strong> {script.input_data.topic}
                </div>
              )}
              {script.input_data.instructions && (
                <div className="mb-2">
                  <strong>Instructions :</strong> {script.input_data.instructions}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Script content */}
      <div className="bg-white rounded-2xl shadow-vuvenu border border-vuvenu-rose/20">
        <div className="p-6 border-b border-vuvenu-rose/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-vuvenu-dark">
              Contenu du script
            </h2>

            <div className="flex gap-2">
              <Button
                onClick={handleCopyScript}
                disabled={copying}
                size="sm"
                className={`transition-all ${
                  copying
                    ? 'bg-green-500 text-white'
                    : 'bg-vuvenu-lime text-vuvenu-dark hover:scale-105'
                }`}
              >
                {copying ? '✅ Copié !' : '📋 Copier'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-vuvenu-cream rounded-xl p-6">
            <pre className="whitespace-pre-wrap text-sm text-vuvenu-dark leading-relaxed font-mono">
              {script.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
        <h2 className="text-lg font-semibold text-vuvenu-dark mb-4">
          Actions rapides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Créer un variant */}
          <Link
            href="/scripts/new"
            className="flex items-center gap-3 p-4 border border-vuvenu-lime rounded-lg hover:bg-vuvenu-lime/10 transition-colors group"
          >
            <div className="w-10 h-10 bg-vuvenu-lime/20 rounded-lg flex items-center justify-center group-hover:bg-vuvenu-lime group-hover:text-vuvenu-dark">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <div className="font-medium text-vuvenu-dark">Créer un variant</div>
              <div className="text-xs text-vuvenu-dark/60">Nouveau script basé sur celui-ci</div>
            </div>
          </Link>

          {/* Partager */}
          <button
            onClick={handleCopyScript}
            className="flex items-center gap-3 p-4 border border-vuvenu-blue rounded-lg hover:bg-vuvenu-blue/10 transition-colors group"
          >
            <div className="w-10 h-10 bg-vuvenu-blue/20 rounded-lg flex items-center justify-center group-hover:bg-vuvenu-blue group-hover:text-white">
              <span className="text-lg">🔗</span>
            </div>
            <div>
              <div className="font-medium text-vuvenu-dark">Partager</div>
              <div className="text-xs text-vuvenu-dark/60">Copier le contenu</div>
            </div>
          </button>

          {/* Analytics (placeholder) */}
          <button
            disabled
            className="flex items-center gap-3 p-4 border border-vuvenu-violet/40 rounded-lg opacity-50 cursor-not-allowed"
          >
            <div className="w-10 h-10 bg-vuvenu-violet/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <div className="font-medium text-vuvenu-dark">Analytics</div>
              <div className="text-xs text-vuvenu-dark/60">Bientôt disponible</div>
            </div>
          </button>
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <div className="bg-gradient-to-br from-vuvenu-lime/20 to-vuvenu-blue/20 rounded-2xl p-8 border border-vuvenu-lime/40">
        <h2 className="text-lg font-semibold text-vuvenu-dark mb-4">
          💡 Conseils pour tourner votre vidéo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-vuvenu-dark/80">
          <div>
            <h3 className="font-semibold text-vuvenu-dark mb-2">✅ À faire :</h3>
            <ul className="space-y-1">
              <li>• Filmer en format vertical (9:16)</li>
              <li>• Changer de plan toutes les 2-3 secondes</li>
              <li>• Ajouter des sous-titres pour l&apos;accessibilité</li>
              <li>• Utiliser une musique trending</li>
              <li>• Regarder directement la caméra</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-vuvenu-dark mb-2">❌ À éviter :</h3>
            <ul className="space-y-1">
              <li>• Vidéo trop longue (respecter la durée format)</li>
              <li>• Son de mauvaise qualité</li>
              <li>• Éclairage insuffisant</li>
              <li>• Hésitations dans le discours</li>
              <li>• Intro trop longue avant le hook</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/scripts/new"
            className="bg-vuvenu-lime text-vuvenu-dark px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform text-sm"
          >
            Créer un autre script
          </Link>
          <Link
            href="/scripts"
            className="border border-vuvenu-blue text-vuvenu-blue px-4 py-2 rounded-lg font-medium hover:bg-vuvenu-blue hover:text-white transition-colors text-sm"
          >
            Voir tous mes scripts
          </Link>
        </div>
      </div>
    </div>
  )
}