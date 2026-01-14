# QUICK-FIX CHECKLIST

**Préparation avant Ralph Loop - Actions rapides**

**Temps total estimé** : 7-8 heures
**Priorité** : 🔴 À compléter avant développement

---

## 1. ESLint + Prettier (30 min)

### 1.1 Installer les dépendances

```bash
npm install --save-dev \
  prettier \
  eslint-config-prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y
```

### 1.2 Créer `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "next/typescript", "prettier"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "alphabeticalOrder": true,
        "newlinesBetween": "always"
      }
    ]
  },
  "overrides": [
    {
      "files": ["*.test.ts", "*.test.tsx"],
      "env": {
        "jest": true
      }
    }
  ]
}
```

### 1.3 Créer `.prettierrc.json`

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### 1.4 Créer `.prettierignore`

```
node_modules
.next
.vercel
dist
build
*.pem
.env
.env.local
coverage
```

### 1.5 Ajouter scripts package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit"
  }
}
```

### 1.6 Tester

```bash
npm run format:check
npm run lint
npm run typecheck
```

---

## 2. next.config.ts (1 heure)

### Remplacer le contenu actuel

**Fichier** : `/Users/simeon/projects/vuvenu/next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.anthropic.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Build optimization
  productionBrowserSourceMaps: false,
  swcMinify: true,

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },

  // Environment variables validation
  env: {
    // Ces variables seront vérifiées au build
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Optimisations serveur
    }
    return config
  },

  // Experimental features (optionnel)
  experimental: {
    // À activer selon les besoins
  },
}

export default nextConfig
```

---

## 3. Supabase Migrations (2 heures)

### 3.1 Créer le dossier

```bash
mkdir -p supabase/migrations
```

### 3.2 Créer `supabase/migrations/001_initial_schema.sql`

```sql
-- ============================================
-- INITIAL SCHEMA - VuVenu MVP
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  business_name TEXT NOT NULL DEFAULT '',
  business_type TEXT NOT NULL DEFAULT '',
  target_audience TEXT,
  main_goal TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'active', 'past_due', 'canceled')),
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'pro', 'business')),
  scripts_count_month INTEGER DEFAULT 0,
  campaigns_count_month INTEGER DEFAULT 0,
  counts_reset_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX idx_profiles_subscription ON public.profiles(subscription_status);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- SCRIPTS TABLE
-- ============================================
CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL,
  tone TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_script_per_user_title UNIQUE(user_id, title)
);

-- Indexes
CREATE INDEX idx_scripts_user_id ON public.scripts(user_id);
CREATE INDEX idx_scripts_created_at ON public.scripts(created_at DESC);

-- RLS
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scripts"
  ON public.scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scripts"
  ON public.scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts"
  ON public.scripts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
  ON public.scripts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  wizard_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_campaign_per_user_title UNIQUE(user_id, title)
);

-- Indexes
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_created_at ON public.campaigns(created_at DESC);

-- RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON public.campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CAMPAIGN_CONCEPTS TABLE
-- ============================================
CREATE TABLE public.campaign_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  funnel_stage TEXT NOT NULL,
  name TEXT NOT NULL,
  angle TEXT,
  ad_type TEXT,
  primary_text TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campaign_concepts_campaign_id ON public.campaign_concepts(campaign_id);

-- RLS
ALTER TABLE public.campaign_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view concepts in their campaigns"
  ON public.campaign_concepts FOR SELECT
  USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert concepts in their campaigns"
  ON public.campaign_concepts FOR INSERT
  WITH CHECK (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update concepts in their campaigns"
  ON public.campaign_concepts FOR UPDATE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete concepts in their campaigns"
  ON public.campaign_concepts FOR DELETE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    business_name,
    business_type
  ) VALUES (
    new.id,
    new.email,
    '',
    ''
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER scripts_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER campaign_concepts_updated_at
  BEFORE UPDATE ON public.campaign_concepts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================
-- À ajouter après tests

COMMIT;
```

### 3.3 Vérifier RLS

