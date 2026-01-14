# Checklist de Configuration VuVenu - Déploiement Production

> Document de référence pour configurer et déployer VuVenu de zéro à la production

**Date de création** : 14 janvier 2026
**Statut** : Ready for Production Deployment

---

## Vue d'Ensemble

Ce document liste **TOUTES** les étapes nécessaires pour déployer VuVenu en production, de la création des comptes tiers à la mise en ligne.

**Temps estimé total** : 2-3 heures

---

## 📋 Pré-requis (Comptes à Créer)

### Comptes obligatoires

- [ ] **Supabase** - Base de données + Auth + Storage
  - URL : [https://supabase.com](https://supabase.com)
  - Plan : Free (suffisant pour démarrer)
  - Email recommandé : votre email professionnel

- [ ] **Stripe** - Gestion des paiements
  - URL : [https://stripe.com](https://stripe.com)
  - Plan : Paiement à l'usage (pas d'abonnement)
  - Email recommandé : comptabilité@votreentreprise.fr

- [ ] **Anthropic** - API Claude (génération de texte)
  - URL : [https://console.anthropic.com](https://console.anthropic.com)
  - Plan : Pay-as-you-go (~20$/mois estimé)
  - Limite initiale : 5$ de crédit offert

- [ ] **Google AI Studio** - API Gemini (génération d'images)
  - URL : [https://ai.google.dev](https://ai.google.dev)
  - Plan : Free tier (60 requests/minute)
  - Compte Google requis

### Comptes optionnels (mais recommandés)

- [ ] **Vercel** - Hébergement (ou Netlify/Railway)
  - URL : [https://vercel.com](https://vercel.com)
  - Plan : Free pour hobby, Pro pour production

- [ ] **GitHub** - Hébergement code + CI/CD
  - URL : [https://github.com](https://github.com)
  - Plan : Free (repos privés inclus)

---

## 1️⃣ Configuration Supabase

**📚 Guide détaillé** : [docs/supabase-setup.md](./docs/supabase-setup.md)

### Étapes critiques

- [ ] **1.1** Créer le projet Supabase
  - Nom : `vuvenu-prod` (ou `vuvenu-dev` pour tests)
  - Région : Europe (Frankfurt) ou Southeast Asia (Singapore)
  - **⚠️ IMPORTANT** : Noter le mot de passe de la base de données

- [ ] **1.2** Exécuter les migrations SQL
  ```bash
  # Option 1 : Via Supabase CLI
  npx supabase link --project-ref <votre-project-ref>
  npx supabase db push

  # Option 2 : Manuellement
  # Copier/coller le contenu de supabase/migrations/001_initial_schema.sql
  # dans le SQL Editor de Supabase
  ```

- [ ] **1.3** Vérifier les tables créées
  - [ ] `profiles`
  - [ ] `scripts`
  - [ ] `campaigns`
  - [ ] `campaign_concepts`

- [ ] **1.4** Activer Row Level Security (RLS)
  - Normalement activé par les migrations
  - Vérifier dans **Authentication > Policies**

- [ ] **1.5** Configurer l'authentification email
  - **Authentication > Providers** : Email activé
  - **Email Confirmations** : ON (sécurité)
  - Personnaliser les templates d'email (optionnel)

- [ ] **1.6** Configurer les URLs de redirection
  - **Authentication > URL Configuration**
  - Site URL : `https://vuvenu.fr` (votre domaine)
  - Redirect URLs : `https://vuvenu.fr/**`

- [ ] **1.7** Créer le bucket Storage pour les images
  - Nom : `campaign-images`
  - Public : ON
  - Configurer les politiques d'accès

- [ ] **1.8** Récupérer les clés API
  - **Settings > API**
  - Noter `NEXT_PUBLIC_SUPABASE_URL`
  - Noter `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Noter `SUPABASE_SERVICE_ROLE_KEY` (secret !)

### ✅ Validation Supabase

```sql
-- Tester la connexion
SELECT * FROM profiles LIMIT 1;

-- Vérifier RLS
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

---

## 2️⃣ Configuration Stripe

**📚 Guide détaillé** : [docs/stripe-setup.md](./docs/stripe-setup.md)

### Étapes critiques

- [ ] **2.1** Créer le compte Stripe
  - Email : email professionnel
  - Entreprise : Informations légales complètes
  - **⚠️ MODE TEST** : Travailler en test pendant développement

- [ ] **2.2** Créer les 3 produits
  - [ ] **Produit 1** : VuVenu Starter (59€/mois)
  - [ ] **Produit 2** : VuVenu Pro (119€/mois)
  - [ ] **Produit 3** : VuVenu Business (249€/mois)

- [ ] **2.3** Créer les prix mensuels
  - Pour chaque produit, ajouter un prix récurrent mensuel
  - **⚠️ IMPORTANT** : Noter les Price IDs (commencent par `price_`)

- [ ] **2.4** Configurer les webhooks
  - URL : `https://vuvenu.fr/api/webhooks/stripe`
  - Événements à écouter :
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.created`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
    - [ ] `invoice.payment_succeeded`
    - [ ] `invoice.payment_failed`

- [ ] **2.5** Récupérer le webhook signing secret
  - **Développeurs > Webhooks** > Votre endpoint
  - Noter `STRIPE_WEBHOOK_SECRET`

- [ ] **2.6** Récupérer les clés API (Test)
  - **Développeurs > Clés API** (mode Test)
  - Noter `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
  - Noter `STRIPE_SECRET_KEY` (sk_test_...)

- [ ] **2.7** Tester avec cartes de test
  - Carte réussie : `4242 4242 4242 4242`
  - Carte refusée : `4000 0000 0000 0002`
  - Faire un achat test complet

### ✅ Validation Stripe

- [ ] Paiement test réussi dans Dashboard > Paiements
- [ ] Client créé dans Dashboard > Clients
- [ ] Webhooks reçus avec status 200 dans Dashboard > Webhooks

---

## 3️⃣ Configuration APIs IA

### Anthropic Claude API

- [ ] **3.1** Créer un compte sur [console.anthropic.com](https://console.anthropic.com)
- [ ] **3.2** Ajouter un moyen de paiement (carte bancaire)
- [ ] **3.3** Générer une clé API
  - **Settings > API Keys**
  - Créer une nouvelle clé
  - Noter `ANTHROPIC_API_KEY` (commence par `sk-ant-`)
- [ ] **3.4** Définir une limite de dépense mensuelle (recommandé : 50$/mois)
- [ ] **3.5** Tester l'API
  ```bash
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
  ```

### Google AI (Gemini) API

- [ ] **3.6** Créer un projet sur [Google Cloud Console](https://console.cloud.google.com)
- [ ] **3.7** Activer l'API "Generative Language API"
- [ ] **3.8** Créer une clé API
  - **APIs & Services > Credentials**
  - Create Credentials > API Key
  - Noter `GOOGLE_AI_API_KEY`
- [ ] **3.9** Tester l'API
  ```bash
  curl "https://generativelanguage.googleapis.com/v1/models?key=$GOOGLE_AI_API_KEY"
  ```

### ✅ Validation APIs IA

- [ ] Claude répond correctement (status 200)
- [ ] Gemini liste les modèles disponibles
- [ ] Billing configuré avec alertes

---

## 4️⃣ Variables d'Environnement

### Créer le fichier .env.local

Copier `.env.local.example` et remplir TOUTES les valeurs :

```bash
# Supabase (étape 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (étape 2)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Price IDs
STRIPE_PRICE_STARTER_MONTHLY=price_xxxxx
STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxxxx

# AI APIs (étape 3)
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_AI_API_KEY=AIzaSyxxxxx

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Checklist validation .env.local

- [ ] Aucune valeur ne contient `your-`, `xxx`, ou `...`
- [ ] Les URLs Supabase se terminent par `.supabase.co`
- [ ] Les clés Stripe Test commencent par `pk_test_` et `sk_test_`
- [ ] Les Price IDs commencent par `price_`
- [ ] La clé Anthropic commence par `sk-ant-`
- [ ] Pas d'espaces avant/après les valeurs

---

## 5️⃣ Installation et Tests Locaux

### Installation

```bash
# Cloner le repo (si pas déjà fait)
git clone https://github.com/votre-username/vuvenu.git
cd vuvenu

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local
# Puis éditer .env.local avec vos clés
```

### Tests de fonctionnement

- [ ] **5.1** Lancer le serveur de développement
  ```bash
  npm run dev
  ```
  Doit démarrer sur http://localhost:3000

- [ ] **5.2** Vérifier le typecheck
  ```bash
  npm run typecheck
  ```
  Doit passer sans erreur

- [ ] **5.3** Tester l'inscription d'un utilisateur
  - Aller sur `/register`
  - Créer un compte
  - Vérifier l'email de confirmation
  - Se connecter

- [ ] **5.4** Tester l'onboarding
  - Remplir les informations business
  - Vérifier que le profil est créé dans Supabase

- [ ] **5.5** Tester la génération de script
  - Aller sur `/scripts/new`
  - Générer un script
  - Vérifier qu'il apparaît dans la liste

- [ ] **5.6** Tester le paiement Stripe (mode test)
  - Aller sur `/pricing`
  - Cliquer sur "S'abonner"
  - Utiliser carte test `4242 4242 4242 4242`
  - Vérifier que l'abonnement est activé

### ✅ Validation Locale

- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Génération de script fonctionne
- [ ] Paiement test fonctionne
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Pas d'erreurs dans les logs serveur

---

## 6️⃣ Déploiement sur Vercel

### Préparation

- [ ] **6.1** Pusher le code sur GitHub
  ```bash
  git add .
  git commit -m "chore: ready for production deployment"
  git push origin main
  ```

- [ ] **6.2** Acheter un nom de domaine (si pas déjà fait)
  - Recommandé : Namecheap, Google Domains, OVH
  - Exemple : `vuvenu.fr`

### Configuration Vercel

- [ ] **6.3** Créer un compte sur [vercel.com](https://vercel.com)
  - Se connecter avec GitHub

- [ ] **6.4** Importer le projet
  - New Project > Import from GitHub
  - Sélectionner le repo `vuvenu`

- [ ] **6.5** Configurer les variables d'environnement
  - **Settings > Environment Variables**
  - Copier TOUTES les variables de `.env.local`
  - **⚠️ IMPORTANT** : Utiliser les clés **LIVE** de Stripe (pk_live_, sk_live_)
  - Changer `NEXT_PUBLIC_APP_URL` vers `https://vuvenu.fr`

- [ ] **6.6** Déployer
  - Cliquer sur "Deploy"
  - Attendre 2-3 minutes

- [ ] **6.7** Configurer le domaine custom
  - **Settings > Domains**
  - Ajouter `vuvenu.fr` et `www.vuvenu.fr`
  - Configurer les DNS selon les instructions Vercel

### Configuration DNS

Chez votre registrar (Namecheap, etc.), ajouter ces enregistrements :

```
Type: A
Host: @
Value: 76.76.21.21

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

### ✅ Validation Déploiement

- [ ] Site accessible sur `https://vuvenu.fr`
- [ ] HTTPS activé (cadenas vert)
- [ ] Pas d'erreurs dans les logs Vercel
- [ ] Inscription fonctionne en production
- [ ] Paiement réel fonctionne (tester avec vraie carte en centimes)

---

## 7️⃣ Configuration Production (Post-Déploiement)

### Stripe Production

- [ ] **7.1** Passer en Mode Live dans Stripe
- [ ] **7.2** Récupérer les clés Live
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
  - `STRIPE_SECRET_KEY` (sk_live_...)
- [ ] **7.3** Mettre à jour les variables d'environnement Vercel
- [ ] **7.4** Redéployer Vercel
- [ ] **7.5** Mettre à jour l'URL du webhook dans Stripe
  - `https://vuvenu.fr/api/webhooks/stripe`

### Supabase Production

- [ ] **7.6** Mettre à jour les URLs de redirection
  - Site URL : `https://vuvenu.fr`
  - Redirect URLs : `https://vuvenu.fr/**`
- [ ] **7.7** Configurer un SMTP custom (optionnel mais recommandé)
  - **Settings > Auth > SMTP Settings**
  - Utiliser SendGrid, Mailgun ou AWS SES

### Surveillance

- [ ] **7.8** Configurer les alertes Stripe
  - Notifications pour paiements échoués
  - Notifications pour nouveaux abonnements
- [ ] **7.9** Activer les logs Vercel
  - Plan Pro recommandé pour logs persistants
- [ ] **7.10** Surveiller les coûts APIs IA
  - Anthropic : Limites de dépense
  - Google AI : Quotas

---

## 8️⃣ Tests Finaux (Smoke Tests)

### Tests utilisateur

- [ ] **Parcours inscription complète**
  1. [ ] S'inscrire avec un vrai email
  2. [ ] Confirmer l'email
  3. [ ] Compléter l'onboarding
  4. [ ] Accéder au dashboard

- [ ] **Parcours génération de script**
  1. [ ] Créer un nouveau script
  2. [ ] Vérifier la qualité du contenu
  3. [ ] Télécharger/copier le script

- [ ] **Parcours paiement**
  1. [ ] Choisir un plan
  2. [ ] Effectuer le paiement (vraie carte, montant minimal)
  3. [ ] Vérifier l'activation de l'abonnement
  4. [ ] Tester l'accès aux fonctionnalités premium

- [ ] **Parcours campagne publicitaire** (plan Pro/Business)
  1. [ ] Créer une nouvelle campagne
  2. [ ] Générer les concepts
  3. [ ] Générer les images avec Gemini
  4. [ ] Suivre le wizard de lancement

### Tests techniques

- [ ] **Performance**
  - [ ] Lighthouse mobile > 90
  - [ ] LCP < 2.5s
  - [ ] CLS < 0.1
  - [ ] FID < 100ms

- [ ] **Responsive**
  - [ ] Mobile 375px : OK
  - [ ] Tablet 768px : OK
  - [ ] Desktop 1920px : OK

- [ ] **SEO**
  - [ ] Sitemap accessible : `https://vuvenu.fr/sitemap.xml`
  - [ ] Robots.txt : `https://vuvenu.fr/robots.txt`
  - [ ] Meta tags présents sur toutes les pages
  - [ ] Structured data (JSON-LD) présent

---

## 9️⃣ Go Live Checklist

### Communication

- [ ] **9.1** Préparer l'annonce de lancement
  - [ ] Poster sur LinkedIn
  - [ ] Email aux beta testers
  - [ ] Communiquer auprès des premiers clients

### Monitoring

- [ ] **9.2** Vérifier les dashboards
  - [ ] Stripe : Paiements en temps réel
  - [ ] Supabase : Utilisateurs actifs
  - [ ] Vercel : Trafic et erreurs

### Support

- [ ] **9.3** Préparer le support client
  - [ ] Email support@vuvenu.fr configuré
  - [ ] Template de réponses FAQ
  - [ ] Process de remontée de bugs

---

## ✅ Checklist Finale - Ready for Production

Cocher ces éléments avant de considérer VuVenu "production-ready" :

### Infrastructure
- [ ] Supabase configuré et testé
- [ ] Stripe configuré en mode Live
- [ ] APIs IA configurées avec limites
- [ ] Vercel déployé avec domaine custom
- [ ] HTTPS activé et fonctionnel

### Fonctionnalités
- [ ] Inscription/Login fonctionnent
- [ ] Génération de scripts fonctionne
- [ ] Génération de campagnes fonctionne
- [ ] Paiements Stripe fonctionnent
- [ ] Webhooks Stripe reçus correctement

### Qualité
- [ ] TypeScript typecheck passe
- [ ] Pas d'erreurs critiques dans les logs
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] Responsive sur mobile, tablet, desktop

### Business
- [ ] Mentions légales / CGV / Confidentialité publiées
- [ ] Prix validés (59€ / 119€ / 249€)
- [ ] Support client prêt
- [ ] Communication de lancement prête

---

## 🆘 Troubleshooting

### Problèmes fréquents

**"Invalid Supabase credentials"**
- Vérifier que `NEXT_PUBLIC_SUPABASE_URL` est correct
- Vérifier que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correcte
- Redémarrer le serveur

**"Stripe webhook signature invalid"**
- Vérifier `STRIPE_WEBHOOK_SECRET`
- En local, utiliser `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**"Anthropic API rate limit exceeded"**
- Vérifier votre solde sur console.anthropic.com
- Augmenter la limite de dépense
- Attendre le reset du rate limit (1 minute)

**"Images Gemini ne se génèrent pas"**
- Vérifier `GOOGLE_AI_API_KEY`
- Vérifier le quota sur ai.google.dev
- Essayer avec un autre prompt

---

## 📞 Support

**Documentation complète**
- README.md
- docs/supabase-setup.md
- docs/stripe-setup.md

**Support VuVenu**
- Email : support@vuvenu.fr
- Discord : discord.gg/vuvenu (à créer)

**Support technique tiers**
- Supabase : support.supabase.com
- Stripe : support.stripe.com
- Vercel : vercel.com/support

---

**Document généré le** : 14 janvier 2026
**Version VuVenu** : MVP v1.0
**Status** : ✅ MVP PRODUCTION READY
