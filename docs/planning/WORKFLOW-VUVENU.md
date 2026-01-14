# 🚀 WORKFLOW COMPLET VUVENU - DE A À Z

> Ce document décrit les étapes EXACTES dans l'ordre pour lancer VuVenu.
> Chaque étape a des critères de validation clairs.
> Utilisable en mode assisté ou avec Ralph Loop.

---

## 📊 VUE D'ENSEMBLE

```
PHASE 0: SETUP (Toi + Claude)
    ↓
PHASE 1: BRANDING (Toi avec Gemini)
    ↓
PHASE 2: DEVELOPMENT (Claude Code + Ralph)
    ↓
PHASE 3: TESTS & POLISH
    ↓
🚀 LAUNCH
```

**Durée totale estimée** : 4 semaines
**Objectif** : MVP fonctionnel avec premiers clients payants

---

## PHASE 0 : SETUP (Jour 1)

### 0.1 Prérequis ✅ (FAIT)

| Tâche                      | Statut |
| -------------------------- | ------ |
| Compte GitHub              | ✅     |
| Compte Vercel              | ✅     |
| Compte Supabase            | ✅     |
| Compte Stripe              | ✅     |
| Clé API Anthropic          | ✅     |
| Clé API Google AI (Gemini) | ✅     |
| Node.js 18+ installé       | ✅     |
| Claude Code installé       | ✅     |

### 0.2 Fichiers de configuration ✅ (FAIT)

| Fichier             | Description                      | Statut |
| ------------------- | -------------------------------- | ------ |
| CLAUDE.md           | Instructions projet Claude Code  | ✅     |
| .mcp.json           | Configuration MCP servers        | ✅     |
| .env.local.example  | Template variables environnement | ✅     |
| PRD-VuVenu-MVP.md   | Product Requirements Document    | ✅     |
| MASTER_CHECKLIST.md | 206 tâches détaillées            | ✅     |
| Guide Claude Code   | Document maître 16 sections      | ✅     |

### 0.3 Initialisation projet (À FAIRE SUR TON ORDI)

```bash
# 1. Créer le dossier projet
mkdir -p ~/projects/vuvenu
cd ~/projects/vuvenu

# 2. Copier les fichiers de config téléchargés
# (CLAUDE.md, .mcp.json, .env.local.example, PRD, MASTER_CHECKLIST)

# 3. Initialiser Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 4. Installer les dépendances de base
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install stripe @stripe/stripe-js
npm install @anthropic-ai/sdk
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install -D @types/node

# 5. Installer shadcn/ui
npx shadcn-ui@latest init
# Répondre: TypeScript, Default style, Slate, CSS variables: yes

# 6. Configurer le .env.local
cp .env.local.example .env.local
# Remplir avec tes vraies clés

# 7. Initialiser Git
git init
git add .
git commit -m "chore: initial setup with Next.js 14"

# 8. Créer repo GitHub et push
gh repo create vuvenu --private --source=. --push

# 9. Lancer Claude Code
claude
```

**Validation Phase 0** :

- [ ] `npm run dev` fonctionne
- [ ] Page localhost:3000 s'affiche
- [ ] Repo GitHub créé
- [ ] Claude Code se lance sans erreur

---

## PHASE 1 : BRANDING (Jour 2-3)

### 1.1 Génération du logo

**Outil** : Gemini (ou autre IA image)

**Prompt à utiliser** (copier depuis BRANDING-VUVENU-BRIEF.md section 5.1)

**Critères de validation** :

- [ ] Logo reconnaissable en petit (favicon)
- [ ] Fonctionne en monochrome
- [ ] Déclinaisons : complet, compact, favicon, blanc, noir

### 1.2 Génération du hero landing page

**Outil** : Gemini

**Prompt à utiliser** (section 5.2 du brief)

**Ce qu'on obtient** : Maquette visuelle du hero

### 1.3 Génération du dashboard

**Outil** : Gemini

**Prompt à utiliser** (section 5.3 du brief)

**Ce qu'on obtient** : Maquette visuelle du dashboard

