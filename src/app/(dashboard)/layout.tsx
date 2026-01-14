'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const navigationItems = [
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: '📊',
    description: 'Vue d&apos;ensemble et statistiques'
  },
  {
    name: 'Dashboard Pro',
    href: '/dashboard-advanced',
    icon: '📈',
    description: 'Analytics avancées & calendrier'
  },
  {
    name: 'Scripts Vidéo',
    href: '/scripts',
    icon: '🎬',
    description: 'Générateur de scripts IA'
  },
  {
    name: 'Campagnes Pub',
    href: '/campaigns',
    icon: '🚀',
    description: 'Publicités Meta automatisées'
  },
  {
    name: 'Images IA',
    href: '/images',
    icon: '🎨',
    description: 'Générateur d&apos;images Gemini'
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: '⚙️',
    description: 'Profil et abonnement'
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        setUser(session.user)

        // Récupérer le profil
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Erreur profil:', error)
          router.push('/onboarding')
          return
        }

        if (!profile?.onboarding_completed) {
          router.push('/onboarding')
          return
        }

        setUserProfile(profile)
      } catch (error) {
        console.error('Erreur auth:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-vuvenu-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-vuvenu-lime rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">V</span>
          </div>
          <p className="text-vuvenu-dark">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-vuvenu-rose/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
              <span className="font-bold text-vuvenu-dark">V</span>
            </div>
            <span className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-vuvenu-rose/20"
          >
            <span className="text-xl">{sidebarOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-vuvenu-rose/20 transform transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Logo */}
          <div className="p-6 border-b border-vuvenu-rose/20">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                <span className="font-bold text-vuvenu-dark text-lg">V</span>
              </div>
              <div>
                <div className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</div>
                <div className="text-xs text-vuvenu-dark/60 truncate">
                  {userProfile.business_name}
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-vuvenu-lime text-vuvenu-dark font-semibold'
                      : 'text-vuvenu-dark/70 hover:bg-vuvenu-rose/20 hover:text-vuvenu-dark'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-60">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Compte info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-vuvenu-rose/20 bg-white">
            <div className="space-y-3">
              {/* Plan actuel */}
              <div className="bg-vuvenu-violet/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-vuvenu-dark">
                    Plan {userProfile.subscription_tier || 'Gratuit'}
                  </span>
                  <span className="text-xs bg-vuvenu-lime px-2 py-1 rounded-full text-vuvenu-dark">
                    {userProfile.subscription_status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="text-xs text-vuvenu-dark/60">
                  Scripts: {userProfile.scripts_count_month || 0}/
                  {userProfile.subscription_tier === 'pro' ? '30' :
                   userProfile.subscription_tier === 'business' ? '∞' : '10'}
                </div>
              </div>

              {/* Profil utilisateur */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-vuvenu-blue to-vuvenu-violet rounded-full flex items-center justify-center text-white font-semibold">
                  {userProfile.business_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-vuvenu-dark text-sm truncate">
                    {userProfile.business_name}
                  </div>
                  <div className="text-xs text-vuvenu-dark/60 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Bouton déconnexion */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full text-xs border-vuvenu-rose/40 text-vuvenu-dark/70 hover:bg-vuvenu-rose/20"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}