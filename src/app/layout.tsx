import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/seo/structured-data'

// Optimisation des polices avec Inter (plus performant que Geist pour le web)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Optimisation de chargement
  preload: true,
})

// Métadonnées SEO optimisées
export const metadata: Metadata = createMetadata()

// Configuration du viewport pour mobile
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#BFFF00' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Preconnect aux domaines externes pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon optimisé */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Données structurées pour le SEO */}
        <StructuredData />

        {/* DNS prefetch pour les APIs externes */}
        <link rel="dns-prefetch" href="//api.anthropic.com" />
        <link rel="dns-prefetch" href="//api.stripe.com" />
        <link rel="dns-prefetch" href="//js.stripe.com" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-vuvenu-cream text-vuvenu-dark`}
        suppressHydrationWarning={true}
      >
        {/* Détection du navigateur pour les optimisations */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimisation critique pour éviter le flash de contenu
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />

        {children}

        {/* Scripts de performance en fin de page */}
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
              // Amélioration des performances avec le preloading des pages critiques
              if ('requestIdleCallback' in window) {
                requestIdleCallback(function() {
                  const links = ['/dashboard', '/scripts/new', '/campaigns/new'];
                  links.forEach(link => {
                    const linkEl = document.createElement('link');
                    linkEl.rel = 'prefetch';
                    linkEl.href = link;
                    document.head.appendChild(linkEl);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