### 1.4 Export des assets

**Fichiers à préparer** :

```
/public
  /images
    logo.svg
    logo-white.svg
    logo-dark.svg
    favicon.ico
    og-image.png (1200x630)
```

**Validation Phase 1** :

- [ ] Logo final validé
- [ ] Maquette hero validée
- [ ] Maquette dashboard validée
- [ ] Tous les fichiers exportés dans /public

---

## PHASE 2 : DÉVELOPPEMENT (Semaines 1-3)

### Mode opératoire

Tu as **deux options** :

**Option A : Mode Assisté**

```bash
# Dans Claude Code, donner des instructions une par une
> Crée le composant Header avec le logo
> Configure Supabase Auth
> Crée la page de login
```

**Option B : Mode Ralph (Autonome)**

```bash
# Lancer Ralph avec le PRD
/ralph-vuvenu semaine-1-foundations
# Ralph travaille pendant que tu dors
```

### Semaine 1 : Foundations

| Jour  | Focus      | Tâches principales                              |
| ----- | ---------- | ----------------------------------------------- |
| J1-J2 | Auth       | Setup Supabase, Login, Register, Reset password |
| J3    | Onboarding | Wizard 4 étapes (business info, objectifs)      |
| J4    | Layout     | Dashboard shell, Sidebar, Header                |
| J5    | Profil     | Page paramètres, gestion compte                 |

**Commande Ralph** :

```bash
/ralph-vuvenu semaine-1 --max-iterations 50
```

**Validation Semaine 1** :

- [ ] Un utilisateur peut s'inscrire
- [ ] Un utilisateur peut se connecter
- [ ] L'onboarding capture les infos business
- [ ] Le dashboard s'affiche avec sidebar
- [ ] TypeScript compile sans erreur
- [ ] Tests passent

### Semaine 2 : Core Product

| Jour  | Focus         | Tâches principales                               |
| ----- | ------------- | ------------------------------------------------ |
| J1-J2 | Scripts Vidéo | Formulaire, appel API Claude, affichage résultat |
| J3-J4 | Meta Ads      | Formulaire campagne, génération concepts         |
| J5    | Images IA     | Intégration Gemini pour visuels ads              |

**Commande Ralph** :

```bash
/ralph-vuvenu semaine-2 --max-iterations 60
```

**Validation Semaine 2** :

- [ ] Génération de script vidéo fonctionne
- [ ] Résultat s'affiche correctement
- [ ] Bouton copier fonctionne
- [ ] Formulaire Meta Ads complet
- [ ] Concepts TOF/MOF/BOF générés
- [ ] Images générées par Gemini

### Semaine 3 : Paiement + Landing

| Jour  | Focus   | Tâches principales                     |
| ----- | ------- | -------------------------------------- |
| J1-J2 | Stripe  | Produits, Checkout, Portal, Webhooks   |
| J3-J4 | Landing | Hero, Features, Pricing, FAQ           |
| J5    | Legal   | CGV, Confidentialité, Mentions légales |

**Commande Ralph** :

```bash
/ralph-vuvenu semaine-3 --max-iterations 50
```

**Validation Semaine 3** :

- [ ] Paiement Stripe fonctionne (mode test)
- [ ] Webhooks reçus et traités
- [ ] Limites par plan respectées
- [ ] Landing page complète
- [ ] Responsive mobile
- [ ] Pages légales présentes

---

## PHASE 3 : TESTS & POLISH (Semaine 4)

### 3.1 Wizard 7 étapes (Différenciation clé)

Le wizard guidé est ce qui différencie VuVenu de Canva+ChatGPT.

**Étapes du wizard Meta Ads** :

1. Type de commerce
2. Produit/Service à promouvoir
3. Objectif de la campagne
4. Budget et durée
5. Audience cible
6. Sélection des concepts générés
7. Personnalisation des images

**Validation** :

- [ ] Chaque étape a des explications claires
- [ ] Progression visible
- [ ] Retour en arrière possible
- [ ] Aide contextuelle disponible

### 3.2 Tests E2E

