# ⚡ PLAN D'ACTION NETTOYAGE - À EXÉCUTER MAINTENANT

**Objectif** : Préparer VuVenu pour Ralph Loop en 4-5 heures
**Statut** : 🟢 PRÊT À EXÉCUTER
**Format** : Commandes bash + actions détaillées

---

## ÉTAPE 0 : PRÉPARATION SÉCURITÉ

```bash
# 0.1 Vérifier branche principale
cd /Users/simeon/projects/vuvenu
git status
git branch

# 0.2 Créer branche nettoyage
git checkout -b cleanup/docs-reorganization

# 0.3 Backup sécurité
mkdir -p ~/backups-vuvenu
cp -r /Users/simeon/projects/vuvenu/skills ~/backups-vuvenu/skills-backup-$(date +%Y%m%d)
cp -r /Users/simeon/projects/vuvenu/docs ~/backups-vuvenu/docs-backup-$(date +%Y%m%d) 2>/dev/null || echo "docs n'existe pas yet"

echo "✅ Backup complété"
```

---

## ÉTAPE 1 : CRÉER STRUCTURE /docs

### 1.1 Créer dossiers

```bash
mkdir -p /Users/simeon/projects/vuvenu/docs/{execution,branding,prompts,technical,research-archive,deprecated}

echo "✅ Dossiers /docs créés"
```

### 1.2 Copier et archiver fichiers

```bash
# Archiver INIT + SETUP + JOURNAL → EXECUTION-LOG
cat > /Users/simeon/projects/vuvenu/docs/execution/EXECUTION-LOG.md << 'EOF'
# 📓 JOURNAL D'EXÉCUTION COMPLET

**Fusionné de** : INIT-COMPLETE.md + CLAUDE-SETUP-COMPLETE.md + JOURNAL.md
**Date dernière MAJ** : 13 janvier 2026

---

## 🚀 SESSIONS D'EXÉCUTION

### Phase 0 - Setup Environnement (13 janvier 2026)

| Heure | Tâche | Statut | Notes |
|-------|-------|--------|-------|
| 06:43 | Début conversation | ✅ | Objectif : Construire env Claude Code pour SaaS |
| 07:30 | Analyse 16 repos GitHub | ✅ | Extraction best practices Claude Code |
| 08:00 | Guide Claude Code complet créé | ✅ | 16 sections, guide-claude-code-complet.md |
| 08:30 | Définition projet VuVenu | ✅ | 2 modules MVP : Scripts + Meta Ads |
| 09:00 | Analyse business + pricing | ✅ | 59€/119€/249€ validé |
| 09:30 | Planning 4 semaines défini | ✅ | J1-J28 détaillé |
| 10:00 | Révision scope Meta Ads | ✅ | Ajout images Gemini + Wizard |
| 10:30 | PRD complet créé | ✅ | 45 User Stories, PRD-VuVenu-MVP.md |
| 10:45 | Master Checklist créée | ✅ | 206 tâches sur 4 semaines + Phase 0 |
| 10:46 | Journal de bord créé | ✅ | Ce fichier |
| 11:30 | Prérequis confirmés | ✅ | Tous les comptes et clés API OK |
| 11:40 | Config CLAUDE.md complète | ✅ | Projet configuré |
| 11:41 | MCP servers configurés | ✅ | Supabase, GitHub, Playwright, Filesystem |
| 11:42 | .env.local.example créé | ✅ | Template toutes variables |

---

## 🏗️ STATUT INITIALISATION

✅ **Next.js 16.1.1** avec App Router (fonctionne sur localhost:3000)
✅ **TypeScript** strict mode configuré
✅ **Tailwind CSS** avec couleurs VuVenu
✅ **Git** initialisé avec commits
✅ **Structure projet** selon PRD
✅ **Dépendances** installées (Supabase, Stripe, Anthropic, Gemini, etc.)
✅ **MCP Servers** configurés (Playwright, Supabase, GitHub)

---

## 📊 PROGRESSION PHASE 0

| Tâche | Statut | % |
|-------|--------|---|
| Prérequis utilisateur | ✅ | 100% |
| Config fichiers | ✅ | 100% |
| Initialisation projet | ✅ | 100% |
| **PHASE 0 TOTAL** | **✅** | **100%** |

---

## 🚀 PROCHAINES ÉTAPES

**Phase 1 : Nettoyage (13 janvier)**
1. Réorganiser documentations
2. Archiver /skills
3. Créer /docs structure
4. Créer stub TypeScript files

**Phase 2 : Développement (14 janvier +)**
Ralph Loop démarre avec SEMAINE 1 (Authentification, DB, Onboarding)

---

*Mise à jour : 13 janvier 2026*
EOF

echo "✅ EXECUTION-LOG.md créé"

# Copier BRANDING
cp /Users/simeon/projects/vuvenu/BRANDING-VUVENU-BRIEF.md /Users/simeon/projects/vuvenu/docs/branding/BRIEF.md

# Copier prompts Gemini
cp /Users/simeon/projects/vuvenu/MEGA-PROMPT-GEMINI.md /Users/simeon/projects/vuvenu/docs/prompts/gemini-interface.md

# Copier workflow deprecated
cp /Users/simeon/projects/vuvenu/WORKFLOW-VUVENU.md /Users/simeon/projects/vuvenu/docs/deprecated/WORKFLOW.md

# Archiver skills references
cp -r /Users/simeon/projects/vuvenu/skills/* /Users/simeon/projects/vuvenu/docs/research-archive/ 2>/dev/null || echo "Skills copy completed"

echo "✅ Fichiers archivés dans /docs"
```

