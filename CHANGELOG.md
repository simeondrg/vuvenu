# Changelog

Historique des versions de VuVenu.

## [1.0.0] - 2026-01-14

### 🎉 Lancement MVP Production Ready

#### Ajouté
- **Authentification complète** (Supabase)
  - Login / Register
  - Forgot password
  - Reset password
  - Email verification
  - Onboarding guidé

- **Générateur de Scripts Vidéos**
  - Génération IA avec Claude 3.5 Sonnet
  - Secteurs multiples (restaurants, coiffure, fitness, etc.)
  - Formats 30-60 secondes
  - Historique et sauvegarde

- **Générateur Campagnes Meta Ads**
  - Wizard 7 étapes complet
  - Génération 5 concepts automatiques
  - Images IA avec Gemini Imagen 3
  - Export CSV/JSON/PDF
  - Guide de publication

- **Gestion Abonnements**
  - 3 plans : Starter (59€), Pro (119€), Business (249€)
  - Customer Portal Stripe
  - Webhooks complets
  - Upgrade/downgrade
  - Historique paiements

- **Dashboard & Analytics**
  - Vue d'ensemble activité
  - Analytics avancé
  - Utilisation mensuelle
  - Statistiques temps réel

- **Documentation Complète**
  - README professionnel
  - Guide setup Supabase
  - Guide setup Stripe
  - Checklist déploiement production
  - API Reference

#### Technique
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- RLS Supabase
- Rate limiting APIs
- Circuit breakers
- Error handling robuste
- SEO optimisé
- Responsive mobile-first

#### Documentation
- 📚 Documentation technique complète
- 📋 CONFIGURATION-CHECKLIST.md (564 lignes)
- 🎯 Guides setup détaillés
- 📊 Rapports de développement

---

## Format

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

Types de changements :
- **Ajouté** : nouvelles fonctionnalités
- **Modifié** : changements fonctionnalités existantes
- **Déprécié** : fonctionnalités bientôt supprimées
- **Supprimé** : fonctionnalités supprimées
- **Corrigé** : corrections de bugs
- **Sécurité** : corrections vulnérabilités