```bash
# Se connecter à Supabase CLI
supabase link --project-ref <project-id>

# Appliquer migrations
supabase db push
```

---

## 4. Constants (30 min)

### Créer `src/lib/constants.ts`

```typescript
/**
 * Application-wide constants
 * Centralize configuration and business rules
 */

// Subscription Limits
export const SUBSCRIPTION_LIMITS = {
  STARTER: {
    SCRIPTS_PER_MONTH: 10,
    CAMPAIGNS_PER_MONTH: 0,
    MAX_SCRIPTS_LENGTH: 5000,
    MAX_CAMPAIGN_CONCEPTS: 3,
  },
  PRO: {
    SCRIPTS_PER_MONTH: 30,
    CAMPAIGNS_PER_MONTH: 5,
    MAX_SCRIPTS_LENGTH: 8000,
    MAX_CAMPAIGN_CONCEPTS: 5,
  },
  BUSINESS: {
    SCRIPTS_PER_MONTH: Infinity,
    CAMPAIGNS_PER_MONTH: Infinity,
    MAX_SCRIPTS_LENGTH: 10000,
    MAX_CAMPAIGN_CONCEPTS: 10,
  },
} as const

// Pricing (EUR)
export const PRICING = {
  STARTER: { monthly: 59, yearly: 590 },
  PRO: { monthly: 119, yearly: 1190 },
  BUSINESS: { monthly: 249, yearly: 2490 },
} as const

// Script Formats
export const SCRIPT_FORMATS = [
  'reels-15s',
  'reels-30s',
  'reels-60s',
  'tiktok-15s',
  'tiktok-30s',
  'tiktok-60s',
  'youtube-shorts',
] as const

// Tones
export const SCRIPT_TONES = [
  'humorous',
  'professional',
  'casual',
  'educational',
  'inspirational',
  'urgent',
  'storytelling',
] as const

// Campaign Funnel Stages
export const CAMPAIGN_FUNNEL_STAGES = [
  'awareness',
  'consideration',
  'conversion',
  'retention',
] as const

// Routes
export const ROUTES = {
  PUBLIC: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SCRIPTS: '/scripts',
  CAMPAIGNS: '/campaigns',
  SETTINGS: '/settings',
} as const

// API Endpoints
export const API_ROUTES = {
  SCRIPT_GENERATE: '/api/generate/script',
  CAMPAIGN_GENERATE: '/api/generate/campaign',
  IMAGES_GENERATE: '/api/generate/images',
  STRIPE_CHECKOUT: '/api/stripe/checkout',
  STRIPE_PORTAL: '/api/stripe/portal',
  WEBHOOKS_STRIPE: '/api/webhooks/stripe',
} as const

// AI Models
export const AI_MODELS = {
  TEXT_GENERATION: 'claude-3-5-sonnet-20241022',
  IMAGE_GENERATION: 'gemini-2.0-flash',
} as const

// Timeouts (ms)
export const TIMEOUTS = {
  API_CALL: 30000, // 30s
  AI_GENERATION: 45000, // 45s
  UPLOAD: 60000, // 1 min
} as const

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Les données fournie sont invalides',
  UNAUTHORIZED: 'Vous devez être connecté',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource non trouvée',
  INTERNAL_ERROR: "Une erreur serveur s'est produite",
  SUBSCRIPTION_LIMIT: "Vous avez dépassé votre limite d'utilisation",
  INSUFFICIENT_CREDITS: "Vous n'avez pas assez de crédits",
  AI_ERROR: 'La génération IA a échoué, réessayez',
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_LIMITS
export type ScriptFormat = (typeof SCRIPT_FORMATS)[number]
export type ScriptTone = (typeof SCRIPT_TONES)[number]
```

---

## 5. Error Handling (1 heure)

### Créer `src/lib/errors.ts`

