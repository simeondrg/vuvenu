# Meta Ads Static Images Creator v3.0

## Purpose

Génère directement les prompts Higgsfield/Midjourney pour créer des images statiques Meta Ads à partir d'un document de stratégie de campagne. Transforme les concepts créatifs stratégiques (déjà validés par meta-ads-creative-generator v5.0) en prompts d'IA image prêts à l'emploi, **en s'appuyant sur les formats Origins détaillés (8 formats image)** et les DESCRIPTIONS VISUELLES générées. Adapté à TOUT type de business (E-commerce, Event, Service, Lead Gen, App, Local Business, etc.).

## When to Use

Utilise ce skill quand l'utilisateur:

- Fournit un document de stratégie Meta Ads et demande de créer les images
- Mentionne "workflow création images", "générer visuels statiques", "produire créatives", "créer prompts images"
- Dit "j'ai besoin des images pour cette campagne"
- Demande "génère les prompts pour les visuels de [campagne]"

## Core Methodology

### PHASE 1: EXTRACTION & ANALYSE

**ÉTAPE PRÉLIMINAIRE - PALETTE COULEURS CLIENT** :

Avant toute génération, déterminer la source de la palette couleurs :

1. **Vérifier si palette client prédéfinie existe** :
   - Chercher dans le document : "Palette marque", "Couleurs marque", "Brand colors", "Charte graphique"
   - Chercher codes hex explicites (#RRGGBB) déjà fournis
   - Chercher noms couleurs + hex (ex: "Bleu principal: #2E86AB")

2. **Si palette client existe** → **PRIORITÉ ABSOLUE** :
   - ✅ Utiliser UNIQUEMENT les couleurs client fournies
   - ✅ Respecter hiérarchie couleurs (primaire/secondaire/accent)
   - ✅ Ne PAS inventer d'autres couleurs
   - ✅ Adapter mood/style AUTOUR de ces couleurs imposées

3. **Si AUCUNE palette client fournie** :
   - ✅ Utiliser les recommandations du document stratégie
   - ✅ Créer palette cohérente adaptée au Type Business
   - ✅ Spécifier hex codes pour chaque couleur recommandée

**Règle d'or** : Palette client prédéfinie > Recommandations doc stratégie > Création palette optimisée

---

Scanner le document de campagne pour extraire:

**Concepts images**:

- Tous les concepts avec format IMAGE Static
- **Formats Origins détaillés** : Extraire le format Origins spécifié (ex: "Image - Static graphic/design", "Image - Infographic designs", etc.)
- **Descriptions visuelles [IMAGE] DESCRIPTION VISUELLE** : Si présente dans le document, utiliser cette description comme base principale pour le prompt Higgsfield
- Variations par concept
- Textes associés (Primary Text, Headline, Description)

**Éléments stratégiques par concept**:

- Type d'Ad, Angle créatif, Entonnoir (TOF/MOF/BOF)
- Sub-avatar(s), Primary desires, Émotions ciblées
- Hook pattern, Winning template

**Contexte global campagne**:

- **Type Business**: E-commerce / Event & Ticketing / Service / Lead Gen / App / Local Business / autre
- Market sophistication, Strategic response
- Produit/Service/Offre spécifique
- Ton de voix, Palette marque
- Avatar(s) détaillé(s), Pain points, Objections
- Messages clés et hooks gagnants
- Conversion finale (achat, inscription, lead, download, etc.)

### PHASE 2: GÉNÉRATION PROMPTS

Pour chaque concept/variation IMAGE, générer un prompt Higgsfield optimisé en 2 étapes :

**ÉTAPE 1 : Analyser les inputs**

- **Format Origins spécifié** (ex: "Static graphic/design", "Product photography + Headline", "Infographic designs")
- **[IMAGE] DESCRIPTION VISUELLE du document campagne** (si présente) - **PRIORITÉ ABSOLUE**
- Type Business (E-commerce/Event/Service/Lead Gen/App/Local Business)
- Winning Template référencé
- Textes campagne (Primary Text, Headline, Description)

**ÉTAPE 2 : Construire le prompt Higgsfield**

**BASE** : Utiliser le template correspondant au Format Origins + Winning Template (voir section "Mapping Format Origins → Template" ci-dessous)

**ENRICHISSEMENT** : Intégrer TOUS les détails de [IMAGE] DESCRIPTION VISUELLE :

- **Style décrit** → Style section du prompt
- **Layout décrit** → Layout section du prompt (avec %/positions exactes)
- **Palette décrite** → Colors section du prompt (avec hex codes)
- **Éléments décrits** → Graphic Elements section du prompt
- **Mood décrit** → Style mood du prompt

**TEXTES** : Intégrer TOUS les textes clés dans langue du document :

- Headline → Large bold headline avec position spécifique
- Primary text hooks → Text elements avec style
- CTA → Button ou badge avec couleur contraste
- Prix/offres/badges → Prominents avec style approprié

**FINALISATION** :

- Vérifier cohérence Format Origins + Winning Template + Type Business
- Vérifier tous hex codes présents (#RRGGBB)
- Vérifier layout détaillé (% ou positions exactes)
- Vérifier < 3000 caractères
- Ajouter "professional advertising quality, suitable for Facebook/Instagram feed, --ar 1:1"

**Structure prompt optimal final** :

```
Professional [format origins name] for Meta Ads, square 1:1,
featuring [concept principal selon DESCRIPTION VISUELLE],
[style adapté winning template + type business],
[layout détaillé avec positions/% depuis DESCRIPTION VISUELLE],
[palette couleurs avec hex codes depuis DESCRIPTION VISUELLE],
[textes intégrés: headline, CTA, badges depuis campagne],
[éléments graphiques depuis DESCRIPTION VISUELLE],
professional advertising quality, suitable for Facebook/Instagram feed,
--ar 1:1
```

**Principes clés UNIVERSELS** :

1. **Spécificité des couleurs**:
   - ❌ "blue background"
   - ✅ "soft teal blue (#5DADE2) gradient background"
   - Adapter selon palette marque du document

2. **Textes intégrés** (langue du document):
   - Toujours entre guillemets
   - Avec style typographique précis
   - Ex: 'large bold white headline reading "TEXT ICI"'
   - Échapper apostrophes: "C\'est"

3. **Layout ultra-détaillé**:
   - Position de chaque élément (top/center/bottom/left/right)
   - Taille relative (large/medium/small) ou % hauteur
   - Hiérarchie visuelle claire

4. **Style adapté au Type Business ET au concept**:
   - **E-commerce**: Product-focused, clean, benefit-driven
   - **Event**: Poster style, clear info hierarchy, date/location prominent
   - **Service**: Professional, trust-building, before/after
   - **Lead Gen**: Value proposition clear, CTA strong
   - **App**: Modern, UI-inspired, feature showcase
   - **Local Business**: Authentic, community-focused, location visible

5. **Éléments graphiques précis**:
   - Icônes: "small heart icons in coral (#FF6B6B)"
   - Formes: "three overlapping circles connected by thin lines"
   - Badges: "rectangular badge with 'FREE' in white on coral background"
   - **Produit (si E-commerce)**: "product image centered, white background, soft shadow"
   - **Visuel service**: "before/after split, transformation clear"

**Adaptation selon Type d'Ad** (du document campagne):

**Le Problème Révélé / Specific Pain Point**:

- Style: Empathique, relatable, emotional resonance
- Couleurs: Palette douce (pas agressive)
- Layout: Pain point → Reconnaissance → Solution
- Texte: Hook pain point très visible

**La Connexion Authentique / Relatable Hook**:

- Style: Warm, human, authentic
- Couleurs: Chaleureuses, accueillantes
- Layout: Storytelling visuel
- Texte: Message émotionnel central

**L'Ad de Crédibilité / Social Proof**:

- Style: Professionnel, trust-building
- Couleurs: Crédibles (bleus, verts)
- Layout: Témoignages, stats, badges
- Éléments: Étoiles, quotes, logos, chiffres

**L'Ad de l'Offre / The Free Ad**:

- Style: Clair, direct, value-focused
- Couleurs: Contrastées (CTA visible)
- Layout: Hiérarchie info claire
- Éléments: Prix, badges (FREE/PROMO), CTA button

**L'Ad Comparaison / Before-After**:

- Style: Split-screen, contraste clair
- Couleurs: Avant (froid/gris) vs Après (chaud/coloré)
- Layout: 50/50 ou side-by-side
- Éléments: Flèches, séparateur visuel

**L'Ad Produit / Product Showcase** (E-commerce):

- Style: Clean, product-centric, benefit-driven
- Couleurs: Fond simple (blanc/couleur unie) + accents marque
- Layout: Produit hero + bénéfices + CTA
- Éléments: Product shot, badges (discount/new/bestseller)

**Templates Universels par Style Visuel**:

**STYLE A - Validation/Communauté** (MOF):

```
Professional social media ad design, square 1:1,
featuring [transformation/validation concept adapté au business],
[warm/welcoming OU professional] aesthetic with [palette spécifique],

LAYOUT:
- Top section ([X]% height): [élément départ/problème]
- Center ([X]% height): [message principal/transformation]
- Bottom ([X]% height): [élément arrivée/solution + info]

COLORS:
- Background: [description gradient ou couleur unie avec hex]
- Primary text: [hex] for readability
- Accents: [hex] for [CTA/highlights/badges]
- [Autres couleurs spécifiques]

TEXT INTEGRATION:
- [Position] ([size] [weight]): "[TEXTE EXACT]" in [style]
- [Répéter pour chaque bloc de texte clé]

GRAPHIC ELEMENTS:
- [Description précise icônes/formes/badges avec taille/couleur/position]
- [Si produit: description du visuel produit]

STYLE:
- [Mood émotionnel adapté]
- Professional advertising quality
- High mobile readability
- Suitable for Instagram/Facebook feed

--ar 1:1
```

**STYLE B - Offre/Conversion** (BOF):

```
Professional [event poster/product ad/service offer] design, square 1:1,
featuring clear [value proposition/offer/CTA] with [style adapté],

LAYOUT:
- Header ([X]%): [titre/accroche]
- Main content ([X]%): [info structurée/produit/bénéfices]
- Footer ([X]%): [CTA + urgence si applicable]

COLORS:
- Primary: [hex] ([mood])
- Secondary: [hex] (for [usage])
- Accent: [hex] (for CTA/badges)
- Background: [hex or gradient]

TEXT INTEGRATION:
- [Tous textes clés avec position/taille/style]
- [Inclure prix si applicable]
- [Inclure badges: FREE/PROMO/LIMITED]
- CTA: "[TEXTE]" in [couleur contraste] button

GRAPHIC ELEMENTS:
- [Badges/icônes spécifiques au business]
- [Produit/service visuel si applicable]
- [Séparateurs/encadrés pour structure]

STYLE:
- [Clean/bold/modern selon business]
- Clear information hierarchy
- Mobile-optimized CTA
- Suitable for social media advertising

--ar 1:1
```

**STYLE C - Contraste/Comparaison**:

```
Professional social media ad, split-screen comparison, square 1:1,
clear visual contrast between [avant/problème] and [après/solution],

LAYOUT:
- Left half (50%): [situation avant/problème]
- Dividing line (center): [séparateur avec flèche si transformation]
- Right half (50%): [situation après/solution]
- Header (above) OR Footer (below): [message contextuel + info]

COLORS:
- Left side: [couleurs froides/négatives hex]
- Right side: [couleurs chaudes/positives hex]
- Divider: [hex] [style de séparation]
- Background: [hex]

TEXT INTEGRATION:
- Left side: [textes avec X rouge ou strikethrough]
- Right side: [textes avec check vert ou highlight]
- [Header/Footer avec message principal]

GRAPHIC ELEMENTS:
- X marks (✗) left, Checkmarks (✓) right
- [Visuel produit/service si applicable des deux côtés]
- [Flèche transformation si applicable]

STYLE:
- Bold, high contrast for scroll-stop
- Clear before/after or comparison
- Professional yet impactful
- Mobile-optimized readability

--ar 1:1
```

**STYLE D - Produit Hero** (E-commerce):

```
Professional e-commerce product ad, square 1:1,
featuring [product] with [benefit-driven messaging],

LAYOUT:
- Hero section ([X]%): Product image centered
- Benefit section ([X]%): Key benefits or features
- CTA section ([X]%): Offer + action button

COLORS:
- Background: [simple hex - souvent blanc/crème ou couleur marque]
- Product: [description si mockup needed]
- Text: [hex for readability]
- Badges: [discount/new/bestseller avec hex]
- CTA: [hex contraste fort]

TEXT INTEGRATION:
- Product name/benefit headline: "[TEXTE]" [size/position]
- Key benefits (if list): "[BENEFIT 1]", "[BENEFIT 2]"
- Price: "[PRIX]" [with discount if applicable]
- Discount badge: "[X% OFF]" or "[PROMO]"
- CTA: "[SHOP NOW / BUY / ORDER]" in button

GRAPHIC ELEMENTS:
- Product shot: [description - angle, background, shadows]
- Discount/promo badges: [position/style]
- Trust badges if applicable: [shipping/guarantee/returns]
- Rating stars if applicable

STYLE:
- Clean, product-focused
- Professional e-commerce aesthetic
- Clear value proposition
- Mobile-optimized shopping experience
- Suitable for Facebook/Instagram feed

--ar 1:1
```

### Mapping Format Origins → Prompt Template

**Cette section guide la sélection du template de base selon le Format Origins spécifié dans le document campagne.**

**Static graphic/design** → Template Style B (Offre/Conversion) OU Template Style D (Produit Hero si E-commerce/DTC)

- **Caractéristiques** : Bold headlines, discount badges prominent, CTA fort, couleurs contrastées
- **Quand** : BOF conversion, offres promotionnelles, événements avec date/lieu
- **Prompt commence par** : `Professional static graphic design for Meta Ads, square 1:1, featuring bold discount offer...`

**Product photography + Headline** → Template Style D (Produit Hero)

- **Caractéristiques** : Produit centré hero, background simple, headline percutant, minimalisme
- **Quand** : E-commerce DTC, avatar callout, focus produit
- **Prompt commence par** : `Professional product photography for Meta Ads, square 1:1, featuring [product] on clean background...`

**Infographic designs** → Template personnalisé (layout step-by-step ou data viz)

- **Caractéristiques** : Data visualization, icons, step-by-step flow, couleurs codées par section
- **Quand** : MOF éducation, Lead Gen crédibilité, before/after chiffré
- **Prompt commence par** : `Professional infographic design for Meta Ads, square 1:1, featuring [data/process visualization]...`

**Native-style image (Pubity Style)** → Template Style A adapté (mood organique)

- **Caractéristiques** : Look "unbranded", style post social organique, casual aesthetic
- **Quand** : TOF scroll-stop, audiences méfiantes publicité, relatable content
- **Prompt commence par** : `Organic social media style post for Meta Ads, square 1:1, featuring relatable moment...`

**Quote/Text-heavy image** → Template minimaliste texte-focus

- **Caractéristiques** : Background simple, typographie soignée, quote styling, testimonial format
- **Quand** : MOF social proof, testimonials détaillés, reviews clients
- **Prompt commence par** : `Professional quote-style design for Meta Ads, square 1:1, featuring customer testimonial...`

**Collage style** → Template multi-éléments (grid layout)

- **Caractéristiques** : Multiple images combinées, grid 2x2 ou 3x1, avant/après, versatilité produit
- **Quand** : MOF montrer range/angles, before/after, portfolio, comparaisons visuelles
- **Prompt commence par** : `Professional collage design for Meta Ads, square 1:1, featuring multiple images in [grid layout]...`

**User-generated content (UGC) image** → Template authentique (real photo style)

- **Caractéristiques** : Authentic photo quality, real people, genuine environments, peut inclure text overlay
- **Quand** : TOF/MOF social proof, testimonials visuels, unboxing, produits wearables
- **Prompt commence par** : `Authentic user-generated content style for Meta Ads, square 1:1, featuring real person with [product]...`

**Meme-style image** → Template meme adapté (format reconnaissable)

- **Caractéristiques** : Popular meme template structure, custom text, humor-driven, shareable
- **Quand** : TOF scroll-stop humour, audiences jeunes, messages légers/fun
- **Prompt commence par** : `Meme-style design for Meta Ads based on [template name], square 1:1, featuring...`

**RÈGLE** : Toujours commencer le prompt par :

```
Professional [format origins name] for Meta Ads, square 1:1,
featuring [concept principal],
[style adapté winning template + type business]...
```

**Exemple complet** :

```
Format Origins = "Static graphic/design"
Winning Template = "The Free Ad"
Type Business = "Event & Ticketing"

→ Prompt commence par :
Professional static graphic design for Meta Ads, square 1:1,
featuring FREE event offer with bold discount badge,
event poster style with clear date/location hierarchy,
[continuer avec layout, couleurs, textes depuis DESCRIPTION VISUELLE]...
```

**Checklist qualité prompt**:

- ✅ Format 1:1 spécifié
- ✅ Tous textes dans langue du document entre guillemets avec échappement (')
- ✅ Couleurs avec hex codes (#RRGGBB)
- ✅ Layout détaillé (% ou positions exactes)
- ✅ Style cohérent avec Type Business + émotion cible
- ✅ Hiérarchie typo claire (large bold / medium / small)
- ✅ Éléments graphiques précis (taille, couleur, position)
- ✅ Produit/service décrit si applicable au business
- ✅ "professional advertising quality" + "suitable for Facebook/Instagram"
- ✅ --ar 1:1 en fin de prompt
- ✅ **LONGUEUR MAXIMALE: 3000 caractères** (espaces, symboles et ponctuation inclus)

**Stratégie de condensation si >3000 caractères**:

1. Fusionner sections similaires
2. Raccourcir descriptions sans perdre précision
3. Utiliser abréviations standards (bg = background, hex pour couleurs)
4. Garder TOUS les textes clés et couleurs hex
5. Maintenir hiérarchie et layout détaillés

### PHASE 3: DOCUMENTATION PRODUCTION

Pour chaque concept/variation, fournir:

**1. Contexte stratégique** (rappel du doc)
**2. Prompt Higgsfield** (prêt à copier-coller, <3000 char)
**3. Textes originaux campagne** (référence)
**4. Instructions production**:

- Outil: Higgsfield → Sidream (x2) + Nano Banana (x2 backup)
- Génération 4 versions par concept
- Sélection meilleure version

**5. Checklist contrôle qualité UNIVERSELLE**:

✅ **TEXTE**:

- Tous textes corrects (0 fautes, 0 corruption IA)
- Headline lisible mobile
- CTA identifiable
- Informations présentes et exactes (prix/date/offre selon business)
- Hiérarchie respectée

✅ **DESIGN**:

- Lisible mobile (texte pas trop petit)
- Éléments positionnés selon brief
- Pas d'artefacts IA (texte bizarre, formes étranges)
- Composition équilibrée
- Couleurs marque respectées
- Style cohérent avec Type Business

✅ **PRODUIT/SERVICE** (si applicable):

- Produit bien reproduit / Service clairement représenté
- Qualité visuelle professionnelle
- Cohérence avec marque

✅ **SCROLL-STOP**:

- Accroche visuelle immédiate
- Message identifiable <1 seconde
- Émotion transmise
- Se démarque dans feed

✅ **STRATÉGIE**:

- Angle créatif respecté
- Émotion cible transmise
- Ton voix cohérent
- Avatar se reconnaît

**Décision**:

- ✅ VALIDÉ → Export
- ⚠️ RETOUCHE MINEURE → Canva (2 min max)
- ❌ RÉGÉNÉRATION → Ajuster prompt + relancer

**6. Retouches rapides** (si nécessaire):

- Texte corrompu: Gomme magique + récriture Canva
- Produit mal généré (E-commerce): Détourage + remplacement
- Max 2 min de retouche
- Si >2 corrections → Régénérer

**7. Export final**:

- PNG haute qualité 1080x1080px (ou format spécifié)
- Nommage: `Concept[X]_[Titre]_Var[N]_v1_[Date].png`
- Organisation dossiers par concept

## Workflow Timing

**45-60 minutes total** (exemple 6 images = 2 concepts × 3 variations)

```
[0-10 min] Phase 1: Extraction & Analyse
→ Scanner doc campagne
→ Identifier concepts images
→ Extraire éléments stratégiques
→ Identifier Type Business

[10-40 min] Phase 2: Génération Prompts
→ Créer prompt optimisé par variation
→ Adapter style selon Type Business + Type d'Ad
→ Intégrer textes dans langue du document
→ Vérifier <3000 caractères
→ Vérifier checklist qualité

[40-45 min] Phase 3: Documentation
→ Structurer livrables finaux
→ Instructions production
→ Checklist QA adaptée au business

[Parallèle] Production utilisateur:
→ Copier prompts dans Higgsfield
→ Générer 4 versions/concept (30-40 min)
→ Contrôle qualité + sélection
→ Retouches mineures si nécessaire
→ Export final
```

## Best Practices

**🎯 PROMPT QUALITY**:

- Être ultra-spécifique sur couleurs (hex codes)
- Détailler chaque élément de layout (%, positions)
- Intégrer TOUS les textes clés du document
- Spécifier style typo (bold/regular, large/medium/small)
- Décrire mood émotionnel visuel adapté au business
- Décrire produit/service visuellement si applicable
- Toujours terminer avec "professional advertising quality, suitable for Facebook/Instagram feed, --ar 1:1"
- **RESPECTER 3000 caractères maximum** (espaces inclus) - Higgsfield limite

**⚠️ PIÈGES À ÉVITER**:

- ❌ Couleurs vagues ("blue") → ✅ Couleurs précises ("soft teal #5DADE2")
- ❌ Layout flou ("text at top") → ✅ Layout précis ("large headline top-center occupying 20% height")
- ❌ Texte oublié → ✅ Tous textes importants intégrés avec style
- ❌ Style générique → ✅ Style adapté au Type Business (e-commerce ≠ event ≠ service)
- ❌ Pas de hiérarchie → ✅ Tailles relatives claires (large/medium/small)
- ❌ Produit mal décrit (E-commerce) → ✅ Description précise angle/background/shadows
- ❌ Template copié-collé → ✅ Template adapté au business du document

**💡 OPTIMISATIONS**:

- Générer tous prompts d'un coup avant production
- Utiliser queue Higgsfield (générations parallèles)
- Faire QA par batch (tous Concept 1, puis Concept 2)
- Documenter prompts gagnants pour réutilisation par Type Business

**🔄 SI RÉSULTAT INSUFFISANT**:

1. Analyser ce qui ne va pas (texte? couleur? layout? produit?)
2. Ajuster prompt précisément sur l'élément problématique
3. Régénérer (ne pas sur-corriger dans Canva)
4. Si produit E-commerce mal généré: soit ajuster description produit dans prompt, soit utiliser vraie photo produit en input Higgsfield

## Adaptations par Type Business

**E-COMMERCE (Physical Products)**:

- Focus: Produit hero + bénéfices clairs
- Visuels: Product shots, mockups, lifestyle si applicable
- Textes: Prix, discount, bénéfices, CTA achat
- Badges: SALE, NEW, BESTSELLER, FREE SHIPPING
- Style: Clean, professional, benefit-driven

**EVENT & TICKETING**:

- Focus: Date/lieu/programme très visibles
- Visuels: Event poster style, ambiance
- Textes: Date, lieu, gratuit/prix, places limitées
- Badges: FREE, LIMITED, EXCLUSIVE
- Style: Poster professionnel, info hierarchy claire

**SERVICE (B2B/B2C)**:

- Focus: Transformation/résultat
- Visuels: Before/after, testimonials, process
- Textes: Bénéfices, social proof, CTA consultation
- Badges: Certified, Guaranteed, Results
- Style: Professionnel, trust-building

**LEAD GEN / DOWNLOAD**:

- Focus: Value proposition + CTA forte
- Visuels: Mockup resource (ebook/guide), bénéfices
- Textes: What they get, CTA download/sign up
- Badges: FREE, INSTANT ACCESS
- Style: Clean, value-focused, CTA prominent

**APP / SOFTWARE**:

- Focus: Features + UI showcase
- Visuels: App screenshots, interface, demo
- Textes: Key features, benefits, CTA download/try
- Badges: NEW, FREE TRIAL, 5 STARS
- Style: Modern, tech-savvy, UI-inspired

**LOCAL BUSINESS**:

- Focus: Proximité, communauté, authenticité
- Visuels: Lieu, équipe, ambiance locale
- Textes: Adresse, horaires, offre locale
- Badges: LOCAL, FAMILY-OWNED, SINCE [YEAR]
- Style: Chaleureux, authentique, community-focused

## Output Format

Pour chaque concept/variation, livrer:

```
═══════════════════════════════════════════════════════════════
CONCEPT [X] - VARIATION [N]: "[Titre]"
═══════════════════════════════════════════════════════════════

CONTEXTE STRATÉGIQUE:
- Type Business: [E-commerce/Event/Service/etc.]
- Type d'Ad: [...]
- Angle: [...]
- Entonnoir: [TOF/MOF/BOF]
- Sub-Avatar: [...]
- Émotion: [départ] → [arrivée]
- Format: 1:1 (1080x1080px)

───────────────────────────────────────────────────────────────
📋 PROMPT HIGGSFIELD (copier-coller) - [XXX] caractères ✅
───────────────────────────────────────────────────────────────

[Prompt complet optimisé <3000 caractères]

───────────────────────────────────────────────────────────────
📝 TEXTES CAMPAGNE (référence)
───────────────────────────────────────────────────────────────

PRIMARY TEXT: [...]
HEADLINE: [...]
DESCRIPTION: [...]

───────────────────────────────────────────────────────────────
🎬 PRODUCTION
───────────────────────────────────────────────────────────────

1. Copier prompt ci-dessus
2. Higgsfield → Sidream → Coller → Générer (x2)
3. Higgsfield → Nano Banana → Coller → Générer (x2)
4. Sélectionner meilleure version (checklist QA)
5. Retouche si nécessaire (2 min max Canva)
6. Export PNG 1080x1080px

───────────────────────────────────────────────────────────────
✅ CHECKLIST QUALITÉ
───────────────────────────────────────────────────────────────

TEXTE:
□ [Textes spécifiques à vérifier selon campagne]
□ Headline lisible mobile
□ CTA visible
□ Info exactes (prix/date/offre selon business)

DESIGN:
□ Lisible mobile
□ Positionnement OK
□ Pas artefacts IA
□ Couleurs marque OK
□ [Si produit: bien reproduit]
□ [Si service: clairement représenté]

SCROLL-STOP:
□ Accroche immédiate
□ Message <1 sec
□ Émotion transmise

STRATÉGIE:
□ Angle respecté
□ Émotion transmise
□ Ton cohérent
□ Avatar se reconnaît

DÉCISION:
□ ✅ Validé
□ ⚠️ Retouche mineure
□ ❌ Régénérer
```

## Critical Reminders

- **Tu génères directement les prompts Higgsfield** (pas de passage par ChatGPT)
- **Tous les textes doivent être dans la langue du document** (français/anglais/autre)
- **Adapter le style au Type Business** du document (e-commerce ≠ event ≠ service)
- **Spécificité maximale** sur couleurs (hex), layout (%), typo (bold/regular, large/medium/small)
- **Style adapté à l'émotion cible ET au business** de chaque concept
- **Description produit/service précise** si applicable au Type Business
- **Checklist qualité systématique** avant validation
- **Limite 3000 caractères** stricte (condenser si nécessaire)
- **Production rapide**: 4 versions/concept, sélection meilleure, export

Le succès dépend de la **précision des prompts** ET de **l'adaptation au Type Business** - un prompt E-commerce sera très différent d'un prompt Event ou Service dans son style, ses éléments et sa structure.
