---
name: vuvenu-image-generator
description: Génère automatiquement les images Meta Ads via l'API Gemini Imagen à partir des descriptions détaillées du Meta Ads Generator. Appel direct API avec 2 variations par concept, pas de prompts manuels. Workflow end-to-end natif VuVenu.
tools:
  - Read
  - WebFetch
model: haiku
---

# VuVenu Image Generator v3.0 - API Native

## Mission

Générer automatiquement les images Meta Ads en appelant directement l'API Gemini Imagen. Workflow end-to-end : descriptions visuelles → API call → images prêtes pour Meta Ads Manager.

## Quand utiliser cette skill

- L'utilisateur a généré une campagne Meta Ads et veut les images finales
- Mention "générer les images", "créer les visuels automatiquement"
- Workflow final après Meta Ads Generator pour campagne complète
- Besoin de 2 variations par concept pour A/B testing

---

## PHASE 1 : Extraction & Préparation

### Source des Données (Input)

Récupérer depuis la campagne Meta Ads générée :

- **Descriptions visuelles détaillées** (200+ mots par concept)
- **Format Origins spécifié** (ex: "Image - Static Graphic", "Image - UGC style")
- **Business type & info** (DTC, Lead Gen, RBS, DTS, Event, Subscription)
- **Palette couleurs client** (priorité absolue si fournie)
- **Copy publicitaire** (Primary Text, Headline, Description)

### Formats Image Origins → API Prompts

1. **Static Graphic/Design** → Design graphique marketing
2. **Product Photo** → Photo produit commerciale
3. **Infographic designs** → Infographie d'entreprise
4. **Collage/Multi-image** → Composition multi-éléments
5. **Quote/Text overlay** → Citation inspirante avec design
6. **Native content style** → Contenu organique authentique
7. **Meme/Trend format** → Format viral moderne
8. **UGC image style** → Contenu utilisateur réaliste

---

## PHASE 2 : Construction Prompts Gemini Optimisés

### Template API Gemini Prompt

```
Create a {FORMAT_TYPE} for {BUSINESS_NAME}, a {BUSINESS_TYPE}.

Visual Description:
{DETAILED_DESCRIPTION_FROM_META_ADS}

Style Requirements:
- Format: Square 1:1 ratio for social media advertising
- Colors: {COLOR_PALETTE} (primary: {PRIMARY}, secondary: {SECONDARY})
- Quality: Professional, high-resolution, advertising grade
- Mood: {BUSINESS_MOOD}
- Target: {TARGET_AUDIENCE}

Technical Specs:
- Resolution: 1024x1024 minimum
- Style: {ORIGINS_FORMAT_STYLE}
- Text: {TEXT_OVERLAY_INSTRUCTIONS}

Avoid: Generic stock photo look, poor composition, illegible text, off-brand colors
```

### Adaptations par Business Type

**DTC (E-commerce)**

```
Focus on product prominently displayed, professional lighting,
clean background, call-to-action visible, premium presentation
```

**Lead Generation**

```
Professional yet approachable, service expertise highlighted,
credibility elements visible, contact invitation implied
```

**RBS (Réservation)**

```
Welcoming atmosphere, team/location featured, availability suggested,
human connection emphasized, booking invitation
```

**DTS (Drive-to-Store)**

```
Local business authenticity, location pride, products/services visible,
come visit invitation, community feeling
```

**Event & Ticketing**

```
Excitement and energy, crowd/event atmosphere, date/location prominent,
FOMO elements, ticket/registration urgency
```

**Subscription**

```
Long-term value focus, continuous benefits shown, interface/product featured,
ease of use emphasized, subscription value
```

---

## PHASE 3 : Appel API Gemini Imagen

### Configuration API

```typescript
// Configuration API Gemini pour génération d'images
const GEMINI_IMAGE_CONFIG = {
  model: 'imagen-3.0', // Ou dernière version disponible
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0:generateImages',
  headers: {
    Authorization: 'Bearer ${GOOGLE_AI_API_KEY}',
    'Content-Type': 'application/json',
  },
  params: {
    prompt: '{OPTIMIZED_PROMPT}',
    num_images: 2, // TOUJOURS 2 variations pour A/B testing
    aspect_ratio: '1:1', // Format Meta Ads
    style: 'PHOTOGRAPHIC', // Ou "DIGITAL_ART" selon format Origins
    quality: 'HD',
    safety_level: 'BLOCK_MEDIUM_AND_ABOVE',
  },
}
```

### Appels API Séquentiels

**Pour chaque concept (TOF, MOF, BOF) :**

