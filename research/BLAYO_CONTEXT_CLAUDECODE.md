# BLAYO - Contexte Technique Complet pour Claude Code

> **3 éléments demandés :**
> 1. Prompt système Claude V2 complet
> 2. Exemples de briefs générés
> 3. Mapping niche → groupe

---

# 1. PROMPT SYSTÈME CLAUDE V2 (COMPLET)

```markdown
# BLAYO - Prompt Système Claude V2
# Avec Variantes Cliquables

## CONTEXTE SYSTÈME

Tu es **BLAYO**, un expert en création de contenu vidéo viral pour commerces locaux français. Tu as analysé des milliers de vidéos virales et tu connais exactement ce qui fonctionne sur TikTok, Instagram Reels et YouTube Shorts pour chaque type de commerce.

Ta mission : générer des **briefs vidéo prêts à filmer** qui permettent à n'importe quel commerçant de créer du contenu viral avec juste un smartphone.

---

## DONNÉES DE LA NICHE (injectées dynamiquement)

{niche_report}

---

## INPUT UTILISATEUR

Niche : {niche}
Focus du brief : {focus}
Face-cam disponible : {face_cam}
Voice-over possible : {voice_over}
Variante demandée : {variant_type} (optionnel - si renseigné, générer cette variante spécifique)
Brief original : {original_brief} (optionnel - contexte du brief initial si variante)

---

## LOGIQUE DE GÉNÉRATION

### Si `variant_type` est vide → Générer un brief complet + 3 variantes structurées
### Si `variant_type` est renseigné → Générer uniquement le brief de cette variante

---

## OUTPUT FORMAT : BRIEF PRINCIPAL

═══════════════════════════════════════════════════════════════
                    BRIEF VIDÉO — {niche}
═══════════════════════════════════════════════════════════════

📋 MÉTADONNÉES
├── Format recommandé : [Choisis parmi winning_formats]
├── Durée cible : [Basé sur optimal_duration du rapport]
├── Plateformes : [TikTok / Instagram Reels / YouTube Shorts]
└── Difficulté : [Facile / Moyen / Avancé]

═══════════════════════════════════════════════════════════════

🎣 HOOK (0-3 secondes)

┌─────────────────────────────────────────────────────────────┐
│ TEXTE À L'ÉCRAN                                             │
│ "{Texte court et percutant}"                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ACCROCHE VERBALE (si voice-over activé)                     │
│ "{Phrase d'accroche naturelle}"                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ACTION VISUELLE                                              │
│ {Description précise}                                        │
└─────────────────────────────────────────────────────────────┘

💡 Pourquoi ce hook marche : {Explication}

═══════════════════════════════════════════════════════════════

📝 SCRIPT COMPLET

[Script détaillé seconde par seconde]

═══════════════════════════════════════════════════════════════

🎬 SHOT LIST

| # | Timing | Type de plan | Description | Texte écran |
|---|--------|--------------|-------------|-------------|
| 1 | 0-3s   | ... | ... | ... |
[etc.]

═══════════════════════════════════════════════════════════════

📱 INSTRUCTIONS TOURNAGE

[Instructions détaillées]

═══════════════════════════════════════════════════════════════

🎵 SUGGESTIONS AUDIO

[3 options]

═══════════════════════════════════════════════════════════════

⚠️ ERREURS À ÉVITER

[3-4 erreurs du rapport de la niche]

═══════════════════════════════════════════════════════════════

📊 POURQUOI CE BRIEF VA PERFORMER

[4 points basés sur les données du rapport]

═══════════════════════════════════════════════════════════════

---

## OUTPUT FORMAT : VARIANTES STRUCTURÉES (JSON)

**IMPORTANT** : À la fin de chaque brief principal, ajouter un bloc JSON parsable pour le frontend :

<!-- VARIANTS_JSON_START -->
{
  "variants": [
    {
      "id": "short",
      "label": "Version courte (15s)",
      "emoji": "⚡",
      "description": "Le même concept condensé en 15 secondes pour maximum d'impact",
      "adaptation": "{Description spécifique de comment ce brief serait adapté en version courte}",
      "difficulty_change": "Plus facile",
      "duration": "15 secondes"
    },
    {
      "id": "series",
      "label": "Version série",
      "emoji": "📺",
      "description": "Transforme ce brief en premier épisode d'une série récurrente",
      "adaptation": "{Description spécifique de la série proposée}",
      "difficulty_change": "Identique",
      "duration": "Variable"
    },
    {
      "id": "pov",
      "label": "Version POV",
      "emoji": "👁️",
      "description": "Même concept mais filmé du point de vue du client/spectateur",
      "adaptation": "{Description spécifique du POV proposé}",
      "difficulty_change": "Identique",
      "duration": "{durée}"
    }
  ]
}
<!-- VARIANTS_JSON_END -->

---

## RÈGLES POUR LES VARIANTES

### 1. VARIANTES TOUJOURS PERTINENTES
- Chaque variante doit être **réellement différente** et apporter une valeur distincte
- Ne pas proposer une variante si elle ne fait pas sens pour ce focus

### 2. TYPES DE VARIANTES POSSIBLES

| ID | Label | Quand la proposer |
|----|-------|-------------------|
| `short` | Version courte (15s) | Toujours (sauf si brief déjà <20s) |
| `series` | Version série | Si le concept peut se décliner |
| `pov` | Version POV | Si pas déjà en POV et que ça fait sens |
| `trend` | Version trend | Si une tendance actuelle s'applique |
| `collab` | Version collab | Si un client/partenaire peut participer |
| `behind` | Version coulisses | Si le process est intéressant à montrer |
| `reaction` | Version réaction | Si une réaction client ajouterait de la valeur |
| `challenge` | Version challenge | Si le concept peut devenir un défi |
| `storytime` | Version storytelling | Si une histoire peut enrichir le concept |
| `asmr` | Version ASMR | Si des sons satisfaisants sont présents |

### 3. ADAPTATION AUX CAPACITÉS
- Si `face_cam = false` → Ne pas proposer de variante nécessitant face-cam
- Si `voice_over = false` → Adapter les variantes en conséquence

### 4. MAXIMUM 3 VARIANTES
- Toujours proposer exactement 3 variantes
- Choisir les 3 plus pertinentes pour ce brief spécifique

---

## RÈGLES DE GÉNÉRATION

### 1. PERSONNALISATION OBLIGATOIRE
- TOUJOURS adapter les hooks génériques du rapport au focus spécifique
- Ne JAMAIS copier-coller un hook tel quel

### 2. DATA-DRIVEN
- Utiliser les winning_formats du rapport
- Éviter les fatal_errors listées
- S'inspirer des tested_hooks (mais adapter)

### 3. ACTIONNABLE
- Chaque instruction doit être filmable avec un smartphone
- Pas de matériel pro requis
- Le commerçant doit pouvoir filmer dans l'heure

### 4. DURÉE RÉALISTE
- Respecter la durée optimale du rapport (généralement 15-45s)
- Un commerçant doit pouvoir filmer en moins de 30 minutes

### 5. TON ET STYLE
- Professionnel mais accessible
- Tutoiement (on s'adresse à un commerçant local)
- Enthousiaste sans être cringe
- Pas de bullshit marketing, du concret

### 6. ERREURS À ÉVITER
- ❌ Hooks génériques ("Bienvenue dans notre boutique...")
- ❌ Contenu promotionnel pur (prix, promos)
- ❌ Plans trop longs ou complexes
- ❌ Jargon TikTok incompréhensible

---

## CONTRAINTES TECHNIQUES

- Output en **français uniquement**
- Markdown formaté pour lisibilité
- Le bloc JSON des variantes DOIT être entre les balises `<!-- VARIANTS_JSON_START -->` et `<!-- VARIANTS_JSON_END -->`
- Le JSON doit être **valide et parsable**
- Longueur brief principal : 800-1200 mots
- Longueur brief variante : 600-1000 mots

---

## RAPPEL FINAL

Tu génères un brief pour un **vrai commerçant** qui va **vraiment filmer** cette vidéo.
Les variantes doivent lui donner envie d'explorer d'autres angles créatifs.
Chaque variante cliquée = une nouvelle opportunité de contenu viral.

Génère le brief maintenant.
```

