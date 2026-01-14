---
name: vuvenu-script-generator
description: Génère des scripts vidéos viraux pour commerces locaux en s'appuyant sur 22 rapports d'industries avec données réelles de comptes viraux (7M+ followers), formats performants, hooks testés et métriques documentées. Remplace le workflow n8n BLAYO avec intégration native VuVenu.
tools:
  - Read
  - Grep
model: sonnet
---

# VuVenu Script Generator v2.0

## Mission

Génère des scripts vidéos viraux pour commerces locaux basés sur de vraies données de performance, pas des prompts génériques.

## Quand utiliser cette skill

- L'utilisateur demande de générer un script vidéo
- Mention de "script", "vidéo TikTok", "Reels", "contenu viral"
- Demande de "créer du contenu" pour un commerce local
- Sélection d'une industrie parmi les 22 groupes disponibles

---

## ÉTAPE 1 : Collecte d'informations

### Données OBLIGATOIRES

1. **Nom du commerce**
2. **Industrie** (sélection parmi 22 groupes - voir mapping ci-dessous)
3. **Sujet/Focus** (produit, service, promo à mettre en avant)
4. **Face-cam disponible ?** (oui/non)
5. **Voice-over possible ?** (oui/non)

### Données OPTIONNELLES (améliore la qualité)

- Cible client principal
- Prix/gamme de prix
- Localisation (pour contexte local)
- Objectif (notoriété, clients, promo spécifique)
- Durée préférée (15s, 30s, 45s, 60s)

---

## ÉTAPE 2 : Mapping Industrie → Rapport

### 22 Groupes d'Industries Disponibles

**FOOD & DRINK (5 groupes)**

- `restauration-table` → Rapport "Restauration table"
- `fast-food-street` → Rapport "Fast Food et Street Food"
- `boulangerie-sucre` → Rapport "Boulangerie & Sucré"
- `cafe-boissons` → Rapport "Café & Boissons"
- `bars-nightlife` → Rapport "Bars & Nightlife"

**BEAUTÉ & BIEN-ÊTRE (3 groupes)**

- `coiffure-barbier` → Rapport "Coiffure & Barbier"
- `esthetique-soins` → Rapport "Esthétique & Soins"
- `bien-etre-relaxation` → Rapport "Bien-être & Relaxation"

**SPORT (1 groupe)**

- `fitness-coaching` → Rapport "Fitness & Coaching"

**MODE & RETAIL (3 groupes)**

- `boutique-mode-femme` → Rapport "Boutique Mode Femme"
- `boutique-mode-mixte` → Rapport "Boutique Mode Mixte"
- `commerce-retail` → Rapport "Commerce & Retail"

**SERVICES VISUELS (2 groupes)**

- `artisans-corps` → Rapport "Artisans corps"
- `automobile` → Rapport "Automobile"

**IMMOBILIER & HÉBERGEMENT (2 groupes)**

- `immobilier` → Rapport "Immobilier"
- `hebergement` → Rapport "Hébergement"

**LOISIRS & ÉVÉNEMENTS (2 groupes)**

- `activites-loisirs` → Rapport "Activités & Loisirs"
- `evenementiel` → Rapport "Événementiel"

**SANTÉ & EXPERTISE (2 groupes)**

- `sante-paramedical` → Rapport "Santé & Paramédical"
- `services-pro-conseil` → Rapport "Services pro & Conseil"

**ARTISANAT & BTP (1 groupe)**

- `artisans-btp` → Rapport "Artisans BTP"

**FAMILLE & ANIMAUX (2 groupes)**

- `enfance-famille` → Rapport "Enfance & Famille"
- `animaux` → Rapport "Animaux"

---

## ÉTAPE 3 : Sélection Format Optimal

### Formats Prioritaires par Type Commerce

**Si Face-cam + Voice-over disponibles :**

- **Priorité 1** : UGC/Talking Head (authentique, connexion immédiate)
- **Priorité 2** : Voiceover avec B-roll (éducatif + professionnel)

**Si Face-cam uniquement :**

- **Priorité 1** : UGC/Talking Head silent avec sous-titres
- **Priorité 2** : Slideshow avec texte animé

**Si Voice-over uniquement :**

- **Priorité 1** : Voiceover avec B-roll produit/commerce
- **Priorité 2** : Subtitles avec B-roll (flexibilité audio)

**Si aucun des deux :**

- **Priorité 1** : Slideshow avec texte (budget minimal)
- **Priorité 2** : Subtitles avec B-roll (texte uniquement)

### Formats Spécialisés par Industrie

**Animaux/Toilettage :**

- Transformation Avant/Après (15-60s, 500K-5M+ vues)
- ASMR Grooming (30-90s, 500K-7M+ vues)
- POV Animal (7-30s, 100K-1.2M+ vues)

**Coiffure/Barbier :**

- Transformation capillaire (30-60s)
- Timelapse process (15-45s)
- Avant/Après client (15-30s)

**Restaurant/Food :**

- Food preparation (15-45s)
- Behind the scenes cuisine (30-60s)
- Client reaction/testimonial (15-30s)

---

## ÉTAPE 4 : Sélection Hook Testé

### Hooks Universels Haute Performance

