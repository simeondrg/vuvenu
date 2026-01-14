# RALPH LOOP PREPARATION

**Configuration pour démarrage Ralph autonome**

**Date** : 13 janvier 2026
**Prérequis** : Code review complétée + Quick-Fix checklist appliquée

---

## OVERVIEW

VuVenu est architecturalement prêt pour Ralph Loop. Cependant, quelques préparations maximiseront l'efficacité du développement autonome.

**Statut actuel** : 60% prêt
**Statut après Quick-Fix** : 95% prêt
**Statut Ralph-ready** : 100% ✅

---

## PHASE 1 : CONFIGURATION FONDATIONS (7-8h)

### À faire AVANT de lancer Ralph Loop

#### 1.1 Apply Quick-Fix Checklist (7.5h)

```bash
# Temps : 7.5 heures
# Inclut :
# - ESLint + Prettier
# - next.config.ts
# - Supabase migrations
# - Constants, Error handling, Middleware
# - Vercel config

# Valider :
npm run lint              # ✅ Pas d'erreurs
npm run format:check      # ✅ Code formaté
npm run typecheck         # ✅ No TS errors
npm run build             # ✅ Build success
```

#### 1.2 Valider setup local (30 min)

```bash
# 1. Créer .env.local depuis .env.local.example
cp .env.local.example .env.local
# Puis remplir avec vraies clés

# 2. Tester serveur dev
npm run dev
# Visit http://localhost:3000
# Doit afficher landing page VuVenu

# 3. Tester connexion services
# - Supabase: Migrations appliquées ✅
# - Stripe: Produits créés dans dashboard
# - Anthropic: API key valide
# - Gemini: API key valide
```

#### 1.3 Commit sur main (15 min)

```bash
git add .
git commit -m "chore: pre-production setup and configurations

- Setup ESLint + Prettier
- Complete next.config.ts with optimizations
- Create Supabase migrations with RLS policies
- Implement error handling system
- Add auth middleware
- Create constants and configuration files
- Add Vercel deployment config

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push origin main
```

---

## PHASE 2 : CONFIGURATION RALPH LOOP (1h)

### 2.1 Instruction pour Ralph Autonome

Créer un fichier d'instructions pour Ralph Loop :

**Fichier** : `.claude/ralph-instructions.md`

```markdown
# Ralph Loop Instructions - VuVenu MVP

## Contexte

- Projet : VuVenu (SaaS marketing pour commerces)
- Type : MVP avec 2 modules (Scripts + Meta Ads)
- Stack : Next.js 16 + Supabase + Stripe + Anthropic/Gemini
- Durée : 4 semaines
- Démarrage : Semaine 1 (Auth + DB + Dashboard)

## Règles Absolues

1. TypeScript strict - JAMAIS de 'any'
2. Server Components par défaut
3. RLS Supabase obligatoire pour données user
4. Validation Zod côté serveur
5. Messages d'erreur en français
6. Mobile-first toujours
7. TailwindCSS + shadcn/ui uniquement

## Workflow

1. **Tâche** → Lire MASTER_CHECKLIST
2. **Implémenter** → 1 user story = 1 tâche Ralph
3. **Tester** → Manuellement sur localhost
4. **Commit** → Message conventional
5. **Enregistrer** → Mettre à jour JOURNAL.md
6. **Suivant** → Task itérante auto

## Limite Tokens

- Max 100k tokens par itération
- Garder contexte < 50 lignes de résumé
- Dépendances max 5-10 fichiers par changement

## Quality Gates

- ✅ npm run typecheck (zéro erreur)
- ✅ npm run lint (zéro erreur)
- ✅ npm run format:check (formaté)
- ✅ Tests unitaires (si applicable)
- ✅ Pas de console.log en prod

## Fichiers de Référence

- CLAUDE.md - Config projet
- PRD-VuVenu-MVP.md - User stories
- MASTER_CHECKLIST.md - Tâches détaillées
- CODE-REVIEW-COMPLETE.md - Architecture notes
- QUICK-FIX-CHECKLIST.md - Pre-flight checklist

## Points d'Attention

- Secrets JAMAIS en dur (utiliser env vars)
- Rate limiting sur API IA (30s timeout)
- Limites d'abonnement vérifiées avant génération
- Error messages friendly (français)
- Images optimisées avec next/image

## Structure User Story
```

### 1.1.5 Page /register - formulaire inscription

**Description**
Créer page d'inscription avec formulaire email + password

**Acceptance Criteria**

- [ ] Formulaire avec validation Zod
- [ ] Submit crée user dans Supabase Auth
- [ ] Erreurs affichées user-friendly
- [ ] Responsive mobile
- [ ] Tests unitaires pour validation

