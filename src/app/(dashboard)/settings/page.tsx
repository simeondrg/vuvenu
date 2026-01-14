'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { PRICING_PLANS } from '@/lib/constants/pricing'

export default function SettingsPage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const router = useRouter()

  // Form states
  const [businessName, setBusinessName] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [mainGoal, setMainGoal] = useState('')

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Erreur profil:', error)
          return
        }

        setUserProfile(profile)
        setBusinessName(profile.business_name || '')
        setTargetAudience(profile.target_audience || '')
        setMainGoal(profile.main_goal || '')

      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [router])

  const handleUpdateProfile = async () => {
    if (!userProfile) return

    setUpdating(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: businessName,
          target_audience: targetAudience,
          main_goal: mainGoal,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id)

      if (error) {
        throw error
      }

      setUserProfile((prev: any) => ({
        ...prev,
        business_name: businessName,
        target_audience: targetAudience,
        main_goal: mainGoal
      }))

      alert('Profil mis à jour avec succès !')

    } catch (error) {
      console.error('Erreur mise à jour:', error)
      alert('Erreur lors de la mise à jour. Réessayez.')
    } finally {
      setUpdating(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoadingPortal(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session')
      }

      // Rediriger vers le portail Stripe
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erreur portail Stripe:', error)
      alert('Erreur lors de l\'accès au portail de gestion. Réessayez.')
    } finally {
      setLoadingPortal(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!userProfile) return

    const confirmation = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera tous vos scripts et données.'
    )

    if (!confirmation) return

    const doubleConfirmation = prompt(
      'Tapez "SUPPRIMER" en majuscules pour confirmer la suppression définitive de votre compte :'
    )

    if (doubleConfirmation !== 'SUPPRIMER') {
      alert('Suppression annulée.')
      return
    }

    try {
      setUpdating(true)

      // Supprimer toutes les données utilisateur
      await supabase.from('scripts').delete().eq('user_id', userProfile.id)
      await supabase.from('campaigns').delete().eq('user_id', userProfile.id)
      await supabase.from('profiles').delete().eq('id', userProfile.id)

      // Déconnecter l'utilisateur
      await supabase.auth.signOut()

      alert('Votre compte a été supprimé avec succès.')
      router.push('/')

    } catch (error) {
      console.error('Erreur suppression compte:', error)
      alert('Erreur lors de la suppression. Contactez le support.')
      setUpdating(false)
    }
  }

  const getPlanDetails = () => {
    const tier = userProfile?.subscription_tier || 'starter'
    const billingPeriod = userProfile?.billing_period || 'monthly'
    const plan = PRICING_PLANS[tier as keyof typeof PRICING_PLANS]

    if (!plan) {
      return {
        name: 'Starter',
        price: '59€/mois',
        billingPeriod: 'monthly',
        features: ['10 scripts/mois', 'Générateur IA', 'Support email'],
        color: 'bg-vuvenu-blue'
      }
    }

    const price = billingPeriod === 'yearly'
      ? `${plan.yearly.price}€/an`
      : `${plan.monthly.price}€/mois`

    const priceDetail = billingPeriod === 'yearly'
      ? `(soit ${Math.round(plan.yearly.pricePerMonth)}€/mois)`
      : ''

    const savings = billingPeriod === 'yearly' ? plan.yearly.savings : 0

    return {
      name: plan.name,
      price,
      priceDetail,
      billingPeriod,
      savings,
      features: plan.features,
      color: plan.id === 'pro' ? 'bg-vuvenu-lime' : plan.id === 'business' ? 'bg-vuvenu-violet' : 'bg-vuvenu-blue'
    }
  }

  const getUsageStats = () => {
    const tier = userProfile?.subscription_tier || 'starter'
    const scriptsUsed = userProfile?.scripts_count_month || 0
    const campaignsUsed = userProfile?.campaigns_count_month || 0

    let scriptsLimit, campaignsLimit

    switch (tier) {
      case 'business':
        scriptsLimit = '∞'
        campaignsLimit = '∞'
        break
      case 'pro':
        scriptsLimit = 30
        campaignsLimit = 5
        break
      default:
        scriptsLimit = 10
        campaignsLimit = 0
    }

    return {
      scripts: { used: scriptsUsed, limit: scriptsLimit },
      campaigns: { used: campaignsUsed, limit: campaignsLimit }
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-vuvenu-rose/20 rounded-lg w-1/3"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-6 bg-vuvenu-rose/20 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-vuvenu-rose/20 rounded w-full"></div>
                  <div className="h-4 bg-vuvenu-rose/20 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vuvenu-dark mb-4">Erreur</h1>
          <p>Impossible de charger votre profil.</p>
        </div>
      </div>
    )
  }

  const planDetails = getPlanDetails()
  const usage = getUsageStats()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-vuvenu-dark mb-2">
          Paramètres
        </h1>
        <p className="text-lg text-vuvenu-dark/80">
          Gérez votre profil, votre abonnement et vos préférences.
        </p>
      </div>

      {/* Plan actuel */}
      <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
        <h2 className="text-xl font-semibold text-vuvenu-dark mb-6">
          Abonnement actuel
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Détails du plan */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 ${planDetails.color} rounded-lg flex items-center justify-center`}>
                <span className="text-xl text-white">⭐</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-vuvenu-dark">
                    Plan {planDetails.name}
                  </h3>
                  {planDetails.billingPeriod === 'yearly' && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Annuel
                    </span>
                  )}
                  {planDetails.billingPeriod === 'monthly' && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Mensuel
                    </span>
                  )}
                </div>
                <p className="text-vuvenu-dark/60">
                  {planDetails.price}
                  {planDetails.priceDetail && (
                    <span className="text-sm ml-1">{planDetails.priceDetail}</span>
                  )}
                </p>
                {planDetails.savings && planDetails.savings > 0 && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Vous économisez {planDetails.savings}€/an
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {planDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-vuvenu-dark/80">
                  <span className="text-green-600">✓</span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/pricing')}
                className="bg-vuvenu-lime text-vuvenu-dark hover:scale-105 transition-transform"
              >
                Changer de plan
              </Button>
              {userProfile.subscription_status === 'active' && (
                <Button
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {loadingPortal ? 'Chargement...' : 'Gérer l\'abonnement'}
                </Button>
              )}
            </div>
          </div>

          {/* Utilisation */}
          <div>
            <h4 className="font-semibold text-vuvenu-dark mb-4">
              Utilisation ce mois
            </h4>

            <div className="space-y-4">
              {/* Scripts */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-vuvenu-dark/70">Scripts générés</span>
                  <span className="font-medium text-vuvenu-dark">
                    {usage.scripts.used} / {usage.scripts.limit}
                  </span>
                </div>
                <div className="w-full bg-vuvenu-rose/30 rounded-full h-2">
                  <div
                    className="bg-vuvenu-lime h-2 rounded-full transition-all"
                    style={{
                      width: usage.scripts.limit === '∞'
                        ? '20%'
                        : `${Math.min((usage.scripts.used / Number(usage.scripts.limit)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Campagnes */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-vuvenu-dark/70">Campagnes créées</span>
                  <span className="font-medium text-vuvenu-dark">
                    {usage.campaigns.used} / {usage.campaigns.limit}
                  </span>
                </div>
                <div className="w-full bg-vuvenu-rose/30 rounded-full h-2">
                  <div
                    className="bg-vuvenu-blue h-2 rounded-full transition-all"
                    style={{
                      width: usage.campaigns.limit === '∞'
                        ? '10%'
                        : usage.campaigns.limit === 0
                        ? '0%'
                        : `${Math.min((usage.campaigns.used / Number(usage.campaigns.limit)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {userProfile.counts_reset_at && (
              <div className="mt-4 text-xs text-vuvenu-dark/60">
                Reset le {new Date(userProfile.counts_reset_at).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profil business */}
      <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
        <h2 className="text-xl font-semibold text-vuvenu-dark mb-6">
          Informations business
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-vuvenu-dark mb-2">
              Nom de votre commerce
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors"
              placeholder="Ex: Coiffure Chez Marie"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-vuvenu-dark mb-2">
              Audience cible
            </label>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors resize-none"
              placeholder="Ex: Femmes de 25-45 ans, familles avec enfants..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-vuvenu-dark mb-2">
              Objectifs principaux
            </label>
            <textarea
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-vuvenu-rose/40 rounded-lg focus:ring-2 focus:ring-vuvenu-lime focus:border-transparent outline-none transition-colors resize-none"
              placeholder="Ex: Attirer de nouveaux clients, fidéliser ma clientèle..."
            />
          </div>

          <Button
            onClick={handleUpdateProfile}
            disabled={updating}
            className="bg-vuvenu-blue text-white hover:bg-vuvenu-blue/90"
          >
            {updating ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </Button>
        </div>
      </div>

      {/* Compte et sécurité */}
      <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-vuvenu-rose/20">
        <h2 className="text-xl font-semibold text-vuvenu-dark mb-6">
          Compte et sécurité
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-vuvenu-dark mb-2">Email</h3>
            <p className="text-vuvenu-dark/70 mb-4">
              {userProfile?.email || 'Email non défini'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
            >
              Changer l&apos;email
            </Button>
          </div>

          <div className="border-t border-vuvenu-rose/20 pt-6">
            <h3 className="font-medium text-vuvenu-dark mb-2">Mot de passe</h3>
            <p className="text-vuvenu-dark/70 mb-4">
              Modifiez votre mot de passe pour sécuriser votre compte.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-vuvenu-blue text-vuvenu-blue hover:bg-vuvenu-blue hover:text-white"
            >
              Changer le mot de passe
            </Button>
          </div>
        </div>
      </div>

      {/* Zone de danger */}
      <div className="bg-white rounded-2xl p-8 shadow-vuvenu border border-red-200">
        <h2 className="text-xl font-semibold text-red-800 mb-6">
          Zone de danger
        </h2>

        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="font-medium text-red-800 mb-2">
            Supprimer définitivement mon compte
          </h3>
          <p className="text-red-600 text-sm mb-6">
            Cette action est irréversible. Tous vos scripts, campagnes et données seront
            définitivement supprimés. Votre abonnement sera également annulé.
          </p>

          <Button
            onClick={handleDeleteAccount}
            disabled={updating}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {updating ? 'Suppression...' : 'Supprimer mon compte'}
          </Button>
        </div>
      </div>
    </div>
  )
}