# PRE-RALPH CHECKLIST

**Before launching Ralph Loop - Complete verification**

**Status**: Ready to use
**Last updated**: 13 janvier 2026

---

## ✅ CODE REVIEW COMPLETION

- [x] **CODE-REVIEW-COMPLETE.md** - Analysé 14 critères
  - [x] Architecture (9/10)
  - [x] TypeScript (9/10)
  - [x] Tailwind (9/10)
  - [x] Dependencies (7.5/10)
  - [x] ESLint (0/10 - créer)
  - [x] Performance (7/10)
  - [x] Security (9/10)
  - [x] Maintenability (7.5/10)

- [x] **QUICK-FIX-CHECKLIST.md** - 8 sections
- [x] **RALPH-LOOP-PREPARATION.md** - Setup complet
- [x] **ARCHITECTURE-IMPROVEMENTS.md** - Roadmap avant/après
- [x] **EXECUTIVE-SUMMARY.md** - Vue d'ensemble

---

## 🔴 BLOCKERS - À FAIRE (7-8h)

### Task 1: ESLint + Prettier Setup (30 min)

**Status**: ⏳ TODO

- [ ] 1.1 - Installer dépendances

  ```bash
  npm install --save-dev prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
  ```

  **Expected**: Zéro erreurs npm

- [ ] 1.2 - Créer `.eslintrc.json` (40 lignes)
      **File**: `/Users/simeon/projects/vuvenu/.eslintrc.json`
      **Source**: See QUICK-FIX-CHECKLIST.md section 1.2

- [ ] 1.3 - Créer `.prettierrc.json` (10 lignes)
      **File**: `/Users/simeon/projects/vuvenu/.prettierrc.json`
      **Source**: See QUICK-FIX-CHECKLIST.md section 1.3

- [ ] 1.4 - Créer `.prettierignore` (15 lignes)
      **File**: `/Users/simeon/projects/vuvenu/.prettierignore`
      **Source**: See QUICK-FIX-CHECKLIST.md section 1.4

- [ ] 1.5 - Ajouter scripts package.json
      **Modify**: `package.json` - Voir section 1.5

- [ ] 1.6 - Valider
  ```bash
  npm run format:check   # Should pass
  npm run lint          # Should pass
  npm run typecheck     # Should pass
  ```
  **Expected**: Tous les commandes pass

**Time**: 30 min
**Difficulty**: Easy (copy-paste)
**Critical**: OUI - nécessaire pour toute la suite

---

### Task 2: next.config.ts Completion (1h)

**Status**: ⏳ TODO

- [ ] 2.1 - Remplacer `next.config.ts` (80 lignes)
      **File**: `/Users/simeon/projects/vuvenu/next.config.ts`
      **Current**: 8 lignes vides
      **After**: 80 lignes complètes
      **Source**: See QUICK-FIX-CHECKLIST.md section 2

- [ ] 2.2 - Vérifier compilation

  ```bash
  npm run typecheck
  ```

  **Expected**: Zéro erreur TypeScript

- [ ] 2.3 - Vérifier build
  ```bash
  npm run build
  ```
  **Expected**: Build succès, next/image warnings zéro

**Includes**:

- ✅ Image remote patterns (Supabase, Gemini)
- ✅ Image formats (WebP, AVIF)
- ✅ Security headers (8 headers)
- ✅ Redirects
- ✅ Webpack optimizations
- ✅ Production source maps disabled

**Time**: 1h
**Difficulty**: Easy (copy-paste)
**Critical**: OUI - sécurité + performance

---

### Task 3: Supabase Migrations (2h)

**Status**: ⏳ TODO

- [ ] 3.1 - Créer dossier migrations

  ```bash
  mkdir -p supabase/migrations
  ```

- [ ] 3.2 - Créer migration SQL (250+ lignes)
      **File**: `/Users/simeon/projects/vuvenu/supabase/migrations/001_initial_schema.sql`
      **Source**: See QUICK-FIX-CHECKLIST.md section 3.2
      **Includes**:
  - [x] `profiles` table + RLS
  - [x] `scripts` table + RLS
  - [x] `campaigns` table + RLS
  - [x] `campaign_concepts` table + RLS
  - [x] `audit_logs` table
  - [x] Triggers (updated_at)
  - [x] Functions (handle_new_user)
  - [x] Indexes (performance)

- [ ] 3.3 - Appliquer migration Supabase

  ```bash
  supabase link --project-ref <project-id>
  supabase db push
  ```

  **Expected**: Migration appliquée sans erreur

- [ ] 3.4 - Vérifier RLS dans Supabase UI
      **Check**: Policies > Select > profiles
      **Expected**: 3 policies (select, update, insert)

- [ ] 3.5 - Générer types TypeScript (optionnel)
  ```bash
  npx supabase gen types typescript --project-id <id> > src/types/database.ts
  ```

**Tables créées**:

- profiles (id, email, business_name, subscription_status, etc)
- scripts (id, user_id, title, content, format, tone)
- campaigns (id, user_id, title, status, wizard_step)
- campaign_concepts (id, campaign_id, funnel_stage, name, etc)
- audit_logs (id, user_id, action, resource_type)

**RLS Policies**:

- Users can only access their own data
- Cascade delete on user deletion
- Updated_at auto-updated on changes

**Time**: 2h
**Difficulty**: Medium (SQL + Supabase UI)
**Critical**: OUI - database foundation

---

### Task 4: Constants + Error Handling (1.5h)

**Status**: ⏳ TODO

- [ ] 4.1 - Créer `src/lib/constants.ts` (120 lignes)
      **File**: `/Users/simeon/projects/vuvenu/src/lib/constants.ts`
      **Source**: See QUICK-FIX-CHECKLIST.md section 4
      **Includes**:
  - [x] SUBSCRIPTION_LIMITS (starter/pro/business)
  - [x] PRICING (monthly/yearly)
  - [x] SCRIPT_FORMATS (reels, tiktok, shorts)
  - [x] SCRIPT_TONES (humorous, professional, etc)
  - [x] ROUTES (public paths)
  - [x] API_ROUTES (endpoints)
  - [x] TIMEOUTS (30s/45s/60s)
  - [x] ERROR_MESSAGES (user-friendly)

- [ ] 4.2 - Valider compilation

  ```bash
  npm run typecheck
  ```

  **Expected**: Zéro erreur

- [ ] 4.3 - Créer `src/lib/errors.ts` (150 lignes)
      **File**: `/Users/simeon/projects/vuvenu/src/lib/errors.ts`
      **Source**: See QUICK-FIX-CHECKLIST.md section 5
      **Classes**:
  - [x] VuVenuError (base)
  - [x] ValidationError
  - [x] AuthenticationError
  - [x] ForbiddenError
  - [x] NotFoundError
  - [x] SubscriptionError
  - [x] RateLimitError
  - [x] AIError
  - [x] StripeError
  - [x] handleError() function
  - [x] createErrorResponse() function

- [ ] 4.4 - Créer validators (optionnel pour now)
      **Files**:
  - [ ] `src/lib/validators/auth.ts`
  - [ ] `src/lib/validators/script.ts`
  - [ ] `src/lib/validators/campaign.ts`

- [ ] 4.5 - Valider
  ```bash
  npm run typecheck
  ```
  **Expected**: Zéro erreur

**Time**: 1.5h
**Difficulty**: Easy (copy-paste patterns)
**Critical**: OUI - error handling + constants

---

### Task 5: Middleware + Vercel (1.5h)

**Status**: ⏳ TODO

- [ ] 5.1 - Créer `src/middleware.ts` (50 lignes)
      **File**: `/Users/simeon/projects/vuvenu/src/middleware.ts`
      **Source**: See QUICK-FIX-CHECKLIST.md section 6
      **Features**:
  - [x] Route protection (dashboard, scripts, campaigns)
  - [x] Auth redirect (to /login if unauthorized)
  - [x] Authenticated redirect (to /dashboard if already logged in)
  - [x] Session update

- [ ] 5.2 - Créer `vercel.json` (30 lignes)
      **File**: `/Users/simeon/projects/vuvenu/vercel.json`
      **Source**: See QUICK-FIX-CHECKLIST.md section 8
      **Includes**:
  - [x] Environment variables
  - [x] Build command
  - [x] Dev command
  - [x] Framework (nextjs)
  - [x] Node version (20.x)

- [ ] 5.3 - Valider
  ```bash
  npm run typecheck
  npm run build
  ```
  **Expected**: Build succès

**Time**: 1.5h
**Difficulty**: Easy (copy-paste)
**Critical**: OUI - security + deployment

---

### Task 6: Package.json + Dependencies (45 min)

**Status**: ⏳ TODO

- [ ] 6.1 - Ajouter dev dependencies

  ```bash
  npm install --save-dev \
    prettier \
    eslint-config-prettier \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/parser \
    eslint-plugin-import \
    eslint-plugin-jsx-a11y \
    vitest \
    @vitest/ui \
    @testing-library/react \
    @testing-library/jest-dom \
    jsdom \
    playwright
  ```

  **Expected**: Zéro erreurs npm

- [ ] 6.2 - Modifier `package.json` scripts
      **Source**: See QUICK-FIX-CHECKLIST.md section 1.5
      **New scripts**:
  - [ ] `lint:fix`
  - [ ] `format`
  - [ ] `format:check`
  - [ ] `typecheck`
  - [ ] `test`
  - [ ] `test:ui`
  - [ ] `test:e2e`

- [ ] 6.3 - Valider package.json
  ```bash
  npm install
  npm run typecheck
  npm run lint
  npm run format:check
  ```
  **Expected**: Tous les scripts pass

**Time**: 45 min
**Difficulty**: Easy
**Critical**: NON - mais utile pour CI/CD

---

## 🟢 VALIDATION (1h)

### Test 1: Code Quality Gates (30 min)

