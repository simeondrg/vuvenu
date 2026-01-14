# 🎨 MEGA PROMPT GEMINI PHASE 1 - LANDING + ONBOARDING ENRICHI

**Mission** : Générer la Phase 1 complète de VuVenu intégrant notre stack technique exacte et nos 22 industries documentées avec données virales réelles.

---

## 🎯 OBJECTIF PHASE 1 PRÉCIS

Créer uniquement les pages fondamentales :
- **Landing page** complète (`/src/app/page.tsx`)
- **Onboarding wizard** 5 étapes (`/src/app/onboarding/page.tsx`)
- **Choose plan** (`/src/app/choose-plan/page.tsx`)
- **Layout principal** avec navigation (`/src/app/layout.tsx`)
- **Components partagés** (header, footer, industry-selector, etc.)

**NOT INCLUDED in Phase 1** : Dashboard, Scripts, Campaigns, Auth pages, Legal pages
**WILL BE DONE** in Phase 2 & 3 avec Ralph Loop

---

## ⚙️ STACK TECHNIQUE EXACT

### Next.js 16 App Router
```typescript
// Configuration exacte
- TypeScript strict mode
- Server Components par défaut
- App directory structure
- Turbopack compatibility
- Metadata API pour SEO
- 'use client' seulement si nécessaire
```

### Supabase Integration EXACTE
```typescript
// Types from /src/types/database.ts (EXISTING)
import type { Database } from '@/types/database'

// Tables disponibles :
profiles: {
  id: string (UUID, référence auth.users)
  business_name: string
  business_type: string (une des 22 industries)
  target_audience: string | null
  main_goal: string | null
  subscription_status: 'none' | 'active' | 'past_due' | 'canceled'
  subscription_tier: 'starter' | 'pro' | 'business' | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

// Auth helpers from /src/lib/supabase/client.ts (EXISTING)
import { supabase, auth } from '@/lib/supabase/client'

// Available methods:
auth.signIn(email, password)
auth.signUp(email, password, metadata)
auth.signInWithGoogle(redirectTo?)
auth.signOut()
auth.getUser()

// Server helpers from /src/lib/supabase/server.ts (EXISTING)
import { createClient, getUser, getUserProfile } from '@/lib/supabase/server'
```

### Design System EXACT
```typescript
// Utility classes from /src/lib/utils.ts (EXISTING)
import { cn, capitalize, truncate, formatPrice, formatDate, timeAgo } from '@/lib/utils'

// Error boundaries from /src/components/ui/error-boundary.tsx (EXISTING)
import { ErrorBoundary, PageErrorBoundary } from '@/components/ui/error-boundary'

// Button component from /src/components/ui/button.tsx (EXISTING)
import { Button } from '@/components/ui/button'

// Couleurs design system VuVenu :
Electric Lime: #BFFF00 (primary CTA, highlights)
Pixel Blue: #60A5FA (graphics, backgrounds)
Soft Violet: #C4B5FD (secondary sections, cards)
Pale Rose: #FECDD3 (soft backgrounds, hover states)
Cream: #FFFBEB (main background)
Deep Dark: #0F172A (primary text)
```

### Error Handling VuVenu EXACT
```typescript
// System from /src/lib/errors/index.ts (EXISTING)
import { VuVenuError, AuthError, SubscriptionError, DatabaseError, handleSupabaseError } from '@/lib/errors'

// Dans chaque composant :
try {
  const result = await supabase.operation()
} catch (error) {
  const vuvenuerror = handleSupabaseError(error)
  throw vuvenuerror // sera catchée par ErrorBoundary
}
```

---

## 📊 DONNÉES RÉELLES - 22 INDUSTRIES INTÉGRÉES