**Dépendances**

- 1.1.2 Supabase client setup
- 1.1.3 Supabase server setup

**Fichiers**

- src/app/(auth)/register/page.tsx
- src/components/forms/register-form.tsx
- src/lib/validators/auth.ts

**Notes**

- Utiliser react-hook-form + Zod
- Email + password validation
- Password min 8 chars, 1 upper, 1 number
- Après submit → /verify-email

```

## Signaux de Succès
- ✅ Chaque tâche < 2h de travail
- ✅ Tests lancés et passent
- ✅ Code review clean (ESLint)
- ✅ JOURNAL.md mis à jour
- ✅ Git push sur branche feature

## Blocages Connus
- Aucun actuellement
- À mettre à jour au fur et à mesure

## Contacts Support
- Tech questions → CODE-REVIEW-COMPLETE.md
- Product questions → PRD-VuVenu-MVP.md
- Setup questions → QUICK-FIX-CHECKLIST.md
```

### 2.2 Fichier master pour Ralph Loop

**Fichier** : `src/lib/ralph-config.ts`

```typescript
/**
 * Configuration globale pour Ralph Loop
 * À jour automatiquement par Claude Code
 */

export const RALPH_CONFIG = {
  PROJECT: 'VuVenu MVP',
  PHASE: 'Week 1',
  WEEK: 1,
  DAY: 1,

  // Limites système
  MAX_API_CALLS_PER_MINUTE: 60,
  MAX_TOKENS_PER_REQUEST: 4000,
  MAX_GENERATION_TIME_MS: 30000,

  // URLs
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,

  // Feature flags
  FEATURES: {
    SCRIPT_GENERATION: true,
    CAMPAIGN_GENERATION: false, // Week 2
    IMAGE_GENERATION: false, // Week 3
    STRIPE_INTEGRATION: false, // Week 2
    EMAIL_VERIFICATION: true,
  },

  // Debug mode
  DEBUG: process.env.NODE_ENV === 'development',
  VERBOSE_LOGS: process.env.DEBUG_VERBOSE === 'true',
} as const

// Type-safe access
export function getConfig() {
  return RALPH_CONFIG
}

export function isFeatureEnabled(feature: keyof typeof RALPH_CONFIG.FEATURES): boolean {
  return RALPH_CONFIG.FEATURES[feature]
}
```

### 2.3 Setup tests framework

**Installer Vitest** :

```bash
npm install --save-dev \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  jsdom
```

**Créer `vitest.config.ts`** :

```typescript
import { getViteConfig } from 'astro/config'
import { defineConfig } from 'vitest/config'

export default defineConfig(
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'tests/'],
      },
    },
  })
)
```

**Créer `tests/setup.ts`** :

```typescript
import '@testing-library/jest-dom'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

// Mock AI clients
vi.mock('@anthropic-ai/sdk', () => ({
  Anthropic: vi.fn(),
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(),
}))
```

---

## PHASE 3 : LANCEMENT RALPH (30 min)

### 3.1 Premier Ralph Loop Command

```bash
# Syntaxe
/ralph-vuvenu week-1 --max-iterations 50 --auto-commit

# Ou mode pas-à-pas
/ralph-vuvenu next --wait-for-review

# Ou ciblé
/ralph-vuvenu task 1.1.5 --reset-to-start
```

### 3.2 Monitoring Ralph

```bash
# Vérifier progression
tail -f JOURNAL.md

# Vérifier code quality
npm run lint
npm run typecheck

# Vérifier tests
npm run test

# Vérifier build
npm run build
```

### 3.3 Intervention en cas de blocage

Ralph peut rencontrer des blocages. Intervention manuelle :

```bash
# 1. Identifier problème
tail -n 50 JOURNAL.md | grep -i error

# 2. Fixer issue
# - Fix le code manuellement
# - Ou diriger Ralph pour dépasser

# 3. Relancer
/ralph-vuvenu next --resume
```

---

## STRUCTURE POUR RALPH

### Fichiers à respecter

```
VuVenu/
├── CLAUDE.md                    # Config Ralph (ne pas modifier)
├── CODE-REVIEW-COMPLETE.md      # Notes archi (référence)
├── QUICK-FIX-CHECKLIST.md       # Pre-flight (vérifié ✅)
├── MASTER_CHECKLIST.md          # Source de vérité (mise à jour Ralph)
├── PRD-VuVenu-MVP.md            # User stories (mise à jour Ralph)
├── JOURNAL.md                   # Historique (mise à jour auto)
├── .claude/
│   └── ralph-instructions.md    # Instructions Ralph (ce doc)
└── src/
    └── lib/
        └── ralph-config.ts      # Config runtime Ralph
```

---

## COMMANDES POUR RALPH