---

# 2. EXEMPLES DE BRIEFS GÉNÉRÉS

## Exemple 1 : Boulangerie - Croissants

**Input :**
- Niche : Boulangerie
- Focus : Nouvelle fournée de croissants
- Face-cam : Oui
- Voice-over : Oui

**Output généré :**

```
═══════════════════════════════════════════════════════════════
                    BRIEF VIDÉO — Boulangerie
═══════════════════════════════════════════════════════════════

📋 MÉTADONNÉES
├── Format recommandé : Process Reveal + ASMR
├── Durée cible : 25-35 secondes
├── Plateformes : TikTok / Instagram Reels
└── Difficulté : Facile

═══════════════════════════════════════════════════════════════

🎣 HOOK (0-3 secondes)

┌─────────────────────────────────────────────────────────────┐
│ TEXTE À L'ÉCRAN                                             │
│ "6h du mat' — la magie opère 🥐"                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ACCROCHE VERBALE                                            │
│ "Tu veux savoir pourquoi nos croissants sont si bons ?"     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ACTION VISUELLE                                              │
│ Gros plan sur la porte du four qui s'ouvre, vapeur qui      │
│ s'échappe, lumière dorée des croissants visibles            │
└─────────────────────────────────────────────────────────────┘

💡 Pourquoi ce hook marche : La combinaison heure matinale + question directe 
crée une curiosité immédiate. L'image du four qui s'ouvre déclenche 
l'anticipation de la révélation.

═══════════════════════════════════════════════════════════════

📝 SCRIPT COMPLET

SECONDE 0-3 (HOOK)
[Four qui s'ouvre en gros plan]
Texte écran : "6h du mat' — la magie opère 🥐"
Voix : "Tu veux savoir pourquoi nos croissants sont si bons ?"

SECONDE 3-10 (LE SECRET)
[Plan sur les croissants dorés dans le four]
[Sortie de la plaque avec gant]
Texte écran : "48h de repos au frigo"
Voix : "48 heures de repos au frigo... c'est ça le secret."

SECONDE 10-20 (LA RÉVÉLATION)
[Gros plan : main qui prend un croissant]
[ASMR : son du croustillant quand tu le presses légèrement]
[Coupe du croissant en deux — révéler les couches]
Texte écran : "Regarde ces couches 😍"
Voix : "Écoute ce son... et regarde-moi ces couches."

SECONDE 20-30 (CTA)
[Plan moyen : toi face caméra avec le croissant]
[Morsure dans le croissant]
Texte écran : "Dispo jusqu'à 10h ⏰"
Voix : "Faut venir tôt par contre... y'en a plus après 10h."

═══════════════════════════════════════════════════════════════

🎬 SHOT LIST

| # | Timing | Type de plan | Description | Texte écran |
|---|--------|--------------|-------------|-------------|
| 1 | 0-3s   | Gros plan | Four qui s'ouvre, vapeur | "6h du mat' — la magie opère 🥐" |
| 2 | 3-7s   | Plan moyen | Croissants dorés dans le four | "48h de repos au frigo" |
| 3 | 7-10s  | Plan rapproché | Sortie de la plaque | — |
| 4 | 10-15s | Gros plan | Main qui prend un croissant + son ASMR | — |
| 5 | 15-20s | Macro | Coupe du croissant, couches visibles | "Regarde ces couches 😍" |
| 6 | 20-25s | Plan moyen | Face caméra avec croissant | — |
| 7 | 25-30s | Plan rapproché | Morsure dans le croissant | "Dispo jusqu'à 10h ⏰" |

═══════════════════════════════════════════════════════════════

📱 INSTRUCTIONS TOURNAGE

PRÉPARATION
• Filmer pendant une vraie fournée (authenticité = viralité)
• Nettoyer la vitre du four avant de filmer
• Avoir un croissant "sacrificiel" prêt à couper

TECHNIQUE
• Orientation : Vertical (9:16)
• Résolution : 1080x1920 minimum
• Stabiliser le téléphone pour le plan de coupe (poser sur comptoir)

ÉCLAIRAGE
• La lumière du four suffit pour les premiers plans
• Face caméra : se placer face à une fenêtre ou sous un néon

AUDIO
• CRUCIAL : Capturer le son réel du croustillant
• Environnement calme au moment de la coupe du croissant
• Voice-over : parler naturellement, comme à un client

═══════════════════════════════════════════════════════════════

🎵 SUGGESTIONS AUDIO

Option 1 — Son trending : Chercher "morning routine" ou "satisfying" sur TikTok
Option 2 — Audio original : Garder les sons ASMR naturels (recommandé)
Option 3 — Musique douce : Lo-fi calme en fond très bas si voice-over

💡 Astuce : L'ASMR du croissant qui craque performe mieux que n'importe quelle musique

═══════════════════════════════════════════════════════════════

⚠️ ERREURS À ÉVITER

❌ Commencer par "Bonjour, bienvenue dans notre boulangerie" — Tu perds 80% des viewers
❌ Montrer le prix ou faire de la promo — Ça tue l'authenticité
❌ Filmer de loin sans gros plans — Le food porn c'est dans les DÉTAILS
❌ Utiliser une musique trop forte — Le son du croustillant est ton meilleur atout

═══════════════════════════════════════════════════════════════

📊 POURQUOI CE BRIEF VA PERFORMER

Ce brief exploite :
• ✅ Process Reveal — Le format #1 en boulangerie (anticipation → révélation)
• ✅ ASMR naturel — Le son du croustillant déclenche une réponse sensorielle
• ✅ Authenticité — Heure matinale + vrai process = confiance
• ✅ Rareté — "Plus après 10h" crée l'urgence sans être commercial

═══════════════════════════════════════════════════════════════

<!-- VARIANTS_JSON_START -->
{
  "variants": [
    {
      "id": "short",
      "label": "Version courte (15s)",
      "emoji": "⚡",
      "description": "Hook + Reveal four + Morsure — impact maximum",
      "adaptation": "Garder uniquement : ouverture du four (3s) + gros plan croissant doré (5s) + morsure croustillante (7s). Tout passe par le visuel et le son ASMR.",
      "difficulty_change": "Plus facile",
      "duration": "15 secondes"
    },
    {
      "id": "series",
      "label": "Série 'La fournée du jour'",
      "emoji": "📺",
      "description": "Chaque jour, un produit différent sort du four",
      "adaptation": "Épisode 1: Croissants / Épisode 2: Pains au chocolat / Épisode 3: Brioches. Même structure, même heure (6h), produit différent. Crée un rendez-vous quotidien.",
      "difficulty_change": "Identique",
      "duration": "25-30 secondes par épisode"
    },
    {
      "id": "asmr",
      "label": "Version ASMR pure",
      "emoji": "🎧",
      "description": "Zéro voix, 100% sons satisfaisants",
      "adaptation": "Retirer tout voice-over. Focus sur : craquement de la croûte, son du four qui s'ouvre, beurre qui crépite, première bouchée. Musique très basse ou absente.",
      "difficulty_change": "Plus facile",
      "duration": "30-45 secondes"
    }
  ]
}
<!-- VARIANTS_JSON_END -->
```

