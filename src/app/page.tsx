'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Video, Target, Zap } from 'lucide-react'
import { PRICING_PLANS, ANNUAL_DISCOUNT_PERCENTAGE, TRIAL_PERIOD_DAYS } from '@/lib/constants/pricing'
import { INDUSTRY_CATEGORIES } from '@/lib/data/niche-mapping'

// ============================================================================
// DONNÉES LANDING PAGE
// ============================================================================

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'Coiffeuse',
    location: 'Saint-Denis, La Réunion',
    quote: "J'ai doublé mes réservations en 2 mois grâce aux scripts VuVenu. Mes Reels font enfin des vues !",
    avatar: '👩‍🦰',
  },
  {
    name: 'Thomas B.',
    role: 'Boulanger',
    location: 'Lyon',
    quote: "Enfin un outil simple ! Je crée mes vidéos TikTok en 5 minutes entre deux fournées.",
    avatar: '👨‍🍳',
  },
  {
    name: 'Sophie M.',
    role: 'Fleuriste',
    location: 'Paris',
    quote: "Le wizard Meta Ads m'a fait économiser 500€ d'agence. ROI dès le premier mois.",
    avatar: '👩‍🌾',
  },
]

const STATS = [
  { value: '500+', label: 'Commerçants actifs' },
  { value: '3 min', label: 'Temps moyen création' },
  { value: '22', label: 'Industries supportées' },
]

