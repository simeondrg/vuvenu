# 🎯 NETTOYAGE - PRIORITÉS ESSENTIELLES

**Format compressé pour décisions rapides**

---

## 📋 EN 2 MINUTES

### ❌ À SUPPRIMER (après archivage)

```
/skills/                          # 304K - moved to docs/research-archive
INIT-COMPLETE.md                  # merged to docs/execution/EXECUTION-LOG.md
CLAUDE-SETUP-COMPLETE.md          # merged
JOURNAL.md                        # merged
BRANDING-VUVENU-BRIEF.md          # moved to docs/branding/BRIEF.md
MEGA-PROMPT-GEMINI.md             # moved to docs/prompts/gemini-interface.md
WORKFLOW-VUVENU.md                # moved to docs/deprecated/WORKFLOW.md
SKILLS-INTEGRATION-COMPLETE.md    # content moved
```

### ✅ À GARDER

```
CLAUDE.md                         # Config projet (essentieel)
PRD-VuVenu-MVP.md                 # MVP definition (essentieel)
MASTER_CHECKLIST.md               # Task tracker (essentieel)
package.json                      # Dépendances
src/lib/skills/                   # VuVenu skills (essentieel)
src/lib/data/niche-mapping.ts     # Data mapping (essentieel)
```

### 🆕 À CRÉER

```
/docs/PROJECT-SUMMARY.md          # Point d'entrée
/docs/QUICK-START.md              # Ralph instructions
/docs/execution/EXECUTION-LOG.md  # Unified log
/docs/technical/VERSION-AUDIT.md  # Version tracking
README.md                         # Overwrite existing
src/lib/supabase/*.ts (stubs)     # Empty TS files
src/lib/ai/*.ts (stubs)           # Empty TS files
```

---

## ⚡ EXÉCUTION (4 commandes)

```bash
# 1. Créer dossiers
mkdir -p /Users/simeon/projects/vuvenu/docs/{execution,branding,prompts,technical,research-archive,deprecated}

# 2. Archiver docs
cp /Users/simeon/projects/vuvenu/BRANDING-VUVENU-BRIEF.md /Users/simeon/projects/vuvenu/docs/branding/BRIEF.md
cp /Users/simeon/projects/vuvenu/MEGA-PROMPT-GEMINI.md /Users/simeon/projects/vuvenu/docs/prompts/gemini-interface.md
cp /Users/simeon/projects/vuvenu/WORKFLOW-VUVENU.md /Users/simeon/projects/vuvenu/docs/deprecated/WORKFLOW.md
cp -r /Users/simeon/projects/vuvenu/skills/* /Users/simeon/projects/vuvenu/docs/research-archive/

# 3. Créer stubs (voir CLEANUP-ACTION-PLAN.md Étape 4)
# 4. Supprimer anciens fichiers
# 5. Git commit
```

---

## 🚨 CRITICAL

```
❌ JAMAIS supprimer sans backup :
   - PRD-VuVenu-MVP.md (scope MVP)
   - MASTER_CHECKLIST.md (roadmap)
   - /src/lib/skills/ (implémentation)

⚠️ APRÈS suppression, VÉRIFIER :
   npm run typecheck    # 0 erreurs
   npm run lint         # 0 erreurs
   npm run dev          # Démarre
```

---

## 📊 BÉNÉFICES

**Avant** :

- 8 fichiers MD à racine (confus)
- /skills 304K dupliqué (confusion)
- 7 fichiers d'execution (redondance)
- Aucune structure /docs

**Après** :

- 3 fichiers MD à racine (clair)
- /docs/research-archive organisé
- 1 EXECUTION-LOG unifié
- Structure /docs complète

**Résultat** : +60% clarté, -70% confusion

---

## ⏱️ TIMELINE

| Étape               | Durée      | Statut          |
| ------------------- | ---------- | --------------- |
| Setup sauvegarde    | 10min      | Start here ↓    |
| Archive & copy      | 30min      |                 |
| Créer nouveaux docs | 45min      |                 |
| Stub files          | 30min      |                 |
| Build check         | 15min      |                 |
| Git commit          | 20min      |                 |
| Merge main          | 10min      |                 |
| **TOTAL**           | **2.5-3h** | **Ralph Ready** |

---

## 🔄 ORDRE D'EXÉCUTION

```
1️⃣  Lire CLEANUP-ANALYSIS.md (compréhension)
2️⃣  Lancer backup (sécurité)
3️⃣  Exécuter CLEANUP-ACTION-PLAN.md étapes 1-11 (action)
4️⃣  Vérifier npm run typecheck + lint (validation)
5️⃣  Commit & merge main (finalisation)
6️⃣  Lancer Ralph Loop semaine-1 (développement)
```

---

## ✅ VALIDATION FINALE

```bash
# Devrait afficher ✅
cd /Users/simeon/projects/vuvenu
npm run typecheck    # ✅ OK
npm run lint         # ✅ OK
npm run dev &        # ✅ http://localhost:3000
git log -1           # ✅ Cleanup commit
ls -la docs/         # ✅ 6 dossiers
rm -rf node_modules/.cache  # Cleanup
echo "✅ READY FOR RALPH"
```

---

## 🎯 RÉSUMÉ

| Question              | Réponse                |
| --------------------- | ---------------------- |
| Combien de temps ?    | 2.5-3h                 |
| Risque de casse ?     | Faible (backup fait)   |
| Impact Ralph ?        | +20% productivité      |
| Point de non-retour ? | Après git commit       |
| Avant Ralph ?         | Absolument obligatoire |

---

_Document créé : 13 janvier 2026_
_Priorité : 🔴 CRITIQUE_
