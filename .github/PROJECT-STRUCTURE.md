# Structure du Projet VuVenu

## 📁 Organisation des Dossiers

```
vuvenu/
├── .github/                    # Configuration GitHub
│   └── PROJECT-STRUCTURE.md
├── docs/                       # Documentation technique
│   ├── api-reference.md
│   ├── deployment-guide.md
│   ├── extension-guide.md
│   ├── stripe-setup.md
│   └── supabase-setup.md
├── ralph-templates/            # Templates PRD pour Ralph Loop
│   ├── prd-template.json
│   └── nouvelle-feature-example.json
├── research/                   # Recherche industrielle
│   ├── industries/             # Analyses par secteur
│   └── BLAYO_CONTEXT_CLAUDECODE.md
├── skills/                     # Skills Claude Code
│   ├── meta-ads-creative-generator-v5.0 2/
│   └── static-ad-creatives-generator/
├── src/                        # Code source application
│   ├── app/                    # Next.js App Router
│   ├── components/             # Composants React
│   ├── hooks/                  # React hooks
│   ├── lib/                    # Bibliothèques utilitaires
│   └── types/                  # Types TypeScript
├── supabase/                   # Configuration Supabase
│   ├── config.toml
│   └── migrations/
├── tests/                      # Tests E2E et unitaires
│   └── e2e/
└── public/                     # Assets statiques

## 📄 Fichiers Racine (Organisés)

### Documentation Principale
- README.md                     # Point d'entrée projet
- CONFIGURATION-CHECKLIST.md    # Checklist déploiement production
- CHANGELOG.md                  # Historique des changements

### Configuration
- .env.example                  # Template variables environnement
- .env.local                    # Variables locales (git ignored)
- package.json                  # Dépendances npm
- tsconfig.json                 # Configuration TypeScript
- next.config.ts                # Configuration Next.js
- tailwind.config.ts            # Configuration Tailwind
- eslint.config.mjs             # Configuration ESLint
- .prettierrc.json              # Configuration Prettier
- .prettierignore               # Fichiers ignorés Prettier
- playwright.config.ts          # Configuration Playwright
- vitest.config.ts              # Configuration Vitest
- middleware.ts                 # Middleware Next.js

### Git
- .gitignore                    # Fichiers ignorés par Git

## 📂 Réorganisation Effectuée

Les fichiers suivants ont été déplacés pour une meilleure organisation :

### Déplacés vers `.archive/`
- Tous les fichiers temporaires Ralph (ralph-*.json)
- Fichiers de travail temporaires (*.txt avec emojis)
- Analyses et rapports temporaires

### Déplacés vers `docs/reports/`
- MVP-COMPLETION-SUMMARY.md
- RESPONSIVE-AUDIT.md
- CODE-REVIEW-*.md
- EXECUTIVE-SUMMARY.md

### Déplacés vers `docs/planning/`
- PRD-VuVenu-MVP.md
- MASTER_CHECKLIST.md
- Fichiers de workflow et planning

## 🗂️ Convention de Nommage

- **Dossiers** : kebab-case (`my-folder/`)
- **Fichiers code** : kebab-case (`my-component.tsx`)
- **Fichiers docs** : SCREAMING-KEBAB-CASE (`MY-DOC.md`)
- **Composants React** : PascalCase (`MyComponent.tsx`)

## 🎯 Règles d'Organisation

1. **Racine** : Seulement fichiers essentiels (README, config, CHANGELOG)
2. **docs/** : Toute documentation technique
3. **src/** : Tout le code applicatif
4. **.archive/** : Fichiers temporaires/historiques
5. **research/** : Recherches et analyses métier
6. **tests/** : Tous les tests