---

## ÉTAPE 2 : COPIER SKILLS VERS /src/lib/skills (VÉRIFIER)

```bash
# Vérifier skills sont bien dans src/lib/skills
ls -la /Users/simeon/projects/vuvenu/src/lib/skills/

# Devrait afficher :
# vuvenu-script-generator.md
# vuvenu-meta-ads-generator.md
# vuvenu-image-generator.md

# Si manquants :
# cp /Users/simeon/projects/vuvenu/skills/... /Users/simeon/projects/vuvenu/src/lib/skills/

echo "✅ Skills confirmés dans /src/lib/skills"
```

---

## ÉTAPE 3 : CRÉER DOCUMENTS D'INDEX

### 3.1 Créer PROJECT-SUMMARY.md

```bash
cat > /Users/simeon/projects/vuvenu/docs/PROJECT-SUMMARY.md << 'EOF'
# 🎯 VuVenu MVP - Résumé Exécutif

**SaaS B2B pour commerces locaux**

## Elevator Pitch
VuVenu permet aux gérants de petits commerces (restaurants, salons, boutiques, artisans) de créer du contenu marketing performant pour réseaux sociaux en quelques clics, sans expertise en digital. Plateforme tout-en-un : scripts vidéos viraux + campagnes Meta Ads + images IA.

## Timeline
- **Semaine 1** : Auth + DB + Onboarding + Dashboard
- **Semaine 2** : Script Generator + Meta Ads Generator complète
- **Semaine 3** : Stripe Payment + Landing + Légal
- **Semaine 4** : Wizard 7 étapes + Polish + LAUNCH

## Statut Actuel
- ✅ Phase 0 (Setup) : 100% complète
- ⏳ Phase 1 (Semaine 1) : En attente Ralph Loop
- ⏳ Phase 2-4 : À venir

## Ressources Essentielles
- **PRD** : `PRD-VuVenu-MVP.md` (45 User Stories)
- **Checklist** : `MASTER_CHECKLIST.md` (206 tâches)
- **Config** : `CLAUDE.md` (conventions, stack)
- **Exécution** : `docs/execution/EXECUTION-LOG.md`

## Prochaine Étape
→ Lancer Ralph Loop pour Semaine 1
EOF

echo "✅ PROJECT-SUMMARY.md créé"
```

### 3.2 Créer QUICK-START.md

````bash
cat > /Users/simeon/projects/vuvenu/docs/QUICK-START.md << 'EOF'
# 🚀 QUICK START - Lancer Ralph Loop

## Prérequis
- ✅ Node.js 18+
- ✅ npm run dev fonctionne
- ✅ npm run typecheck passe
- ✅ npm run lint passe
- ✅ Comptes créés (Supabase, Stripe, Anthropic, Gemini)

## Démarrer Développement

### Option 1 : Mode Assisté
```bash
cd /Users/simeon/projects/vuvenu

# Lancer serveur dev
npm run dev

# Dans autre terminal : Parler à Claude Code
# > Crée le système d'authentification Supabase
# > Configure les tables (profiles, scripts, campaigns)
# > etc.
````

### Option 2 : Ralph Loop (Autonome)

```bash
# Depuis Claude Code CLI
/ralph-vuvenu semaine-1 --max-iterations 50