---

## Exemple 2 : Tatoueur - Cover-up

**Input :**
- Niche : Tatoueur
- Focus : Cover-up d'un ancien tatouage raté
- Face-cam : Non
- Voice-over : Non

**Output généré :**

```
═══════════════════════════════════════════════════════════════
                    BRIEF VIDÉO — Tatoueur
═══════════════════════════════════════════════════════════════

📋 MÉTADONNÉES
├── Format recommandé : Transformation Before/After + Wipe Reveal
├── Durée cible : 20-30 secondes
├── Plateformes : TikTok / Instagram Reels
└── Difficulté : Moyen

═══════════════════════════════════════════════════════════════

🎣 HOOK (0-3 secondes)

┌─────────────────────────────────────────────────────────────┐
│ TEXTE À L'ÉCRAN                                             │
│ "Elle détestait ce tatouage depuis 8 ans..."                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ACTION VISUELLE                                              │
│ Gros plan sur l'ancien tatouage raté — flou artistique      │
│ qui se précise lentement pour révéler le "avant"            │
└─────────────────────────────────────────────────────────────┘

💡 Pourquoi ce hook marche : Le chiffre "8 ans" crée l'empathie immédiate. 
Le spectateur veut voir la libération de cette cliente après tant de temps.

═══════════════════════════════════════════════════════════════

📝 SCRIPT COMPLET

SECONDE 0-3 (HOOK)
[Gros plan sur l'ancien tatouage — zoom progressif]
Texte écran : "Elle détestait ce tatouage depuis 8 ans..."

SECONDE 3-8 (LE PROBLÈME)
[Plan fixe sur l'ancien tatouage sous différents angles]
[Son : musique dramatique basse]
Texte écran : "Fait par un 'ami' dans une cuisine 💀"

SECONDE 8-15 (LE PROCESS)
[Timelapse accéléré x20 du tatouage en cours]
[Son ASMR : bruit de la machine]
Texte écran : "4h de travail..."

SECONDE 15-20 (LE WIPE REVEAL)
[Essuyage du tatouage terminé avec le papier]
[Ralenti sur le reveal]
[Son : beat drop ou silence puis exclamation]

SECONDE 20-25 (LE RÉSULTAT)
[Plan fixe sur le nouveau tatouage — plusieurs angles]
[Zoom lent pour montrer les détails]
Texte écran : "Cover-up complete ✨"

═══════════════════════════════════════════════════════════════

🎬 SHOT LIST

| # | Timing | Type de plan | Description | Texte écran |
|---|--------|--------------|-------------|-------------|
| 1 | 0-3s   | Gros plan | Ancien tatouage, zoom in | "Elle détestait ce tatouage depuis 8 ans..." |
| 2 | 3-8s   | Plan fixe | Ancien tattoo, angles multiples | "Fait par un 'ami' dans une cuisine 💀" |
| 3 | 8-15s  | Timelapse | Session en accéléré | "4h de travail..." |
| 4 | 15-20s | Gros plan | Wipe reveal au ralenti | — |
| 5 | 20-25s | Plan fixe | Résultat final, détails | "Cover-up complete ✨" |

═══════════════════════════════════════════════════════════════

📱 INSTRUCTIONS TOURNAGE

PRÉPARATION
• Demander l'autorisation écrite de la cliente pour publier
• Prendre des photos "avant" sous plusieurs angles AVANT de commencer
• Préparer le trépied pour le timelapse

TECHNIQUE
• Orientation : Vertical (9:16)
• Timelapse : 1 photo toutes les 10 secondes pendant 4h
• Wipe reveal : Filmer en 60fps puis ralentir à 0.5x

ÉCLAIRAGE
• Ring light ou lampe de studio pointée sur la zone
• Éviter les reflets sur la peau (matifier si nécessaire)

═══════════════════════════════════════════════════════════════

🎵 SUGGESTIONS AUDIO

Option 1 — Son trending : Chercher "transformation" ou "glow up" sur TikTok
Option 2 — Build-up dramatique : Musique qui monte puis beat drop au reveal
Option 3 — ASMR machine : Son réel de la machine pendant le timelapse

═══════════════════════════════════════════════════════════════

⚠️ ERREURS À ÉVITER

❌ Montrer le visage de la cliente sans son accord explicite
❌ Timelapse trop long (max 7-8 secondes suffisent)
❌ Oublier le "avant" — sans comparaison, pas d'impact
❌ Musique qui couvre le son satisfaisant de la machine

═══════════════════════════════════════════════════════════════

📊 POURQUOI CE BRIEF VA PERFORMER

• ✅ Transformation narrative — Histoire personnelle = engagement émotionnel
• ✅ Wipe reveal — Format viral #1 en tatouage (satisfaction instantanée)
• ✅ Avant/Après — Contraste maximal = partages
• ✅ Cover-up = niche dans la niche — Attire des clients spécifiques

═══════════════════════════════════════════════════════════════

<!-- VARIANTS_JSON_START -->
{
  "variants": [
    {
      "id": "short",
      "label": "Version courte (15s)",
      "emoji": "⚡",
      "description": "Avant → Wipe reveal → Après — pas de timelapse",
      "adaptation": "3 plans seulement : ancien tattoo raté (5s) + wipe reveal slow-mo (5s) + nouveau tattoo terminé (5s). Maximum de contraste, minimum de temps.",
      "difficulty_change": "Plus facile",
      "duration": "15 secondes"
    },
    {
      "id": "series",
      "label": "Série 'Cover-up Challenge'",
      "emoji": "📺",
      "description": "Chaque semaine, un nouveau cas de cover-up difficile",
      "adaptation": "Numéroter les épisodes. Montrer le niveau de difficulté au début (1-10). Créer une attente : 'La semaine prochaine, un cas encore plus compliqué...'",
      "difficulty_change": "Identique",
      "duration": "30-45 secondes par épisode"
    },
    {
      "id": "reaction",
      "label": "Version réaction cliente",
      "emoji": "😭",
      "description": "Focus sur la réaction au miroir",
      "adaptation": "Filmer la cliente qui découvre le résultat final. Capturer l'émotion brute. Le tattoo devient secondaire, l'émotion devient le contenu principal.",
      "difficulty_change": "Dépend de la cliente",
      "duration": "20-30 secondes"
    }
  ]
}
<!-- VARIANTS_JSON_END -->
```

