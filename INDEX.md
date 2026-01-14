# Index VuVenu - Guide de Navigation

Bienvenue dans le projet VuVenu ! Ce document vous guide vers les ressources importantes.

## 🚀 Démarrage Rapide

1. **[README.md](./README.md)** - Commencez ici ! Installation et présentation
2. **[CONFIGURATION-CHECKLIST.md](./CONFIGURATION-CHECKLIST.md)** - Checklist déploiement production
3. **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions

## 📚 Documentation

### Guides Techniques
- **[docs/supabase-setup.md](./docs/supabase-setup.md)** - Configuration base de données
- **[docs/stripe-setup.md](./docs/stripe-setup.md)** - Configuration paiements
- **[docs/deployment-guide.md](./docs/deployment-guide.md)** - Déploiement Vercel
- **[docs/api-reference.md](./docs/api-reference.md)** - Documentation API

### Planning & Organisation
- **[docs/planning/PRD-VuVenu-MVP.md](./docs/planning/PRD-VuVenu-MVP.md)** - Product Requirements Document
- **[docs/planning/WORKFLOW-VUVENU.md](./docs/planning/WORKFLOW-VUVENU.md)** - Workflow développement
- **[docs/planning/MASTER_CHECKLIST.md](./docs/planning/MASTER_CHECKLIST.md)** - Checklist développement

### Rapports
- **[docs/reports/MVP-COMPLETION-SUMMARY.md](./docs/reports/MVP-COMPLETION-SUMMARY.md)** - Résumé MVP
- **[docs/reports/RESPONSIVE-AUDIT.md](./docs/reports/RESPONSIVE-AUDIT.md)** - Audit responsive
- **[docs/reports/](./docs/reports/)** - Tous les rapports

## 🗂️ Structure du Projet

```
vuvenu/
├── src/                    # Code source application
│   ├── app/               # Pages Next.js
│   ├── components/        # Composants React
│   ├── lib/              # Bibliothèques
│   └── types/            # Types TypeScript
├── docs/                  # Documentation technique
│   ├── planning/         # Planning et PRD
│   └── reports/          # Rapports développement
├── supabase/             # Configuration BDD
│   └── migrations/       # Migrations SQL
├── tests/                # Tests E2E et unitaires
├── research/             # Recherches métier
├── ralph-templates/      # Templates Ralph Loop
└── .archive/            # Fichiers historiques

## 🎯 Pour Développeurs

### Commandes Essentielles
```bash
npm run dev          # Lancer serveur dev
npm run build        # Build production
npm run typecheck    # Vérifier TypeScript
npm run lint         # Linter le code
npm run test         # Tests unitaires
npm run test:e2e     # Tests E2E
```

### Configuration Requise
- **[.env.example](./.env.example)** - Template variables environnement
- **[CLAUDE.md](./CLAUDE.md)** - Instructions pour Claude Code

### Workflows
- **[docs/planning/WORKFLOW-VUVENU.md](./docs/planning/WORKFLOW-VUVENU.md)** - Processus développement
- **[ralph-templates/](./ralph-templates/)** - Templates Ralph Loop

## 🔧 Configuration

### Services Externes
1. **Supabase** → [docs/supabase-setup.md](./docs/supabase-setup.md)
2. **Stripe** → [docs/stripe-setup.md](./docs/stripe-setup.md)
3. **Vercel** → [docs/deployment-guide.md](./docs/deployment-guide.md)

### Variables d'Environnement
Voir [.env.example](./.env.example) pour la liste complète

## 📞 Support

- **Issues GitHub** : [github.com/simeondrg/vuvenu/issues](https://github.com/simeondrg/vuvenu/issues)
- **Documentation** : [docs/](./docs/)

---

**Dernière mise à jour** : 14 janvier 2026
**Version** : 1.0.0
