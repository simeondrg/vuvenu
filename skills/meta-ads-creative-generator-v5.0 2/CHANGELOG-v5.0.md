# Changelog - meta-ads-creative-generator

## Version 5.0 (Novembre 2025)

### 🎨 Nouveautés Majeures

#### 1. Intégration Complète Formats Origins

**AJOUTÉ** : Fichier `references/ad-formats.md` (524 lignes)

- 6 formats vidéo détaillés avec caractéristiques complètes
- 8 formats image détaillés avec caractéristiques complètes
- Descriptions "Quand utiliser" pour chaque format
- Exemples visuels et références liens
- Notes critiques et erreurs à éviter

**Formats Vidéo** :

1. Voiceover with b-roll
2. Subtitles with b-roll
3. Slideshow Video w Text
4. Authentic UGC/Talking head only
5. Professional shot video
6. Animation

**Formats Image** :

1. Static graphic/design
2. Product photography + Headline
3. Infographic designs
4. Collage style
5. Quote/Text-heavy image
6. Native-style image
7. Meme-style image
8. UGC image

---

#### 2. Format Selection Strategy (Decision Tree)

**AJOUTÉ** : Méthodologie sélection formats en 5 étapes

**STEP 1** : Identifier Entonnoir (TOF/MOF/BOF)

- TOF → Vidéo préféré (scroll-stop + éducation)
- MOF → Image préféré (preuves rapides)
- BOF → Image préféré (offre claire conversion)

**STEP 2** : Identifier Type Business (6 catégories)

- Formats prioritaires par catégorie documentés

**STEP 3** : Identifier Winning Template utilisé

- Mapping Template → Format optimal

**STEP 4** : Croiser les 3 critères

- Exemple : TOF + DTC + Avatar Callout → Format précis

**STEP 5** : Justifier en 1 ligne

- Pourquoi ce format pour ce concept ?

---

#### 3. Descriptions Visuelles Détaillées

**AJOUTÉ** : Section "Description Visuelle Détaillée" dans chaque variation

Inclut maintenant :

- Composition visuelle (layout, hiérarchie)
- Couleurs et palette
- Texte overlay (positionnement, taille)
- Produit positioning
- Ambiance et mood
- Style général

**Objectif** : Permettre génération prompts Higgsfield via meta-ads-static-images-creator

---

#### 4. Mapping Complet Formats

**AJOUTÉ** : 3 tableaux de mapping dans ad-formats.md

**Tableau 1 : Par Type Business**

- DTC : Formats prioritaires + secondaires
- Lead Gen : Formats prioritaires + secondaires
- RBS : Formats prioritaires + secondaires
- DTS : Formats prioritaires + secondaires
- Event & Ticketing : Formats prioritaires + secondaires
- Subscription : Formats prioritaires + secondaires

**Tableau 2 : Par Winning Template**

- 13 templates × Format Image Optimal × Format Vidéo Optimal
- Justification pour chaque mapping

**Tableau 3 : Par Entonnoir**

- TOF : Vidéo (interruption + éducation)
- MOF : Image (preuves + autorité)
- BOF : Image (conversion + urgence)

---

#### 5. Règles Critiques Formats

**AJOUTÉ** : Section "CRITICAL NOTES" dans ad-formats.md

**✅ ALWAYS** :

- Toujours spécifier format détaillé exact
- Formats = base pour génération prompts Higgsfield
- Respect strict catégories Origins (ne pas inventer)
- Croiser 3 critères : Type Business + Entonnoir + Template
- Justifier pourquoi ce format (1 ligne)

**❌ NEVER** :

- Jamais dire "Image Static" sans préciser type exact
- Jamais inventer formats hors nomenclature Origins
- Jamais choisir format sans analyser entonnoir + business type
- Pas faire faux articles presse (Native-style ≠ Fake Press)

---

### 🔧 Améliorations v5.0

#### Workflow Génération Concepts

**MODIFIÉ** : Phase 2 - Analyse stratégique

- Ajout étape 7 : "Sélection des Formats"
- Lecture obligatoire ad-formats.md
- Application Format Decision Tree

**MODIFIÉ** : Phase 4 - Génération Concepts

- Structure concept inclut maintenant "Format" + "Justification Format"
- Section "Description Visuelle Détaillée" obligatoire
- Exemples formats dans tous les concepts générés

#### Documentation SKILL.md

**MODIFIÉ** : Section "Règles Critiques"

- Ajout règles spécifiques formats Origins
- Mise à jour exemples avec formats précis
- Clarification TOUJOURS/JAMAIS pour formats