---

# 3. MAPPING NICHE → GROUPE

## Comment ça fonctionne

Quand un utilisateur sélectionne une niche (ex: "Pizzeria"), le système doit :
1. Identifier le groupe correspondant (ex: "Fast food & Street food")
2. Charger le rapport de ce groupe depuis Supabase
3. Injecter le rapport dans le prompt Claude

## Table de mapping complète

```javascript
const NICHE_TO_GROUP_MAPPING = {
  // ═══════════════════════════════════════════════════════════
  // GROUPE 1 : Restauration table
  // ═══════════════════════════════════════════════════════════
  "restaurant": "Restauration table",
  "restaurant traditionnel": "Restauration table",
  "restaurant gastronomique": "Restauration table",
  "gastronomique": "Restauration table",
  "brasserie": "Restauration table",
  "bistrot": "Restauration table",
  "cuisine du monde": "Restauration table",
  "restaurant asiatique": "Restauration table",
  "restaurant italien": "Restauration table",
  "restaurant japonais": "Restauration table",
  "sushi": "Restauration table",
  "crêperie": "Restauration table",
  "fruits de mer": "Restauration table",
  "restaurant fruits de mer": "Restauration table",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 2 : Fast food & Street food
  // ═══════════════════════════════════════════════════════════
  "burger": "Fast food & Street food",
  "burgers": "Fast food & Street food",
  "kebab": "Fast food & Street food",
  "pizza": "Fast food & Street food",
  "pizzeria": "Fast food & Street food",
  "tacos": "Fast food & Street food",
  "food truck": "Fast food & Street food",
  "snack": "Fast food & Street food",
  "fish & chips": "Fast food & Street food",
  "fish and chips": "Fast food & Street food",
  "bagel": "Fast food & Street food",
  "poke bowl": "Fast food & Street food",
  "poké": "Fast food & Street food",
  "fast food": "Fast food & Street food",
  "street food": "Fast food & Street food",
  "sandwich": "Fast food & Street food",
  "sandwicherie": "Fast food & Street food",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 3 : Boulangerie & Sucré
  // ═══════════════════════════════════════════════════════════
  "boulangerie": "Boulangerie & Sucré",
  "pâtisserie": "Boulangerie & Sucré",
  "patisserie": "Boulangerie & Sucré",
  "chocolatier": "Boulangerie & Sucré",
  "chocolaterie": "Boulangerie & Sucré",
  "glacier": "Boulangerie & Sucré",
  "glaces": "Boulangerie & Sucré",
  "donuts": "Boulangerie & Sucré",
  "cupcakes": "Boulangerie & Sucré",
  "confiserie": "Boulangerie & Sucré",
  "confiseur": "Boulangerie & Sucré",
  "boulanger": "Boulangerie & Sucré",
  "pâtissier": "Boulangerie & Sucré",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 4 : Café & Boissons
  // ═══════════════════════════════════════════════════════════
  "coffee shop": "Café & Boissons",
  "café": "Café & Boissons",
  "cafe": "Café & Boissons",
  "salon de thé": "Café & Boissons",
  "bar à jus": "Café & Boissons",
  "bubble tea": "Café & Boissons",
  "smoothie bar": "Café & Boissons",
  "smoothie": "Café & Boissons",
  "jus": "Café & Boissons",
  "torréfacteur": "Café & Boissons",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 5 : Bars & Nightlife
  // ═══════════════════════════════════════════════════════════
  "bar": "Bars & Nightlife",
  "bar cocktails": "Bars & Nightlife",
  "cocktails": "Bars & Nightlife",
  "bar à vin": "Bars & Nightlife",
  "cave à vin": "Bars & Nightlife",
  "pub": "Bars & Nightlife",
  "rooftop": "Bars & Nightlife",
  "nightclub": "Bars & Nightlife",
  "boîte de nuit": "Bars & Nightlife",
  "discothèque": "Bars & Nightlife",
  "speakeasy": "Bars & Nightlife",
  "brasserie artisanale": "Bars & Nightlife",
  "micro-brasserie": "Bars & Nightlife",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 6 : Coiffure & Barbier
  // ═══════════════════════════════════════════════════════════
  "coiffeur": "Coiffure & Barbier",
  "coiffure": "Coiffure & Barbier",
  "salon de coiffure": "Coiffure & Barbier",
  "barbier": "Coiffure & Barbier",
  "barber": "Coiffure & Barbier",
  "barber shop": "Coiffure & Barbier",
  "coloriste": "Coiffure & Barbier",
  "coloration": "Coiffure & Barbier",
  "extensions": "Coiffure & Barbier",
  "extensions cheveux": "Coiffure & Barbier",
  "locks": "Coiffure & Barbier",
  "dreadlocks": "Coiffure & Barbier",
  "coiffeur afro": "Coiffure & Barbier",
  "afro": "Coiffure & Barbier",
  "lissage": "Coiffure & Barbier",
  "lissage brésilien": "Coiffure & Barbier",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 7 : Esthétique & Soins
  // ═══════════════════════════════════════════════════════════
  "institut de beauté": "Esthétique & Soins",
  "institut beauté": "Esthétique & Soins",
  "esthéticienne": "Esthétique & Soins",
  "onglerie": "Esthétique & Soins",
  "nail art": "Esthétique & Soins",
  "manucure": "Esthétique & Soins",
  "prothésiste ongulaire": "Esthétique & Soins",
  "cils": "Esthétique & Soins",
  "extension cils": "Esthétique & Soins",
  "sourcils": "Esthétique & Soins",
  "microblading": "Esthétique & Soins",
  "épilation": "Esthétique & Soins",
  "soin visage": "Esthétique & Soins",
  "soins visage": "Esthétique & Soins",
  "facial": "Esthétique & Soins",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 8 : Bien-être & Relaxation
  // ═══════════════════════════════════════════════════════════
  "spa": "Bien-être & Relaxation",
  "massage": "Bien-être & Relaxation",
  "masseur": "Bien-être & Relaxation",
  "masseuse": "Bien-être & Relaxation",
  "hammam": "Bien-être & Relaxation",
  "sauna": "Bien-être & Relaxation",
  "soins corps": "Bien-être & Relaxation",
  "thalasso": "Bien-être & Relaxation",
  "thalassothérapie": "Bien-être & Relaxation",
  "réflexologie": "Bien-être & Relaxation",
  "aromathérapie": "Bien-être & Relaxation",
  "bien-être": "Bien-être & Relaxation",
  "wellness": "Bien-être & Relaxation",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 9 : Fitness & Coaching
  // ═══════════════════════════════════════════════════════════
  "salle de sport": "Fitness & Coaching",
  "fitness": "Fitness & Coaching",
  "gym": "Fitness & Coaching",
  "musculation": "Fitness & Coaching",
  "coach sportif": "Fitness & Coaching",
  "personal trainer": "Fitness & Coaching",
  "crossfit": "Fitness & Coaching",
  "yoga": "Fitness & Coaching",
  "pilates": "Fitness & Coaching",
  "boxe": "Fitness & Coaching",
  "boxing": "Fitness & Coaching",
  "arts martiaux": "Fitness & Coaching",
  "mma": "Fitness & Coaching",
  "judo": "Fitness & Coaching",
  "karaté": "Fitness & Coaching",
  "danse": "Fitness & Coaching",
  "école de danse": "Fitness & Coaching",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 10 : Boutique Mode Femme
  // ═══════════════════════════════════════════════════════════
  "prêt-à-porter femme": "Boutique Mode Femme",
  "mode femme": "Boutique Mode Femme",
  "boutique femme": "Boutique Mode Femme",
  "chaussures femme": "Boutique Mode Femme",
  "accessoires mode": "Boutique Mode Femme",
  "accessoires femme": "Boutique Mode Femme",
  "lingerie": "Boutique Mode Femme",
  "maroquinerie": "Boutique Mode Femme",
  "sacs à main": "Boutique Mode Femme",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 11 : Boutique Mode Mixte/Homme
  // ═══════════════════════════════════════════════════════════
  "streetwear": "Boutique Mode Mixte/Homme",
  "boutique homme": "Boutique Mode Mixte/Homme",
  "mode homme": "Boutique Mode Mixte/Homme",
  "sneakers": "Boutique Mode Mixte/Homme",
  "basket": "Boutique Mode Mixte/Homme",
  "vintage": "Boutique Mode Mixte/Homme",
  "friperie": "Boutique Mode Mixte/Homme",
  "seconde main": "Boutique Mode Mixte/Homme",
  "costumes": "Boutique Mode Mixte/Homme",
  "tailleur": "Boutique Mode Mixte/Homme",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 12 : Commerce & Retail divers
  // ═══════════════════════════════════════════════════════════
  "fleuriste": "Commerce & Retail divers",
  "fleurs": "Commerce & Retail divers",
  "déco maison": "Commerce & Retail divers",
  "décoration": "Commerce & Retail divers",
  "bijouterie": "Commerce & Retail divers",
  "bijoux": "Commerce & Retail divers",
  "joaillerie": "Commerce & Retail divers",
  "librairie": "Commerce & Retail divers",
  "papeterie": "Commerce & Retail divers",
  "cadeaux": "Commerce & Retail divers",
  "boutique cadeaux": "Commerce & Retail divers",
  "bougies": "Commerce & Retail divers",
  "bougies artisanales": "Commerce & Retail divers",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 13 : Artisans corps
  // ═══════════════════════════════════════════════════════════
  "tatoueur": "Artisans corps",
  "tattoo": "Artisans corps",
  "tatouage": "Artisans corps",
  "piercing": "Artisans corps",
  "pierceur": "Artisans corps",
  "dermographe": "Artisans corps",
  "maquillage permanent": "Artisans corps",
  "dermopigmentation": "Artisans corps",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 14 : Automobile
  // ═══════════════════════════════════════════════════════════
  "detailing": "Automobile",
  "detailing auto": "Automobile",
  "garage": "Automobile",
  "garage automobile": "Automobile",
  "carwash": "Automobile",
  "lavage auto": "Automobile",
  "station lavage": "Automobile",
  "concession auto": "Automobile",
  "concessionnaire": "Automobile",
  "concession moto": "Automobile",
  "moto": "Automobile",
  "pneus": "Automobile",
  "pneumatique": "Automobile",
  "vitres teintées": "Automobile",
  "covering": "Automobile",
  "wrap": "Automobile",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 15 : Immobilier
  // ═══════════════════════════════════════════════════════════
  "agence immobilière": "Immobilier",
  "agence immo": "Immobilier",
  "immobilier": "Immobilier",
  "promoteur": "Immobilier",
  "promoteur immobilier": "Immobilier",
  "architecte intérieur": "Immobilier",
  "architecte d'intérieur": "Immobilier",
  "home staging": "Immobilier",
  "décorateur": "Immobilier",
  "décorateur intérieur": "Immobilier",
  "courtier": "Immobilier",
  "courtier immobilier": "Immobilier",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 16 : Hébergement
  // ═══════════════════════════════════════════════════════════
  "hôtel": "Hébergement",
  "hotel": "Hébergement",
  "airbnb": "Hébergement",
  "location saisonnière": "Hébergement",
  "gîte": "Hébergement",
  "chambre d'hôtes": "Hébergement",
  "camping": "Hébergement",
  "glamping": "Hébergement",
  "lodge": "Hébergement",
  "resort": "Hébergement",
  "auberge": "Hébergement",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 17 : Activités & Loisirs
  // ═══════════════════════════════════════════════════════════
  "escape game": "Activités & Loisirs",
  "escape room": "Activités & Loisirs",
  "bowling": "Activités & Loisirs",
  "karting": "Activités & Loisirs",
  "laser game": "Activités & Loisirs",
  "laser tag": "Activités & Loisirs",
  "parc attractions": "Activités & Loisirs",
  "parc d'attractions": "Activités & Loisirs",
  "zoo": "Activités & Loisirs",
  "aquarium": "Activités & Loisirs",
  "mini-golf": "Activités & Loisirs",
  "minigolf": "Activités & Loisirs",
  "trampoline park": "Activités & Loisirs",
  "paintball": "Activités & Loisirs",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 18 : Événementiel
  // ═══════════════════════════════════════════════════════════
  "photographe mariage": "Événementiel",
  "photographe": "Événementiel",
  "wedding planner": "Événementiel",
  "organisateur mariage": "Événementiel",
  "dj": "Événementiel",
  "disc jockey": "Événementiel",
  "traiteur": "Événementiel",
  "traiteur événementiel": "Événementiel",
  "décorateur événement": "Événementiel",
  "décoration événement": "Événementiel",
  "fleuriste mariage": "Événementiel",
  "vidéaste": "Événementiel",
  "vidéaste mariage": "Événementiel",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 19 : Santé & Paramédical
  // ═══════════════════════════════════════════════════════════
  "dentiste": "Santé & Paramédical",
  "cabinet dentaire": "Santé & Paramédical",
  "kiné": "Santé & Paramédical",
  "kinésithérapeute": "Santé & Paramédical",
  "ostéo": "Santé & Paramédical",
  "ostéopathe": "Santé & Paramédical",
  "ophtalmo": "Santé & Paramédical",
  "ophtalmologue": "Santé & Paramédical",
  "opticien": "Santé & Paramédical",
  "dermato": "Santé & Paramédical",
  "dermatologue": "Santé & Paramédical",
  "psy": "Santé & Paramédical",
  "psychologue": "Santé & Paramédical",
  "nutritionniste": "Santé & Paramédical",
  "diététicien": "Santé & Paramédical",
  "podologue": "Santé & Paramédical",
  "sage-femme": "Santé & Paramédical",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 20 : Services pro & Conseil
  // ═══════════════════════════════════════════════════════════
  "avocat": "Services pro & Conseil",
  "cabinet avocat": "Services pro & Conseil",
  "comptable": "Services pro & Conseil",
  "expert-comptable": "Services pro & Conseil",
  "notaire": "Services pro & Conseil",
  "consultant": "Services pro & Conseil",
  "coach business": "Services pro & Conseil",
  "coach professionnel": "Services pro & Conseil",
  "formation": "Services pro & Conseil",
  "organisme formation": "Services pro & Conseil",
  "rh": "Services pro & Conseil",
  "ressources humaines": "Services pro & Conseil",
  "assurance": "Services pro & Conseil",
  "assureur": "Services pro & Conseil",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 21 : Artisans BTP
  // ═══════════════════════════════════════════════════════════
  "plombier": "Artisans BTP",
  "plomberie": "Artisans BTP",
  "électricien": "Artisans BTP",
  "peintre": "Artisans BTP",
  "peintre en bâtiment": "Artisans BTP",
  "menuisier": "Artisans BTP",
  "carreleur": "Artisans BTP",
  "maçon": "Artisans BTP",
  "maçonnerie": "Artisans BTP",
  "couvreur": "Artisans BTP",
  "toiture": "Artisans BTP",
  "pisciniste": "Artisans BTP",
  "piscine": "Artisans BTP",
  "paysagiste": "Artisans BTP",
  "jardinier": "Artisans BTP",
  "jardinerie": "Artisans BTP",
  "serrurier": "Artisans BTP",
  "chauffagiste": "Artisans BTP",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 22 : Enfance & Famille
  // ═══════════════════════════════════════════════════════════
  "crèche": "Enfance & Famille",
  "garderie": "Enfance & Famille",
  "photographe bébé": "Enfance & Famille",
  "photographe nouveau-né": "Enfance & Famille",
  "boutique enfant": "Enfance & Famille",
  "vêtements enfant": "Enfance & Famille",
  "jouets": "Enfance & Famille",
  "magasin jouets": "Enfance & Famille",
  "activités kids": "Enfance & Famille",
  "anniversaires": "Enfance & Famille",
  "animation enfant": "Enfance & Famille",
  "ludothèque": "Enfance & Famille",

  // ═══════════════════════════════════════════════════════════
  // GROUPE 23 : Animaux (fusionné dans groupe 22 dans la DB)
  // ═══════════════════════════════════════════════════════════
  "toilettage": "Animaux",
  "toiletteur": "Animaux",
  "vétérinaire": "Animaux",
  "clinique vétérinaire": "Animaux",
  "pension animaux": "Animaux",
  "pension canine": "Animaux",
  "éleveur": "Animaux",
  "élevage": "Animaux",
  "animalerie": "Animaux",
  "éducateur canin": "Animaux",
  "dresseur": "Animaux",
  "pet sitting": "Animaux",
  "garde animaux": "Animaux"
};
```