const FEATURES = [
  {
    icon: Video,
    title: 'Scripts Vidéo IA',
    description: 'Hooks viraux testés par industrie, formats optimisés TikTok/Reels, tons personnalisables.',
    color: 'bg-vuvenu-lime',
  },
  {
    icon: Target,
    title: 'Campagnes Meta Ads',
    description: 'Concepts publicitaires générés, images IA Gemini, wizard de lancement guidé.',
    color: 'bg-vuvenu-blue',
  },
  {
    icon: Zap,
    title: 'IA de pointe',
    description: 'Claude AI pour les textes, Gemini Imagen pour les visuels. Qualité professionnelle.',
    color: 'bg-vuvenu-violet',
  },
]

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const plans = Object.values(PRICING_PLANS)
  const router = useRouter()

  const handleSelectPlan = (planId: string) => {
    router.push(`/register?plan=${planId}&billing=${billingPeriod}`)
  }

  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-vuvenu-rose/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                <span className="font-bold text-vuvenu-dark">V</span>
              </div>
              <span className="font-display font-bold text-xl text-vuvenu-dark">VuVenu</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/pricing" className="text-vuvenu-dark hover:text-vuvenu-blue transition-colors">
                Tarifs
              </Link>
              <Link href="/about" className="text-vuvenu-dark hover:text-vuvenu-blue transition-colors">
                Notre Mission
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-vuvenu-dark hover:text-vuvenu-blue transition-colors">
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-vuvenu-lime text-vuvenu-dark font-semibold px-6 py-2 rounded-lg hover:scale-105 transition-transform shadow-vuvenu"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Pixels décoratifs style Gemini */}
        <div className="absolute top-10 left-10 md:left-40 w-16 h-16 bg-vuvenu-lime pixel-border animate-bounce hidden md:block" />
        <div className="absolute bottom-20 right-10 md:right-40 w-24 h-24 bg-vuvenu-blue rounded-full border-2 border-vuvenu-dark opacity-50 blur-xl" />

        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Texte Hero */}
              <div className="space-y-8 text-center lg:text-left">
                {/* Badge style pill Gemini */}
                <div className="inline-block bg-vuvenu-violet px-4 py-1 rounded-full border border-vuvenu-dark text-xs font-bold transform -rotate-2">
                  ✨ NOUVEAU: Le Générateur Gen Z pour Pros
                </div>

                {/* Headline style Gemini avec skew */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-vuvenu-dark">
                  Devenez{' '}
                  <span className="bg-vuvenu-lime px-2 inline-block transform -skew-x-6 border-b-4 border-vuvenu-dark">Viral</span>
                  <br />
                  Sans Agence à 2000€.
                </h1>

                {/* Sous-titre style Gemini */}
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Marie, Thomas, Sophie...{' '}
                  <span className="font-bold text-vuvenu-dark">on pense enfin à vous.</span>
                  <br />
                  Transformez votre commerce local en machine à clients avec nos scripts IA basés sur de vraies données.
                </p>

                {/* CTA style Gemini - bouton noir */}
                <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start items-center">
                  <Link
                    href="/register"
                    className="px-8 py-4 bg-vuvenu-dark text-white text-lg font-bold rounded-sm pixel-shadow hover:translate-y-px hover:shadow-none transition-all flex items-center gap-2 group"
                  >
                    Commencer Gratuitement
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gray-300 border-2 border-vuvenu-cream"
                        />
                      ))}
                    </div>
                    <span>Rejoint par +2,000 commerçants</span>
                  </div>
                </div>
              </div>

              {/* Mockup Dashboard avec pixel shadow */}
              <div className="relative">
                <div className="bg-white p-6 pixel-border pixel-shadow">
                  {/* Header mockup */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-vuvenu-dark/10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-vuvenu-rose border border-vuvenu-dark" />
                      <div className="w-4 h-4 bg-vuvenu-lime border border-vuvenu-dark" />
                      <div className="w-4 h-4 bg-vuvenu-blue border border-vuvenu-dark" />
                    </div>
                    <span className="text-xs font-bold text-vuvenu-dark uppercase tracking-wider">VuVenu Dashboard</span>
                  </div>

                  {/* Content mockup */}
                  <div className="space-y-4">
                    <div className="bg-vuvenu-cream p-4 border-2 border-vuvenu-dark/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-vuvenu-lime pixel-border flex items-center justify-center pixel-shadow-sm">
                          <Video className="w-6 h-6 text-vuvenu-dark" />
                        </div>
                        <div>
                          <p className="font-bold text-vuvenu-dark">Nouveau script généré</p>
                          <p className="text-xs text-vuvenu-dark/60 font-medium">Il y a 2 minutes</p>
                        </div>
                      </div>
                      <div className="bg-white p-3 border-2 border-vuvenu-dark/20">
                        <p className="text-sm text-vuvenu-dark/80 italic font-medium">
                          &quot;Vous pensiez que cette coupe était ratée ? Attendez de voir le résultat final...&quot;
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-vuvenu-blue/20 p-4 text-center border-2 border-vuvenu-blue/30">
                        <p className="text-3xl font-black text-vuvenu-dark">12.5K</p>
                        <p className="text-xs text-vuvenu-dark/70 font-bold uppercase">Vues ce mois</p>
                      </div>
                      <div className="bg-vuvenu-lime/30 p-4 text-center border-2 border-vuvenu-lime/50">
                        <p className="text-3xl font-black text-vuvenu-dark">+148</p>
                        <p className="text-xs text-vuvenu-dark/70 font-bold uppercase">Nouveaux abonnés</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative pixel elements */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-vuvenu-lime pixel-border hidden lg:block" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-vuvenu-violet pixel-border hidden lg:block" />
                <div className="absolute top-1/2 -right-6 w-4 h-4 bg-vuvenu-blue pixel-border hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION PROBLÈME */}
      {/* ================================================================== */}
      <section className="py-20 bg-white border-y-2 border-vuvenu-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-vuvenu-blue/20 transform translate-x-4 translate-y-4 rounded-2xl" />
                <div className="relative bg-gradient-to-br from-vuvenu-cream to-white rounded-2xl p-8 border-2 border-vuvenu-dark/10">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">😓</div>
                    <p className="text-lg text-vuvenu-dark/80">
                      22h. Après une journée à gérer la boutique, la compta, le stock...
                      <br />
                      <span className="font-semibold">Il faut encore faire un TikTok.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Texte */}
              <div className="space-y-8 order-1 lg:order-2">
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark">
                  L&apos;Injustice du Marketing Digital
                </h2>

                <p className="text-lg text-vuvenu-dark/80">
                  Pendant que les agences se battent pour des contrats à{' '}
                  <span className="font-semibold">100K€/mois</span> avec les grandes marques...
                </p>

                <div className="space-y-4">
                  {[
                    {
                      color: 'bg-vuvenu-lime',
                      text: 'Fini le syndrome de la page blanche.',
                      sub: 'Nos scripts sont prêts à l\'emploi.',
                    },
                    {
                      color: 'bg-vuvenu-blue',
                      text: 'Fini les tendances ratées.',
                      sub: 'On analyse ce qui marche pour VOTRE métier.',
                    },
                    {
                      color: 'bg-vuvenu-violet',
                      text: 'Fini le budget perdu.',
                      sub: 'Des résultats organiques avant de payer des pubs.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`${item.color} p-2 rounded border border-vuvenu-dark mt-1`}>
                        <Check className="w-4 h-4 text-vuvenu-dark" />
                      </div>
                      <div>
                        <p className="font-semibold text-vuvenu-dark">{item.text}</p>
                        <p className="text-vuvenu-dark/70">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* COMMENT ÇA MARCHE */}
      {/* ================================================================== */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-vuvenu-dark/70">
              3 étapes pour créer du contenu viral
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Choisis ton industrie',
                  description: 'Coiffure, restaurant, boulangerie... On a analysé les comptes viraux de ton secteur.',
                  icon: '🎯',
                },
                {
                  step: '2',
                  title: 'L\'IA génère ton script',
                  description: 'Hooks accrocheurs, structure optimisée, ton adapté. Prêt en 30 secondes.',
                  icon: '✨',
                },
                {
                  step: '3',
                  title: 'Publie et grandis',
                  description: 'Filme, publie, et regarde tes vues exploser. C\'est aussi simple que ça.',
                  icon: '🚀',
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-white rounded-sm p-8 pixel-shadow border-2 border-vuvenu-dark text-center h-full">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-vuvenu-lime rounded-full font-bold text-vuvenu-dark text-sm mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-vuvenu-dark mb-3">
                      {item.title}
                    </h3>
                    <p className="text-vuvenu-dark/70">{item.description}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-vuvenu-dark/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* INDUSTRIES */}
      {/* ================================================================== */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Déjà optimisé pour{' '}
              <span className="bg-vuvenu-lime px-2 py-1 rounded">22 industries</span>
            </h2>
            <p className="text-lg text-vuvenu-dark/70">
              Des scripts adaptés à ton métier, basés sur les tendances qui marchent vraiment
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INDUSTRY_CATEGORIES.slice(0, 7).map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-sm p-6 pixel-shadow border-2 border-vuvenu-dark text-center hover:-translate-y-1 transition-transform cursor-pointer group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-vuvenu-dark text-lg">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {category.groups.length} sous-catégories
                  </p>
                </div>
              ))}
              <div className="col-span-1 flex items-center justify-center p-6 border-2 border-dashed border-vuvenu-dark bg-gray-50 rounded-sm">
                <span className="font-medium text-gray-500">+15 autres...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FONCTIONNALITÉS */}
      {/* ================================================================== */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Tout ce qu&apos;il te faut pour briller
            </h2>
            <p className="text-lg text-vuvenu-dark/70">
              Des outils puissants, une interface simple
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="bg-white rounded-sm p-8 pixel-shadow border-2 border-vuvenu-dark"
                >
                  <div className={`${feature.color} w-12 h-12 rounded border border-vuvenu-dark flex items-center justify-center mb-6`}>
                    <feature.icon className="w-6 h-6 text-vuvenu-dark" />
                  </div>
                  <h3 className="text-xl font-bold text-vuvenu-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-vuvenu-dark/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STATS / SOCIAL PROOF */}
      {/* ================================================================== */}
      <section className="py-20 bg-vuvenu-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {STATS.map((stat, i) => (
                <div key={i} className={`p-6 ${i === 1 ? 'border-x-0 md:border-x border-gray-700' : ''}`}>
                  <p className="text-5xl font-extrabold text-vuvenu-lime mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xl font-medium text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TÉMOIGNAGES */}
      {/* ================================================================== */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Ils ont fait le choix VuVenu
            </h2>
            <p className="text-lg text-vuvenu-dark/70">
              Des commerçants comme toi qui ont transformé leur visibilité
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-white rounded-sm p-8 pixel-shadow border-2 border-vuvenu-dark"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-vuvenu-cream rounded-full border-2 border-vuvenu-dark flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-vuvenu-dark">{testimonial.name}</p>
                      <p className="text-sm text-vuvenu-dark/60">
                        {testimonial.role} · {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-vuvenu-dark/80 italic">&quot;{testimonial.quote}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRICING PREVIEW */}
      {/* ================================================================== */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-4">
              Investis dans ta croissance
            </h2>
            <p className="text-lg text-vuvenu-dark/70 mb-8">
              {TRIAL_PERIOD_DAYS} jours d&apos;essai gratuit sur tous les plans
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`font-medium ${billingPeriod === 'monthly' ? 'text-vuvenu-dark' : 'text-vuvenu-dark/50'}`}>
                Mensuel
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-vuvenu-dark/20 rounded-full transition-colors"
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-vuvenu-lime rounded-full transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-7' : ''
                  }`}
                />
              </button>
              <span className={`font-medium ${billingPeriod === 'yearly' ? 'text-vuvenu-dark' : 'text-vuvenu-dark/50'}`}>
                Annuel
              </span>
              {billingPeriod === 'yearly' && (
                <span className="bg-vuvenu-lime text-vuvenu-dark text-xs font-semibold px-3 py-1 rounded-full">
                  -{ANNUAL_DISCOUNT_PERCENTAGE}%
                </span>
              )}
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const price = billingPeriod === 'monthly' ? plan.monthly.price : plan.yearly.price

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white border-2 border-vuvenu-dark p-8 ${
                      plan.recommended
                        ? 'md:-mt-8 shadow-[8px_8px_0px_0px_rgba(191,255,0,1)] z-10'
                        : 'pixel-shadow'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-vuvenu-dark text-vuvenu-lime px-4 py-1 font-bold text-sm uppercase tracking-wider">
                        Recommandé
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-vuvenu-dark mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-vuvenu-dark/60 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-vuvenu-dark">{price}€</span>
                      <span className="text-base font-normal text-gray-500">/{billingPeriod === 'monthly' ? 'mois' : 'an'}</span>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3 font-bold border-2 border-vuvenu-dark transition-all hover:translate-y-px hover:shadow-none ${
                        plan.recommended
                          ? 'bg-vuvenu-lime text-vuvenu-dark shadow-[4px_4px_0px_0px_#0F172A]'
                          : 'bg-gray-50 hover:bg-gray-100 shadow-[4px_4px_0px_0px_#0F172A]'
                      }`}
                    >
                      Choisir {plan.name}
                    </button>

                    <ul className="mt-8 space-y-3">
                      {plan.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-vuvenu-dark">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/pricing" className="text-vuvenu-blue hover:underline font-medium">
                Voir tous les détails des plans →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA FINAL */}
      {/* ================================================================== */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-vuvenu-dark mb-6">
              Prêt à devenir <span className="bg-vuvenu-lime px-3 py-1 rounded">viral</span> ?
            </h2>
            <p className="text-xl text-vuvenu-dark/80 mb-8">
              Rejoins les 500+ commerçants qui ont choisi VuVenu pour transformer leur visibilité.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-vuvenu-dark text-white font-bold px-10 py-5 rounded-sm pixel-shadow hover:translate-y-px hover:shadow-none transition-all text-lg group"
            >
              Essayer {TRIAL_PERIOD_DAYS} jours gratuit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="mt-6 text-vuvenu-dark/60">
              Sans engagement · Résiliation en 1 clic · Aucune carte requise pour l&apos;essai
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="bg-vuvenu-dark text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-vuvenu-lime rounded-lg flex items-center justify-center">
                  <span className="font-bold text-vuvenu-dark">V</span>
                </div>
                <span className="font-display font-bold text-xl">VuVenu</span>
              </div>
              <p className="text-white/70">
                Le marketing digital enfin simple pour les commerces de proximité.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <div className="space-y-2">
                <Link href="/pricing" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Tarifs
                </Link>
                <Link href="/about" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Notre Mission
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <div className="space-y-2">
                <Link href="/cgv" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  CGV
                </Link>
                <Link href="/confidentialite" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Confidentialité
                </Link>
                <Link href="/mentions-legales" className="block text-white/70 hover:text-vuvenu-lime transition-colors">
                  Mentions légales
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-white/70">
                <p>hello@vuvenu.fr</p>
                <p>La Réunion, France</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2026 VuVenu. Tous droits réservés. Made with ❤️ à La Réunion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
