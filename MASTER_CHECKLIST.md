# 📋 VUVENU MVP - MASTER CHECKLIST

> **Règle absolue** : Après chaque tâche complétée, mettre à jour JOURNAL.md puis passer à la tâche suivante automatiquement.

---

## PHASE 0 - SETUP ENVIRONNEMENT

_Objectif : Tout préparer avant de coder_

### 0.1 Vérification Prérequis Utilisateur

- [ ] **0.1.1** Confirmer compte GitHub créé
- [ ] **0.1.2** Confirmer compte Vercel créé (connecté à GitHub)
- [ ] **0.1.3** Confirmer compte Supabase créé
- [ ] **0.1.4** Confirmer compte Stripe créé
- [ ] **0.1.5** Confirmer clé API Anthropic obtenue
- [ ] **0.1.6** Confirmer clé API Google AI (Gemini) obtenue
- [ ] **0.1.7** Confirmer domaine réservé (vuvenu.fr ou autre)
- [ ] **0.1.8** Confirmer Node.js 18+ installé
- [ ] **0.1.9** Confirmer Claude Code installé et fonctionnel

### 0.2 Fichiers de Configuration

- [ ] **0.2.1** Créer CLAUDE.md (config projet)
- [ ] **0.2.2** Créer .mcp.json (serveurs MCP)
- [ ] **0.2.3** Créer .env.local.example (template variables)

### 0.3 Initialisation Projet

- [ ] **0.3.1** Créer projet Next.js 14 avec TypeScript
- [ ] **0.3.2** Configurer Tailwind CSS
- [ ] **0.3.3** Installer shadcn/ui
- [ ] **0.3.4** Configurer structure dossiers selon PRD
- [ ] **0.3.5** Setup ESLint + Prettier
- [ ] **0.3.6** Créer .gitignore approprié

### 0.4 Setup Services Externes

- [ ] **0.4.1** Créer repo GitHub + premier push
- [ ] **0.4.2** Connecter Vercel au repo
- [ ] **0.4.3** Créer projet Supabase
- [ ] **0.4.4** Créer tables + RLS dans Supabase
- [ ] **0.4.5** Créer produits Stripe (3 plans)
- [ ] **0.4.6** Configurer variables d'environnement Vercel

---

## SEMAINE 1 - FOUNDATIONS

_Objectif : Auth, DB, Onboarding, Dashboard_

### 1.1 Authentification (US-001 à US-004)

- [ ] **1.1.1** Installer @supabase/supabase-js + @supabase/ssr
- [ ] **1.1.2** Créer lib/supabase/client.ts (browser)
- [ ] **1.1.3** Créer lib/supabase/server.ts (server)
- [ ] **1.1.4** Créer middleware.ts (protection routes)
- [ ] **1.1.5** Page /register - formulaire inscription
- [ ] **1.1.6** Page /login - formulaire connexion
- [ ] **1.1.7** Page /forgot-password - demande reset
- [ ] **1.1.8** Page /reset-password - nouveau mot de passe
- [ ] **1.1.9** Page /verify-email - confirmation
- [ ] **1.1.10** Tester flux complet auth
- [ ] **1.1.11** Composant AuthButton (login/logout)

### 1.2 Base de Données (Schema)

- [ ] **1.2.1** Créer migration 001_initial_schema.sql
- [ ] **1.2.2** Table profiles
- [ ] **1.2.3** Table scripts
- [ ] **1.2.4** Table campaigns
- [ ] **1.2.5** Table campaign_concepts
- [ ] **1.2.6** Configurer Row Level Security
- [ ] **1.2.7** Créer trigger auto-création profile
- [ ] **1.2.8** Générer types TypeScript depuis Supabase
- [ ] **1.2.9** Tester RLS fonctionne

### 1.3 Onboarding (US-005)

- [ ] **1.3.1** Page /onboarding avec 4 étapes
- [ ] **1.3.2** Étape 1 : Nom du commerce
- [ ] **1.3.3** Étape 2 : Type d'activité
- [ ] **1.3.4** Étape 3 : Cible client
- [ ] **1.3.5** Étape 4 : Objectif principal
- [ ] **1.3.6** Barre de progression
- [ ] **1.3.7** Sauvegarde dans profiles
- [ ] **1.3.8** Redirection vers /choose-plan
- [ ] **1.3.9** Tester flux complet onboarding

### 1.4 Layout Dashboard (US-007, US-008)

