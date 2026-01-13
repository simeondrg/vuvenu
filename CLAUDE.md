# CLAUDE.md - VuVenu MVP

> Configuration projet pour Claude Code. Ce fichier donne le contexte nécessaire pour travailler efficacement sur VuVenu.

---

## 🎯 CONTEXTE PROJET

**Nom** : VuVenu  
**Type** : SaaS B2B  
**Cible** : Commerces de proximité (restaurants, salons, boutiques, artisans)  
**Objectif** : Permettre aux commerçants d'attirer plus de clients via les réseaux sociaux, sans expertise marketing  

### Proposition de Valeur
> "VuVenu te permet en tant que gérant d'une entreprise locale d'attirer plus de clients grâce à un outil tout-en-un qui t'apporte la meilleure visibilité sur les réseaux sociaux possible, rapidement et avec le moindre effort."

### Modules MVP V1
1. **Générateur de Scripts Vidéos** - Scripts optimisés pour Reels/TikTok (30-60 sec)
2. **Meta Ads Generator** - Concepts publicitaires + images IA + wizard de lancement guidé

---

## 🛠️ STACK TECHNIQUE

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| IA Texte | Anthropic Claude 3.5 Sonnet |
| IA Images | Google Gemini (Imagen 3) |
| Paiements | Stripe (Checkout + Customer Portal) |
| Déploiement | Vercel |
| Validation | Zod |

---

## 📁 STRUCTURE PROJET

```
vuvenu/
├── app/
│   ├── (auth)/                    # Routes auth (non connecté)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (dashboard)/               # Routes app (connecté)
│   │   ├── layout.tsx             # Layout avec sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── scripts/
│   │   │   ├── page.tsx           # Liste scripts
│   │   │   ├── new/page.tsx       # Générer script
│   │   │   └── [id]/page.tsx      # Détail script
│   │   ├── campaigns/
│   │   │   ├── page.tsx           # Liste campagnes
│   │   │   ├── new/page.tsx       # Générer campagne
│   │   │   ├── [id]/page.tsx      # Détail campagne
│   │   │   └── [id]/launch/page.tsx # Wizard lancement
│   │   └── settings/page.tsx
│   ├── (marketing)/               # Routes publiques
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Landing page
│   │   ├── cgv/page.tsx
│   │   ├── confidentialite/page.tsx
│   │   └── mentions-legales/page.tsx
│   ├── api/
│   │   ├── webhooks/stripe/route.ts
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── portal/route.ts
│   │   └── generate/
│   │       ├── script/route.ts
│   │       ├── campaign/route.ts
│   │       └── images/route.ts
│   ├── onboarding/page.tsx
│   ├── choose-plan/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn/ui (auto-généré)
│   ├── forms/
│   ├── dashboard/
│   ├── scripts/
│   ├── campaigns/
│   ├── wizard/
│   ├── marketing/
│   └── shared/
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # createBrowserClient
│   │   ├── server.ts              # createServerClient
│   │   └── middleware.ts          # updateSession
│   ├── stripe/
│   │   ├── client.ts
│   │   └── config.ts
│   ├── ai/
│   │   ├── anthropic.ts
│   │   ├── gemini.ts
│   │   └── prompts/
│   ├── utils/
│   └── constants.ts
├── hooks/
├── types/
├── supabase/
│   └── migrations/
├── public/
├── .env.local.example
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📋 CONVENTIONS

### Nommage
| Type | Convention | Exemple |
|------|------------|---------|
| Fichiers/Dossiers | kebab-case | `script-form.tsx` |
| Composants React | PascalCase | `ScriptForm` |
| Fonctions/Variables | camelCase | `generateScript` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_SCRIPTS_PER_MONTH` |
| Types/Interfaces | PascalCase | `Campaign`, `UserProfile` |

### TypeScript
- Mode strict activé
- Pas de `any` - utiliser `unknown` si nécessaire
- Types explicites pour les props
- Zod pour validation inputs API

### Composants React
- Server Components par défaut
- `"use client"` uniquement si nécessaire
- Props typées avec interface

### Imports (ordre)
```typescript
import { ... } from "react"           // 1. React
import { ... } from "next/..."        // 2. Next.js
import { ... } from "@/components/..."// 3. Composants internes
import { ... } from "@/lib/..."       // 4. Lib interne
import { ... } from "@/types/..."     // 5. Types
```

---

## 🗃️ SCHÉMA BASE DE DONNÉES

