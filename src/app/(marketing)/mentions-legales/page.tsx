import Link from 'next/link'

export const metadata = {
  title: 'Mentions Légales - VuVenu',
  description: 'Mentions légales de VuVenu - Informations légales et réglementaires',
}

export default function MentionsLegalesPage() {
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
            Mentions Légales
          </h1>
          <p className="text-lg text-vuvenu-dark/80">
            Dernière mise à jour : 14 janvier 2026
          </p>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-vuvenu border border-vuvenu-rose/20">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              1. Éditeur du site
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                <strong>Raison sociale :</strong> VuVenu SAS<br />
                <strong>Forme juridique :</strong> Société par Actions Simplifiée<br />
                <strong>Capital social :</strong> [MONTANT] euros<br />
                <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
                <strong>Numéro SIRET :</strong> [SIRET]<br />
                <strong>Numéro RCS :</strong> [RCS VILLE NUMÉRO]<br />
                <strong>Code APE/NAF :</strong> [CODE APE]<br />
                <strong>Numéro de TVA intracommunautaire :</strong> [TVA]
              </p>
              <p>
                <strong>Téléphone :</strong> [NUMÉRO]<br />
                <strong>Email :</strong> contact@vuvenu.fr<br />
                <strong>Site web :</strong> https://vuvenu.fr
              </p>
              <p>
                <strong>Directeur de la publication :</strong> [NOM PRÉNOM]<br />
                <strong>Responsable éditorial :</strong> [NOM PRÉNOM]
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              2. Hébergeur du site
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                <strong>Vercel Inc.</strong><br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                États-Unis<br />
                Site web : https://vercel.com
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              3. Prestataires techniques
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.1 Base de données et authentification</h3>
              <p>
                <strong>Supabase Inc.</strong><br />
                San Francisco, CA, États-Unis<br />
                Site web : https://supabase.com<br />
                <em>Données hébergées en Europe (conformité RGPD)</em>
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.2 Traitement des paiements</h3>
              <p>
                <strong>Stripe Inc.</strong><br />
                354 Oyster Point Blvd<br />
                South San Francisco, CA 94080<br />
                États-Unis<br />
                Site web : https://stripe.com<br />
                <em>Prestataire de services de paiement certifié PCI-DSS</em>
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">3.3 Intelligence artificielle</h3>
              <p>
                <strong>Anthropic PBC</strong><br />
                San Francisco, CA, États-Unis<br />
                Site web : https://anthropic.com<br />
                <em>API Claude pour génération de contenu</em>
              </p>
              <p>
                <strong>Google Cloud Platform</strong><br />
                Mountain View, CA, États-Unis<br />
                Site web : https://cloud.google.com<br />
                <em>API Gemini pour génération d&apos;images</em>
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              4. Propriété intellectuelle
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.1 Marque et logo</h3>
              <p>
                La marque &quot;VuVenu&quot; et le logo associé sont des marques déposées de VuVenu SAS.
                Toute reproduction ou utilisation non autorisée est strictement interdite.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.2 Contenu du site</h3>
              <p>
                L&apos;ensemble du contenu présent sur le site web VuVenu (textes, images, vidéos, code source, design)
                est protégé par les droits d&apos;auteur et appartient à VuVenu SAS, sauf mention contraire.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.3 Contenu généré par les utilisateurs</h3>
              <p>
                Le contenu généré par la plateforme VuVenu (scripts, concepts publicitaires, images)
                devient la propriété exclusive de l&apos;utilisateur client une fois créé.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">4.4 Licences tierces</h3>
              <p>
                Certaines fonctionnalités utilisent des bibliothèques open source sous diverses licences.
                La liste complète est disponible dans notre dépôt de code source.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              5. Responsabilité et garanties
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.1 Limitation de responsabilité</h3>
              <p>
                VuVenu s&apos;efforce de fournir des informations exactes et à jour, mais ne peut garantir
                l&apos;exactitude, la complétude ou l&apos;actualité de toutes les informations présentes sur le site.
              </p>
              <p>
                VuVenu ne saurait être tenu responsable des dommages directs ou indirects résultant
                de l&apos;utilisation du site web ou de l&apos;impossibilité d&apos;y accéder.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.2 Disponibilité du service</h3>
              <p>
                Nous nous efforçons de maintenir le site accessible 24h/24 et 7j/7, mais nous ne pouvons
                garantir une disponibilité continue. Des interruptions peuvent survenir pour maintenance
                ou en cas de force majeure.
              </p>

              <h3 className="text-lg font-semibold text-vuvenu-dark mt-6 mb-3">5.3 Liens externes</h3>
              <p>
                Notre site peut contenir des liens vers d&apos;autres sites web. Nous ne sommes pas responsables
                du contenu de ces sites externes ni de leur politique de confidentialité.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              6. Protection des données personnelles
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu s&apos;engage à protéger la vie privée de ses utilisateurs conformément
                au Règlement Général sur la Protection des Données (RGPD).
              </p>
              <p>
                Pour plus d&apos;informations sur la collecte et le traitement de vos données personnelles,
                consultez notre{' '}
                <Link href="/confidentialite" className="text-vuvenu-blue hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
              <p>
                <strong>Délégué à la Protection des Données :</strong> dpo@vuvenu.fr
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              7. Cookies
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Le site VuVenu utilise des cookies pour améliorer l&apos;expérience utilisateur
                et analyser l&apos;utilisation du site.
              </p>
              <p>
                Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur
                ou notre bandeau de consentement.
              </p>
              <p>
                Les détails sur notre utilisation des cookies sont disponibles dans notre
                Politique de Confidentialité.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              8. Loi applicable et juridiction
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Les présentes mentions légales sont soumises au droit français.
              </p>
              <p>
                En cas de litige relatif à l&apos;utilisation du site web VuVenu, les tribunaux
                français seront seuls compétents.
              </p>
              <p>
                Conformément à l&apos;article L. 616-1 du Code de la consommation, nous adhérons
                au service de médiation de [NOM MÉDIATEUR] accessible à l&apos;adresse [ADRESSE MÉDIATEUR].
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              9. Conditions d&apos;utilisation
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                L&apos;utilisation de ce site web implique l&apos;acceptation pleine et entière des présentes
                mentions légales.
              </p>
              <p>
                Pour utiliser notre service SaaS, vous devez également accepter nos{' '}
                <Link href="/cgv" className="text-vuvenu-blue hover:underline">
                  Conditions Générales de Vente
                </Link>.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              10. Accessibilité
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu s&apos;efforce de rendre son site web accessible à tous, conformément
                aux standards du W3C et aux recommandations d&apos;accessibilité web.
              </p>
              <p>
                Si vous rencontrez des difficultés d&apos;accessibilité, veuillez nous contacter
                à accessibility@vuvenu.fr.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              11. Signalement de contenu illicite
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                Conformément à la réglementation en vigueur, vous pouvez signaler tout contenu illicite
                présent sur notre plateforme en nous contactant à abuse@vuvenu.fr.
              </p>
              <p>
                Votre signalement sera traité dans les plus brefs délais conformément aux obligations légales.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-vuvenu-dark mb-6">
              12. Modification des mentions légales
            </h2>
            <div className="mb-8 text-vuvenu-dark/80 space-y-4">
              <p>
                VuVenu se réserve le droit de modifier les présentes mentions légales à tout moment.
                Les modifications prendront effet dès leur publication sur le site.
              </p>
              <p>
                Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance
                des éventuelles modifications.
              </p>
            </div>

          </div>

          {/* Contact */}
          <div className="border-t border-vuvenu-rose/20 pt-8 mt-12">
            <div className="bg-vuvenu-violet/10 rounded-xl p-6">
              <h3 className="font-semibold text-vuvenu-dark mb-3">
                ⚖️ Questions juridiques ou techniques ?
              </h3>
              <p className="text-vuvenu-dark/80 mb-4">
                Notre équipe juridique et technique est disponible pour répondre à vos questions
                concernant nos mentions légales ou l&apos;utilisation de notre plateforme.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="mailto:legal@vuvenu.fr"
                  className="inline-flex items-center gap-2 bg-vuvenu-violet text-white px-4 py-3 rounded-lg hover:bg-vuvenu-violet/90 transition-colors font-medium text-center text-sm"
                >
                  📧 Juridique
                </Link>
                <Link
                  href="mailto:support@vuvenu.fr"
                  className="inline-flex items-center gap-2 border border-vuvenu-violet text-vuvenu-violet px-4 py-3 rounded-lg hover:bg-vuvenu-violet hover:text-white transition-colors text-center text-sm"
                >
                  🛠️ Support
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 border border-vuvenu-blue text-vuvenu-blue px-4 py-3 rounded-lg hover:bg-vuvenu-blue hover:text-white transition-colors text-center text-sm"
                >
                  🏠 Accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}