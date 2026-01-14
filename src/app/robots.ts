import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vuvenu.fr'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/about',
          '/cgv',
          '/confidentialite',
          '/mentions-legales',
          '/login',
          '/register',
        ],
        disallow: [
          '/dashboard/',
          '/scripts/',
          '/campaigns/',
          '/settings/',
          '/onboarding/',
          '/choose-plan/',
          '/api/',
          '/_next/',
          '/admin/',
          '/*.json',
          '/*.xml',
        ],
      },
      // Règles spécifiques pour les bots de réseaux sociaux
      {
        userAgent: [
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
          'WhatsApp',
          'TelegramBot',
        ],
        allow: [
          '/',
          '/pricing',
          '/about',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}