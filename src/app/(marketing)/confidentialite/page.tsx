import Link from 'next/link'

export const metadata = {
  title: 'Politique de Confidentialité - VuVenu',
  description: 'Politique de protection des données personnelles de VuVenu - Conformité RGPD',
}

export default function ConfidentialitePage() {
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
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-vuvenu-dark/80">
            Dernière mise à jour : 14 janvier 2026
          </p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              1. Introduction
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu SAS s&apos;engage à protéger la confidentialité et la sécurité des données personnelles
                de ses utilisateurs. Cette politique de confidentialité décrit comment nous collectons,
                utilisons, partageons et protégeons vos informations personnelles.
              </p>
              <p>
                Cette politique s&apos;applique à tous les utilisateurs de la plateforme VuVenu et est conforme
                au Règlement Général sur la Protection des Données (RGPD) et à la loi française en matière
                de protection des données.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              2. Responsable du traitement
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                <strong>VuVenu SAS</strong><br />
                Siège social : [ADRESSE]<br />
                Email : privacy@vuvenu.fr<br />
                Téléphone : [TÉLÉPHONE]
              </p>
              <p>
                Délégué à la Protection des Données : dpo@vuvenu.fr
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              3. Données collectées
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.1 Données d&apos;inscription</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adresse email</li>
                <li>Nom et prénom</li>
                <li>Nom du commerce/entreprise</li>
                <li>Secteur d&apos;activité</li>
                <li>Audience cible</li>
                <li>Objectifs marketing</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.2 Données d&apos;utilisation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Historique des scripts et campagnes générés</li>
                <li>Paramètres et préférences de génération</li>
                <li>Statistiques d&apos;utilisation de la plateforme</li>
                <li>Données de connexion (dates, heures, durée de session)</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.3 Données techniques</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Système d&apos;exploitation</li>
                <li>Pages visitées et temps passé</li>
                <li>Cookies et technologies similaires</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.4 Données de paiement</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informations de facturation (nom, adresse)</li>
                <li>Historique des paiements</li>
                <li>Les données de carte bancaire sont traitées directement par Stripe (notre prestataire de paiement)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              4. Finalités et bases légales du traitement
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.1 Fourniture du service</h3>
              <p><strong>Base légale :</strong> Exécution du contrat</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Création et gestion de votre compte</li>
                <li>Génération de contenu personnalisé</li>
                <li>Support client et assistance technique</li>
                <li>Facturation et gestion des abonnements</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.2 Amélioration du service</h3>
              <p><strong>Base légale :</strong> Intérêt légitime</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Analyse des performances de nos algorithmes IA</li>
                <li>Optimisation de l&apos;interface utilisateur</li>
                <li>Développement de nouvelles fonctionnalités</li>
                <li>Prévention de la fraude et sécurisation de la plateforme</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.3 Communication marketing</h3>
              <p><strong>Base légale :</strong> Consentement ou intérêt légitime</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Newsletter et actualités produit</li>
                <li>Offres commerciales personnalisées</li>
                <li>Invitations à des événements ou webinaires</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.4 Obligations légales</h3>
              <p><strong>Base légale :</strong> Obligation légale</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Conservation des factures et données comptables</li>
                <li>Réponse aux demandes des autorités compétentes</li>
              </ul>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              5. Partage des données
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu ne vend jamais vos données personnelles. Nous partageons vos données uniquement
                dans les cas suivants :
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.1 Prestataires de service</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase</strong> : Hébergement et base de données (UE)</li>
                <li><strong>Vercel</strong> : Hébergement de l&apos;application (UE)</li>
                <li><strong>Stripe</strong> : Traitement des paiements (UE)</li>
                <li><strong>Anthropic</strong> : API d&apos;intelligence artificielle (États-Unis, avec garanties adequates)</li>
                <li><strong>Google Cloud</strong> : Génération d&apos;images IA (UE)</li>
              </ul>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.2 Obligations légales</h3>
              <p>
                Nous pouvons divulguer vos données si la loi l&apos;exige ou en réponse à une demande
                légale d&apos;autorités publiques.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.3 Transferts internationaux</h3>
              <p>
                Certains de nos prestataires sont situés en dehors de l&apos;UE. Dans ce cas, nous nous assurons
                que des garanties appropriées sont en place (clauses contractuelles types, décisions d&apos;adéquation).
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              6. Durée de conservation
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Données de compte actif :</strong> Pendant toute la durée d&apos;utilisation du service</li>
                <li><strong>Données après résiliation :</strong> 30 jours (possibilité de réactivation), puis suppression</li>
                <li><strong>Données de facturation :</strong> 10 ans (obligation légale comptable)</li>
                <li><strong>Logs techniques :</strong> 12 mois maximum</li>
                <li><strong>Données marketing :</strong> Jusqu&apos;au retrait du consentement</li>
              </ul>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              7. Sécurité des données
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu met en œuvre des mesures techniques et organisationnelles appropriées pour protéger
                vos données personnelles :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chiffrement des données en transit (HTTPS/TLS) et au repos</li>
                <li>Authentification multi-facteurs pour les accès administrateur</li>
                <li>Audits de sécurité réguliers</li>
                <li>Sauvegarde automatique des données</li>
                <li>Formation du personnel à la protection des données</li>
                <li>Contrôle d&apos;accès basé sur le principe du moindre privilège</li>
              </ul>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              8. Vos droits
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.1 Droit d&apos;accès</h3>
              <p>Vous pouvez demander une copie des données personnelles que nous détenons sur vous.</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.2 Droit de rectification</h3>
              <p>Vous pouvez corriger les données inexactes ou incomplètes depuis votre espace client.</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.3 Droit à l&apos;effacement</h3>
              <p>Vous pouvez demander la suppression de vos données dans certaines conditions.</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.4 Droit de portabilité</h3>
              <p>Vous pouvez récupérer vos données dans un format structuré et lisible par machine.</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.5 Droit d&apos;opposition</h3>
              <p>Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes.</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.6 Droit de limitation</h3>
              <p>Vous pouvez demander la limitation du traitement dans certaines conditions.</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">8.7 Retrait du consentement</h3>
              <p>Vous pouvez retirer votre consentement à tout moment pour les traitements basés sur celui-ci.</p>

              <div className="bg-vuvenu-lime/10 rounded-lg p-4 mt-6">
                <p className="font-medium text-vuvenu-dark">
                  💡 <strong>Comment exercer vos droits :</strong>
                </p>
                <p className="text-sm text-vuvenu-dark/80 mt-2">
                  Contactez-nous à privacy@vuvenu.fr en précisant votre demande et en joignant
                  une copie de votre pièce d&apos;identité. Nous traiterons votre demande sous 30 jours.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              9. Cookies et technologies similaires
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">9.1 Cookies strictement nécessaires</h3>
              <p>Ces cookies sont indispensables au fonctionnement du service (authentification, sécurité).</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">9.2 Cookies de performance</h3>
              <p>Ces cookies nous aident à comprendre comment vous utilisez notre plateforme (avec votre consentement).</p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">9.3 Gestion des cookies</h3>
              <p>
                Vous pouvez gérer vos préférences cookies depuis les paramètres de votre navigateur
                ou notre bannière de consentement.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              10. Réclamations
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Si vous estimez que le traitement de vos données ne respecte pas la réglementation,
                vous pouvez introduire une réclamation auprès de la CNIL :
              </p>
              <p>
                <strong>Commission Nationale de l&apos;Informatique et des Libertés (CNIL)</strong><br />
                3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07<br />
                Téléphone : 01 53 73 22 22<br />
                Site web : www.cnil.fr
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              11. Mineurs
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu s&apos;adresse exclusivement aux professionnels et entreprises.
                Notre service n&apos;est pas destiné aux mineurs de moins de 16 ans.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              12. Évolution de la politique
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Cette politique de confidentialité peut être mise à jour occasionnellement.
                Nous vous notifierons de tout changement important par email et/ou via notre plateforme.
              </p>
              <p>
                La date de dernière mise à jour est indiquée en haut de cette page.
              </p>
            </div>

          </div>

          {/* Contact */}
          <div className="border-t border-vuvenu-rose/20 pt-8 mt-12">
            <div className="bg-vuvenu-blue/10 rounded-xl p-6">
              <h3 className="font-semibold text-vuvenu-dark mb-3">
                🔒 Questions sur la protection de vos données ?
              </h3>
              <p className="text-vuvenu-dark/80 mb-4">
                Notre équipe de protection des données est à votre disposition pour répondre
                à toutes vos questions et traiter vos demandes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="mailto:privacy@vuvenu.fr"
                  className="inline-flex items-center gap-2 bg-vuvenu-blue text-white px-6 py-3 rounded-lg hover:bg-vuvenu-blue/90 transition-colors font-semibold text-center"
                >
                  📧 privacy@vuvenu.fr
                </Link>
                <Link
                  href="mailto:dpo@vuvenu.fr"
                  className="inline-flex items-center gap-2 border border-vuvenu-blue text-vuvenu-blue px-6 py-3 rounded-lg hover:bg-vuvenu-blue hover:text-white transition-colors text-center"
                >
                  👨‍💼 DPO - dpo@vuvenu.fr
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}