# Ralph va automatiquement :
# - Créer auth Supabase
# - Créer DB schema + RLS
# - Créer onboarding
# - Créer dashboard layout
# - Tester à chaque étape
```

## Commandes Importantes

```bash
npm run dev         # Serveur local
npm run build       # Build production
npm run typecheck   # Vérify TS
npm run lint        # Vérify ESLint
```

## Documentation

- `PRD-VuVenu-MVP.md` : Comprendre la scope
- `MASTER_CHECKLIST.md` : Tracker les tâches
- `/docs/execution/EXECUTION-LOG.md` : Historique exécution
- `CLAUDE.md` : Conventions projet

## Support

Questions ? Voir :

- CLAUDE.md → Conventions
- PRD-VuVenu-MVP.md → Details User Stories
- MASTER_CHECKLIST.md → Tâche spécifique
  EOF

echo "✅ QUICK-START.md créé"

````

### 3.3 Créer VERSION-AUDIT.md

```bash
cat > /Users/simeon/projects/vuvenu/docs/technical/VERSION-AUDIT.md << 'EOF'
# 🔍 VERSION AUDIT

## Versions Clés

### Framework
- **Next.js** : 16.1.1 (confirmé package.json)
- **React** : 19.2.3
- **TypeScript** : 5.x

### Serveurs
- **Supabase** : 2.90.1
- **Stripe** : 20.1.2
- **Anthropic** : 0.71.2
- **Gemini** : 0.24.1

### Outils
- **Tailwind** : 4 (avec @tailwindcss/postcss)
- **ESLint** : 9
- **Prettier** : Configuré via ESLint

## Incohérences Résolues
- ❌ INIT-COMPLETE.md disait "Next.js 16.1.1" ✅ Confirmé
- ❌ CLAUDE.md disait "Next.js 14" ✅ Corrigé

## Statut TypeScript
- ✅ Mode strict activé
- ✅ Pas de `any` allowed
- ✅ @types/node, react, react-dom installés

## Decision Log
- **13/01/2026** : Versions verrouillées dans package.json
EOF

echo "✅ VERSION-AUDIT.md créé"
````

---

## ÉTAPE 4 : CRÉER STUB FILES TYPESCRIPT

```bash
# 4.1 Stubs Supabase
cat > /Users/simeon/projects/vuvenu/src/lib/supabase/client.ts << 'EOF'
// Supabase Browser Client
// À remplir en Semaine 1

export const createBrowserClient = () => {
  // TODO: Implémenter
  throw new Error('Not implemented yet');
};
EOF

cat > /Users/simeon/projects/vuvenu/src/lib/supabase/server.ts << 'EOF'
// Supabase Server Client
// À remplir en Semaine 1

export const createServerClient = () => {
  // TODO: Implémenter
  throw new Error('Not implemented yet');
};
EOF

# 4.2 Stubs AI
cat > /Users/simeon/projects/vuvenu/src/lib/ai/anthropic.ts << 'EOF'
// Anthropic Claude Client
// À remplir en Semaine 2

export const generateScript = async () => {
  // TODO: Implémenter
  throw new Error('Not implemented yet');
};
EOF

cat > /Users/simeon/projects/vuvenu/src/lib/ai/gemini.ts << 'EOF'
// Google Gemini Client
// À remplir en Semaine 2

export const generateImages = async () => {
  // TODO: Implémenter
  throw new Error('Not implemented yet');
};
EOF

# 4.3 Stubs Stripe
cat > /Users/simeon/projects/vuvenu/src/lib/stripe/client.ts << 'EOF'
// Stripe Client
// À remplir en Semaine 3

export const createCheckoutSession = async () => {
  // TODO: Implémenter
  throw new Error('Not implemented yet');
};
EOF

# 4.4 Types Database (stub)
cat > /Users/simeon/projects/vuvenu/src/types/database.ts << 'EOF'
// Database Types (à générer depuis Supabase CLI)
// Structure basée sur PRD schema

export interface Profile {
  id: string;
  business_name: string;
  business_type: string;
  // À ajouter : tous les champs
}

export interface Script {
  id: string;
  user_id: string;
  title: string;
  // À ajouter : tous les champs
}

export interface Campaign {
  id: string;
  user_id: string;
  title: string;
  // À ajouter : tous les champs
}
EOF

echo "✅ Stub files TypeScript créés"
```

---

## ÉTAPE 5 : NETTOYER .gitignore

