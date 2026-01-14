import { Metadata } from 'next'

const siteConfig = {
  name: 'VuVenu',
  title: 'VuVenu - Générateur de contenu viral pour commerces locaux',
  description: 'Créez du contenu viral pour TikTok, Reels et Meta Ads avec l\'IA. VuVenu aide les commerces locaux à booster leur visibilité sur les réseaux sociaux.',
  url: 'https://vuvenu.fr',
  image: '/og-image.jpg', // TODO: Créer cette image
  author: 'VuVenu',
  keywords: [
    'génération contenu',
    'réseaux sociaux',
    'TikTok',
    'Instagram Reels',
    'Meta Ads',
    'IA marketing',
    'commerce local',
    'contenu viral',
    'publicité Facebook',
    'scripts vidéo',
    'marketing digital',
    'La Réunion',
    'France'
  ],
}

export function createMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
} = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const metaDescription = description || siteConfig.description
  const metaImage = image || siteConfig.image
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url
  const metaKeywords = keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords

  return {
    metadataBase: new URL(siteConfig.url),
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    alternates: {
      canonical: metaUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: type,
      locale: 'fr_FR',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@vuvenu_fr', // TODO: Créer le compte Twitter
    },
    verification: {
      // TODO: Ajouter les codes de vérification des webmasters
      google: 'google-verification-code',
      // bing: 'bing-verification-code',
      // yandex: 'yandex-verification-code',
    },
    category: 'technology',
  }
}

// Métadonnées spécifiques par page
export const pageMetadata = {
  home: createMetadata({
    title: 'Accueil',
    description: 'Créez du contenu viral pour TikTok, Reels et Meta Ads avec l\'IA. VuVenu aide les commerces locaux à booster leur visibilité sur les réseaux sociaux.',
    url: '/',
    keywords: ['accueil', 'générateur contenu', 'IA marketing'],
  }),

  pricing: createMetadata({
    title: 'Tarifs',
    description: 'Découvrez nos plans tarifaires : Starter (59€), Pro (119€), Business (249€). Scripts vidéo, campagnes Meta Ads et génération d\'images IA incluses.',
    url: '/pricing',
    keywords: ['tarifs', 'prix', 'abonnement', 'plans'],
  }),

  about: createMetadata({
    title: 'À propos',
    description: 'VuVenu révolutionne le marketing digital pour les commerces locaux avec l\'IA. Découvrez notre mission et notre équipe.',
    url: '/about',
    keywords: ['à propos', 'équipe', 'mission', 'La Réunion'],
  }),

  cgv: createMetadata({
    title: 'Conditions Générales de Vente',
    description: 'Consultez nos conditions générales de vente pour l\'utilisation de la plateforme VuVenu.',
    url: '/cgv',
    keywords: ['CGV', 'conditions', 'vente', 'légal'],
    noIndex: true,
  }),

  privacy: createMetadata({
    title: 'Politique de Confidentialité',
    description: 'Notre politique de protection des données personnelles conforme au RGPD.',
    url: '/confidentialite',
    keywords: ['confidentialité', 'RGPD', 'données personnelles'],
    noIndex: true,
  }),

  legal: createMetadata({
    title: 'Mentions Légales',
    description: 'Mentions légales de VuVenu SAS - Informations légales et réglementaires.',
    url: '/mentions-legales',
    keywords: ['mentions légales', 'information légale'],
    noIndex: true,
  }),

  login: createMetadata({
    title: 'Connexion',
    description: 'Connectez-vous à votre compte VuVenu pour créer du contenu viral avec l\'IA.',
    url: '/login',
    keywords: ['connexion', 'login', 'compte'],
    noIndex: true,
  }),

  register: createMetadata({
    title: 'Inscription',
    description: 'Créez votre compte VuVenu gratuitement et commencez à générer du contenu viral pour votre business.',
    url: '/register',
    keywords: ['inscription', 'créer compte', 'gratuit'],
    noIndex: true,
  }),

  dashboard: createMetadata({
    title: 'Dashboard',
    description: 'Tableau de bord VuVenu - Gérez vos scripts, campagnes et analytics.',
    url: '/dashboard',
    noIndex: true,
  }),

  scripts: createMetadata({
    title: 'Mes Scripts',
    description: 'Gérez tous vos scripts vidéo générés avec l\'IA VuVenu.',
    url: '/scripts',
    noIndex: true,
  }),

  campaigns: createMetadata({
    title: 'Mes Campagnes',
    description: 'Gérez vos campagnes Meta Ads créées avec VuVenu.',
    url: '/campaigns',
    noIndex: true,
  }),

  settings: createMetadata({
    title: 'Paramètres',
    description: 'Paramètres de votre compte VuVenu - Profil, abonnement et facturation.',
    url: '/settings',
    noIndex: true,
  }),
}

// JSON-LD Structured Data
export function createStructuredData() {
  const organizationLD = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    foundingDate: '2026',
    founders: [
      {
        '@type': 'Person',
        name: 'Bourbon Media',
      },
    ],
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressRegion: 'La Réunion',
      },
    },
    sameAs: [
      // TODO: Ajouter les liens réseaux sociaux
      'https://www.linkedin.com/company/vuvenu',
      'https://twitter.com/vuvenu_fr',
    ],
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '59',
      highPrice: '249',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  }

  const softwareLD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '59',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150', // TODO: Remplacer par de vraies données
    },
  }

  return {
    organizationLD,
    softwareLD,
  }
}