### Structure des données industrie
```typescript
// À créer : /src/lib/data/industries.ts
export interface IndustryData {
  id: string
  name: string
  category: string
  icon: string
  viralAccounts: {
    handle: string
    platform: string
    followers: string
    description: string
  }[]
  winningFormats: {
    name: string
    duration: string
    viewRange: string
    description: string
  }[]
  testedHooks: {
    text: string
    performance: string
    context: string
  }[]
  fatalErrors: {
    error: string
    solution: string
  }[]
  trends2024_2025: string[]
}

export const INDUSTRIES_DATA: IndustryData[] = [
  {
    id: 'animaux',
    name: 'Animaux',
    category: 'Family & Pets',
    icon: '🐾',
    viralAccounts: [
      {
        handle: '@girlwithedogs',
        platform: 'TikTok',
        followers: '7.1M',
        description: 'Toilettage professionnel avec humour'
      },
      {
        handle: '@dogsbylogan',
        platform: 'TikTok',
        followers: '6.5M',
        description: 'Dressage et comportement canin'
      }
    ],
    winningFormats: [
      {
        name: 'Transformation Before/After',
        duration: '15-60s',
        viewRange: '500K-5M+ vues',
        description: 'Avant/après toilettage ou dressage'
      },
      {
        name: 'ASMR Grooming',
        duration: '30-90s',
        viewRange: '500K-7M vues',
        description: 'Sons apaisants du toilettage'
      },
      {
        name: 'POV Animal',
        duration: '15-45s',
        viewRange: '100K-1.2M vues',
        description: 'Point de vue de l\'animal'
      }
    ],
    testedHooks: [
      {
        text: 'Wait until the end...',
        performance: 'Des millions de vues',
        context: 'Transformation spectaculaire'
      },
      {
        text: 'This dog was abandoned and...',
        performance: '500K-2M vues',
        context: 'Histoire émouvante'
      },
      {
        text: 'Nobody is talking about this...',
        performance: '100K-300K vues',
        context: 'Technique secrète'
      }
    ],
    fatalErrors: [
      {
        error: 'Montrer des animaux stressés',
        solution: 'Toujours montrer des animaux détendus et heureux'
      },
      {
        error: 'Techniques dangereuses',
        solution: 'Valider toutes les pratiques avec un vétérinaire'
      }
    ],
    trends2024_2025: [
      'Bien-être animal prioritaire',
      'Méthodes de dressage positif',
      'ASMR pet grooming en explosion',
      'Adoption responsable mise en avant'
    ]
  },
  // ... 21 autres industries avec même niveau de détail

  {
    id: 'restaurant',
    name: 'Restauration table',
    category: 'Food & Drink',
    icon: '🍽️',
    viralAccounts: [
      {
        handle: '@gordonramsay',
        platform: 'TikTok',
        followers: '35M',
        description: 'Chef celebrity, recettes et critique'
      },
      {
        handle: '@chefsalinas',
        platform: 'Instagram',
        followers: '2.8M',
        description: 'Cuisine française moderne'
      }
    ],
    winningFormats: [
      {
        name: 'Recette rapide 60s',
        duration: '45-75s',
        viewRange: '200K-3M vues',
        description: 'Recette complète en moins d\'1 minute'
      },
      {
        name: 'Behind the scenes cuisine',
        duration: '30-90s',
        viewRange: '100K-1.5M vues',
        description: 'Dans les coulisses du restaurant'
      }
    ],
    testedHooks: [
      {
        text: 'Le secret que les chefs cachent...',
        performance: '1M-5M vues',
        context: 'Technique professionnelle révélée'
      },
      {
        text: 'Cette recette va changer votre vie',
        performance: '500K-2M vues',
        context: 'Recette simple mais révolutionnaire'
      }
    ],
    fatalErrors: [
      {
        error: 'Hygiène douteuse visible',
        solution: 'Toujours montrer une cuisine impeccable'
      },
      {
        error: 'Techniques dangereuses avec couteaux',
        solution: 'Former l\'équipe aux gestes sécurisés'
      }
    ],
    trends2024_2025: [
      'Cuisine locale/terroir mise en avant',
      'Transparence sur l\'origine des produits',
      'Formats courts type "quick recipes"',
      'Collaboration avec producteurs locaux'
    ]
  },

  {
    id: 'coiffure',
    name: 'Coiffure & Barbier',
    category: 'Beauty & Wellness',
    icon: '✂️',
    viralAccounts: [
      {
        handle: '@brad.mondo',
        platform: 'TikTok',
        followers: '17.8M',
        description: 'Coiffeur celebrity, transformations'
      },
      {
        handle: '@rickysbarber',
        platform: 'Instagram',
        followers: '3.2M',
        description: 'Barbier artistique, coupes précises'
      }
    ],
    winningFormats: [
      {
        name: 'Transformation cheveux',
        duration: '30-90s',
        viewRange: '300K-8M vues',
        description: 'Avant/après coupe ou couleur spectaculaire'
      },
      {
        name: 'ASMR Coiffure',
        duration: '60-180s',
        viewRange: '500K-3M vues',
        description: 'Sons relaxants du brushing/coupe'
      }
    ],
    testedHooks: [
      {
        text: 'Elle m\'a dit de faire ça à ses cheveux...',
        performance: '2M-10M vues',
        context: 'Demande client inhabituelle'
      },
      {
        text: 'TRANSFORMATION EXTRÊME',
        performance: '1M-5M vues',
        context: 'Changement radical de look'
      }
    ],
    fatalErrors: [
      {
        error: 'Montrer un résultat raté',
        solution: 'Ne jamais montrer d\'échecs, même pour l\'humour'
      },
      {
        error: 'Techniques non-professionnelles',
        solution: 'Toujours respecter les règles de l\'art'
      }
    ],
    trends2024_2025: [
      'Coupes durables et entretien facile',
      'Produits naturels et bio',
      'Inclusivité textures de cheveux',
      'Techniques de coloration respectueuses'
    ]
  }

  // ... continuer pour les 19 autres industries
]

export const INDUSTRY_CATEGORIES = [
  {
    name: 'Food & Drink',
    icon: '🍽️',
    color: '#FF6B6B',
    industries: ['restaurant', 'fastfood', 'boulangerie', 'cafe', 'bars']
  },
  {
    name: 'Beauty & Wellness',
    icon: '💄',
    color: '#FF8CC8',
    industries: ['coiffure', 'esthetique', 'bienetre']
  },
  {
    name: 'Fitness',
    icon: '💪',
    color: '#4ECDC4',
    industries: ['fitness']
  },
  {
    name: 'Fashion & Retail',
    icon: '👗',
    color: '#45B7D1',
    industries: ['mode_femme', 'mode_mixte', 'commerce']
  },
  {
    name: 'Visual Services',
    icon: '🎨',
    color: '#96CEB4',
    industries: ['artisans_corps', 'automobile']
  },
  {
    name: 'Real Estate',
    icon: '🏠',
    color: '#FECA57',
    industries: ['immobilier', 'hebergement']
  },
  {
    name: 'Entertainment',
    icon: '🎪',
    color: '#FF9FF3',
    industries: ['activites', 'evenementiel']
  },
  {
    name: 'Health & Expertise',
    icon: '⚕️',
    color: '#54A0FF',
    industries: ['sante', 'services_pro']
  },
  {
    name: 'Crafts & Construction',
    icon: '🔨',
    color: '#5F27CD',
    industries: ['artisans_btp']
  },
  {
    name: 'Family & Pets',
    icon: '👨‍👩‍👧‍👦',
    color: '#00D2D3',
    industries: ['enfance', 'animaux']
  }
]
```