```bash
# Vérifier .gitignore
cat > /Users/simeon/projects/vuvenu/.gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
.next/
out/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env.local
.env.*.local

# Vercel
.vercel

# IDE
.vscode/
.idea/
*.swp
*.swo

# Research Archive (volumineux, pas besoin repo)
docs/research-archive/

# Backups
~/backups-vuvenu/
EOF

echo "✅ .gitignore mis à jour"
```

---

## ÉTAPE 6 : VÉRIFIER BUILD & LINT

```bash
cd /Users/simeon/projects/vuvenu

# 6.1 TypeScript check
npm run typecheck
# Doit afficher : ✅ Pas d'erreurs

# 6.2 ESLint
npm run lint
# Doit afficher : ✅ Pas d'erreurs

# 6.3 Next.js dev
npm run dev &
sleep 5

# Tester http://localhost:3000 (ctrl+C pour arrêter)
curl -s http://localhost:3000 | head -20

pkill -f "next dev"

echo "✅ Build vérifié"
```

---

## ÉTAPE 7 : CRÉER NOUVEAU README.md

````bash
cat > /Users/simeon/projects/vuvenu/README.md << 'EOF'
# 🎯 VuVenu MVP

**SaaS B2B pour créer du contenu marketing performant pour commerces locaux.**

- 📹 **Script Generator** : Scripts vidéos viraux 30-60s
- 📢 **Meta Ads Generator** : Campagnes publicitaires complètes
- 🎨 **Image Generator** : Images optimisées Meta Ads

---

## 🚀 Démarrer

```bash
# Installation
npm install

# Développement
npm run dev

# Voir http://localhost:3000
````

---

## 📚 Documentation

- **[Résumé Exécutif](./docs/PROJECT-SUMMARY.md)** ← Commencer ici
- **[Quick Start](./docs/QUICK-START.md)** ← Lancer Ralph Loop
- **[PRD Complet](./PRD-VuVenu-MVP.md)** ← Comprendre MVP
- **[Checklist](./MASTER_CHECKLIST.md)** ← Tracker tâches
- **[Configuration Projet](./CLAUDE.md)** ← Conventions

---

## 🏗️ Stack

- **Framework** : Next.js 16 + TypeScript
- **UI** : Tailwind CSS + shadcn/ui
- **Auth** : Supabase
- **DB** : PostgreSQL (Supabase)
- **IA** : Claude 3.5 + Gemini 2
- **Payments** : Stripe
- **Deploy** : Vercel

---

## 📊 Timeline

| Phase         | Durée | Objectif               |
| ------------- | ----- | ---------------------- |
| **Semaine 1** | 5j    | Auth + DB + Onboarding |
| **Semaine 2** | 5j    | Core (Scripts + Ads)   |
| **Semaine 3** | 5j    | Payments + Landing     |
| **Semaine 4** | 5j    | Polish + Launch        |

---

## 🎯 Objectif

Atteindre PMF (Product-Market Fit) avec commerces locaux réunionnais via une plateforme qui simplifie la création de contenu viral.

---

_Projet VuVenu MVP V1 - Lanché 13 janvier 2026_
EOF

echo "✅ README.md créé"

````

---

## ÉTAPE 8 : GIT COMMIT & CLEANUP FINAL

```bash
cd /Users/simeon/projects/vuvenu

# 8.1 Vérifier status
git status

# 8.2 Ajouter tous les changements
git add -A

# 8.3 Commit
git commit -m "chore: Complete project cleanup and documentation reorganization

- Archive /skills research to /docs/research-archive
- Consolidate INIT, SETUP, JOURNAL into single EXECUTION-LOG
- Create /docs structure (execution, branding, prompts, technical)
- Add PROJECT-SUMMARY and QUICK-START guides
- Create TypeScript stub files for empty modules
- Update README with minimal but clear info
- Clean .gitignore
- All builds pass: typecheck, lint, dev server

Ralph Loop Ready ✅"

# 8.4 Vérifier commit
git log -1 --stat

echo "✅ Git commit complété"
````

---

## ÉTAPE 9 : SUPPRESSION DES FICHIERS ARCHIVÉS

