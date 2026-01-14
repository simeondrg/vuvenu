'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface UserProfile {
  id: string
  business_name?: string | null
  subscription_tier: 'starter' | 'pro' | 'business' | null
  subscription_status: string
  scripts_count_month: number
  campaigns_count_month: number
}

interface Stats {
  totalScripts: number
  thisMonthScripts: number
  remainingScripts: number | string
  campaignsThisMonth: number
  lastMonthScripts: number
  progression: number
  formatStats: Record<string, number>
}

interface Analytics {
  weeklyAverage: number
  topFormat: string
  daysUntilReset: number
  usagePercentage: number
}

interface Script {
  id: string
  title?: string
  format: string
  created_at: string
}

interface Campaign {
  id: string
  title?: string
  status?: string
  wizard_step?: number
  input_data?: any // JSON from Supabase - peut être étendu plus tard
  created_at: string
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentScripts, setRecentScripts] = useState<Script[]>([])
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
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

        // Charger toutes les données scripts pour analytics
        const { data: allScripts } = await supabase
          .from('scripts')
          .select('*')
          .eq('user_id', session.user.id)

        // Charger les campagnes récentes
        const { data: campaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3)

        if (!campaignsError) {
          setRecentCampaigns(campaigns || [])
        }

        // Calculer les statistiques
        const totalScripts = allScripts?.length || 0
        const thisMonthScripts = profile.scripts_count_month || 0
        const remainingScripts = profile.subscription_tier === 'business'
          ? '∞'
          : profile.subscription_tier === 'pro'
          ? Math.max(0, 30 - thisMonthScripts)
          : Math.max(0, 10 - thisMonthScripts)

        // Analytics avancées
        const now = new Date()
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const lastMonthScripts = allScripts?.filter(script => {
          const scriptDate = new Date(script.created_at)
          return scriptDate >= oneMonthAgo && scriptDate < new Date(now.getFullYear(), now.getMonth(), 1)
        }).length || 0

        const thisMonthScriptsFromData = allScripts?.filter(script => {
          const scriptDate = new Date(script.created_at)
          return scriptDate >= new Date(now.getFullYear(), now.getMonth(), 1)
        }).length || 0

        // Calculer les métriques par format
        const formatStats = allScripts?.reduce((acc: Record<string, number>, script: Script) => {
          acc[script.format] = (acc[script.format] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

        // Calculer la progression
        const progression = lastMonthScripts > 0
          ? ((thisMonthScriptsFromData - lastMonthScripts) / lastMonthScripts) * 100
          : thisMonthScriptsFromData > 0 ? 100 : 0

        setStats({
          totalScripts,
          thisMonthScripts,
          remainingScripts,
          campaignsThisMonth: profile.campaigns_count_month || 0,
          lastMonthScripts,
          progression: Math.round(progression),
          formatStats
        })

        // Insights et recommandations
        const insights = {
          weeklyAverage: Math.round(thisMonthScriptsFromData / (now.getDate() / 7)) || 0,
          topFormat: Object.keys(formatStats).reduce((a, b) => formatStats[a] > formatStats[b] ? a : b, 'Reels'),
          daysUntilReset: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate(),
          usagePercentage: profile.subscription_tier === 'business' ? 100 : Math.round((thisMonthScripts / (profile.subscription_tier === 'pro' ? 30 : 10)) * 100)
        }

        setAnalytics(insights)

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

  const getPlanColor = (tier: string | null | undefined) => {
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Scripts ce mois */}
        <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-vuvenu-blue/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            {stats?.progression !== undefined && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                stats.progression >= 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {stats.progression > 0 ? '+' : ''}{stats.progression}%
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-vuvenu-dark">
              {stats?.thisMonthScripts || 0}
            </div>
            <div className="text-sm text-vuvenu-dark/70">
              Scripts ce mois
            </div>
            <div className="text-xs text-vuvenu-dark/60">
              Reste: {stats?.remainingScripts} • Mois dernier: {stats?.lastMonthScripts || 0}
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

        {/* Campagnes ce mois */}
        <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-vuvenu-violet/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <span className="text-xs bg-vuvenu-violet/20 text-vuvenu-dark px-3 py-1 rounded-full">
              Campagnes
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-vuvenu-dark">
              {stats?.campaignsThisMonth || 0}
            </div>
            <div className="text-sm text-vuvenu-dark/70">
              Campagnes Meta Ads
            </div>
            <div className="text-xs text-vuvenu-dark/60">
              {userProfile?.subscription_tier === 'starter' ? 'Pro/Business requis' : `Total créé: ${stats?.totalScripts || 0}`}
            </div>
          </div>
        </div>

        {/* Moyenne hebdo */}
        <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-vuvenu-lime/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-xs bg-vuvenu-lime/20 text-vuvenu-dark px-3 py-1 rounded-full">
              Tendance
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-vuvenu-dark">
              {analytics?.weeklyAverage || 0}
            </div>
            <div className="text-sm text-vuvenu-dark/70">
              Scripts / semaine
            </div>
            <div className="text-xs text-vuvenu-dark/60">
              Format favori: {analytics?.topFormat || 'Reels'}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics et insights */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progression mensuelle */}
          <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
            <h3 className="text-lg font-semibold text-vuvenu-dark mb-4">📈 Progression ce mois</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-vuvenu-dark/70 mb-2">
                  <span>Utilisation du plan</span>
                  <span>{analytics.usagePercentage}%</span>
                </div>
                <div className="w-full bg-vuvenu-rose/30 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      analytics.usagePercentage >= 80
                        ? 'bg-red-500'
                        : analytics.usagePercentage >= 60
                        ? 'bg-yellow-500'
                        : 'bg-vuvenu-blue'
                    }`}
                    style={{ width: `${Math.min(analytics.usagePercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-vuvenu-blue/10 rounded-lg p-4">
                <div className="text-sm font-medium text-vuvenu-dark mb-1">
                  {analytics.usagePercentage >= 90
                    ? '⚠️ Limite presque atteinte !'
                    : analytics.usagePercentage >= 80
                    ? '⚡ Vous êtes très actif !'
                    : '✅ Vous avez de la marge'
                  }
                </div>
                <div className="text-xs text-vuvenu-dark/70">
                  {analytics.daysUntilReset} jours avant le reset des compteurs
                </div>
              </div>
            </div>
          </div>

          {/* Insights personnalisés */}
          <div className="bg-white rounded-2xl p-6 shadow-vuvenu border border-vuvenu-rose/20">
            <h3 className="text-lg font-semibold text-vuvenu-dark mb-4">💡 Insights personnalisés</h3>

            <div className="space-y-4">
              {/* Recommandation basée sur l'usage */}
              {analytics.usagePercentage >= 90 && userProfile?.subscription_tier === 'starter' && (
                <div className="bg-vuvenu-lime/10 border border-vuvenu-lime/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-vuvenu-dark mb-1">
                    🚀 Passez au plan Pro !
                  </div>
                  <div className="text-xs text-vuvenu-dark/70 mb-3">
                    Vous utilisez beaucoup VuVenu. Le plan Pro vous donnera accès aux campagnes Meta Ads et 3x plus de scripts.
                  </div>
                  <Link
                    href="/settings"
                    className="text-xs bg-vuvenu-lime text-vuvenu-dark px-3 py-1 rounded font-medium hover:scale-105 transition-transform"
                  >
                    Voir les plans
                  </Link>
                </div>
              )}

              {/* Recommandation de fréquence */}
              {analytics?.weeklyAverage && analytics.weeklyAverage < 2 && stats?.thisMonthScripts && stats.thisMonthScripts > 0 && (
                <div className="bg-vuvenu-blue/10 border border-vuvenu-blue/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-vuvenu-dark mb-1">
                    📅 Créez plus régulièrement
                  </div>
                  <div className="text-xs text-vuvenu-dark/70">
                    La régularité est clé sur les réseaux sociaux. Essayez de créer 3-4 scripts par semaine.
                  </div>
                </div>
              )}

              {/* Recommandation de format */}
              {stats?.formatStats && Object.keys(stats.formatStats).length === 1 && (
                <div className="bg-vuvenu-violet/10 border border-vuvenu-violet/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-vuvenu-dark mb-1">
                    🎭 Diversifiez vos formats
                  </div>
                  <div className="text-xs text-vuvenu-dark/70">
                    Vous utilisez surtout {analytics.topFormat}. Testez aussi les autres formats pour toucher plus d&apos;audience !
                  </div>
                </div>
              )}

              {/* Message d'encouragement pour les nouveaux */}
              {stats?.totalScripts === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-green-700 mb-1">
                    🌟 Bienvenue sur VuVenu !
                  </div>
                  <div className="text-xs text-green-600">
                    Créez votre premier script pour commencer à générer du contenu viral. Notre IA est là pour vous aider !
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scripts récents */}
        <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-vuvenu-dark">
              📝 Scripts récents
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

        {/* Campagnes récentes */}
        <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-vuvenu-dark">
              🎯 Campagnes récentes
            </h2>
            <Link
              href="/campaigns"
              className="text-sm text-vuvenu-blue hover:underline"
            >
              Voir toutes →
            </Link>
          </div>

          {recentCampaigns.length > 0 ? (
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div
                  key={campaign.id}
                  className="flex items-center gap-4 p-4 bg-vuvenu-violet/10 rounded-lg hover:bg-vuvenu-violet/20 transition-colors"
                >
                  <div className="w-10 h-10 bg-vuvenu-violet rounded-lg flex items-center justify-center text-white font-semibold">
                    🎯
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-vuvenu-dark text-sm">
                      {campaign.title || `Campagne ${index + 1}`}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-vuvenu-dark/70">
                      <span className="capitalize">{campaign.input_data?.industry || 'Secteur'}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded ${
                        campaign.status === 'draft' ? 'bg-vuvenu-rose/20' :
                        campaign.status === 'ready' ? 'bg-green-100' :
                        'bg-vuvenu-lime/20'
                      }`}>
                        {campaign.status || 'draft'}
                      </span>
                      <span>•</span>
                      <span>{new Date(campaign.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="text-xs text-vuvenu-dark/60 mt-1">
                      Wizard: {campaign.wizard_step || 0}/7 étapes
                    </div>
                  </div>
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="text-sm bg-vuvenu-violet text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Voir
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-vuvenu-violet/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-vuvenu-dark mb-2">
                {userProfile?.subscription_tier === 'starter' ? 'Campagnes disponibles en Pro' : 'Aucune campagne encore'}
              </h3>
              <p className="text-vuvenu-dark/70 mb-6 text-sm">
                {userProfile?.subscription_tier === 'starter'
                  ? 'Passez au plan Pro pour créer des campagnes Meta Ads automatisées avec IA !'
                  : 'Créez votre première campagne publicitaire avec génération d\'images IA !'
                }
              </p>
              <Button
                onClick={() => router.push(userProfile?.subscription_tier === 'starter' ? '/settings' : '/campaigns/new')}
                className="bg-vuvenu-violet text-white hover:bg-vuvenu-violet/90 text-sm"
              >
                {userProfile?.subscription_tier === 'starter' ? 'Voir les plans 🚀' : 'Créer ma première campagne 🎯'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Conseil personnalisé */}
      <div className="bg-gradient-to-br from-vuvenu-lime/20 to-vuvenu-blue/20 rounded-2xl p-8 border border-vuvenu-lime/40">
        <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-4">
          💡 {(stats?.totalScripts ?? 0) > 0 ? 'Conseil personnalisé' : 'Conseil pour bien commencer'}
        </h2>

        {/* Conseil dynamique basé sur les analytics */}
        <p className="text-vuvenu-dark/80 mb-6">
          <strong>
            {stats?.totalScripts === 0
              ? 'Pour débuter : '
              : (analytics?.usagePercentage ?? 0) >= 80
              ? 'Optimisation : '
              : (analytics?.weeklyAverage ?? 0) < 2
              ? 'Régularité : '
              : 'Performance : '
            }
          </strong>
          {stats?.totalScripts === 0
            ? 'Commencez par créer 2-3 scripts pour des formats différents (Reels, TikTok, Stories) et découvrez ce qui marche le mieux pour votre secteur.'
            : (analytics?.usagePercentage ?? 0) >= 80 && userProfile?.subscription_tier === 'starter'
            ? 'Vous utilisez VuVenu intensivement ! Le plan Pro vous donnera 3x plus de scripts et accès aux campagnes Meta Ads pour démultiplier votre impact.'
            : (analytics?.usagePercentage ?? 0) >= 80
            ? 'Excellent usage ! Pensez à programmer vos publications pour maintenir une présence régulière sur les réseaux sociaux.'
            : (analytics?.weeklyAverage ?? 0) < 2 && (stats?.thisMonthScripts ?? 0) > 0
            ? 'La régularité booste l\'engagement de +40%. Essayez de créer 3-4 scripts par semaine pour maximiser votre visibilité.'
            : analytics?.topFormat
            ? `Votre format favori est ${analytics?.topFormat}. Testez aussi d\'autres formats pour diversifier votre audience et découvrir de nouvelles opportunités !`
            : 'Les vidéos de 15-30 secondes ont 67% plus d\'engagement. Utilisez notre générateur pour créer des scripts courts et percutants !'
          }
        </p>

        <div className="flex flex-wrap gap-4">
          {stats?.totalScripts === 0 ? (
            <Link
              href="/scripts/new"
              className="bg-vuvenu-lime text-vuvenu-dark px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Créer mon premier script ✨
            </Link>
          ) : (analytics?.usagePercentage ?? 0) >= 80 && userProfile?.subscription_tier === 'starter' ? (
            <Link
              href="/settings"
              className="bg-vuvenu-lime text-vuvenu-dark px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Passer au plan Pro 🚀
            </Link>
          ) : (
            <Link
              href="/scripts/new"
              className="bg-vuvenu-lime text-vuvenu-dark px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Créer un nouveau script
            </Link>
          )}

          {/* Bouton secondaire adaptatif */}
          {userProfile?.subscription_tier !== 'starter' && !recentCampaigns.length && (
            <Link
              href="/campaigns/new"
              className="border border-vuvenu-violet text-vuvenu-violet px-6 py-2 rounded-lg font-semibold hover:bg-vuvenu-violet hover:text-white transition-colors"
            >
              Essayer les campagnes Meta Ads
            </Link>
          )}

          {(stats?.totalScripts ?? 0) > 0 && (
            <Link
              href="/scripts"
              className="border border-vuvenu-blue text-vuvenu-blue px-6 py-2 rounded-lg font-semibold hover:bg-vuvenu-blue hover:text-white transition-colors"
            >
              Voir tous mes contenus
            </Link>
          )}
        </div>

        {/* Stats de motivation */}
        {(stats?.totalScripts ?? 0) > 0 && (
          <div className="mt-6 pt-6 border-t border-vuvenu-lime/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-vuvenu-dark">{stats?.totalScripts}</div>
                <div className="text-xs text-vuvenu-dark/70">Contenus créés</div>
              </div>
              <div>
                <div className="text-xl font-bold text-vuvenu-dark">{analytics?.weeklyAverage || 0}</div>
                <div className="text-xs text-vuvenu-dark/70">Scripts/semaine</div>
              </div>
              <div>
                <div className="text-xl font-bold text-vuvenu-dark">{analytics?.daysUntilReset || 0}</div>
                <div className="text-xs text-vuvenu-dark/70">Jours avant reset</div>
              </div>
              <div>
                <div className="text-xl font-bold text-vuvenu-dark">
                  {userProfile?.subscription_tier === 'business' ? '∞' : stats?.remainingScripts}
                </div>
                <div className="text-xs text-vuvenu-dark/70">Restants ce mois</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}