# Guide de Configuration Stripe pour VuVenu

Ce guide vous accompagne dans la configuration complète de Stripe pour gérer les abonnements VuVenu.

## Table des matières

1. [Création du compte Stripe](#1-création-du-compte-stripe)
2. [Création des produits](#2-création-des-produits)
3. [Création des prix mensuels](#3-création-des-prix-mensuels)
4. [Configuration des webhooks](#4-configuration-des-webhooks)
5. [Obtention des clés API](#5-obtention-des-clés-api)
6. [Tests avec cartes de test](#6-tests-avec-cartes-de-test)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Création du compte Stripe

### Étape 1.1 : S'inscrire sur Stripe

1. Allez sur [https://stripe.com](https://stripe.com)
2. Cliquez sur **S'inscrire**
3. Créez votre compte avec un email professionnel
4. Confirmez votre email

### Étape 1.2 : Activer le mode Test

1. Connectez-vous au [Dashboard Stripe](https://dashboard.stripe.com)
2. En haut à gauche, vérifiez que vous êtes en **Mode Test** (toggle)
3. ⚠️ Travaillez TOUJOURS en mode Test pendant le développement

---

## 2. Création des produits

VuVenu propose 3 plans d'abonnement. Vous devez créer 3 produits dans Stripe.

### Étape 2.1 : Créer le produit "Starter"

1. Allez dans **Produits** > **+ Ajouter un produit**
2. Remplissez les informations :
   - **Nom** : `VuVenu Starter`
   - **Description** : `Plan Starter - 10 scripts/mois - Idéal pour démarrer`
   - **Image** : (optionnel) Logo VuVenu
3. **Ne pas** cocher "Paiement unique"
4. Cliquez sur **Enregistrer le produit**
5. ✅ Notez le **Product ID** (commence par `prod_`)

### Étape 2.2 : Créer le produit "Pro"

1. **+ Ajouter un produit**
2. Remplissez :
   - **Nom** : `VuVenu Pro`
   - **Description** : `Plan Pro - 30 scripts/mois + 5 campagnes Meta Ads - Le plus populaire`
3. Cliquez sur **Enregistrer le produit**
4. ✅ Notez le **Product ID**

### Étape 2.3 : Créer le produit "Business"

1. **+ Ajouter un produit**
2. Remplissez :
   - **Nom** : `VuVenu Business`
   - **Description** : `Plan Business - Scripts & Campagnes ILLIMITÉS - Pour les pros du marketing`
3. Cliquez sur **Enregistrer le produit**
4. ✅ Notez le **Product ID**

---

## 3. Création des prix mensuels

Pour chaque produit créé, vous devez maintenant ajouter un prix mensuel.

### Étape 3.1 : Ajouter un prix au produit "Starter"

1. Cliquez sur le produit **VuVenu Starter**
2. Dans la section **Tarification**, cliquez sur **+ Ajouter un prix**
3. Configurez le prix :
   - **Modèle de tarification** : Prix standard
   - **Prix** : `59` EUR
   - **Modèle de facturation** : Récurrent
   - **Fréquence de facturation** : Mensuel
   - **Type de renouvellement** : Renouvellement automatique
4. Cliquez sur **Ajouter un prix**
5. ✅ **IMPORTANT** : Notez le **Price ID** (commence par `price_`)

**Copiez dans votre `.env.local`** :
```bash
STRIPE_PRICE_STARTER_MONTHLY=price_xxxxxxxxxxxxx
```

### Étape 3.2 : Ajouter un prix au produit "Pro"

1. Même processus pour **VuVenu Pro**
2. Prix : `119` EUR
3. Mensuel, renouvellement automatique
4. ✅ Notez le **Price ID**

```bash
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
```

### Étape 3.3 : Ajouter un prix au produit "Business"

1. Même processus pour **VuVenu Business**
2. Prix : `249` EUR
3. Mensuel, renouvellement automatique
4. ✅ Notez le **Price ID**

```bash
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxxxxxxxxxxxx
```

### (Optionnel) Étape 3.4 : Ajouter des prix annuels

Si vous souhaitez proposer des abonnements annuels avec réduction :

1. Pour chaque produit, ajoutez un nouveau prix
2. Fréquence : **Annuel**
3. Prix suggérés (avec 2 mois gratuits) :
   - Starter : 590 EUR/an (au lieu de 708)
   - Pro : 1190 EUR/an (au lieu de 1428)
   - Business : 2490 EUR/an (au lieu de 2988)

---

## 4. Configuration des webhooks

Les webhooks permettent à VuVenu de recevoir les notifications Stripe (paiement réussi, abonnement annulé, etc).

### Étape 4.1 : Créer un endpoint webhook

1. Allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **+ Ajouter un endpoint**
3. Remplissez :
   - **URL de l'endpoint** :
     - Développement local : `https://votre-tunnel-ngrok.ngrok.io/api/webhooks/stripe`
     - Production : `https://vuvenu.fr/api/webhooks/stripe`
   - **Description** : `VuVenu Production Webhooks`
4. Cliquez sur **+ Sélectionner des événements**

### Étape 4.2 : Sélectionner les événements à écouter

Cochez les événements suivants (essentiels pour VuVenu) :

✅ **checkout.session.completed** - Quand un paiement est confirmé
✅ **customer.subscription.created** - Nouvel abonnement créé
✅ **customer.subscription.updated** - Abonnement modifié (upgrade/downgrade)
✅ **customer.subscription.deleted** - Abonnement annulé
✅ **invoice.payment_succeeded** - Paiement récurrent réussi
✅ **invoice.payment_failed** - Paiement récurrent échoué

5. Cliquez sur **Ajouter des événements**
6. Cliquez sur **Ajouter un endpoint**

### Étape 4.3 : Récupérer le signing secret

1. Cliquez sur votre endpoint webhook créé
2. Dans la section **Signature du webhook**, cliquez sur **Révéler**
3. ✅ Copiez le **Signing secret** (commence par `whsec_`)

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Étape 4.4 : Tester les webhooks en local (développement)

Pour tester les webhooks localement, utilisez Stripe CLI :

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks et les rediriger vers votre app locale
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Le CLI affichera le webhook signing secret temporaire
# Copiez-le dans votre .env.local
```

Gardez cette commande active dans un terminal pendant le développement.

---

## 5. Obtention des clés API

### Étape 5.1 : Récupérer les clés API Test

1. Allez dans **Développeurs** > **Clés API**
2. En mode **Test**, vous verrez deux clés :

**Clé publique (Publishable key)** - Safe pour le client
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx
```

**Clé secrète (Secret key)** - JAMAIS exposée côté client
```bash
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx
```

3. ⚠️ Ne JAMAIS commit ces clés dans Git
4. ⚠️ La clé secrète doit rester côté serveur uniquement

### Étape 5.2 : Récupérer les clés API Live (Production)

1. Une fois vos tests validés, passez en **Mode Live** (toggle en haut à gauche)
2. Complétez les informations de votre entreprise (requis par Stripe)
3. Récupérez les nouvelles clés (elles commencent par `pk_live_` et `sk_live_`)
4. Configurez-les dans les variables d'environnement **Vercel/Production**

---

## 6. Tests avec cartes de test

Stripe fournit des cartes de test pour simuler différents scénarios.

### Cartes de test principales

| Carte | Numéro | Comportement |
|-------|--------|--------------|
| ✅ Visa Réussie | `4242 4242 4242 4242` | Paiement toujours accepté |
| ❌ Carte refusée | `4000 0000 0000 0002` | Paiement toujours refusé |
| 🔐 3D Secure requis | `4000 0027 6000 3184` | Demande authentification |
| 📉 Fonds insuffisants | `4000 0000 0000 9995` | Refusé (fonds insuff.) |

**Données supplémentaires pour tests** :
- **Date d'expiration** : N'importe quelle date future (ex: `12/25`)
- **CVC** : N'importe quel 3 chiffres (ex: `123`)
- **Code postal** : N'importe lequel (ex: `97400`)

### Étape 6.1 : Tester un abonnement complet

1. Lancez votre app en local (`npm run dev`)
2. Allez sur `/pricing`
3. Cliquez sur **S'abonner** (plan Starter par exemple)
4. Remplissez avec la carte test `4242 4242 4242 4242`
5. Complétez le paiement
6. Vérifiez dans Stripe Dashboard > **Paiements** que le paiement apparaît
7. Vérifiez dans Stripe Dashboard > **Clients** que le client est créé
8. Vérifiez dans votre app que l'utilisateur a accès au contenu

### Étape 6.2 : Tester les webhooks

1. Effectuez un paiement test
2. Allez dans **Développeurs** > **Webhooks** > Votre endpoint
3. Cliquez sur l'onglet **Tentatives récentes**
4. Vous devriez voir les événements reçus avec leur statut (200 = succès)
5. Cliquez sur un événement pour voir le payload JSON complet

---

## 7. Troubleshooting

### Problème : "No such price: price_xxx"

**Cause** : Le Price ID dans `.env.local` est incorrect
**Solution** :
1. Vérifiez que vous avez copié le bon Price ID depuis **Produits**
2. Assurez-vous d'être en **Mode Test**
3. Les Price IDs test commencent par `price_`, les live par `price_`

### Problème : "Invalid API Key provided"

**Cause** : Clé API incorrecte ou expirée
**Solution** :
1. Revérifiez **Développeurs > Clés API**
2. Copiez-collez à nouveau les clés
3. Redémarrez le serveur (`npm run dev`)
4. Vérifiez que vous n'avez pas mélangé test/live keys

### Problème : "Webhook signature verification failed"

**Cause** : Le signing secret ne correspond pas
**Solution** :
1. Si en local, utilisez `stripe listen` pour obtenir le secret temporaire
2. En production, copiez le secret depuis **Webhooks > Votre endpoint**
3. Vérifiez qu'il n'y a pas d'espace avant/après dans `.env.local`

### Problème : Les webhooks ne sont pas reçus

**Cause** : URL incorrecte ou serveur inaccessible
**Solution** :
1. **En local** : Utilisez ngrok ou Stripe CLI pour exposer localhost
   ```bash
   # Option 1 : Stripe CLI
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

   # Option 2 : ngrok
   ngrok http 3000
   # Puis utilisez l'URL https://xxxxx.ngrok.io dans Stripe
   ```
2. **En production** : Vérifiez que l'URL est bien `https://vuvenu.fr/api/webhooks/stripe`
3. Testez manuellement dans **Webhooks > Votre endpoint > Envoyer un événement de test**

### Problème : Paiements refusés en production

**Cause** : Mode Test activé ou vraie carte bancaire utilisée en test
**Solution** :
1. Assurez-vous d'être en **Mode Live** dans Stripe
2. Vérifiez que les clés live sont configurées dans Vercel
3. Utilisez de vraies cartes bancaires (pas les cartes de test)

### Problème : "Customer already exists"

**Cause** : L'utilisateur a déjà un customer_id Stripe
**Solution** :
1. C'est normal, Stripe évite les doublons
2. VuVenu récupère le customer existant via `stripe_customer_id` en base
3. Si erreur persistante, vérifiez la colonne `stripe_customer_id` dans `profiles`

---

## Récapitulatif des IDs à noter

Avant de finaliser, vérifiez que vous avez bien noté dans votre `.env.local` :

```bash
# Clés API (Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs (Test)
STRIPE_PRICE_STARTER_MONTHLY=price_xxxxx
STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxxxx
```

---

## Prochaines étapes

✅ Stripe configuré
👉 Continuer avec le [déploiement sur Vercel](../README.md#déploiement)

---

**Besoin d'aide ?**
- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- Support VuVenu : support@vuvenu.fr
