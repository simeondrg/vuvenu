# 🎓 RECOMMANDATIONS POUR RALPH LOOP

**Leçons et bonnes pratiques pour optimiser développement autonome**

---

## 📌 SITUATION ACTUELLE

**État du Projet** :
- ✅ Planification complète (206 tâches, 45 US)
- ✅ Documentation exhaustive (PRD, Checklist, Branding)
- ✅ Stack technique validée (Next.js, Supabase, Stripe, etc.)
- ✅ 3 Skills natives intégrés (Script, Meta Ads, Images)
- ❌ **Code source quasi vide** (3 fichiers TS seulement)
- ❌ **Pas d'authentification** (bloquant pour tout)
- ❌ **Pas de DB** (bloquant pour tout)

**Phase 0 Status** : ✅ 100% (Setup terminé)
**Phase 1 Status** : ⏳ 0% (Prêt à lancer)

---

## 🚀 CONFIGURATION RECOMMANDÉE POUR RALPH

### 1. RESPECTER L'ORDRE SÉQUENTIEL

```
JAMAIS paralléliser ces tâches :

❌ MAUVAIS : Créer wizard + dashboard + scripts en même temps
✅ BON :
  1. Auth (bloquant pour tout)
  2. DB + RLS (bloquant pour tout)
  3. Onboarding (nécessite auth + db)
  4. Dashboard layout (après onboarding)
  5. Scripts generator (après dashboard)
```

### 2. DÉFINIR "DONE" CLAIREMENT

**Pour Ralph de savoir quand commit** :

```typescript
// ✅ DONE = satisfait ces critères :

// 1. Feature est complète
- Fonctionnalité testée end-to-end
- Pas de TODO/FIXME restants
- Code respecte conventions CLAUDE.md

// 2. Build passe
npm run typecheck   // 0 erreurs
npm run lint        // 0 erreurs
npm run dev         // Démarre sans crash

// 3. Tests passent (si existe)
npm run test        // 0 failures

// 4. Documentation à jour
- MASTER_CHECKLIST.md mis à jour
- JOURNAL.md mis à jour
- Comments inline si logique complexe

// 5. Git status
git status          // Rien en staging (tout committé)
```

### 3. PRIORITÉ ABSOLUE : SEMAINE 1

```
BLOQUANTS SEMAINE 1 (non-négociable) :

✅ 1.1 Authentification Supabase
   - [ ] Auth routes (/login, /register, /reset)
   - [ ] Email verification
   - [ ] JWT middleware
   - [ ] Protected routes

✅ 1.2 Database Schema + RLS
   - [ ] profiles table
   - [ ] scripts table
   - [ ] campaigns table
   - [ ] Row Level Security policies
   - [ ] Triggers auto-creation

✅ 1.3 Onboarding Flow
   - [ ] 4 étapes complètes
   - [ ] Sauvegarde en DB
   - [ ] Validation Zod

✅ 1.4 Dashboard Layout
   - [ ] Sidebar + Header
   - [ ] Navigation actifs
   - [ ] Responsive mobile

TOUT DÉPEND de ces 4 blocages.
Ne PAS avancer si l'un n'est pas 100% fini.
```

### 4. TESTER À CHAQUE ÉTAPE

```bash
# Ralph devrait faire à la fin de CHAQUE user story :

# 1. TypeScript
npm run typecheck

# 2. ESLint
npm run lint

# 3. Démarrer serveur (5sec test)
npm run dev &
sleep 3
curl http://localhost:3000
pkill -f "next dev"

# 4. Browser test manuel (si possible)
# Ouvrir http://localhost:3000
# Tester parcours utilisateur

# 5. Si tests existent
npm run test

# Si un test échoue → BLOQUER + fixer avant commit
```

### 5. STRUCTURER LES COMMITS

```bash
# Format conventionnel à respecter :

# Features
git commit -m "feat: Add Supabase authentication

- Implement sign up, login, password reset flows
- Add email verification with OTP
- Create JWT middleware for protected routes
- Add Row Level Security policies

Closes #1.1.1 #1.1.2 (MASTER_CHECKLIST tasks)"

# Fixes
git commit -m "fix: TypeScript error in auth middleware"

# Refactoring
git commit -m "refactor: Extract auth utils to separate module"

# Docs
git commit -m "docs: Update JOURNAL.md with Semaine 1 progress"

# Configuration
git commit -m "config: Add environment variables for Supabase"

# JAMAIS :
# ❌ "WIP: stuff"
# ❌ "Update"
# ❌ "bugfix"
# ❌ Commits énormes (>500 lignes changées)
```

---

## 🎯 QUALITÉ GATES RALPH

**Ne PAS procéder à l'étape suivante si** :

