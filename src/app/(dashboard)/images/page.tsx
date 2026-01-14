import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ImageGeneratorForm } from '@/components/images/image-generator-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, Target, Palette } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Générateur d\'Images IA | VuVenu',
  description: 'Créez des visuels publicitaires professionnels avec l\'IA Gemini de Google'
}

/**
 * Page de génération d'images avec Gemini
 * Permet aux utilisateurs de créer des visuels pour leurs campagnes publicitaires
 */
export default async function ImagesPage() {
  const supabase = await createClient()

  // Vérification de l'authentification
  const { data: { session }, error: authError } = await supabase.auth.getSession()

  if (authError || !session) {
    redirect('/login')
  }

  // Récupération du profil utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      id,
      business_name,
      business_type,
      subscription_tier,
      subscription_status,
      scripts_count_month,
      campaigns_count_month
    `)
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    console.error('Error fetching user profile:', profileError)
    redirect('/onboarding')
  }

  // Vérification de l'abonnement pour la génération d'images
  const hasImageAccess = profile?.subscription_status === 'active' &&
                         profile.subscription_tier !== null &&
                         ['pro', 'business'].includes(profile.subscription_tier)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header avec statistiques */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              Générateur d'Images IA
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Créez des visuels publicitaires professionnels avec Google Gemini
            </p>
          </div>

          {profile?.subscription_tier && (
            <Badge
              variant={profile.subscription_status === 'active' ? 'default' : 'secondary'}
              className="capitalize"
            >
              Plan {profile.subscription_tier}
            </Badge>
          )}
        </div>

        {/* Features highlight */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">IA Avancée</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Google Gemini</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Rapide</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">2-5 secondes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">Ciblé</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Meta Ads ready</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-4 text-center">
              <Palette className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Personnalisé</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">Votre style</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vérification de l'accès */}
      {!hasImageAccess ? (
        <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Sparkles className="w-5 h-5" />
              Génération d'Images Disponible avec Plan Pro+
            </CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              La génération d'images avec IA est incluse dans les plans Pro et Business.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Fonctionnalités incluses:
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• Génération illimitée d'images IA</li>
                  <li>• Multiples formats (carré, portrait, paysage, story)</li>
                  <li>• Styles personnalisés par industrie</li>
                  <li>• Qualité professionnelle (jusqu'à premium)</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2">
                  À partir de 119€/mois
                </Badge>
                <a
                  href="/choose-plan"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-800/30 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                >
                  Découvrir les Plans
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Formulaire de génération */}
      <div className={hasImageAccess ? '' : 'opacity-50 pointer-events-none'}>
        <ImageGeneratorForm
          defaultBusinessName={profile?.business_name || ''}
          defaultIndustry={profile?.business_type || ''}
          onImageGenerated={(images) => {
            console.log('Images générées:', images)
            // TODO: Optionnel - sauvegarder dans l'historique utilisateur
          }}
        />
      </div>

      {/* Conseils et bonnes pratiques */}
      {hasImageAccess && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 Conseils pour de meilleures images</CardTitle>
            <CardDescription>
              Optimisez vos générations d'images avec ces bonnes pratiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">✍️ Descriptions efficaces</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Soyez spécifique sur l'ambiance souhaitée</li>
                  <li>• Mentionnez les éléments clés à inclure</li>
                  <li>• Précisez le style photographique</li>
                  <li>• Évitez les descriptions trop complexes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">🎨 Choix du style</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Moderne:</strong> Pour tech, apps, startups</li>
                  <li>• <strong>Premium:</strong> Pour luxe, haute gamme</li>
                  <li>• <strong>Local:</strong> Pour commerces de proximité</li>
                  <li>• <strong>Dynamique:</strong> Pour sport, fitness</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">📐 Formats recommandés</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Carré:</strong> Posts Instagram classiques</li>
                  <li>• <strong>Portrait:</strong> Feed Instagram moderne</li>
                  <li>• <strong>Paysage:</strong> Facebook, publicités</li>
                  <li>• <strong>Story:</strong> Stories IG/FB, contenu vertical</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">💰 Optimisation des coûts</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Commencez par qualité Standard</li>
                  <li>• Générez 1-2 variations d'abord</li>
                  <li>• Testez différents prompts</li>
                  <li>• Passez en Premium pour vos finales</li>
                </ul>
              </div>
            </div>

            {/* Exemples de prompts */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">🎯 Exemples de prompts par secteur</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium text-orange-600 mb-1">🍽️ Restaurant</div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "Assiette de cuisine créole colorée avec carry poulet, riz et grains,
                    photographiée dans un restaurant chaleureux avec éclairage tamisé"
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium text-purple-600 mb-1">💇‍♀️ Coiffure</div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "Coupe de cheveux moderne sur femme souriante, salon élégant en arrière-plan,
                    éclairage professionnel, résultat avant/après"
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium text-green-600 mb-1">💪 Fitness</div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "Salle de sport moderne avec équipements, personne s'entraînant,
                    ambiance motivante et énergique, éclairage dynamique"
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="font-medium text-blue-600 mb-1">🏪 Commerce</div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "Vitrine de boutique accueillante avec produits mis en valeur,
                    éclairage chaleureux, client satisfait, atmosphère conviviale"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}