**AJOUTÉ** : Section "Intégration avec Autres Skills"

- Workflow meta-ads-static-images-creator
- Synergies bbp-script-writer

#### Exemples de Déclenchement

**AJOUTÉ** : Exemple 3 - Formats v5.0

- Montre decision tree formats en action
- Illustre justification format
- Démontre description visuelle détaillée

---

### 📊 Statistiques v5.0

**Lignes de code/documentation** :

- SKILL.md : 1,064 lignes (+~200 vs v4.0)
- ad-formats.md : 745 lignes (NOUVEAU)
- Total références : ~4,500 lignes
- Total skill complète : ~5,600 lignes

**Nouveaux concepts** :

- 14 formats Origins détaillés
- Format Decision Tree (5 étapes)
- 3 tableaux mapping formats
- Descriptions visuelles pour prompts

**Compatibilité** :

- Rétrocompatible avec v4.0
- Tous frameworks v4.0 préservés
- Ajouts non-breaking

---

### 🔄 Migrations depuis v4.0

#### Changements Breaking : AUCUN

Tous les concepts v4.0 restent valides. v5.0 ajoute des capacités sans casser l'existant.

#### Changements Recommandés

**SI tu utilises actuellement v4.0** :

1. **Remplacer** : Format générique → Format Origins précis
   - Avant : "Format : Image Static"
   - Après : "Format : Image - Static graphic/design"

2. **Ajouter** : Justification format (1 ligne)
   - Nouveau : "Justification : BOF DTC nécessite offre visible, static graphic optimal"

3. **Ajouter** : Description visuelle détaillée
   - Nouveau : Section complète avec composition, couleurs, etc.

4. **Lire** : ad-formats.md avant génération
   - Améliore sélection formats adaptés

#### Migration Automatique

Aucune action requise. v5.0 applique automatiquement nouveaux standards.

---

### 🐛 Corrections v5.0

**CORRIGÉ** : Ambiguïté formats

- v4.0 disait parfois "Image Static" sans précision
- v5.0 force format Origins exact

**CORRIGÉ** : Manque justification choix format

- v4.0 choisissait format sans expliquer pourquoi
- v5.0 justifie systématiquement

**AMÉLIORÉ** : Descriptions visuelles

- v4.0 : Descriptions génériques
- v5.0 : Descriptions ultra-détaillées pour génération

**CLARIFIÉ** : Nomenclature formats

- v4.0 : Terminologie parfois floue
- v5.0 : 14 formats fixes, nomenclature stricte Origins

---

## Version 4.0 (Octobre 2025)

### Nouveautés v4.0

- Structure campagne adaptée au budget (<$1k = 1 CBO, >$1k = 2 Campagnes)
- Min/Max Spend Limits pour CBO
- Horizontal Scaling progressif (10% → 50%)
- Métriques Custom organisées en entonnoir
- Diagnostic rapide problèmes funnel
- Open Targeting par défaut
- Critères graduation winners
- Classification 6 Types Business (DTC, Lead Gen, RBS, DTS, Event, Subscription)

---

## Version 3.0 (Septembre 2025)

### Nouveautés v3.0

- Intégration Product/Service Analysis (7 étapes)
- Distinction Produits vs Services
- Market Sophistication (5 niveaux)
- Desires & Émotions (Tier 1-6)
- Desire Calendar (timing saisonnier)
- 13 Winning Templates
- 6 Hook Patterns
- Sub-Avatars segmentation

---

## Version 2.0 (Août 2025)

### Nouveautés v2.0

- Alen Sultanic Principles (4 Besoins Humains)
- Emotional Spending Framework
- Tradeoffs (Sacrifice vs Gain)
- Strategic Responses (New Mechanism, New Information, New Identity)
- Structure TOF/MOF/BOF

---

## Version 1.0 (Juillet 2025)

### Release Initiale

- Génération basique concepts Meta Ads
- Structure campagne simple
- Hook creation
- Primary text generation
- Winning templates de base

---

## Roadmap Future

### Version 5.1 (Planifiée - Décembre 2025)

**Prévu** :

- Intégration prompts Higgsfield automatiques
- Génération scripts vidéo UGC détaillés
- A/B testing suggestions automatiques
- Performance benchmarks par industrie

### Version 6.0 (Planifiée - Q1 2026)

**Prévu** :

- Multi-plateforme (TikTok, Pinterest, Snapchat formats)
- Analyse compétitive automatisée
- Prédiction CPA/ROAS via ML
- Optimisation dynamique budget

---

**Maintenu par : Bourbon Média**  
**Dernière mise à jour : Novembre 2025**