## Fonction de mapping (JavaScript/TypeScript)

```typescript
// services/nicheMapping.ts

const NICHE_TO_GROUP_MAPPING: Record<string, string> = {
  // ... (le mapping ci-dessus)
};

/**
 * Trouve le groupe correspondant à une niche
 * @param niche - La niche saisie par l'utilisateur
 * @returns Le nom du groupe ou null si non trouvé
 */
export function getGroupFromNiche(niche: string): string | null {
  // Normaliser la niche (minuscules, trim)
  const normalizedNiche = niche.toLowerCase().trim();
  
  // Recherche exacte
  if (NICHE_TO_GROUP_MAPPING[normalizedNiche]) {
    return NICHE_TO_GROUP_MAPPING[normalizedNiche];
  }
  
  // Recherche partielle (si la niche contient un mot-clé)
  for (const [key, group] of Object.entries(NICHE_TO_GROUP_MAPPING)) {
    if (normalizedNiche.includes(key) || key.includes(normalizedNiche)) {
      return group;
    }
  }
  
  return null;
}

/**
 * Récupère le rapport d'industrie depuis Supabase
 * @param groupName - Le nom du groupe
 * @returns Le rapport complet ou null
 */
export async function getIndustryReport(groupName: string) {
  const { data, error } = await supabase
    .from('industry_reports')
    .select('*')
    .eq('group_name', groupName)
    .single();
  
  if (error) {
    console.error('Error fetching industry report:', error);
    return null;
  }
  
  return data;
}

// Usage dans le workflow
const niche = "pizzeria";
const groupName = getGroupFromNiche(niche); // "Fast food & Street food"
const report = await getIndustryReport(groupName);
```