- [ ] **1.4.1** Layout /app/(dashboard)/layout.tsx
- [ ] **1.4.2** Composant Sidebar
- [ ] **1.4.3** Composant Header
- [ ] **1.4.4** Navigation active state
- [ ] **1.4.5** Responsive (mobile hamburger)
- [ ] **1.4.6** Page /dashboard - vue d'ensemble
- [ ] **1.4.7** Cards actions rapides
- [ ] **1.4.8** Section dernières créations (vide pour l'instant)
- [ ] **1.4.9** Affichage plan + usage
- [ ] **1.4.10** Tester dashboard complet

### 1.5 Tests & Buffer Semaine 1

- [ ] **1.5.1** Test inscription → vérification → connexion
- [ ] **1.5.2** Test onboarding complet
- [ ] **1.5.3** Test protection routes (non connecté → redirect)
- [ ] **1.5.4** Fix bugs critiques
- [ ] **1.5.5** Commit + push "Semaine 1 complète"

---

## SEMAINE 2 - CORE PRODUCT

_Objectif : Scripts Vidéos + Meta Ads Generator_

### 2.1 Générateur Scripts - UI (US-009)

- [ ] **2.1.1** Page /scripts/new
- [ ] **2.1.2** Formulaire avec validation Zod
- [ ] **2.1.3** Champ description (textarea)
- [ ] **2.1.4** Select format (30s/60s)
- [ ] **2.1.5** Select ton (3 options)
- [ ] **2.1.6** Section optionnelle dépliable
- [ ] **2.1.7** Bouton générer (disabled si invalide)
- [ ] **2.1.8** Vérification limite avant submit

### 2.2 Générateur Scripts - API (US-010, US-011)

- [ ] **2.2.1** Créer lib/ai/anthropic.ts
- [ ] **2.2.2** Créer lib/ai/prompts/script-video.ts
- [ ] **2.2.3** Route API /api/generate/script
- [ ] **2.2.4** Intégration Claude 3.5 Sonnet
- [ ] **2.2.5** Parsing réponse (Accroche/Corps/CTA)
- [ ] **2.2.6** Affichage script formaté
- [ ] **2.2.7** Bouton copier (clipboard API)
- [ ] **2.2.8** Bouton régénérer
- [ ] **2.2.9** Loader pendant génération
- [ ] **2.2.10** Gestion erreurs API

### 2.3 Générateur Scripts - Persistance (US-012, US-013, US-014)

- [ ] **2.3.1** Bouton sauvegarder → insert DB
- [ ] **2.3.2** Incrémenter scripts_count_month
- [ ] **2.3.3** Toast confirmation
- [ ] **2.3.4** Page /scripts - liste
- [ ] **2.3.5** Card script avec titre, format, date
- [ ] **2.3.6** Page /scripts/[id] - détail
- [ ] **2.3.7** Bouton supprimer avec confirmation
- [ ] **2.3.8** Pagination si > 10
- [ ] **2.3.9** État vide avec CTA
- [ ] **2.3.10** Tester flux complet scripts

### 2.4 Meta Ads - UI (US-015)

- [ ] **2.4.1** Page /campaigns/new
- [ ] **2.4.2** Vérification plan Pro/Business
- [ ] **2.4.3** Message upgrade si Starter
- [ ] **2.4.4** Formulaire avec validation Zod
- [ ] **2.4.5** Champs obligatoires (produit, type, budget, objectif)
- [ ] **2.4.6** Champs optionnels (CPA, URL, prix, USPs)
- [ ] **2.4.7** Bouton générer

### 2.5 Meta Ads - Génération Concepts (US-016)

- [ ] **2.5.1** Créer lib/ai/prompts/meta-ads-campaign.ts
- [ ] **2.5.2** Adapter prompt depuis skill existante
- [ ] **2.5.3** Route API /api/generate/campaign
- [ ] **2.5.4** Génération 3 concepts (TOF/MOF/BOF)
- [ ] **2.5.5** Parsing réponse structurée
- [ ] **2.5.6** Loader avec étapes

### 2.6 Meta Ads - Génération Images (US-017)

- [ ] **2.6.1** Créer lib/ai/gemini.ts
- [ ] **2.6.2** Créer lib/ai/prompts/meta-ads-images.ts
- [ ] **2.6.3** Route API /api/generate/images
- [ ] **2.6.4** Intégration Gemini Imagen
- [ ] **2.6.5** Upload images vers Supabase Storage
- [ ] **2.6.6** Retourner URLs publiques
- [ ] **2.6.7** Gestion erreurs + fallback

### 2.7 Meta Ads - Affichage & Persistance (US-018, US-019, US-020)

- [ ] **2.7.1** Affichage 3 concepts en cards
- [ ] **2.7.2** Image + textes par concept
- [ ] **2.7.3** Boutons copier individuels
- [ ] **2.7.4** Télécharger image individuelle
- [ ] **2.7.5** Télécharger ZIP toutes images
- [ ] **2.7.6** Bouton sauvegarder campagne
- [ ] **2.7.7** Incrémenter campaigns_count_month
- [ ] **2.7.8** Page /campaigns - liste
- [ ] **2.7.9** Page /campaigns/[id] - détail
- [ ] **2.7.10** Tester flux complet Meta Ads

### 2.8 Tests & Buffer Semaine 2

- [ ] **2.8.1** Test génération script bout en bout
- [ ] **2.8.2** Test génération campagne bout en bout
- [ ] **2.8.3** Test limites par plan
- [ ] **2.8.4** Fix bugs critiques
- [ ] **2.8.5** Commit + push "Semaine 2 complète"

---

## SEMAINE 3 - PAYMENT + MARKETING

_Objectif : Stripe, Landing, Légal_

### 3.1 Stripe Setup

- [ ] **3.1.1** Installer stripe + @stripe/stripe-js
- [ ] **3.1.2** Créer lib/stripe/client.ts
- [ ] **3.1.3** Créer lib/stripe/config.ts (IDs produits)
- [ ] **3.1.4** Vérifier produits créés dans Stripe Dashboard
- [ ] **3.1.5** Configurer Customer Portal dans Stripe

### 3.2 Checkout Flow (US-032)

- [ ] **3.2.1** Page /choose-plan
- [ ] **3.2.2** Cards 3 plans avec toggle mensuel/annuel
- [ ] **3.2.3** Route API /api/stripe/checkout
- [ ] **3.2.4** Création session Checkout
- [ ] **3.2.5** Redirection vers Stripe
- [ ] **3.2.6** Page /success (retour après paiement)
- [ ] **3.2.7** Tester checkout complet

### 3.3 Webhooks Stripe (US-033)

- [ ] **3.3.1** Route API /api/webhooks/stripe
- [ ] **3.3.2** Vérification signature
- [ ] **3.3.3** Handler checkout.session.completed
- [ ] **3.3.4** Handler customer.subscription.updated
- [ ] **3.3.5** Handler customer.subscription.deleted
- [ ] **3.3.6** Handler invoice.payment_failed
- [ ] **3.3.7** Mise à jour profiles en DB
- [ ] **3.3.8** Tester avec Stripe CLI

### 3.4 Customer Portal (US-030)

- [ ] **3.4.1** Route API /api/stripe/portal
- [ ] **3.4.2** Bouton "Gérer abonnement" dans settings
- [ ] **3.4.3** Redirection vers portal
- [ ] **3.4.4** Retour vers VuVenu
- [ ] **3.4.5** Tester upgrade/downgrade/cancel

### 3.5 Limites par Plan (US-034, US-035)

- [ ] **3.5.1** Fonction checkLimit(userId, type)
- [ ] **3.5.2** Fonction incrementUsage(userId, type)
- [ ] **3.5.3** Fonction resetMonthlyCounters(userId)
- [ ] **3.5.4** Modal "Limite atteinte"
- [ ] **3.5.5** Lien upgrade dans modal
- [ ] **3.5.6** Affichage usage dans dashboard
- [ ] **3.5.7** Tester blocage à la limite

### 3.6 Landing Page (US-036 à US-041)

- [ ] **3.6.1** Layout /(marketing)/layout.tsx
- [ ] **3.6.2** Header marketing (logo + CTA)
- [ ] **3.6.3** Hero section
- [ ] **3.6.4** Section bénéfices (4 cards)
- [ ] **3.6.5** Section "Comment ça marche" (3 étapes)
- [ ] **3.6.6** Section témoignages (placeholder)
- [ ] **3.6.7** Section pricing (réutiliser composant)
- [ ] **3.6.8** Section FAQ (accordion)
- [ ] **3.6.9** Footer
- [ ] **3.6.10** Responsive mobile
- [ ] **3.6.11** Tester landing complète

### 3.7 Pages Légales (US-043 à US-045)

- [ ] **3.7.1** Page /cgv
- [ ] **3.7.2** Page /confidentialite
- [ ] **3.7.3** Page /mentions-legales
- [ ] **3.7.4** Liens dans footer
- [ ] **3.7.5** Contenu adapté VuVenu

### 3.8 Tests & Buffer Semaine 3

- [ ] **3.8.1** Test checkout → activation compte
- [ ] **3.8.2** Test webhooks (tous événements)
- [ ] **3.8.3** Test limites bloquent bien
- [ ] **3.8.4** Test landing responsive
- [ ] **3.8.5** Fix bugs critiques
- [ ] **3.8.6** Commit + push "Semaine 3 complète"

---

## SEMAINE 4 - POLISH + LAUNCH

_Objectif : Wizard, Tests, Beta, LAUNCH_

### 4.1 Wizard Étapes 1-3 (US-021 à US-023)

- [ ] **4.1.1** Page /campaigns/[id]/launch
- [ ] **4.1.2** Composant WizardContainer
- [ ] **4.1.3** Composant WizardStep
- [ ] **4.1.4** Barre progression (7 étapes)
- [ ] **4.1.5** Étape 1 : Téléchargement créatives
- [ ] **4.1.6** Génération ZIP images
- [ ] **4.1.7** Étape 2 : Ouvrir Meta Ads Manager
- [ ] **4.1.8** Étape 3 : Créer la campagne
- [ ] **4.1.9** Boutons copier paramètres

### 4.2 Wizard Étapes 4-7 (US-024 à US-027)

- [ ] **4.2.1** Étape 4 : Configurer audience
- [ ] **4.2.2** Étape 5 : Ajouter publicités
- [ ] **4.2.3** Copier textes par concept
- [ ] **4.2.4** Étape 6 : Vérification finale
- [ ] **4.2.5** Checklist visuelle
- [ ] **4.2.6** Étape 7 : Succès + confettis
- [ ] **4.2.7** Mise à jour statut "launched"
- [ ] **4.2.8** Sauvegarde progression (US-028)

### 4.3 Page Paramètres (US-029)

- [ ] **4.3.1** Page /settings
- [ ] **4.3.2** Section "Mon commerce"
- [ ] **4.3.3** Section "Mot de passe"
- [ ] **4.3.4** Section "Abonnement"
- [ ] **4.3.5** Bouton Stripe Portal
- [ ] **4.3.6** Toast confirmations

### 4.4 Tests End-to-End

- [ ] **4.4.1** Test parcours complet nouveau user
- [ ] **4.4.2** Test génération script (tous formats)
- [ ] **4.4.3** Test génération campagne complète
- [ ] **4.4.4** Test wizard 7 étapes
- [ ] **4.4.5** Test upgrade plan
- [ ] **4.4.6** Test limites atteintes
- [ ] **4.4.7** Test mobile (responsive)
- [ ] **4.4.8** Test emails (vérification, reset)

### 4.5 Fix & Optimisation

- [ ] **4.5.1** Fix tous bugs critiques
- [ ] **4.5.2** Fix bugs majeurs
- [ ] **4.5.3** Optimisation images (next/image)
- [ ] **4.5.4** Optimisation loading states
- [ ] **4.5.5** SEO basique (meta tags)
- [ ] **4.5.6** Favicon + OG images

### 4.6 Beta Test

- [ ] **4.6.1** Inviter 3-5 clients existants
- [ ] **4.6.2** Collecter feedback
- [ ] **4.6.3** Prioriser retours
- [ ] **4.6.4** Fix feedback critique
- [ ] **4.6.5** Valider avec beta testeurs

### 4.7 Launch Preparation

- [ ] **4.7.1** Configurer domaine production
- [ ] **4.7.2** Variables env production
- [ ] **4.7.3** Webhooks Stripe production
- [ ] **4.7.4** Emails transactionnels configurés
- [ ] **4.7.5** Monitoring/alertes basiques
- [ ] **4.7.6** Backup stratégie

### 4.8 🚀 LAUNCH

- [ ] **4.8.1** Deploy production final
- [ ] **4.8.2** Test smoke production
- [ ] **4.8.3** Annonce aux beta testeurs
- [ ] **4.8.4** Post réseaux sociaux
- [ ] **4.8.5** 🎉 C'EST LIVE !

---

## 📊 PROGRESS TRACKER

| Phase                           | Tâches  | Complétées | %      |
| ------------------------------- | ------- | ---------- | ------ |
| Phase 0 - Setup                 | 24      | 0          | 0%     |
| Semaine 1 - Foundations         | 45      | 0          | 0%     |
| Semaine 2 - Core Product        | 54      | 0          | 0%     |
| Semaine 3 - Payment + Marketing | 42      | 0          | 0%     |
| Semaine 4 - Polish + Launch     | 41      | 0          | 0%     |
| **TOTAL**                       | **206** | **0**      | **0%** |

---

## 🎯 CURRENT TASK

**En cours** : 0.1.1 - Confirmer compte GitHub créé

**Prochaine** : 0.1.2 - Confirmer compte Vercel créé

---

_Dernière mise à jour : 13 janvier 2026 - 10:45_