1. **Construire prompt optimisé** selon format Origins
2. **Appel API Gemini** avec prompt + paramètres
3. **Recevoir 2 variations** par concept
4. **Validation automatique** (résolution, format, couleurs)
5. **Sauvegarde locale** avec métadonnées

### Gestion Erreurs & Retry

```
Si erreur API :
1. Retry avec prompt légèrement modifié (1x)
2. Si échec persistant : prompt simplifié (1x)
3. Si échec total : notification utilisateur + log erreur
4. Jamais plus de 3 tentatives par image
```

---

## PHASE 4 : Post-Processing & Validation

### Validation Automatique

- ✅ **Format** : 1:1 ratio vérifié
- ✅ **Résolution** : Minimum 1024x1024
- ✅ **Couleurs** : Cohérence avec palette client
- ✅ **Qualité** : Absence d'artefacts majeurs
- ✅ **Lisibilité** : Texte visible si applicable

### Optimisations Post-API

- **Recadrage automatique** si légèrement off-ratio
- **Compression optimisée** pour Meta Ads (< 30MB, qualité max)
- **Conversion format** PNG ou JPG selon besoin
- **Métadonnées** supprimées pour confidentialité

---

## PHASE 5 : Output Final Automatisé

### Template de Sortie

```markdown
═══════════════════════════════════════════════════════════════
IMAGES GÉNÉRÉES — [Campagne Meta Ads]
═══════════════════════════════════════════════════════════════

🎨 CONFIGURATION UTILISÉE
├── API : Gemini Imagen 3.0
├── Palette : [Client fournie / VuVenu défaut]
├── Business Type : [DTC/Lead Gen/RBS/DTS/Event/Subscription]
└── Total Images : 6 (3 concepts × 2 variations)

🖼️ CONCEPT 1 - TOF (Awareness)
**Format Origins :** [Format spécifique]
**Prompt utilisé :** [Prompt optimisé envoyé à l'API]

**VARIATION A :**
📎 Image: campaign_tof_variant_a.jpg (1024x1024, 2.3MB)
🔗 URL: [Chemin local ou storage URL]
⭐ Recommandé pour: [Audience principale]

**VARIATION B :**
📎 Image: campaign_tof_variant_b.jpg (1024x1024, 2.1MB)
🔗 URL: [Chemin local ou storage URL]
⭐ Recommandé pour: [Test A/B]

🖼️ CONCEPT 2 - MOF (Consideration)
[Même structure]

🖼️ CONCEPT 3 - BOF (Conversion)
[Même structure]

📊 MÉTRIQUES API
├── Temps génération : [X] secondes total
├── Coût API : ~[X]€ (6 images)
├── Taux succès : [6/6] images générées
└── Qualité moyenne : ✅ Toutes validées

🚀 PRÊT POUR META ADS MANAGER

**Fichiers à uploader :**

- [✅] campaign_tof_variant_a.jpg
- [✅] campaign_tof_variant_b.jpg
- [✅] campaign_mof_variant_a.jpg
- [✅] campaign_mof_variant_b.jpg
- [✅] campaign_bof_variant_a.jpg
- [✅] campaign_bof_variant_b.jpg

**A/B Testing Setup :**

- Tester Variation A vs B pour chaque concept
- Metrics focus : CTR, CPC, Conversion Rate
- Budget split : 50/50 premières 24h
```

---

## PHASE 6 : Intégration & Analytics

### Sauvegarde Automatisée

```json
{
  "campaign_id": "uuid",
  "generation_timestamp": "2026-01-13T15:30:00Z",
  "api_used": "gemini-imagen-3.0",
  "total_cost": 0.45,
  "images": [
    {
      "concept": "TOF",
      "variation": "A",
      "filename": "campaign_tof_variant_a.jpg",
      "prompt": "...",
      "format_origins": "Static Graphic",
      "file_size": "2.3MB",
      "resolution": "1024x1024"
    }
  ]
}
```

### Connexion Meta Ads Manager

- **Export organized** : Dossier par campagne
- **Naming convention** : client_concept_variant_date
- **Metadata preserved** : Format, business type, prompt
- **Ready for upload** : Formats et tailles optimaux

### Performance Tracking

- **Quelle variation** performe le mieux (A vs B)
- **Quel format Origins** génère meilleurs résultats
- **Quelles couleurs** engagent le plus
- **Optimisation continue** des prompts API

---

## CONFIGURATION REQUISE

### Variables d'Environnement

```bash
GOOGLE_AI_API_KEY=your-gemini-api-key
SUPABASE_STORAGE_BUCKET=vuvenu-campaign-images
```

### Dépendances

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
// Pas de prompts manuels - tout automatisé !
```

---

_Skill VuVenu Image Generator v3.0_
_Powered by Gemini Imagen API avec génération automatique native_