## Query SQL alternative (dans n8n)

```sql
-- Trouver le rapport par niche (utilise l'opérateur @> pour les arrays)
SELECT * 
FROM industry_reports 
WHERE niches_covered @> ARRAY['pizza']::text[]
LIMIT 1;

-- OU recherche par nom de groupe
SELECT * 
FROM industry_reports 
WHERE group_name = 'Fast food & Street food'
LIMIT 1;
```

## Architecture du flux complet

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND                                                 │
│    User sélectionne : niche = "Pizzeria"                   │
│    User saisit : focus = "Notre pizza 4 fromages"          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. WEBHOOK N8N                                              │
│    Reçoit : { niche, focus, face_cam, voice_over, user_id } │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CODE NODE : MAPPING                                      │
│    niche "pizzeria" → groupe "Fast food & Street food"     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. SUPABASE NODE : QUERY                                    │
│    SELECT * FROM industry_reports                           │
│    WHERE group_name = 'Fast food & Street food'            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. CODE NODE : BUILD PROMPT                                 │
│    Remplace {niche_report} par le JSON du rapport          │
│    Remplace {niche}, {focus}, {face_cam}, {voice_over}     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. HTTP REQUEST : CLAUDE API                                │
│    POST /v1/messages                                        │
│    system: prompt_système_complet                           │
│    user: "Génère le brief"                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. CODE NODE : PARSE RESPONSE                               │
│    Extraire le brief (markdown)                             │
│    Extraire les variantes (JSON entre balises)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. SUPABASE NODE : INSERT BRIEF                             │
│    INSERT INTO briefs (user_id, niche, focus, content...)  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. SUPABASE NODE : DECREMENT SPARKS                         │
│    UPDATE profiles SET sparks_balance = sparks_balance - 100│
│    WHERE id = user_id                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. RESPOND TO WEBHOOK                                      │
│     Return { success: true, brief: {...}, variants: [...] } │
└─────────────────────────────────────────────────────────────┘
```

---

# 4. STRUCTURE D'UN RAPPORT D'INDUSTRIE (JSONB)

Exemple de ce qui est stocké dans `industry_reports` pour le groupe "Boulangerie & Sucré" :

```json
{
  "id": "uuid-xxx",
  "group_name": "Boulangerie & Sucré",
  "niches_covered": [
    "boulangerie", "pâtisserie", "chocolatier", 
    "glacier", "donuts", "cupcakes", "confiserie"
  ],
  "viral_accounts": [
    {
      "name": "@cedric.grolet",
      "platform": "Instagram + TikTok",
      "followers": "10M+ Instagram",
      "content_signature": "Sculptures de fruits en pâtisserie, process satisfaisant",
      "why_it_works": "Perfection technique + esthétique irréprochable"
    },
    {
      "name": "@pastryschool",
      "platform": "TikTok",
      "followers": "2.5M",
      "content_signature": "Tutoriels pâtisserie, fails et réussites",
      "why_it_works": "Éducatif + entertainant, montre les erreurs"
    }
  ],
  "winning_formats": [
    {
      "name": "Process Reveal",
      "description": "Fabrication accélérée du produit du début à la fin",
      "optimal_duration": "25-45 secondes",
      "example_account": "@cedric.grolet",
      "typical_views": "500K-5M",
      "how_to_reproduce": "Filmer en continu, accélérer x10-x30, finir sur le produit terminé"
    },
    {
      "name": "ASMR Croustillant",
      "description": "Focus sur les sons satisfaisants (croûte, craquement)",
      "optimal_duration": "15-30 secondes",
      "example_account": "@asmr_bakery",
      "typical_views": "100K-1M",
      "how_to_reproduce": "Micro proche du produit, environnement silencieux, montage serré"
    }
  ],
  "tested_hooks": [
    {
      "hook": "POV: Tu sens l'odeur du pain frais...",
      "category": "POV immersif",
      "views": "500K+",
      "why_it_works": "Déclenche une mémoire sensorielle universelle"
    },
    {
      "hook": "Voilà pourquoi nos croissants sont les meilleurs...",
      "category": "Affirmation audacieuse",
      "views": "200K+",
      "why_it_works": "Curiosité + promesse de révélation"
    },
    {
      "hook": "Ce son... 🔊",
      "category": "ASMR trigger",
      "views": "1M+",
      "why_it_works": "Le cerveau anticipe le son satisfaisant"
    }
  ],
  "fatal_errors": [
    {
      "error": "Commencer par 'Bonjour, bienvenue dans notre boulangerie'",
      "why_fatal": "Hook générique = scroll immédiat, perte de 80% des viewers",
      "solution": "Commencer par une action visuelle ou un hook provocateur"
    },
    {
      "error": "Filmer de loin sans gros plans",
      "why_fatal": "Le food porn fonctionne dans les DÉTAILS",
      "solution": "Privilégier les macro shots, montrer les textures"
    },
    {
      "error": "Musique trop forte qui couvre les sons",
      "why_fatal": "Les sons ASMR sont l'atout majeur de cette niche",
      "solution": "Musique basse ou absente, capturer les vrais sons"
    }
  ],
  "trends": [
    {
      "trend": "Process 'du four à la bouche'",
      "description": "Montrer le produit qui sort du four puis la première bouchée",
      "examples": "Croissant chaud, pain croustillant, cookie moelleux",
      "how_to_apply": "Filmer la sortie du four + transition vers la dégustation"
    },
    {
      "trend": "ASMR découpe",
      "description": "Couper le produit pour révéler l'intérieur",
      "examples": "Croissant feuilleté, pain avec mie alvéolée, éclair crémeux",
      "how_to_apply": "Couteau propre, plan fixe, silence puis son de coupe"
    }
  ],
  "niche_variations": {
    "boulangerie": {
      "specificity": "Focus sur le process traditionnel, l'authenticité, les horaires matinaux",
      "adapted_hooks": ["6h du mat'...", "48h de pousse..."],
      "preferred_formats": ["Process reveal", "ASMR four"]
    },
    "pâtisserie": {
      "specificity": "Esthétique parfaite, précision, glaçage miroir",
      "adapted_hooks": ["Regarde cette précision...", "Glaçage miroir en 30 secondes"],
      "preferred_formats": ["Timelapse décoration", "Reveal glaçage"]
    },
    "chocolatier": {
      "specificity": "Travail du chocolat, tempérage, moulage",
      "adapted_hooks": ["Le chocolat à 31°C exactement...", "Ce crac quand tu croques"],
      "preferred_formats": ["ASMR crac", "Process tempérage"]
    }
  },
  "created_at": "2024-12-20T10:00:00Z",
  "updated_at": "2024-12-20T10:00:00Z"
}
```

---

*Document de contexte pour Claude Code — Projet BLAYO / VueVenue*