```
🚨 BLOQUANTS (STOP tout)
- [ ] npm run typecheck échoue
- [ ] npm run lint échoue
- [ ] npm run dev crash
- [ ] >10 TODO/FIXME dans le code
- [ ] Aucun test pour feature critique

⚠️ À CORRIGER AVANT COMMIT
- [ ] Console errors/warnings
- [ ] Pas de error handling
- [ ] Magic numbers (pas de constantes)
- [ ] Function >50 lignes sans justification

✅ OK À COMMIT
- [ ] Tous les tests passent
- [ ] Build 100% vert
- [ ] Code reviewable
- [ ] Changelogs mis à jour
```

---

## 📊 MÉTRIQUES À TRACKER

**Ralph devrait logger automatiquement** :

```bash
# Fin de chaque user story
echo "
=== PROGRESS UPDATE ===
Date: $(date)
Task: [Tâche complétée]
Time: [Durée estimée]
TypeScript errors: 0
ESLint warnings: 0
Test coverage: XX%
Git commits: N
Next: [Prochaine tâche]
Status: ✅ READY
=== END UPDATE ===
" >> docs/execution/EXECUTION-LOG.md
```

---

## 🔐 SÉCURITÉ CHECKPOINTS

**Ralph ne doit JAMAIS committé** :

```
❌ SECRETS :
- API keys en dur
- JWT secrets
- Passwords
- Stripe keys
- Supabase URLs (prod)

❌ JUNK :
- console.log() laissé
- Commented code
- .DS_Store files
- node_modules/

❌ MALFORMED :
- Fichiers incomplets
- Imports cassés
- Typos flagrants
```

---

## 🛠️ SKILLS À UTILISER

**Ralph a accès aux 3 skills** :

### vuvenu-script-generator.md
```
Utilisé pour :
- Tester Scripts Generator API
- Validating prompt quality
- Documentation examples
```

### vuvenu-meta-ads-generator.md
```
Utilisé pour :
- Testing Meta Ads flow
- Validating business classification
- Copy generation
```

### vuvenu-image-generator.md
```
Utilisé pour :
- Testing Gemini integration
- Image prompt validation
- Fallback strategies
```

---

## 📚 RESSOURCES CRITIQUES

**Ralph doit lire et respecter** :

```
🔴 OBLIGATOIRES :
- CLAUDE.md          → Conventions strictes
- PRD-VuVenu-MVP.md  → Spécifications exactes
- MASTER_CHECKLIST   → Timeline + validation
- docs/QUICK-START   → Commandes exécution

🟡 RÉFÉRENCE :
- BRANDING           → UI guidelines
- /src/lib/skills/   → Méthodologies business
- /docs/technical/   → Architecture decisions

🟢 INFORMATIF :
- docs/execution/    → Historique
- /docs/research/    → Contexte industries
```

---

## 🔄 CYCLE ITÉRATIF RECOMMANDÉ

```
CHAQUE USER STORY (1-2h) :

1. Lire US dans PRD-VuVenu-MVP.md
2. Créer branche feature/us-XXX
3. Implémenter (code)
4. npm run typecheck (valider)
5. npm run lint (valider)
6. npm run test (valider)
7. Test manuel browser (valider)
8. Mettre à jour JOURNAL.md + MASTER_CHECKLIST
9. git commit -m "feat: us-XXX description"
10. Merger à main
11. VALIDER que :
    - Aucun error dans console
    - Next.js compilé sans warning
    - Feature testée end-to-end

PUIS avancer à USER STORY suivante.
```

---

## ⚡ OPTIMISATIONS SUGGESTIONS

### Paralléliser (SEULEMENT SI)

```
✅ PEUT être parallélisé :
- Créer stub files pendant que autre branch en cours
- Documenter pendant que tests tournent
- Créer fixtures données pendant développement

❌ JAMAIS parallélisé :
- Auth et Database (dépendances)
- Onboarding et Dashboard (dépendances)
- Front-end et Back-end critiques (testing)
```

### Cache & Optimisations

```bash
# Ralph peut utiliser :
# 1. Réutiliser patterns Supabase (auth boilerplate)
# 2. Réutiliser patterns Stripe (checkout flow)
# 3. Réutiliser patterns shadcn/ui (components)
# 4. Copier/adapter skills pour API routes

# Mais PAS :
# ❌ Copier/coller sans adapter
# ❌ Ignorer error handling
# ❌ Skipper tests
```

---

## 🆘 BLOCAGES ANTICIPÉS

**Si Ralph rencontre** :