```typescript
/**
 * Centralized error handling for VuVenu
 */

export class VuVenuError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'VuVenuError'
  }
}

export class ValidationError extends VuVenuError {
  constructor(
    message: string,
    public field?: string,
    details?: Record<string, any>
  ) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends VuVenuError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class ForbiddenError extends VuVenuError {
  constructor(message = 'Access forbidden') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends VuVenuError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class SubscriptionError extends VuVenuError {
  constructor(message: string) {
    super(message, 'SUBSCRIPTION_ERROR', 402)
    this.name = 'SubscriptionError'
  }
}

export class RateLimitError extends VuVenuError {
  constructor(retryAfter?: number) {
    super('Too many requests, please try again later', 'RATE_LIMIT', 429, {
      retryAfter,
    })
    this.name = 'RateLimitError'
  }
}

export class AIError extends VuVenuError {
  constructor(
    message: string,
    public provider: 'anthropic' | 'gemini',
    public originalError?: Error
  ) {
    super(message, 'AI_ERROR', 503)
    this.name = 'AIError'
  }
}

export class StripeError extends VuVenuError {
  constructor(
    message: string,
    public stripeCode?: string
  ) {
    super(message, 'STRIPE_ERROR', 402)
    this.name = 'StripeError'
  }
}

// Error handler utility
export interface ErrorResponse {
  message: string
  code: string
  statusCode: number
  details?: Record<string, any>
}

export function handleError(error: unknown): ErrorResponse {
  console.error('Error occurred:', error)

  if (error instanceof VuVenuError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
  }
}

export function createErrorResponse(error: unknown) {
  const errorData = handleError(error)
  return Response.json(
    {
      error: errorData.message,
      code: errorData.code,
      ...(process.env.NODE_ENV === 'development' && { details: errorData.details }),
    },
    { status: errorData.statusCode }
  )
}
```

---

## 6. Middleware.ts (1 heure)

### Créer `src/middleware.ts`

```typescript
/**
 * Auth middleware for protected routes
 */

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Protected routes patterns
const PROTECTED_ROUTES = ['/dashboard', '/scripts', '/campaigns', '/settings']
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Update session
  let response = await updateSession(request)

  // Check if user is authenticated
  const user = response?.cookies.get('auth-token')?.value

  // Redirect unauthenticated users to login
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname === route)) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

---

## 7. Package.json Updates

### Ajouter scripts de test

```bash
# Dans package.json, remplacer scripts section:
```

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## 8. Vercel Configuration (30 min)

### Créer `vercel.json`

```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_key",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe_publishable",
    "STRIPE_SECRET_KEY": "@stripe_secret",
    "STRIPE_WEBHOOK_SECRET": "@stripe_webhook",
    "ANTHROPIC_API_KEY": "@anthropic_api_key",
    "GOOGLE_AI_API_KEY": "@google_ai_key",
    "NEXT_PUBLIC_APP_URL": "@app_url"
  },
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "20.x"
}
```

---

## VALIDATION CHECKLIST

- [ ] ESLint config créé et sans erreurs
- [ ] Prettier config créé et formatte le code
- [ ] `npm run typecheck` ✅
- [ ] `npm run lint` ✅
- [ ] `npm run format` appliqué
- [ ] next.config.ts rempli
- [ ] Supabase migrations créées
- [ ] RLS policies validées
- [ ] Constants.ts créé et compilé
- [ ] Error handling implémenté
- [ ] Middleware.ts implémenté
- [ ] vercel.json créé
- [ ] Git committed avec message "chore: pre-production setup"

---

## TEMPS PAR TÂCHE

| Tâche                | Temps     | Fait |
| -------------------- | --------- | ---- |
| ESLint + Prettier    | 30 min    | ☐    |
| next.config.ts       | 1h        | ☐    |
| Supabase migrations  | 2h        | ☐    |
| Constants.ts         | 30 min    | ☐    |
| Error handling       | 1h        | ☐    |
| Middleware.ts        | 1h        | ☐    |
| Package.json updates | 15 min    | ☐    |
| Vercel config        | 15 min    | ☐    |
| **TOTAL**            | **~7.5h** | ☐    |

---

**Une fois complété**, le projet sera prêt pour Ralph Loop ! 🚀
