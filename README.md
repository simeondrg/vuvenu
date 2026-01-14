# VuVenu

> Plateforme SaaS B2B pour aider les commerces de proximité à attirer plus de clients grâce aux réseaux sociaux

VuVenu permet aux gérants d'entreprises locales (restaurants, salons, boutiques, artisans) de générer du contenu optimisé pour les réseaux sociaux et de lancer des campagnes publicitaires Meta Ads, sans expertise marketing requise.

## 🚀 Fonctionnalités MVP

- **Générateur de Scripts Vidéos** : Scripts optimisés pour Reels/TikTok (30-60 sec) adaptés à votre secteur d'activité
- **Meta Ads Generator** : Concepts publicitaires complets avec images générées par IA + wizard de lancement guidé
- **Authentification** : Inscription, connexion, réinitialisation de mot de passe via Supabase Auth
- **Abonnements** : Gestion des plans (Starter, Pro, Business) via Stripe
- **Dashboard** : Interface intuitive pour gérer vos contenus et campagnes

## 🛠️ Stack Technique

| Couche      | Technologie                         |
| ----------- | ----------------------------------- |
| Framework   | Next.js 14 (App Router)             |
| Langage     | TypeScript (strict mode)            |
| Styling     | Tailwind CSS + shadcn/ui            |
| Auth        | Supabase Auth                       |
| Database    | Supabase PostgreSQL                 |
| Storage     | Supabase Storage                    |
| IA Texte    | Anthropic Claude 3.5 Sonnet         |
| IA Images   | Google Gemini (Imagen 3)            |
| Paiements   | Stripe (Checkout + Customer Portal) |
| Déploiement | Vercel                              |
| Validation  | Zod                                 |

## 📋 Prérequis

- **Node.js** 18.17 ou supérieur
- **npm** ou **yarn**
- **Comptes requis** :
  - [Supabase](https://supabase.com) (gratuit)
  - [Stripe](https://stripe.com) (test mode gratuit)
  - [Anthropic](https://console.anthropic.com) (API Claude)
  - [Google AI](https://ai.google.dev) (API Gemini)

## 🏗️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/vuvenu.git
cd vuvenu
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Copier le fichier d'exemple et remplir les valeurs :

```bash
cp .env.local.example .env.local
```

Éditer `.env.local` avec vos clés API. Voir les guides de configuration :
- [Guide Supabase](./docs/supabase-setup.md)
- [Guide Stripe](./docs/stripe-setup.md)

### 4. Configuration de la base de données

Exécuter les migrations Supabase :

```bash
# Via Supabase CLI (recommandé)
npx supabase db push

# Ou manuellement dans le SQL Editor de Supabase
# Copier/coller les fichiers SQL de supabase/migrations/
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📦 Scripts NPM disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Build production
npm run start        # Démarrer le serveur production
npm run lint         # Linter ESLint
npm run typecheck    # Vérification TypeScript
npm run test         # Lancer les tests (Vitest)
npm run test:e2e     # Tests end-to-end (Playwright)
```

## 📁 Structure du Projet

```
vuvenu/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── (auth)/            # Pages authentification
│   │   ├── (dashboard)/       # Pages application (connecté)
│   │   ├── (marketing)/       # Pages publiques
│   │   ├── api/               # Routes API
│   │   ├── onboarding/        # Onboarding utilisateur
│   │   └── layout.tsx         # Layout racine
│   ├── components/            # Composants React
│   │   ├── ui/                # shadcn/ui components
│   │   ├── dashboard/
│   │   ├── scripts/
│   │   ├── campaigns/
│   │   └── marketing/
│   ├── lib/                   # Utilitaires & configurations
│   │   ├── supabase/          # Client Supabase
│   │   ├── stripe/            # Client Stripe
│   │   ├── ai/                # APIs IA (Claude, Gemini)
│   │   └── utils.ts
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # Types TypeScript
├── supabase/
│   └── migrations/            # Migrations SQL
├── public/                    # Assets statiques
├── docs/                      # Documentation
├── .env.local.example         # Template variables d'env
└── README.md
```

## 🔐 Sécurité

- **TypeScript strict mode** activé
- **Validation Zod** sur tous les endpoints API
- **Row Level Security (RLS)** sur Supabase
- **Rate limiting** sur les endpoints sensibles
- **Pas de secrets en dur** dans le code

## 🎨 Design System

Le projet utilise un design system custom "VuVenu" basé sur Tailwind CSS :

**Couleurs principales :**
- `vuvenu-lime` : #BFFF00 (CTA principal)
- `vuvenu-blue` : #0EA5E9 (Actions secondaires)
- `vuvenu-violet` : #8B5CF6 (Accents)
- `vuvenu-rose` : #F472B6 (Bordures)
- `vuvenu-dark` : #0F172A (Texte)
- `vuvenu-cream` : #FFFDF7 (Background)

## 📚 Documentation

- [PRD Complet](./PRD-VuVenu-MVP.md)
- [Configuration Supabase](./docs/supabase-setup.md)
- [Configuration Stripe](./docs/stripe-setup.md)
- [Checklist Configuration](./CONFIGURATION-CHECKLIST.md)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests end-to-end
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Déploiement

### Vercel (recommandé)

1. Push le code sur GitHub
2. Connecter le repo sur [Vercel](https://vercel.com)
3. Configurer les variables d'environnement (voir `.env.local.example`)
4. Déployer

### Variables d'environnement production

Assurez-vous de configurer TOUTES les variables dans les settings Vercel :
- Variables Supabase
- Clés Stripe (production)
- Clés API IA
- `NEXT_PUBLIC_APP_URL` (votre domaine)

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

**VuVenu** - Développé avec ❤️ à La Réunion par [Bourbon Media](https://github.com/bourbon-media)