```bash
# Chacun doit passer ✅
npm run lint           # ✅ ESLint sans erreurs
npm run format:check   # ✅ Prettier formating OK
npm run typecheck      # ✅ TypeScript zéro erreur
npm run build          # ✅ Next.js build succès
```

**Expected**: 4/4 Pass ✅

### Test 2: Local Environment (15 min)

```bash
# Setup
cp .env.local.example .env.local
# Remplir vraies valeurs:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - Autres...

# Start server
npm run dev

# Visit
open http://localhost:3000
# Should show VuVenu landing page ✅
```

**Expected**: Landing page OK, no errors

### Test 3: Git Commit (15 min)

```bash
git status
# Check: All important files staged

git add .

git commit -m "chore: pre-production setup

- Setup ESLint + Prettier
- Complete next.config.ts with optimizations
- Create Supabase migrations with RLS
- Implement error handling system
- Add auth middleware
- Create constants and configuration files
- Add Vercel deployment config

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push origin main
```

**Expected**: Push success, no conflicts

---

## 📊 COMPLETION MATRIX

### Progress Tracker

```
Task                          Time    Status    Effort
─────────────────────────────────────────────────────
1. ESLint + Prettier          30min   ⏳ TODO    Easy
2. next.config.ts             1h      ⏳ TODO    Easy
3. Supabase Migrations        2h      ⏳ TODO    Medium
4. Constants + Errors         1.5h    ⏳ TODO    Easy
5. Middleware + Vercel        1.5h    ⏳ TODO    Easy
6. Package.json + Deps        45min   ⏳ TODO    Easy
─────────────────────────────────────────────────────
   TOTAL                      ~7.5h   0%        ▯▯▯▯▯

Validation & Commit            1h      ⏳ TODO    Easy
─────────────────────────────────────────────────────
   GRAND TOTAL               8.5h    0%        ▯▯▯▯▯
```

### Fill as you go

After Task 1: ▓▯▯▯▯ (12%)
After Task 2: ▓▓▯▯▯ (25%)
After Task 3: ▓▓▓▯▯ (50%)
After Task 4: ▓▓▓▓▯ (62%)
After Task 5: ▓▓▓▓▓ (75%)
After Task 6: ▓▓▓▓▓ (88%)
After Validation: ▓▓▓▓▓ (100%) ✅

---

## 🎯 SUCCESS CRITERIA

### All must be YES ✅

- [ ] All 6 tasks completed
- [ ] npm run lint → ✅ Pass
- [ ] npm run format:check → ✅ Pass
- [ ] npm run typecheck → ✅ Pass
- [ ] npm run build → ✅ Pass
- [ ] localhost:3000 → ✅ Shows landing page
- [ ] Supabase → ✅ Migrations applied
- [ ] Git main → ✅ Latest commit pushed
- [ ] Vercel config → ✅ vercel.json present
- [ ] Middleware → ✅ middleware.ts created

### Then Ralph Loop Ready 🚀

---

## 📋 QUICK REFERENCE

### If stuck on Task X

1. **Read QUICK-FIX-CHECKLIST.md** section for that task
2. **Copy code exactly** (all code is provided)
3. **Run validation** for that task
4. **If still stuck**: Check CODE-REVIEW-COMPLETE.md for context

### Common Issues

**Issue**: npm run lint fails
**Fix**: Run `npm run lint:fix` first, then check manually

**Issue**: ESLint not recognized
**Fix**: `npm install --save-dev eslint` and .eslintrc.json

**Issue**: next.config.ts errors
**Fix**: Copy exact code from QUICK-FIX section, validate with tsc

**Issue**: Supabase migrations fail
**Fix**: Check Supabase project ID, verify SQL syntax, try one table at a time

**Issue**: TypeScript errors
**Fix**: Run `npm run typecheck` to see all errors, fix one by one

---

## 🚀 AFTER COMPLETION

Once this checklist is 100% done ✅:

```bash
# You are ready for Ralph Loop
/ralph-vuvenu week-1 --max-iterations 50 --auto-commit
```

Ralph will automatically:

- [ ] Implement auth system
- [ ] Create database interactions
- [ ] Build onboarding flow
- [ ] Create dashboard layout
- [ ] Add tests
- [ ] Commit regularly

Ralph starts with solid foundations you've built.

---

## 📞 SUPPORT

**Questions?**

- Read QUICK-FIX-CHECKLIST.md (detailed steps)
- Check CODE-REVIEW-COMPLETE.md (architecture notes)
- See RALPH-LOOP-PREPARATION.md (config for Ralph)

---

**Last check before hitting GO:**

- [ ] All tasks at ✅
- [ ] All validations pass ✅
- [ ] Committed to main ✅
- [ ] Ready for Ralph Loop ✅

**Estimated time**: 8.5 hours
**Start time**: **\*\***\_**\*\***
**Expected completion**: **\*\***\_**\*\***

🎉 **YOU'RE ABOUT TO BUILD VuVenu!**
