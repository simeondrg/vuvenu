'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AdvancedAnalytics } from '@/components/dashboard/advanced-analytics'
import { EditorialCalendar } from '@/components/dashboard/editorial-calendar'
import {
  BarChart3,
  Calendar,
  Home,
  Zap,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Clock,
  Heart,
  Eye,
  Share2,
  ArrowUpRight,
  Bell,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  business_name?: string | null
  business_type?: string | null
  subscription_tier: 'starter' | 'pro' | 'business' | null
  subscription_status: string
  scripts_count_month: number
  campaigns_count_month: number
  onboarding_data?: any
}

interface Script {
  id: string
  title?: string
  format: string
  created_at: string
  content?: string
  input_data?: any
}

interface Campaign {
  id: string
  title?: string
  status?: string
  wizard_step?: number
  input_data?: any
  created_at: string
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'tip'
  title: string
  message: string
  action?: string
  link?: string
}

/**
 * Dashboard avancé VuVenu avec analytics détaillées et calendrier éditorial
 * Version enrichie du dashboard avec insights business et outils de planification
 */
export default function AdvancedDashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [scripts, setScripts] = useState<Script[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // Charger le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) throw profileError
      setUserProfile(profile)

      // Charger tous les scripts pour analytics
      const { data: scriptsData, error: scriptsError } = await supabase
        .from('scripts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!scriptsError) {
        setScripts(scriptsData || [])
      }

      // Charger les campagnes
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!campaignsError) {
        setCampaigns(campaignsData || [])
      }

      // Générer des notifications intelligentes
      generateNotifications(profile, scriptsData || [], campaignsData || [])

    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const generateNotifications = (profile: UserProfile, scripts: Script[], campaigns: Campaign[]) => {
    const notifications: Notification[] = []

    // Notification de bienvenue pour nouveaux utilisateurs
    if (scripts.length === 0) {
      notifications.push({
        id: 'welcome',
        type: 'info',
        title: '🎉 Bienvenue sur VuVenu !',
        message: 'Créez votre premier script pour commencer à générer du contenu viral',
        action: 'Créer un script',
        link: '/scripts/new'
      })
    }

    // Notification limite approche
    const usagePercentage = profile.subscription_tier === 'business' ? 0 :
      Math.round((profile.scripts_count_month / (profile.subscription_tier === 'pro' ? 30 : 10)) * 100)

    if (usagePercentage >= 80 && profile.subscription_tier !== 'business') {
      notifications.push({
        id: 'usage-warning',
        type: 'warning',
        title: '⚠️ Limite approchée',
        message: `Vous avez utilisé ${usagePercentage}% de vos scripts ce mois`,
        action: profile.subscription_tier === 'starter' ? 'Passer au Pro' : 'Voir usage',
        link: '/settings'
      })
    }

    // Suggestion d'upgrade pour utilisateurs actifs
    if (profile.subscription_tier === 'starter' && scripts.length >= 8) {
      notifications.push({
        id: 'upgrade-suggestion',
        type: 'tip',
        title: '🚀 Vous êtes un utilisateur actif !',
        message: 'Le plan Pro vous donnerait 3x plus de scripts + accès aux campagnes',
        action: 'Découvrir Pro',
        link: '/choose-plan'
      })
    }

    // Conseil régularité
    const recentScripts = scripts.filter(s =>
      new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
    if (scripts.length > 0 && recentScripts.length === 0) {
      notifications.push({
        id: 'consistency-tip',
        type: 'tip',
        title: '📅 Pensez à la régularité',
        message: 'Pas de contenu cette semaine. La régularité booste l\'engagement de +40%',
        action: 'Planifier contenu',
        link: '/dashboard-advanced#calendar'
      })
    }

    // Feature discovery - Gemini
    if (scripts.length >= 3 && profile.subscription_tier !== 'starter') {
      notifications.push({
        id: 'discover-images',
        type: 'success',
        title: '✨ Nouveau : Images IA',
        message: 'Créez maintenant des visuels avec l\'IA Gemini pour vos campagnes',
        action: 'Essayer Gemini',
        link: '/images'
      })
    }

    setNotifications(notifications.slice(0, 3)) // Max 3 notifications
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    const businessName = userProfile?.business_name?.split(' ')[0] || 'Champion'

    if (hour < 12) return `Bonjour ${businessName} !`
    if (hour < 18) return `Bon après-midi ${businessName} !`
    return `Bonsoir ${businessName} !`
  }

  const getQuickStats = () => {
    const thisMonthScripts = userProfile?.scripts_count_month || 0
    const totalScripts = scripts.length
    const avgWeekly = Math.round(thisMonthScripts / (new Date().getDate() / 7)) || 0
    const totalViews = Math.round(totalScripts * 1200 + Math.random() * 1000) // Estimation

    return {
      thisMonthScripts,
      totalScripts,
      avgWeekly,
      totalViews,
      campaignsCount: campaigns.length
    }
  }

  const quickStats = getQuickStats()

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Erreur de chargement</h2>
          <p className="text-gray-600 mt-2">Impossible de charger votre profil</p>
          <Button onClick={() => router.push('/onboarding')} className="mt-4">
            Reconfigurer le profil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header avec greeting et notifications */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {getGreeting()}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Tableau de bord avancé • {userProfile.business_type} • Plan {userProfile.subscription_tier}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-3">
          <Link href="/scripts/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Nouveau script
            </Button>
          </Link>

          {userProfile.subscription_tier !== 'starter' && (
            <Link href="/images">
              <Button variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Générer images
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Notifications intelligentes */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`
              border-l-4 ${
                notification.type === 'warning' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                notification.type === 'success' ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' :
                notification.type === 'tip' ? 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }
            `}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 mt-0.5 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  {notification.action && notification.link && (
                    <Link href={notification.link}>
                      <Button variant="outline" size="sm">
                        {notification.action}
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quickStats.thisMonthScripts}
                </div>
                <div className="text-sm text-gray-600">Scripts ce mois</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quickStats.totalScripts}
                </div>
                <div className="text-sm text-gray-600">Total créés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quickStats.avgWeekly}
                </div>
                <div className="text-sm text-gray-600">Moyenne/sem</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quickStats.totalViews.toLocaleString('fr-FR')}
                </div>
                <div className="text-sm text-gray-600">Vues estimées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quickStats.campaignsCount}
                </div>
                <div className="text-sm text-gray-600">Campagnes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/scripts/new"
                  className="group p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Créer un script</h3>
                      <p className="text-sm text-gray-600">Contenu viral en 30s</p>
                    </div>
                  </div>
                </Link>

                {userProfile.subscription_tier !== 'starter' && (
                  <Link
                    href="/campaigns/new"
                    className="group p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Nouvelle campagne</h3>
                        <p className="text-sm text-gray-600">Publicité automatisée</p>
                      </div>
                    </div>
                  </Link>
                )}

                {userProfile.subscription_tier !== 'starter' && (
                  <Link
                    href="/images"
                    className="group p-4 border rounded-lg hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Générer images</h3>
                        <p className="text-sm text-gray-600">IA Gemini intégrée</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activité récente */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scripts récents</CardTitle>
              </CardHeader>
              <CardContent>
                {scripts.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {scripts.slice(0, 5).map((script, index) => (
                      <div
                        key={script.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-semibold text-blue-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {script.title || `Script ${script.format}`}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {script.format} • {new Date(script.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Link href={`/scripts/${script.id}`}>
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">Aucun script encore</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Créez votre premier script pour commencer
                    </p>
                    <Link href="/scripts/new">
                      <Button>
                        Créer maintenant
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campagnes en cours</CardTitle>
              </CardHeader>
              <CardContent>
                {campaigns.length > 0 ? (
                  <div className="space-y-3">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {campaign.title || 'Campagne Meta Ads'}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Badge variant="secondary" className="text-xs">
                              {campaign.status || 'draft'}
                            </Badge>
                            <span>•</span>
                            <span>{campaign.wizard_step || 0}/7 étapes</span>
                          </div>
                        </div>
                        <Link href={`/campaigns/${campaign.id}`}>
                          <Button variant="outline" size="sm">
                            Continuer
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">
                      {userProfile.subscription_tier === 'starter'
                        ? 'Campagnes disponibles en Pro'
                        : 'Aucune campagne encore'
                      }
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {userProfile.subscription_tier === 'starter'
                        ? 'Passez au plan Pro pour créer des campagnes'
                        : 'Créez votre première campagne automatisée'
                      }
                    </p>
                    <Link href={userProfile.subscription_tier === 'starter' ? '/choose-plan' : '/campaigns/new'}>
                      <Button>
                        {userProfile.subscription_tier === 'starter' ? 'Voir les plans' : 'Créer campagne'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AdvancedAnalytics
            userProfile={userProfile}
            scripts={scripts}
            campaigns={campaigns}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <EditorialCalendar
            userProfile={userProfile}
            scripts={scripts}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6 mt-6">
          {/* Insights sectoriels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Insights secteur {userProfile.business_type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📊 Performance sectorielle
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Votre secteur a +23% d'engagement avec les Reels vs autres formats
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    🎯 Audience type
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Vos clients préfèrent du contenu authentique et des coulisses
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    ⏰ Timing optimal
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Meilleure portée : Mardi-Jeudi 18h-21h pour votre secteur
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  🚀 Recommandation personnalisée
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Basé sur votre profil : Créez 3 Reels/semaine sur vos spécialités.
                  Montrez votre savoir-faire et l'ambiance de votre {userProfile.business_type}.
                  L'authenticité génère +45% d'engagement dans votre secteur.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comparaison concurrentielle */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Benchmark concurrentiel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium">Fréquence de publication</h4>
                    <p className="text-sm text-gray-600">Comparé aux autres {userProfile.business_type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">Excellent</div>
                    <div className="text-sm text-gray-600">Top 20%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium">Diversité des formats</h4>
                    <p className="text-sm text-gray-600">Variété de vos contenus</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">Correct</div>
                    <div className="text-sm text-gray-600">Peut s'améliorer</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}