### Auto-learning

Ralph apprendra ces patterns :

```typescript
// 1. Pattern validation
import { z } from 'zod'

const createScriptSchema = z.object({
  businessNiche: z.string().min(3),
  targetAudience: z.string().min(5),
})

// 2. Pattern error handling
import { ValidationError, AIError } from '@/lib/errors'

throw new ValidationError('Invalid niche', 'businessNiche')

// 3. Pattern API response
return Response.json({ data: result }, { status: 200 })

// 4. Pattern server action
;('use server')

export async function generateScript(formData: FormData) {
  // Validation
  // DB call
  // AI call
  // Error handling
  // Return response
}

// 5. Pattern RLS query
const { data, error } = await supabase.from('scripts').select('*').eq('user_id', userId)
// RLS automatically enforces user_id = auth.uid()
```

---

## PERFORMANCE TARGETS

Ralph doit respecter ces métriques :

| Métrique          | Cible  | Notes               |
| ----------------- | ------ | ------------------- |
| TypeScript errors | 0      | Strict mode         |
| ESLint errors     | 0      | Auto-fix            |
| Build time        | < 60s  | Turbopack           |
| Test coverage     | > 80%  | Fonctions critiques |
| API response      | < 2s   | Sans IA             |
| AI generation     | < 45s  | Timeout             |
| LCP               | < 2.5s | Core Web Vital      |
| CLS               | < 0.1  | Core Web Vital      |

---

## FEEDBACK LOOP

Ralph génère des rapports automatiquement :

**Chaque 24h** :

```
📊 RAPPORT QUOTIDIEN

Tâches complétées : 8/10
Progression : 80%
Issues blocantes : 0
Performance : ✅ Excellente

Prochaines étapes :
- Task 1.1.9 (tests flux auth)
- Task 1.2.1 (migrations DB)
```

**Chaque semaine** :

```
📈 RAPPORT HEBDO

Semaine 1 : ✅ COMPLÉTÉE
- Auth system : ✅
- DB schema : ✅
- Onboarding : ✅
- Dashboard : ✅

Semaine 2 ready ? OUI
Recommandations : 0 blocages
```

---

## CHECKLIST AVANT LANCEMENT

- [ ] Code review appliquée
- [ ] Quick-fix checklist complétée
- [ ] npm run lint ✅
- [ ] npm run typecheck ✅
- [ ] npm run build ✅
- [ ] .env.local configuré
- [ ] Supabase migrations appliquées
- [ ] Tests framework setup
- [ ] Git main branch up-to-date
- [ ] JOURNAL.md initialisé
- [ ] MASTER_CHECKLIST.md à jour
- [ ] Ralph instructions documentées

---

## OPTIMISATIONS RALPH SPÉCIFIQUES

### Pour speed (diminuer tokens)

```typescript
// ✅ RAPIDE - Réutiliser code existant
import { cn } from '@/lib/utils'
const classes = cn('flex gap-2', isActive && 'bg-lime')

// ❌ LENT - Écrire du neuf chaque fois
const classes = classNames({
  flex: true,
  'gap-2': true,
  'bg-lime': isActive,
})
```

### Pour qualité (éviter bugs)

```typescript
// ✅ BON - Types explicites
async function saveScript(userId: string, script: ScriptInput): Promise<{ id: string }> {
  // ...
}

// ❌ MAUVAIS - Types implicites
async function saveScript(data) {
  // ...
}
```

### Pour maintenabilité (DRY)

```typescript
// ✅ BON - Extraire pattern commun
const handleAsyncError = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn()
  } catch (error) {
    throw new AIError(...handleError(error))
  }
}

// ❌ MAUVAIS - Répéter try-catch partout
try { await generateScript() }
catch { throw new Error(...) }
try { await generateImage() }
catch { throw new Error(...) }
```

---

## APRÈS RALPH LOOP

Une fois Ralph complète la Semaine 1 :

```
Checklist finale :
- [ ] Test inscription → connexion → onboarding → dashboard
- [ ] Vérifier RLS (non-auth users ne voient rien)
- [ ] Performance browser DevTools
- [ ] Responsive test (iPhone 12, Pixel 6, iPad)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] SEO (meta tags, sitemap)
```

---

## TL;DR

1. ✅ Code review complétée
2. ⏳ Apply Quick-Fix Checklist (7.5h)
3. ✅ Valider setup local (30 min)
4. ✅ Commit sur main (15 min)
5. 🚀 Lancer Ralph Loop avec `/ralph-vuvenu week-1`
6. 📊 Monitorer progression via JOURNAL.md
7. 🎉 Semaine 1 complétée en ~50-60h de code

---

**Ralph Loop ready !** 🤖✨