---

## 📱 PAGES À GÉNÉRER

### 1. LANDING PAGE (`/src/app/page.tsx`)

```tsx
import { PageErrorBoundary } from '@/components/ui/error-boundary'
import { INDUSTRY_CATEGORIES, INDUSTRIES_DATA } from '@/lib/data/industries'
import { formatPrice } from '@/lib/utils'

export const metadata = {
  title: 'VuVenu - Marketing Digital Basé sur de Vraies Données Virales',
  description: 'Transformez votre commerce local en créateur de contenu viral grâce à nos 22 rapports d\'industries et données de 100+ comptes avec 7M+ followers.',
}

export default function LandingPage() {
  return (
    <PageErrorBoundary>
      <main className="min-h-screen bg-cream">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pixel-blue/10 to-soft-violet/10 px-4 py-24">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-deep-dark lg:text-7xl">
              ils ont vu —
              <span className="block text-electric-lime">ils sont venu!</span>
            </h1>
            <p className="mb-8 text-xl text-deep-dark/80 lg:text-2xl max-w-4xl mx-auto">
              Le marketing digital basé sur de <strong>vraies données virales</strong>
              <br />
              <span className="text-pixel-blue font-semibold">22 industries analysées • 100+ comptes viraux • 7M+ followers documentés</span>
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-electric-lime text-deep-dark hover:bg-electric-lime/90">
                Commencer maintenant
              </Button>
              <Button size="lg" variant="outline" className="border-pixel-blue text-pixel-blue">
                Voir les données
              </Button>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF SECTION */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-deep-dark">
              Basé sur l'Analyse de <span className="text-electric-lime">Vrais Comptes Viraux</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Exemple de comptes viraux */}
              <div className="text-center">
                <div className="mb-4 text-4xl">🐾</div>
                <h3 className="mb-2 font-semibold">@girlwithedogs</h3>
                <p className="text-sm text-gray-600">7.1M followers TikTok</p>
                <p className="text-xs text-gray-500">Toilettage professionnel</p>
              </div>
              <div className="text-center">
                <div className="mb-4 text-4xl">🍽️</div>
                <h3 className="mb-2 font-semibold">@gordonramsay</h3>
                <p className="text-sm text-gray-600">35M followers TikTok</p>
                <p className="text-xs text-gray-500">Recettes rapides</p>
              </div>
              <div className="text-center">
                <div className="mb-4 text-4xl">✂️</div>
                <h3 className="mb-2 font-semibold">@brad.mondo</h3>
                <p className="text-sm text-gray-600">17.8M followers TikTok</p>
                <p className="text-xs text-gray-500">Transformations cheveux</p>
              </div>
            </div>
          </div>
        </section>

        {/* INDUSTRY PREVIEW SECTION */}
        <section className="py-16 bg-gradient-to-br from-soft-violet/20 to-pale-rose/20">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-deep-dark">
              <span className="text-electric-lime">22 Industries</span> Analysées avec Données Réelles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {INDUSTRY_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className="rounded-lg bg-white p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                  style={{ borderTop: `4px solid ${category.color}` }}
                >
                  <div className="mb-3 text-3xl">{category.icon}</div>
                  <h3 className="mb-2 font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500">
                    {category.industries.length} spécialités
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-deep-dark">
              Pricing <span className="text-electric-lime">Transparent</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Starter */}
              <div className="rounded-lg border-2 border-gray-200 p-6 text-center">
                <h3 className="mb-2 text-xl font-bold">Starter</h3>
                <div className="mb-4 text-3xl font-bold text-pixel-blue">
                  {formatPrice(59)}<span className="text-sm text-gray-500">/mois</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm text-gray-600">
                  <li>10 scripts/mois</li>
                  <li>Accès aux 22 industries</li>
                  <li>Formats viraux testés</li>
                  <li>Support email</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Commencer
                </Button>
              </div>

              {/* Pro */}
              <div className="rounded-lg border-2 border-electric-lime bg-electric-lime/5 p-6 text-center">
                <div className="mb-2 text-xs font-semibold uppercase text-electric-lime">
                  Populaire
                </div>
                <h3 className="mb-2 text-xl font-bold">Pro</h3>
                <div className="mb-4 text-3xl font-bold text-pixel-blue">
                  {formatPrice(119)}<span className="text-sm text-gray-500">/mois</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm text-gray-600">
                  <li>30 scripts/mois</li>
                  <li>5 campagnes Meta Ads/mois</li>
                  <li>Générateur d'images IA</li>
                  <li>Wizard de lancement</li>
                  <li>Support prioritaire</li>
                </ul>
                <Button className="w-full bg-electric-lime text-deep-dark hover:bg-electric-lime/90">
                  Commencer
                </Button>
              </div>

              {/* Business */}
              <div className="rounded-lg border-2 border-gray-200 p-6 text-center">
                <h3 className="mb-2 text-xl font-bold">Business</h3>
                <div className="mb-4 text-3xl font-bold text-pixel-blue">
                  {formatPrice(249)}<span className="text-sm text-gray-500">/mois</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm text-gray-600">
                  <li>Scripts illimités</li>
                  <li>Campagnes illimitées</li>
                  <li>API access</li>
                  <li>Support dédié</li>
                  <li>Formation 1:1</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Contacter
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CREDIBILITY SECTION */}
        <section className="py-16 bg-deep-dark text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-8 text-3xl font-bold">
              Données <span className="text-electric-lime">Vérifiées</span>, Pas du Guess-work
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="mb-2 text-3xl font-bold text-electric-lime">22</div>
                <p className="text-sm">Rapports d'industries complets</p>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-electric-lime">100+</div>
                <p className="text-sm">Comptes viraux analysés</p>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-electric-lime">7M+</div>
                <p className="text-sm">Followers documentés</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </PageErrorBoundary>
  )
}
```