```
"npm run typecheck failed"
→ Chercher type definition manquante
→ Vérifier @types/package installé
→ Si Supabase : npm run supabase gen types

"Compilation error in Next.js"
→ Vérifier import paths
→ Vérifier no circular imports
→ Vérifier middleware correct

"RLS policy not working"
→ Vérifier Supabase JWT correct
→ Vérifier auth context setup
→ Tester manuellement dans Supabase

"Tests failing"
→ Vérifier fixtures données
→ Vérifier setup/teardown
→ Vérifier mocks corrects

"Build timeout"
→ Vérifier pas d'infinite loops
→ Vérifier pas d'API appels non-optimisés
→ Vérifier pas d'images énormes
```

---

## 📋 FINAL CHECKLIST AVANT RALPH

```
PRÉ-DÉVELOPPEMENT :
[ ] npm run dev marche
[ ] npm run typecheck passe
[ ] npm run lint passe
[ ] Stub files présents
[ ] .env.local.example setup
[ ] Supabase project créé
[ ] Stripe keys setup
[ ] Anthropic key setup
[ ] Gemini key setup

PENDANT RALPH :
[ ] Committer après chaque US
[ ] Mettre à jour JOURNAL après session
[ ] Tester build complet 1x par jour
[ ] Documenter blocages
[ ] Valider vs PRD

APRÈS RALPH (Semaine) :
[ ] MASTER_CHECKLIST 100% coché (semaine complète)
[ ] npm run build produit aucun error
[ ] Aucun TODO/FIXME dans /src
[ ] Tests écrits pour features critiques
[ ] Documentation mise à jour
```

---

## 🎯 SUCCESS CRITERIA RALPH

**Ralph peut se considérer réussi si** :

```
SEMAINE 1 ✅ :
- Authentification fonctionnelle end-to-end
- Database avec 4 tables + RLS 100%
- Onboarding flow complète
- Dashboard layout responsive
- 0 TypeScript errors
- 0 ESLint warnings
- Tous les tests passent
- Code respecte conventions

Temps : ~40-50h de développement réel

SEMAINE 2 ✅ :
- Scripts Generator UI + API + DB (sauvegarde)
- Meta Ads Generator UI + API + DB (sauvegarde)
- Images Gemini integration
- 0 erreurs build
- End-to-end tested

Temps : ~50-60h de développement réel

SEMAINE 3 ✅ :
- Stripe checkout + portal
- Landing page
- Pages légales
- Webhooks testés (Stripe CLI)

Temps : ~30-40h de développement réel

SEMAINE 4 ✅ :
- Wizard 7 étapes
- Polish + bug fixes
- Beta test + feedback
- DEPLOY production

Temps : ~40-50h de développement réel

TOTAL : ~160-200h pour MVP complet
```

---

## 🏆 AVANTAGES RALPH VS MANUEL

```
Si Ralph exécute ce plan :

⏱️  TIME :
  Manuel solo (Siméon) : ~300-400h
  Ralph+Siméon : ~200h (Ralph) + 50h (Siméon supervision)
  Gain : -50% temps total

🐛 BUGS :
  Ralph : Structured approach → -30% bugs
  Siméon solo : Ad-hoc → +bugs

📚 DOCUMENTATION :
  Ralph : Auto-logging → Complete
  Siméon solo : Manuel → Incomplete

🔄 ITERATIONS :
  Ralph : Prévisible → Timeline respectée
  Siméon solo : Imprévisible → Peut dériver

💡 QUALITÉ :
  Ralph : Conventions strictes → Maintenable
  Siméon solo : Pragmatique → Peut sacrifier qualité
```

---

## 🚀 READINESS CHECKLIST

**Avant de lancer Ralph, vérifier** :

```
[ ] CLEANUP-ACTION-PLAN exécuté 100%
[ ] npm run typecheck passe
[ ] npm run lint passe
[ ] npm run dev fonctionne
[ ] .env.local configuré
[ ] Git clean (tout committé)
[ ] MASTER_CHECKLIST à jour
[ ] Skills docs relus
[ ] Cette doc (RECOMMANDATIONS) lue
[ ] Supabase project prêt
[ ] Stripe keys configurées
[ ] APIs keys sécurisées

SI OUI à tous → /ralph-vuvenu semaine-1 --max-iterations 50
```

---

## 📞 ESCALADE RALPH

**Si Ralph est bloqué >1h** :

```
1. Vérifier error message exact
2. Chercher dans:
   - CLAUDE.md (conventions)
   - PRD (spécifications)
   - /docs/technical (architecture)
3. Si pas trouvé : logger et continuer autre tâche
4. Siméon review + aide après session Ralph
5. Update MASTER_CHECKLIST avec blocage
6. Continuer tâches non-bloquées
```

---

*Document créé : 13 janvier 2026*
*Audience : Ralph Loop + Siméon (supervision)*
*Priorité : 🟡 Important (relire avant Ralph démarrage)*
