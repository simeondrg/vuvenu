# Guide de Configuration Supabase pour VuVenu

Ce guide vous accompagne dans la configuration complète de votre projet Supabase pour VuVenu.

## Table des matières

1. [Création du projet](#1-création-du-projet)
2. [Configuration de la base de données](#2-configuration-de-la-base-de-données)
3. [Configuration Row Level Security (RLS)](#3-configuration-row-level-security-rls)
4. [Configuration de l'authentification](#4-configuration-de-lauthentification)
5. [Obtention des clés API](#5-obtention-des-clés-api)
6. [Configuration du Storage](#6-configuration-du-storage)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Création du projet

### Étape 1.1 : Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **Start your project** (gratuit)
3. Connectez-vous avec GitHub (recommandé) ou créez un compte email

### Étape 1.2 : Créer un nouveau projet

1. Cliquez sur **New Project**
2. Sélectionnez votre organisation (ou créez-en une)
3. Remplissez les informations :
   - **Name** : `vuvenu-prod` (ou `vuvenu-dev` pour développement)
   - **Database Password** : Générez un mot de passe fort (IMPORTANT : notez-le !)
   - **Region** : Choisissez la plus proche de vos utilisateurs
     - Pour La Réunion : `Southeast Asia (Singapore)` ou `Europe (Frankfurt)`
   - **Plan** : Free (suffisant pour démarrer)
4. Cliquez sur **Create new project**
5. Attendez 2-3 minutes que le projet soit prêt

---

## 2. Configuration de la base de données

### Étape 2.1 : Accéder au SQL Editor

1. Dans le dashboard Supabase, cliquez sur **SQL Editor** dans le menu de gauche
2. Cliquez sur **+ New query**

### Étape 2.2 : Exécuter les migrations

#### Option A : Via Supabase CLI (recommandé)

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter à votre projet
npx supabase link --project-ref <votre-project-ref>

# Appliquer les migrations
npx supabase db push
```

#### Option B : Manuellement via SQL Editor

1. Ouvrez le fichier `supabase/migrations/001_initial_schema.sql` de votre projet local
2. Copiez tout le contenu
3. Collez-le dans le SQL Editor de Supabase
4. Cliquez sur **Run** (ou Ctrl+Enter)
5. Vérifiez qu'il n'y a pas d'erreurs dans la console

### Étape 2.3 : Vérifier les tables créées

1. Allez dans **Table Editor** (menu de gauche)
2. Vous devriez voir les tables suivantes :
   - ✅ `profiles`
   - ✅ `scripts`
   - ✅ `campaigns`
   - ✅ `campaign_concepts`

---

## 3. Configuration Row Level Security (RLS)

Les politiques RLS sont normalement créées via les migrations, mais voici comment les vérifier/modifier manuellement.

### Étape 3.1 : Vérifier les politiques RLS

1. Allez dans **Authentication** > **Policies**
2. Pour chaque table, vérifiez que les politiques suivantes existent :

#### Table `profiles`
- ✅ **Enable RLS** activé
- ✅ Policy : "Users can view own profile"
- ✅ Policy : "Users can update own profile"

#### Table `scripts`
- ✅ **Enable RLS** activé
- ✅ Policy : "Users can view own scripts"
- ✅ Policy : "Users can create scripts"
- ✅ Policy : "Users can delete own scripts"

#### Table `campaigns`
- ✅ **Enable RLS** activé
- ✅ Policy : "Users can view own campaigns"
- ✅ Policy : "Users can create campaigns"
- ✅ Policy : "Users can update own campaigns"
- ✅ Policy : "Users can delete own campaigns"

#### Table `campaign_concepts`
- ✅ **Enable RLS** activé
- ✅ Policy : "Users can view concepts of own campaigns"
- ✅ Policy : "Users can create concepts for own campaigns"

### Étape 3.2 : Tester les politiques RLS

Exécutez cette requête SQL pour vérifier les RLS :

```sql
-- Test : essayer de récupérer un profil
SELECT * FROM profiles WHERE id = auth.uid();
```

Si ça fonctionne, vos RLS sont correctement configurées !

---

## 4. Configuration de l'authentification

### Étape 4.1 : Activer l'authentification par email

1. Allez dans **Authentication** > **Providers**
2. Vérifiez que **Email** est activé
3. Configuration recommandée :
   - ✅ **Enable Email Signup** : ON
   - ✅ **Enable Email Confirmations** : ON (important pour sécurité)
   - ⚠️ **Secure email change** : ON
   - ⚠️ **Mailer secure password change** : ON

### Étape 4.2 : Configurer les templates d'email

1. Allez dans **Authentication** > **Email Templates**
2. Personnalisez les templates suivants :

#### Template "Confirm Signup"
```html
<h2>Bienvenue sur VuVenu !</h2>
<p>Clique sur le lien ci-dessous pour confirmer ton email :</p>
<a href="{{ .ConfirmationURL }}">Confirmer mon email</a>
```

#### Template "Reset Password"
```html
<h2>Réinitialisation de mot de passe - VuVenu</h2>
<p>Clique sur le lien ci-dessous pour réinitialiser ton mot de passe :</p>
<a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a>
<p><small>Ce lien expire dans 1 heure.</small></p>
```

### Étape 4.3 : Configurer les URLs de redirection

1. Allez dans **Authentication** > **URL Configuration**
2. Ajoutez ces URLs :

**Site URL** :
- Développement : `http://localhost:3000`
- Production : `https://vuvenu.fr` (votre domaine)

**Redirect URLs** (une par ligne) :
```
http://localhost:3000/**
https://vuvenu.fr/**
```

---

## 5. Obtention des clés API

### Étape 5.1 : Récupérer les clés du projet

1. Allez dans **Settings** > **API**
2. Copiez les valeurs suivantes dans votre `.env.local` :

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Anon/Public Key (safe pour client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (ATTENTION : ne JAMAIS exposer côté client !)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Étape 5.2 : Sécurité des clés

⚠️ **IMPORTANT** :
- La **Anon Key** peut être exposée côté client (elle a des permissions limitées)
- La **Service Role Key** doit UNIQUEMENT être utilisée côté serveur (elle bypass RLS)
- Ne JAMAIS commit les clés dans Git
- Utiliser des projets Supabase séparés pour dev/staging/prod

---

## 6. Configuration du Storage

### Étape 6.1 : Créer un bucket pour les images

1. Allez dans **Storage**
2. Cliquez sur **New bucket**
3. Configuration :
   - **Name** : `campaign-images`
   - **Public bucket** : ON (pour que les images soient accessibles)
4. Cliquez sur **Create bucket**

### Étape 6.2 : Configurer les politiques du bucket

1. Cliquez sur votre bucket `campaign-images`
2. Allez dans **Policies**
3. Ajoutez ces politiques :

**Policy "Users can upload images"** :
```sql
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'campaign-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Policy "Public images are viewable"** :
```sql
CREATE POLICY "Public images are viewable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'campaign-images');
```

---

## 7. Troubleshooting

### Problème : "Invalid JWT token"

**Cause** : Les clés API ne correspondent pas au projet
**Solution** :
1. Vérifiez que vous avez copié les bonnes clés depuis **Settings > API**
2. Redémarrez votre serveur de développement (`npm run dev`)
3. Videz le cache du navigateur

### Problème : "Row level security policy violation"

**Cause** : Les politiques RLS bloquent l'accès
**Solution** :
1. Vérifiez dans **Authentication > Policies** que RLS est activé
2. Exécutez les migrations SQL pour créer les politiques
3. Testez manuellement avec `auth.uid()` dans SQL Editor

### Problème : "Email confirmations not sent"

**Cause** : SMTP mal configuré ou emails bloqués
**Solution** :
1. En développement, les emails apparaissent dans **Authentication > Logs**
2. Copiez l'URL de confirmation depuis les logs
3. En production, configurez un SMTP custom dans **Settings > Auth > SMTP Settings**

### Problème : "Database connection failed"

**Cause** : Le projet n'est pas encore prêt ou erreur réseau
**Solution** :
1. Attendez 2-3 minutes après création du projet
2. Vérifiez sur [status.supabase.com](https://status.supabase.com)
3. Testez la connexion depuis SQL Editor

### Problème : Migrations ne s'appliquent pas

**Cause** : Erreur de syntaxe SQL ou conflit
**Solution** :
1. Lisez attentivement les erreurs dans la console SQL Editor
2. Vérifiez que les tables n'existent pas déjà
3. Si besoin, drop les tables et réexécutez :
```sql
DROP TABLE IF EXISTS campaign_concepts CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS scripts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

---

## Prochaines étapes

✅ Supabase configuré
👉 Continuer avec [Configuration Stripe](./stripe-setup.md)

---

**Besoin d'aide ?**
- [Documentation Supabase](https://supabase.com/docs)
- [Discord Supabase](https://discord.supabase.com)
- Support VuVenu : support@vuvenu.fr