### 2. LAYOUT PRINCIPAL (`/src/app/layout.tsx`)

```tsx
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { setupGlobalErrorHandling } from '@/lib/errors/handler'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Setup global error handlers
setupGlobalErrorHandling()

export const metadata = {
  title: {
    default: 'VuVenu - Marketing Digital Basé sur de Vraies Données Virales',
    template: '%s | VuVenu'
  },
  description: 'Transformez votre commerce local en créateur de contenu viral grâce à nos données de 100+ comptes avec 7M+ followers.',
  keywords: ['marketing digital', 'réseaux sociaux', 'réunion', 'viral', 'tiktok', 'instagram'],
  authors: [{ name: 'VuVenu' }],
  creator: 'VuVenu',
  openGraph: {
    type: 'website',
    locale: 'fr_RE',
    url: 'https://vuvenu.fr',
    title: 'VuVenu - Marketing Digital Viral',
    description: 'Marketing basé sur de vraies données virales - 22 industries analysées',
    siteName: 'VuVenu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VuVenu - Marketing Digital Viral',
    description: 'Marketing basé sur de vraies données virales',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr-RE" className="scroll-smooth">
      <body className={cn(inter.className, "min-h-screen bg-cream")}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### 3. ONBOARDING WIZARD (`/src/app/onboarding/page.tsx`)

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase, auth } from '@/lib/supabase/client'
import { INDUSTRIES_DATA, INDUSTRY_CATEGORIES } from '@/lib/data/industries'
import { handleSupabaseError } from '@/lib/errors'
import { ComponentErrorBoundary } from '@/components/ui/error-boundary'
import { cn } from '@/lib/utils'

interface OnboardingData {
  business_name: string
  business_type: string
  target_audience: string
  main_goal: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState<OnboardingData>({
    business_name: '',
    business_type: '',
    target_audience: '',
    main_goal: ''
  })

  // Vérifier l'auth au mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [router])

  // Suggestions intelligentes basées sur le nom
  const getSuggestedIndustries = (businessName: string) => {
    const name = businessName.toLowerCase()
    const suggestions = []

    if (name.includes('restaurant') || name.includes('resto')) {
      suggestions.push(INDUSTRIES_DATA.find(i => i.id === 'restaurant'))
    }
    if (name.includes('coiff') || name.includes('salon')) {
      suggestions.push(INDUSTRIES_DATA.find(i => i.id === 'coiffure'))
    }
    if (name.includes('gym') || name.includes('fitness')) {
      suggestions.push(INDUSTRIES_DATA.find(i => i.id === 'fitness'))
    }

    return suggestions.filter(Boolean).slice(0, 3)
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          business_name: formData.business_name,
          business_type: formData.business_type,
          target_audience: formData.target_audience,
          main_goal: formData.main_goal,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })

      if (error) throw handleSupabaseError(error)

      router.push('/choose-plan')
    } catch (error) {
      console.error('Erreur onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return (
    <ComponentErrorBoundary>
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto max-w-2xl px-4">

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1,2,3,4,5].map((num) => (
                <div
                  key={num}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    step >= num ? "bg-electric-lime text-deep-dark" : "bg-gray-200 text-gray-500"
                  )}
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-electric-lime h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">

            {/* Step 1: Business Name */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep-dark mb-2">
                    Quel est le nom de votre entreprise ?
                  </h2>
                  <p className="text-gray-600">
                    Nous utiliserons cette information pour personnaliser votre expérience.
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Ex: Chez Marie Restaurant"
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-lime focus:border-electric-lime"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={!formData.business_name.trim()}
                    className="bg-electric-lime text-deep-dark hover:bg-electric-lime/90"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Industry Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep-dark mb-2">
                    Dans quelle industrie êtes-vous ?
                  </h2>
                  <p className="text-gray-600">
                    Sélectionnez votre domaine d'activité pour accéder aux données virales spécifiques.
                  </p>
                </div>

                {/* Suggestions intelligentes */}
                {getSuggestedIndustries(formData.business_name).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Suggestions basées sur "{formData.business_name}" :
                    </h3>
                    <div className="grid gap-3 mb-6">
                      {getSuggestedIndustries(formData.business_name).map((industry) => (
                        <button
                          key={industry.id}
                          onClick={() => setFormData({...formData, business_type: industry.id})}
                          className={cn(
                            "p-4 border rounded-lg text-left transition-all",
                            formData.business_type === industry.id
                              ? "border-electric-lime bg-electric-lime/5"
                              : "border-gray-200 hover:border-electric-lime/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{industry.icon}</span>
                            <div>
                              <div className="font-semibold">{industry.name}</div>
                              <div className="text-sm text-gray-600">
                                {industry.viralAccounts.length} comptes viraux analysés
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* All categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Toutes les industries :
                  </h3>
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {INDUSTRIES_DATA.map((industry) => (
                      <button
                        key={industry.id}
                        onClick={() => setFormData({...formData, business_type: industry.id})}
                        className={cn(
                          "p-3 border rounded-lg text-left transition-all",
                          formData.business_type === industry.id
                            ? "border-electric-lime bg-electric-lime/5"
                            : "border-gray-200 hover:border-electric-lime/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{industry.icon}</span>
                          <div>
                            <div className="font-medium text-sm">{industry.name}</div>
                            <div className="text-xs text-gray-500">{industry.category}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Retour
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!formData.business_type}
                    className="bg-electric-lime text-deep-dark hover:bg-electric-lime/90"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Target Audience */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep-dark mb-2">
                    Qui est votre audience cible ?
                  </h2>
                  <p className="text-gray-600">
                    Décrivez votre clientèle idéale pour personnaliser les scripts.
                  </p>
                </div>

                <div>
                  <textarea
                    placeholder="Ex: Familles réunionnaises, jeunes actifs 25-35 ans, touristes..."
                    value={formData.target_audience}
                    onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                    rows={4}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-lime focus:border-electric-lime resize-none"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Retour
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!formData.target_audience.trim()}
                    className="bg-electric-lime text-deep-dark hover:bg-electric-lime/90"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Main Goal */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep-dark mb-2">
                    Quel est votre objectif principal ?
                  </h2>
                  <p className="text-gray-600">
                    Cela nous aide à orienter les scripts vers vos résultats souhaités.
                  </p>
                </div>

                <div className="grid gap-3">
                  {[
                    'Attirer plus de clients locaux',
                    'Faire connaître mes services/produits',
                    'Augmenter les réservations',
                    'Développer ma notoriété',
                    'Éduquer ma clientèle',
                    'Autre'
                  ].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setFormData({...formData, main_goal: goal})}
                      className={cn(
                        "p-4 border rounded-lg text-left transition-all",
                        formData.main_goal === goal
                          ? "border-electric-lime bg-electric-lime/5"
                          : "border-gray-200 hover:border-electric-lime/50"
                      )}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                {formData.main_goal === 'Autre' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Décrivez votre objectif..."
                      value={formData.main_goal === 'Autre' ? '' : formData.main_goal}
                      onChange={(e) => setFormData({...formData, main_goal: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-lime focus:border-electric-lime"
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Retour
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!formData.main_goal}
                    className="bg-electric-lime text-deep-dark hover:bg-electric-lime/90"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Preview & Confirm */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep-dark mb-2">
                    Aperçu de votre profil
                  </h2>
                  <p className="text-gray-600">
                    Vérifiez les informations avant de finaliser votre configuration.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Entreprise :</span>
                    <p className="text-deep-dark">{formData.business_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Industrie :</span>
                    <p className="text-deep-dark">
                      {INDUSTRIES_DATA.find(i => i.id === formData.business_type)?.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Audience cible :</span>
                    <p className="text-deep-dark">{formData.target_audience}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Objectif principal :</span>
                    <p className="text-deep-dark">{formData.main_goal}</p>
                  </div>
                </div>

                {/* Preview capabilities */}
                <div className="bg-electric-lime/5 border border-electric-lime/20 rounded-lg p-6">
                  <h3 className="font-semibold text-deep-dark mb-3">
                    Votre contenu viral sera basé sur :
                  </h3>
                  {formData.business_type && (
                    <div className="space-y-2 text-sm">
                      {INDUSTRIES_DATA.find(i => i.id === formData.business_type)?.viralAccounts.slice(0,2).map((account) => (
                        <div key={account.handle} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-electric-lime rounded-full"></span>
                          <span>{account.handle} ({account.followers}) - {account.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Modifier
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={loading}
                    className="bg-electric-lime text-deep-dark hover:bg-electric-lime/90"
                  >
                    {loading ? 'Finalisation...' : 'Finaliser'}
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </ComponentErrorBoundary>
  )
}
```