```bash
# Avec Playwright via MCP
/test-vuvenu e2e
```

**Scénarios à tester** :

- [ ] Parcours inscription complet
- [ ] Génération script vidéo
- [ ] Création campagne Meta Ads
- [ ] Paiement et upgrade
- [ ] Gestion compte

### 3.3 Beta test

**Recruter 3-5 testeurs** :

- 1 restaurateur
- 1 salon de coiffure
- 1 boutique
- 1-2 autres commerces

**Collecter feedback sur** :

- Facilité d'utilisation
- Qualité des scripts générés
- Qualité des concepts ads
- Bugs rencontrés
- Suggestions

### 3.4 Corrections finales

- [ ] Fix bugs critiques
- [ ] Améliorer UX selon feedback
- [ ] Optimiser performance
- [ ] Vérifier SEO de base
- [ ] Tester sur mobile réel

---

## 🚀 LAUNCH

### Checklist pré-lancement

**Technique** :

- [ ] Domaine configuré (vuvenu.fr ou seencome.com)
- [ ] SSL actif
- [ ] Variables env production
- [ ] Stripe en mode live
- [ ] Emails transactionnels fonctionnels

**Contenu** :

- [ ] Landing page finalisée
- [ ] Pages légales complètes
- [ ] FAQ à jour
- [ ] Emails de bienvenue prêts

**Marketing** :

- [ ] Compte Instagram créé
- [ ] Premiers posts prêts
- [ ] Liste de prospects identifiée
- [ ] Offre de lancement définie (promo ?)

### Jour J

```bash
# 1. Déployer en production
vercel --prod

# 2. Vérifier que tout fonctionne
# 3. Annoncer sur les réseaux
# 4. Envoyer aux beta testeurs
# 5. Commencer la prospection
```

### Post-lancement

- [ ] Monitorer les erreurs (Vercel logs)
- [ ] Répondre rapidement aux premiers utilisateurs
- [ ] Collecter les témoignages
- [ ] Itérer selon feedback

---

## 📋 RÉCAPITULATIF COMMANDES RALPH

```bash
# Setup initial (une fois)
/test-vuvenu              # Vérifier l'environnement

# Développement par semaine
/ralph-vuvenu semaine-1 --max-iterations 50
/ralph-vuvenu semaine-2 --max-iterations 60
/ralph-vuvenu semaine-3 --max-iterations 50
/ralph-vuvenu semaine-4 --max-iterations 40

# Reviews
/review-vuvenu            # Code review automatique
/commit-vuvenu            # Commit conventionnel

# Tests
/test-vuvenu e2e          # Tests end-to-end
```

---

## ⚠️ POINTS D'ATTENTION

### Erreurs courantes à éviter

1. **Sauter le branding** → L'UI sera générique et peu engageante
2. **Négliger le wizard** → Pas de différenciation vs concurrence
3. **Oublier les limites par plan** → Utilisateurs frustrés
4. **Pas tester sur mobile** → 70% du trafic local est mobile
5. **Lancer sans beta test** → Bugs embarrassants en production

### Questions en attente (à décider)

| Question        | Options                       | Décision  |
| --------------- | ----------------------------- | --------- |
| Trial gratuit ? | A) Non / B) 7 jours           | À décider |
| Support ?       | A) Email seul / B) + WhatsApp | À décider |
| Domaine ?       | vuvenu.fr / seencome.com      | À décider |

---

## 📅 PLANNING SYNTHÉTIQUE

| Semaine | Focus              | Livrables                          |
| ------- | ------------------ | ---------------------------------- |
| **S0**  | Setup + Branding   | Projet initialisé, logo, maquettes |
| **S1**  | Foundations        | Auth, Onboarding, Dashboard        |
| **S2**  | Core Product       | Scripts, Meta Ads, Images IA       |
| **S3**  | Paiement + Landing | Stripe, Landing, Legal             |
| **S4**  | Polish + Launch    | Wizard, Tests, Beta, 🚀            |

---

_Workflow créé le 13 janvier 2026_
_Conçu pour être utilisé avec Claude Code + Ralph Loop_