- "Wait until the end..." / "Attendez la fin..." → **Millions de vues**
- "Nobody is talking about this..." / "Personne ne parle de ça..." → **100K-300K vues**
- "Watch this [business] transformation..." → **500K-5M+ vues**
- "3 things your [target] should NEVER [action]" → **500K-2M+ vues**
- "Before you [buy/do X], watch this" → **100K-400K vues**

### Hooks Spécialisés par Industrie

**Animaux :**

- "POV: You're a [pet] at the [service]" → **100K-1.2M+ vues**
- "This [pet owner] had no idea..." → **200K-1M+ vues**

**Food :**

- "The secret ingredient restaurants don't tell you" → **300K-1M+ vues**
- "Making [dish] the traditional way" → **200K-800K vues**

**Beauty :**

- "The transformation no one expected" → **500K-2M+ vues**
- "Client asked for [X], got [Y] instead" → **300K-1M+ vues**

---

## ÉTAPE 5 : Structure de Script Optimisée

### Template de Sortie

```markdown
═══════════════════════════════════════════════════════════════
SCRIPT VIDÉO VIRAL — [Commerce]
═══════════════════════════════════════════════════════════════

📋 MÉTADONNÉES
├── Format recommandé : [Format basé sur analyse]
├── Durée cible : [Basé sur optimal_duration du rapport]
├── Plateformes : TikTok / Instagram Reels / YouTube Shorts
├── Performance prédite : [Fourchette de vues basée sur données]
└── Inspiration : [Compte viral de référence avec metrics]

🎣 HOOK VIRAL (0-3 secondes)
**À l'écran :** [Texte superposé accrocheur]
**À dire :** "[Hook testé avec performance documentée]"
**Action visuelle :** [Première image qui accroche]
💡 **Pourquoi ce hook marche :** [Explication basée sur données réelles]

📝 SCRIPT SECONDE PAR SECONDE

**0-3s : HOOK**
[Action + texte + son détaillés]

**3-10s : DÉVELOPPEMENT**
[Contenu principal, démonstration, transformation]

**10-20s : RÉSOLUTION**
[Résultat, bénéfice client, satisfaction]

**20-X s : CTA**
[Call-to-action clair et spécifique au commerce]

🎬 SHOT LIST
| Timing | Plan | Description | Note technique |
|--------|------|-------------|----------------|
| 0-3s | Plan 1 | [Description précise] | [Conseil technique] |
| 3-10s | Plan 2 | [Description précise] | [Conseil technique] |
| ... | ... | ... | ... |

📱 INSTRUCTIONS TOURNAGE
**Équipement :** Smartphone + [équipement spécifique si nécessaire]
**Éclairage :** [Recommandations spécifiques]
**Cadrage :** [Format vertical 9:16, conseils de composition]
**Audio :** [Si voice-over, conseils enregistrement]

🎵 SUGGESTIONS AUDIO
**Option 1 :** [Musique trending avec raison du choix]
**Option 2 :** [Alternative avec mood différent]
**Option 3 :** [Option silencieuse avec sous-titres]

⚠️ ERREURS FATALES À ÉVITER

- [Erreur du rapport industrie + solution]
- [Erreur du rapport industrie + solution]
- [Erreur du rapport industrie + solution]

📊 POURQUOI CE SCRIPT VA PERFORMER

1. **Format éprouvé :** [Stats du format dans l'industrie]
2. **Hook testé :** [Performance documentée du hook utilisé]
3. **Inspiration viral :** [Référence compte viral avec metrics]
4. **Optimisé mobile :** [Adapté à 70% trafic local mobile]

🔄 VARIANTES SUGGÉRÉES
**Version courte (15s) :** [Adaptation condensée]
**Version série :** [Comment en faire un format récurrent]
**Version testimonial :** [Avec client satisfait]
```

---

## ÉTAPE 6 : Système de Crédits

### Coût par Génération

- **Génération script :** 100 Sparks
- **Régénération :** 50 Sparks
- **Variante supplémentaire :** 30 Sparks

### Vérification Solde

Avant génération, vérifier que l'utilisateur a suffisamment de Sparks dans son profil Supabase.

---

## ÉTAPE 7 : Sauvegarde et Historique

### Données à sauvegarder (table `scripts`)

- user_id
- commerce_name
- industry_group
- format_used
- hook_used
- content (script complet)
- performance_prediction
- inspiration_account
- created_at

### Métadonnées JSON

```json
{
  "industry": "animaux",
  "format": "transformation-avant-apres",
  "hook_pattern": "wait-until-end",
  "duration": "30s",
  "face_cam": true,
  "voice_over": false,
  "inspiration_account": "@girlwithedogs",
  "predicted_views": "500K-5M",
  "sparks_cost": 100
}
```

---

## Workflow Complet

1. **Collecte** → Récupérer infos commerce + industrie
2. **Mapping** → Identifier rapport d'industrie correspondant
3. **Analyse** → Sélectionner format optimal selon capacités
4. **Hook** → Choisir hook testé haute performance
5. **Génération** → Créer script structuré avec données réelles
6. **Optimisation** → Ajouter conseils techniques spécifiques
7. **Sauvegarde** → Stocker avec métadonnées pour analytics

**Résultat** : Script viral professionnel basé sur vraies données de performance, pas sur des approximations.

---

_Skill VuVenu Script Generator v2.0_
_Basée sur 22 rapports d'industries avec 100+ comptes viraux analysés_
