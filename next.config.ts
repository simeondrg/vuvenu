import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.anthropic.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Build optimization
  productionBrowserSourceMaps: false,

  // Headers for security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(svg|ico|webp|avif|png|jpg|jpeg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },

  // Environment variables validation
  env: {
    // Ces variables seront vérifiées au build
  },

  // Turbopack optimizations (Next.js 16)
  turbopack: {
    // Configuration propre pour Turbopack
  },

  // External packages pour Server Components
  serverExternalPackages: ['@anthropic-ai/sdk'],

  // Experimental features pour performance
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react',
      '@supabase/supabase-js'
    ],
  },

  // Compression et minification avancée
  compress: true,
  poweredByHeader: false,

  // Optimisations webpack additionnelles
  webpack: (config, { isServer }) => {
    // Optimisations client-side
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Tree shaking agressif
    config.optimization = {
      ...config.optimization,
      providedExports: true,
      usedExports: true,
      sideEffects: false,
    }

    return config
  },
};

export default nextConfig;
