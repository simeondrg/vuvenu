import Link from 'next/link'

export const metadata = {
  title: 'Conditions Générales de Vente - VuVenu',
  description: 'Conditions Générales de Vente de VuVenu - Plateforme SaaS pour commerces locaux',
}

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-vuvenu-cream">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-vuvenu-blue hover:text-vuvenu-dark transition-colors mb-8"
          >
            ← Retour à l&apos;accueil
          </Link>

          <h1 className="text-4xl lg:text-5xl font-display font-bold text-vuvenu-dark mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-lg text-vuvenu-dark/80">
            Dernière mise à jour : 14 janvier 2026
          </p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              1. Objet et champ d&apos;application
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent l&apos;utilisation de la plateforme VuVenu,
                service SaaS de génération de contenu marketing pour commerces locaux, exploité par VuVenu SAS.
              </p>
              <p>
                VuVenu propose une plateforme permettant de créer automatiquement du contenu viral pour les réseaux sociaux
                (scripts vidéos, campagnes publicitaires Meta Ads) grâce à l&apos;intelligence artificielle.
              </p>
              <p>
                Toute utilisation de la plateforme implique l&apos;acceptation pleine et entière des présentes CGV.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              2. Entreprise éditrice
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                <strong>VuVenu SAS</strong><br />
                Société par Actions Simplifiée au capital de [MONTANT]<br />
                Siège social : [ADRESSE]<br />
                RCS [VILLE] [NUMÉRO]<br />
                Numéro de TVA intracommunautaire : [TVA]<br />
                Email : contact@vuvenu.fr<br />
                Téléphone : [TÉLÉPHONE]
              </p>
              <p>
                Directeur de la publication : [NOM]
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              3. Services proposés
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.1 Description des services</h3>
              <p>VuVenu propose trois plans d&apos;abonnement :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Plan Starter (59€/mois)</strong> : Génération de 10 scripts vidéos par mois</li>
                <li><strong>Plan Pro (119€/mois)</strong> : 30 scripts vidéos + 5 campagnes Meta Ads par mois</li>
                <li><strong>Plan Business (249€/mois)</strong> : Scripts et campagnes illimités</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.2 Fonctionnalités incluses</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Génération automatique de scripts vidéos optimisés pour les réseaux sociaux</li>
                <li>Création de campagnes publicitaires Meta Ads avec concepts et visuels IA</li>
                <li>22 secteurs d&apos;activité pré-configurés</li>
                <li>Interface de gestion et d&apos;historique</li>
                <li>Support client par email</li>
              </ul>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              4. Inscription et création de compte
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                L&apos;inscription sur VuVenu est réservée aux professionnels et entreprises.
                L&apos;utilisateur garantit l&apos;exactitude des informations fournies lors de l&apos;inscription.
              </p>
              <p>
                Un seul compte par entreprise est autorisé. L&apos;utilisateur est responsable de la confidentialité
                de ses identifiants de connexion.
              </p>
              <p>
                VuVenu se réserve le droit de refuser ou de suspendre tout compte en cas de non-respect
                des présentes conditions.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              5. Tarifs et modalités de paiement
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.1 Tarifs</h3>
              <p>
                Les tarifs sont exprimés en euros toutes taxes comprises. VuVenu se réserve le droit
                de modifier ses tarifs à tout moment, avec un préavis d&apos;un mois pour les abonnements en cours.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.2 Facturation</h3>
              <p>
                Les abonnements sont facturés mensuellement à terme échu. Le paiement s&apos;effectue
                automatiquement par prélèvement sur la carte bancaire enregistrée.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.3 Défaut de paiement</h3>
              <p>
                En cas de défaut de paiement, l&apos;accès au service sera suspendu après 48 heures.
                Si le paiement n&apos;est pas régularisé sous 7 jours, le compte pourra être supprimé définitivement.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              6. Propriété intellectuelle et utilisation du contenu
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">6.1 Contenu généré</h3>
              <p>
                Le contenu généré par VuVenu (scripts, concepts publicitaires, images) devient la propriété
                exclusive du client une fois créé. Le client peut l&apos;utiliser librement à des fins commerciales.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">6.2 Plateforme VuVenu</h3>
              <p>
                La plateforme VuVenu, ses algorithmes, son interface et ses fonctionnalités restent
                la propriété exclusive de VuVenu SAS. Toute reproduction ou utilisation non autorisée est interdite.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">6.3 Responsabilité du contenu</h3>
              <p>
                L&apos;utilisateur est seul responsable de l&apos;utilisation qu&apos;il fait du contenu généré.
                Il s&apos;engage à vérifier que le contenu respecte les réglementations en vigueur avant publication.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              7. Disponibilité du service
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu s&apos;engage à fournir un service accessible 24h/24 et 7j/7, avec un taux de disponibilité
                de 99,5% sur une base mensuelle, hors maintenances programmées.
              </p>
              <p>
                Les maintenances programmées seront annoncées 48 heures à l&apos;avance.
                VuVenu ne saurait être tenu responsable des interruptions dues à des causes externes
                (panne internet, attaques DDoS, etc.).
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              8. Résiliation
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.1 Résiliation par le client</h3>
              <p>
                Le client peut résilier son abonnement à tout moment depuis son espace client.
                La résiliation prend effet à la fin de la période de facturation en cours.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.2 Résiliation par VuVenu</h3>
              <p>
                VuVenu peut résilier un abonnement en cas de non-respect des CGV, après mise en demeure
                restée sans effet pendant 7 jours.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.3 Conséquences</h3>
              <p>
                À la résiliation, l&apos;accès au service est immédiatement suspendu.
                Les données peuvent être conservées 30 jours pour permettre une éventuelle réactivation.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              9. Protection des données personnelles
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu s&apos;engage à respecter la réglementation en vigueur concernant la protection
                des données personnelles (RGPD).
              </p>
              <p>
                Pour plus d&apos;informations, consultez notre{' '}
                <Link href="/confidentialite" className="text-vuvenu-blue hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              10. Limitation de responsabilité
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu fournit un service de génération de contenu basé sur l&apos;intelligence artificielle.
                La qualité et la pertinence du contenu généré ne peuvent être garanties à 100%.
              </p>
              <p>
                La responsabilité de VuVenu est limitée au montant des sommes versées par le client
                au titre du mois où le préjudice a eu lieu.
              </p>
              <p>
                VuVenu ne saurait être tenu responsable des dommages indirects, pertes de chiffre d&apos;affaires
                ou préjudices immatériels.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              11. Droit applicable et litiges
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige,
                les parties s&apos;engagent à rechercher une solution amiable.
              </p>
              <p>
                À défaut d&apos;accord amiable, les tribunaux de [VILLE] seront seuls compétents,
                quel que soit le lieu d&apos;exécution de l&apos;obligation ou le domicile du défendeur.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              12. Évolution des conditions
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu se réserve le droit de modifier les présentes CGV à tout moment.
                Les modifications seront notifiées aux clients 30 jours avant leur entrée en vigueur.
              </p>
              <p>
                La poursuite de l&apos;utilisation du service après notification vaut acceptation
                des nouvelles conditions.
              </p>
            </div>

          </div>

          {/* Contact */}
          <div className="border-t border-vuvenu-rose/20 pt-8 mt-12">
            <div className="bg-vuvenu-lime/10 rounded-xl p-6">
              <h3 className="font-semibold text-vuvenu-dark mb-3">
                💬 Questions sur nos CGV ?
              </h3>
              <p className="text-vuvenu-dark/80 mb-4">
                Notre équipe est là pour vous aider à comprendre nos conditions de service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="mailto:legal@vuvenu.fr"
                  className="inline-flex items-center gap-2 bg-vuvenu-lime text-vuvenu-dark px-6 py-3 rounded-lg hover:scale-105 transition-transform font-semibold text-center"
                >
                  📧 legal@vuvenu.fr
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 border border-vuvenu-blue text-vuvenu-blue px-6 py-3 rounded-lg hover:bg-vuvenu-blue hover:text-white transition-colors text-center"
                >
                  ← Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}