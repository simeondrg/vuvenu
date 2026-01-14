'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [recentScripts, setRecentScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Charger le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) throw profileError
        setUserProfile(profile)

        // Charger les scripts récents
        const { data: scripts, error: scriptsError } = await supabase
          .from('scripts')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (scriptsError) {
          console.error('Erreur scripts:', scriptsError)
        } else {
          setRecentScripts(scripts || [])
        }

        // Calculer les statistiques
        const totalScripts = scripts?.length || 0
        const thisMonthScripts = profile.scripts_count_month || 0
        const remainingScripts = profile.subscription_tier === 'business'
          ? '∞'
          : profile.subscription_tier === 'pro'
          ? Math.max(0, 30 - thisMonthScripts)
          : Math.max(0, 10 - thisMonthScripts)

        setStats({
          totalScripts,
          thisMonthScripts,
          remainingScripts,
          campaignsThisMonth: profile.campaigns_count_month || 0,
        })

      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    const businessName = userProfile?.business_name?.split(' ')[0] || 'Champion'

    if (hour < 12) return `Bonjour ${businessName} !`
    if (hour < 18) return `Bon après-midi ${businessName} !`
    return `Bonsoir ${businessName} !`
  }

  const getPlanColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-vuvenu-lime'
      case 'business': return 'bg-vuvenu-violet'
      default: return 'bg-vuvenu-blue'
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-vuvenu-rose/20 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-vuvenu-rose/20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header avec greeting */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-2">
          {getGreeting()}
        </h1>
        <p className="text-lg text-vuvenu-dark/80">
          Prêt à créer du contenu qui fait{' '}
          <span className="bg-vuvenu-lime px-2 py-1 rounded font-semibold">sensation</span> ?
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scripts ce mois */}
        <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-vuvenu-blue/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            <span className="text-xs bg-vuvenu-blue/20 text-vuvenu-dark px-3 py-1 rounded-full">
              Ce mois
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-vuvenu-dark">
              {stats?.thisMonthScripts || 0}
            </div>
            <div className="text-sm text-vuvenu-dark/70">
              Scripts générés
            </div>
            <div className="text-xs text-vuvenu-dark/60">
              Reste: {stats?.remainingScripts} scripts
            </div>
          </div>
        </div>

        {/* Plan actuel */}
        <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${getPlanColor(userProfile?.subscription_tier)}/20 rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">⭐</span>
            </div>
            <span className={`text-xs ${getPlanColor(userProfile?.subscription_tier)} text-vuvenu-dark px-3 py-1 rounded-full`}>
              {userProfile?.subscription_status === 'active' ? 'Actif' : 'Inactif'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-vuvenu-dark capitalize">
              {userProfile?.subscription_tier || 'Gratuit'}
            </div>
            <div className="text-sm text-vuvenu-dark/70">
              Plan actuel
            </div>
            <Link
              href="/settings"
              className="text-xs text-vuvenu-blue hover:underline"
            >
              Gérer l&apos;abonnement →
            </Link>
          </div>
        </div>

        {/* Total productions */}
        <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-vuvenu-violet/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <span className="text-xs bg-vuvenu-violet/20 text-vuvenu-dark px-3 py-1 rounded-full">
              Total
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-vuvenu-dark">
              {stats?.totalScripts || 0}
            </div>
            <div className="text-sm text-vuvenu-dark/70">
              Contenus créés
            </div>
            <div className="text-xs text-vuvenu-dark/60">
              Scripts + Campagnes
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
        <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
          Actions rapides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Générer script */}
          <div className="group">
            <Link
              href="/scripts/new"
              className="block p-6 border-2 border-vuvenu-lime/40 rounded-xl hover:border-vuvenu-lime hover:bg-vuvenu-lime/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-vuvenu-lime/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-lime group-hover:text-vuvenu-dark transition-colors">
                  <span className="text-3xl">✨</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-vuvenu-dark mb-1">
                    Générer un script vidéo
                  </h3>
                  <p className="text-sm text-vuvenu-dark/70">
                    Créez du contenu viral pour TikTok et Reels en quelques clics
                  </p>
                  <div className="text-xs text-vuvenu-lime font-medium mt-2">
                    Commencer →
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Créer campagne */}
          <div className="group">
            <Link
              href={userProfile?.subscription_tier === 'starter' ? '/settings' : '/campaigns/new'}
              className="block p-6 border-2 border-vuvenu-blue/40 rounded-xl hover:border-vuvenu-blue hover:bg-vuvenu-blue/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-vuvenu-blue/20 rounded-xl flex items-center justify-center group-hover:bg-vuvenu-blue group-hover:text-white transition-colors">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-vuvenu-dark mb-1">
                    Créer une campagne pub
                  </h3>
                  <p className="text-sm text-vuvenu-dark/70">
                    {userProfile?.subscription_tier === 'starter'
                      ? 'Passez au plan Pro pour accéder aux campagnes'
                      : 'Publicités Meta automatisées avec images IA'
                    }
                  </p>
                  <div className="text-xs text-vuvenu-blue font-medium mt-2">
                    {userProfile?.subscription_tier === 'starter' ? 'Upgrader →' : 'Créer →'}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Scripts récents */}
      <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-vuvenu-dark">
            Scripts récents
          </h2>
          <Link
            href="/scripts"
            className="text-sm text-vuvenu-blue hover:underline"
          >
            Voir tous →
          </Link>
        </div>

        {recentScripts.length > 0 ? (
          <div className="space-y-4">
            {recentScripts.map((script, index) => (
              <div
                key={script.id}
                className="flex items-center gap-4 p-4 bg-vuvenu-rose/10 rounded-lg hover:bg-vuvenu-rose/20 transition-colors"
              >
                <div className="w-10 h-10 bg-vuvenu-violet rounded-lg flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-vuvenu-dark">
                    {script.title || `Script ${index + 1}`}
                  </h3>
                  <p className="text-sm text-vuvenu-dark/70">
                    {script.format} • {new Date(script.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Link
                  href={`/scripts/${script.id}`}
                  className="text-sm bg-vuvenu-lime px-4 py-2 rounded-lg text-vuvenu-dark font-medium hover:scale-105 transition-transform"
                >
                  Voir
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-vuvenu-rose/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-vuvenu-dark mb-2">
              Aucun script encore
            </h3>
            <p className="text-vuvenu-dark/70 mb-6">
              Créez votre premier script pour commencer à générer du contenu viral !
            </p>
            <Button
              onClick={() => router.push('/scripts/new')}
              className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform"
            >
              Créer mon premier script ✨
            </Button>
          </div>
        )}
      </div>

      {/* Tips & Resources */}
      <div className="bg-gradient-to-br from-vuvenu-lime/20 to-vuvenu-blue/20 rounded-2xl p-8 border border-vuvenu-lime/40">
        <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
          💡 Conseil du jour
        </h2>
        <p className="text-vuvenu-dark/80 mb-6">
          <strong>Astuce :</strong> Les vidéos de 15-30 secondes ont 67% plus d&apos;engagement que les plus longues.
          Utilisez notre générateur pour créer des scripts courts et percutants !
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/scripts/new"
            className="bg-vuvenu-lime text-vuvenu-dark px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Essayer maintenant
          </Link>
          <Link
            href="/about"
            className="border border-vuvenu-blue text-vuvenu-blue px-6 py-2 rounded-lg font-semibold hover:bg-vuvenu-blue hover:text-white transition-colors"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </div>
  )
}