```sql
-- profiles (extension auth.users)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  target_audience TEXT,
  main_goal TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'none',  -- none, active, past_due, canceled
  subscription_tier TEXT,                    -- starter, pro, business
  scripts_count_month INTEGER DEFAULT 0,
  campaigns_count_month INTEGER DEFAULT 0,
  counts_reset_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- scripts
scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL,
  tone TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- campaigns
campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  wizard_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- campaign_concepts
campaign_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  funnel_stage TEXT NOT NULL,
  name TEXT NOT NULL,
  angle TEXT,
  ad_type TEXT,
  primary_text TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 💰 PLANS & LIMITES

| Plan | Prix/mois | Scripts/mois | Campagnes/mois |
|------|-----------|--------------|----------------|
| Starter | 59€ | 10 | 0 |
| Pro | 119€ | 30 | 5 |
| Business | 249€ | ∞ | ∞ |

---

## 🔑 VARIABLES D'ENVIRONNEMENT

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER_MONTHLY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_BUSINESS_MONTHLY=

# AI APIs
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://vuvenu.fr
```

---

## 🚀 COMMANDES UTILES

```bash
npm run dev              # Développement
npm run build            # Build production
npm run lint             # ESLint
npm run typecheck        # TypeScript check

# Supabase
npx supabase gen types typescript --project-id <id> > types/database.ts

# Stripe CLI (webhooks locaux)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📚 DOCUMENTATION

- PRD : `./PRD-VuVenu-MVP.md`
- Checklist : `./MASTER_CHECKLIST.md`
- Journal : `./JOURNAL.md`

---

## ⚠️ RÈGLES IMPORTANTES

1. **Vérifier les limites** avant génération (scripts/campagnes)
2. **Row Level Security** : Users ne voient que leurs données
3. **Validation Zod** côté serveur
4. **Mobile-first** : Tester sur petit écran
5. **Gestion erreurs** : Messages user-friendly

## 🔄 WORKFLOW RALPH LOOP

### Configuration pour développement autonome
- Tâches divisées en user stories < 1 contexte Claude
- Quality gates automatiques : TypeScript + ESLint + Tests
- Commit conventionnel après chaque story validée

### Exemple de tâche Ralph-compatible
✅ **Bon** : "Add login form component with validation"
❌ **Trop gros** : "Build entire authentication system"

### Quality Gates (obligatoires avant commit)
- [ ] `npm run typecheck` passe
- [ ] `npm run lint` passe
- [ ] `npm run test` passe
- [ ] Pas de secrets exposés
- [ ] Vérification browser manuelle

---

## 🎮 MCP SERVERS CONFIGURÉS

| Server | Usage VuVenu |
|--------|-------------|
| **playwright** | Tests E2E du wizard de campagnes, génération de screenshots UI |
| **supabase** | Requêtes directes BDD, gestion RLS, debug auth |
| **github** | Gestion des issues/PRs, commits automatiques |
| **context7** | APIs Anthropic/Google à jour pour génération IA |

---

## 🚨 POINTS D'ATTENTION CRITIQUES

### Sécurité IA
- **Jamais** de prompts utilisateur directement dans l'API Claude/Gemini
- Toujours sanitizer les inputs avant génération
- Rate limiting sur les endpoints `/api/generate/*`

### Performance IA
- Cache des prompts fréquents (system prompts)
- Streaming pour les générations longues
- Timeout de 30s max sur les appels IA

### Limites Stripe
- Vérifier `subscription_tier` avant génération
- Reset compteurs `scripts_count_month` chaque mois
- Webhook signature obligatoire

---

## 🧪 TESTS SPÉCIFIQUES

### Tests critiques à maintenir
- Authentification Supabase (RLS)
- Génération de scripts (mock API Claude)
- Webhook Stripe (signature + payload)
- Wizard campagne (flow complet)

### Tests E2E prioritaires
- Parcours inscription → onboarding → première génération
- Gestion abonnement (upgrade/downgrade)
- Génération script + sauvegarde

---

## 📊 MÉTRIQUES À TRACKER

### Business
- Conversion inscription → premier script généré
- Utilisation mensuelle par tier d'abonnement
- Taux d'abandon wizard campagne

### Technique
- Latence génération IA (Claude/Gemini)
- Erreurs API IA (rate limits, timeouts)
- Performance Core Web Vitals

---

*Dernière mise à jour : 13 janvier 2026*