```bash
# 9.1 SAUVEGARDER D'ABORD (fait en Étape 0)
# Vérifier backup existe
ls -la ~/backups-vuvenu/

# 9.2 Supprimer fichiers dupliqués
rm /Users/simeon/projects/vuvenu/INIT-COMPLETE.md
rm /Users/simeon/projects/vuvenu/CLAUDE-SETUP-COMPLETE.md
rm /Users/simeon/projects/vuvenu/JOURNAL.md
rm /Users/simeon/projects/vuvenu/BRANDING-VUVENU-BRIEF.md
rm /Users/simeon/projects/vuvenu/MEGA-PROMPT-GEMINI.md
rm /Users/simeon/projects/vuvenu/WORKFLOW-VUVENU.md
rm /Users/simeon/projects/vuvenu/SKILLS-INTEGRATION-COMPLETE.md

# 9.3 Supprimer /skills (après archivage)
rm -rf /Users/simeon/projects/vuvenu/skills/

# 9.4 Vérifier nettoyage
ls -la /Users/simeon/projects/vuvenu/*.md

# Devrait afficher seulement :
# CLAUDE.md
# CLAUDE-SETUP-COMPLETE.md (peut rester, c'est OK)
# CLEANUP-ANALYSIS.md
# CLEANUP-ACTION-PLAN.md
# MASTER_CHECKLIST.md
# PRD-VuVenu-MVP.md
# README.md

echo "✅ Fichiers dupliqués supprimés"
```

---

## ÉTAPE 10 : COMMIT FINAL & VÉRIFICATION

```bash
cd /Users/simeon/projects/vuvenu

# 10.1 Add suppression
git add -A

# 10.2 Commit suppression
git commit -m "chore: Remove archived documentation files

Removed:
- INIT-COMPLETE.md (merged to EXECUTION-LOG)
- CLAUDE-SETUP-COMPLETE.md (merged)
- JOURNAL.md (merged)
- BRANDING-VUVENU-BRIEF.md (moved to docs/branding)
- MEGA-PROMPT-GEMINI.md (moved to docs/prompts)
- WORKFLOW-VUVENU.md (moved to docs/deprecated)
- SKILLS-INTEGRATION-COMPLETE.md (info in docs)
- /skills/ (archived to docs/research-archive)"

# 10.3 Vérifier structure finale
echo "=== Structure Projet Finale ==="
find /Users/simeon/projects/vuvenu -maxdepth 1 -type f -name "*.md" | sort

echo ""
echo "=== Vérifications Build ==="
npm run typecheck && echo "✅ TypeScript OK"
npm run lint && echo "✅ ESLint OK"

echo ""
echo "=== Git Status ==="
git status

echo "✅ NETTOYAGE COMPLET"
```

---

## ÉTAPE 11 : FUSIONNER SUR MAIN

```bash
# 11.1 Retourner à main
git checkout main

# 11.2 Merger cleanup
git merge cleanup/docs-reorganization

# 11.3 Vérifier
git log --oneline | head -5

echo "✅ Merged to main - PRÊT POUR RALPH"
```

---

## ✅ CHECKLIST FINALE

```
PRÉ-NETTOYAGE
✅ Branche cleanup créée
✅ Backup sécurité

BLOC 1 : Archive & Suppression
✅ /docs structure créée
✅ Fichiers archivés dans /docs
✅ EXECUTION-LOG fusionné
✅ /skills copié dans /docs/research-archive

BLOC 2 : Nouveaux Documents
✅ PROJECT-SUMMARY.md créé
✅ QUICK-START.md créé
✅ VERSION-AUDIT.md créé

BLOC 3 : Stub Files
✅ src/lib/supabase/*.ts stubs
✅ src/lib/ai/*.ts stubs
✅ src/lib/stripe/*.ts stubs
✅ src/types/database.ts stub

BLOC 4 : Build Validation
✅ npm run typecheck passe
✅ npm run lint passe
✅ npm run dev fonctionne

BLOC 5 : Git & Cleanup
✅ .gitignore mis à jour
✅ README.md créé
✅ Commits finis
✅ Merged to main

RÉSULTAT FINAL
✅ Structure /docs organisée
✅ 0 fichiers MD dupliqués
✅ 0 erreurs TypeScript
✅ Ralph Loop Ready 🚀
```

---

## 🎯 PROCHAINE ÉTAPE

```bash
# Lancer Ralph Loop pour Semaine 1
/ralph-vuvenu semaine-1 --max-iterations 50

# Ou mode assisté
npm run dev
# > Crée l'authentification Supabase
# > Configure les tables et RLS
# > etc.
```

---

_Plan d'action créé : 13 janvier 2026_
_Durée estimée : 4-5 heures_
_Résultat : 100% Ready for Ralph_