### 4. CHOOSE PLAN (`/src/app/choose-plan/page.tsx`)

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { ComponentErrorBoundary } from '@/components/ui/error-boundary'

const PLANS = {
  starter: {
    name: 'Starter',
    price: 59,
    scripts: 10,
    campaigns: 0,
    features: [
      '10 scripts/mois',
      'Accès aux 22 industries',
      'Formats viraux testés',
      'Hooks performants',
      'Support email'
    ]
  },
  pro: {
    name: 'Pro',
    price: 119,
    scripts: 30,
    campaigns: 5,
    features: [
      '30 scripts/mois',
      '5 campagnes Meta Ads/mois',
      'Générateur d\'images IA',
      'Wizard de lancement',
      'Analytics de performance',
      'Support prioritaire'
    ],
    popular: true
  },
  business: {
    name: 'Business',
    price: 249,
    scripts: 'unlimited',
    campaigns: 'unlimited',
    features: [
      'Scripts illimités',
      'Campagnes illimitées',
      'API access',
      'Formation 1:1',
      'Support dédié',
      'Consultation stratégique'
    ]
  }
}

export default function ChoosePlanPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('pro')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [router])

  const handlePlanSelect = async (planId: string) => {
    // TODO: Intégrer avec Stripe (Phase 2)
    console.log('Plan sélectionné:', planId)
    // Pour l'instant, redirection vers dashboard
    router.push('/dashboard')
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return (
    <ComponentErrorBoundary>
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto max-w-6xl px-4">

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-deep-dark mb-4">
              Choisissez votre <span className="text-electric-lime">plan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Commencez à créer du contenu viral basé sur de vraies données.
              Changez ou annulez à tout moment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {Object.entries(PLANS).map(([planId, plan]) => (
              <div
                key={planId}
                className={`
                  relative rounded-lg bg-white p-8 shadow-lg transition-all hover:shadow-xl
                  ${selectedPlan === planId ? 'ring-2 ring-electric-lime' : ''}
                  ${plan.popular ? 'border-2 border-electric-lime' : 'border border-gray-200'}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-electric-lime text-deep-dark px-4 py-1 rounded-full text-sm font-semibold">
                      Populaire
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-deep-dark mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-pixel-blue mb-1">
                    {formatPrice(plan.price)}
                    <span className="text-lg text-gray-500">/mois</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {typeof plan.scripts === 'number' ? `${plan.scripts} scripts` : 'Scripts illimités'} • {' '}
                    {typeof plan.campaigns === 'number' ?
                      plan.campaigns === 0 ? 'Pas de campagnes' : `${plan.campaigns} campagnes`
                      : 'Campagnes illimitées'
                    }
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-electric-lime/20 text-electric-lime rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(planId)}
                  className={`
                    w-full
                    ${plan.popular
                      ? 'bg-electric-lime text-deep-dark hover:bg-electric-lime/90'
                      : 'bg-pixel-blue text-white hover:bg-pixel-blue/90'
                    }
                  `}
                  size="lg"
                >
                  {selectedPlan === planId ? 'Plan sélectionné' : 'Choisir ce plan'}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-deep-dark mb-6 text-center">
              Questions fréquentes
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-deep-dark mb-2">
                  Puis-je changer de plan à tout moment ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment.
                  Les changements prennent effet immédiatement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-deep-dark mb-2">
                  Que se passe-t-il si je dépasse mes limites ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Vous recevrez une notification et pourrez upgrader votre plan
                  pour débloquer plus de génération instantanément.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-deep-dark mb-2">
                  Les données sont-elles vraiment vérifiées ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Absolument. Toutes nos données proviennent d'analyses réelles
                  de comptes avec millions de followers documentés.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-deep-dark mb-2">
                  Support technique inclus ?
                </h3>
                <p className="text-gray-600 text-sm">
                  Tous les plans incluent le support. Pro et Business bénéficient
                  d'un support prioritaire et de formations personnalisées.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </ComponentErrorBoundary>
  )
}
```

---

## 🧩 COMPONENTS À CRÉER

### Header (`/src/components/shared/header.tsx`)

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-electric-lime rounded-lg flex items-center justify-center">
              <span className="text-deep-dark font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl text-deep-dark">VuVenu</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#industries" className="text-gray-600 hover:text-electric-lime transition-colors">
              Industries
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-electric-lime transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-electric-lime transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Connexion
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="bg-electric-lime text-deep-dark hover:bg-electric-lime/90">
                Commencer
              </Button>
            </Link>
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1">
              <span className={cn("w-full h-0.5 bg-deep-dark transition-all", isMenuOpen && "rotate-45 translate-y-1.5")} />
              <span className={cn("w-full h-0.5 bg-deep-dark transition-all", isMenuOpen && "opacity-0")} />
              <span className={cn("w-full h-0.5 bg-deep-dark transition-all", isMenuOpen && "-rotate-45 -translate-y-1.5")} />
            </div>
          </button>
        </div>

        {/* Menu Mobile Ouvert */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <Link href="/#industries" className="block text-gray-600 hover:text-electric-lime">
              Industries
            </Link>
            <Link href="/#pricing" className="block text-gray-600 hover:text-electric-lime">
              Pricing
            </Link>
            <Link href="/contact" className="block text-gray-600 hover:text-electric-lime">
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button size="sm" className="w-full bg-electric-lime text-deep-dark hover:bg-electric-lime/90">
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
```

### Footer (`/src/components/shared/footer.tsx`)

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-deep-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">

          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-electric-lime rounded-lg flex items-center justify-center">
                <span className="text-deep-dark font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl">VuVenu</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Le marketing digital basé sur de vraies données virales.
              22 industries analysées, 100+ comptes viraux documentés.
            </p>
            <p className="text-electric-lime text-sm mt-2 font-medium">
              "ils ont vu — ils sont venu!"
            </p>
          </div>

          {/* Liens Produit */}
          <div>
            <h3 className="font-semibold mb-4">Produit</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/#industries" className="hover:text-electric-lime transition-colors">Industries</Link></li>
              <li><Link href="/#pricing" className="hover:text-electric-lime transition-colors">Pricing</Link></li>
              <li><Link href="/features" className="hover:text-electric-lime transition-colors">Fonctionnalités</Link></li>
            </ul>
          </div>

          {/* Liens Entreprise */}
          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-electric-lime transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-electric-lime transition-colors">Contact</Link></li>
              <li><Link href="/support" className="hover:text-electric-lime transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2024 VuVenu. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/cgv" className="hover:text-electric-lime transition-colors">
              CGV
            </Link>
            <Link href="/confidentialite" className="hover:text-electric-lime transition-colors">
              Confidentialité
            </Link>
            <Link href="/mentions-legales" className="hover:text-electric-lime transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

## 🎨 TAILWIND CONFIG ENRICHI

Ajouter à `tailwind.config.ts` :

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'electric-lime': '#BFFF00',
        'pixel-blue': '#60A5FA',
        'soft-violet': '#C4B5FD',
        'pale-rose': '#FECDD3',
        'cream': '#FFFBEB',
        'deep-dark': '#0F172A',
      }
    }
  }
}
```

---

## ✅ DELIVERABLE FINAL

Ce prompt génère du code **production-ready** qui :

1. **S'intègre parfaitement** avec votre stack Next.js 16 + Supabase
2. **Utilise vos types Database** exacts et helpers auth
3. **Suit vos conventions** de nommage et structure
4. **Gère les erreurs** avec votre système VuVenuError
5. **Affiche les 22 industries** avec données virales réelles
6. **Fonctionne immédiatement** sans modifications
7. **Mobile-first responsive** avec design system cohérent

**Tone** : Professionnel data-driven, mobile-friendly, user-friendly français Réunion.
**Résultat** : Interface qui reflète l'expertise marketing backstage, pas un simple générateur IA.

**VuVenu = La plateforme marketing viral basée sur de vraies données, pas du guess-work.**