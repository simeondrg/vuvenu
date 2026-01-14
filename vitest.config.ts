import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],

    // Patterns de tests critiques
    include: [
      'tests/**/*.{test,spec}.{js,ts,tsx}',
      'src/**/*.{test,spec}.{js,ts,tsx}'
    ],

    exclude: [
      'node_modules',
      'dist',
      '.next',
      'tests/e2e/**', // E2E avec Playwright séparément
      'coverage/**'
    ],

    // Timeout pour tests d'API
    testTimeout: 30000,

    // Coverage améliorée pour production
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      exclude: [
        'src/types/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/node_modules/**',
        '.next/**',
        'src/app/**/layout.tsx', // Next.js layouts
        'src/app/**/page.tsx',   // Pages testées en E2E
        'playwright.config.ts',
        'vitest.config.ts'
      ],

      // Seuils de couverture stricts pour code critique
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 90,
          statements: 90
        },
        // Seuils très stricts pour la logique métier critique
        'src/lib/': {
          branches: 95,
          functions: 100,
          lines: 98,
          statements: 98
        }
      }
    },

    // Variables d'environnement pour tests
    env: {
      NODE_ENV: 'test',
      NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      ANTHROPIC_API_KEY: 'test-claude-key',
      GOOGLE_AI_API_KEY: 'test-gemini-key',
      STRIPE_SECRET_KEY: 'sk_test_stripe_key',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_webhook_secret',
      UNSPLASH_ACCESS_KEY: 'test-unsplash-key',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/tests': path.resolve(__dirname, './tests')
    },
  },
})