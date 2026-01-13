# meta-ads-creative-generator v5.0

## 🎯 Description

Skill Claude pour générer des concepts publicitaires Meta Ads performants en appliquant la méthodologie complète Bourbon Média.

**Nouveautés v5.0** :
- ✨ Intégration complète des 14 formats Origins (6 vidéo + 8 image)
- ✨ Decision tree formats par Type Business + Entonnoir + Template
- ✨ Descriptions visuelles détaillées pour génération prompts Higgsfield
- ✨ Justification systématique du format choisi

**Héritées v4.0** :
- Structure campagne adaptée au budget (<$1k = 1 CBO, >$1k = 2 Campagnes)
- Min/Max Spend Limits pour CBO
- Horizontal Scaling progressif
- Métriques Custom en entonnoir
- Open Targeting par défaut

---

## 📦 Installation

### Dans Claude Projects

1. Créer un nouveau projet Claude (ou utiliser projet existant)
2. Aller dans "Project knowledge"
3. Uploader le dossier complet `meta-ads-creative-generator-v5.0/`
4. La skill sera automatiquement disponible

### Fichiers inclus

```
meta-ads-creative-generator-v5.0/
├── SKILL.md                          # Documentation principale
├── README.md                         # Ce fichier
├── CHANGELOG-v5.0.md                # Changements v5.0
├── EXAMPLE-RESTAURANT-v5.0.md       # Exemple complet
└── references/
    ├── ad-formats.md                # ⭐ NOUVEAU v5.0 - 14 formats Origins
    ├── alen-sultanic-principles.md  # Fondations stratégiques
    ├── desire-calendar.md           # Timing saisonnier desires
    ├── hook-patterns.md             # 6 patterns hooks gagnants
    ├── product-service-analysis.md  # Méthodologie 7 étapes
    ├── research-prompts.md          # Prompts recherche avancée
    ├── secondary-emotions.md        # Émotions Tier 1-6
    └── winning-templates.md         # 13 templates éprouvés
```

---

## 🚀 Utilisation

### Déclenchement basique

```
Crée une campagne Meta Ads pour [produit/service].
Budget [X]€/jour, CPA cible [Y]€.
```

### Informations recommandées

Pour de meilleurs résultats, fournis :
- Nom produit/service
- Type (Produit physique / Service)
- Budget journalier (critique)
- CPA cible
- URL (si disponible)
- Prix
- Avatar principal
- Pain points connus
- USPs

### Exemple complet

Voir `EXAMPLE-RESTAURANT-v5.0.md` pour un exemple détaillé de génération complète.

---

## 🎨 Formats Origins v5.0

### Formats Vidéo (6)

1. **Voiceover with b-roll** - TOF éducation
2. **Subtitles with b-roll** - TOF/MOF scroll muet
3. **Slideshow Video w Text** - BOF conversion
4. **Authentic UGC/Talking head** - TOF connexion
5. **Professional shot video** - MOF autorité
6. **Animation** - TOF/MOF concepts abstraits

### Formats Image (8)

1. **Static graphic/design** - BOF offres/promos
2. **Product photography + Headline** - MOF présentation
3. **Infographic designs** - MOF/BOF data/crédibilité
4. **Collage style** - MOF comparaisons
5. **Quote/Text-heavy image** - MOF/BOF testimonials
6. **Native-style image** - TOF/MOF organic feel
7. **Meme-style image** - BOF urgence/humour
8. **UGC image** - TOF/DTS authenticité

**IMPORTANT** : Toujours spécifier le format exact (ex: "Image - Product photography + Headline"), jamais générique ("Image Static").

---

## 🏗️ Structure de Campagne

### Budget < $1,000/jour → 1 CBO

```
CAMPAGNE : [Nom] - CBO Testing & Scaling
├─ Ad Set 1 : WINNERS
│  └─ Min Spend : 4x CPA | Max Spend : 8x CPA
└─ Ad Set 2 : TESTING
   └─ Min Spend : 1.5x CPA | Max Spend : 4x CPA
```

### Budget > $1,000/jour → 2 Campagnes

```
CAMPAGNE 1 : [Nom] - TESTING (10%)
└─ Ad Set : New Concepts Testing

CAMPAGNE 2 : [Nom] - SCALING (90%)
└─ Ad Set : Proven Winners
```

---

## 📊 Métriques Custom

**Ordre entonnoir (gauche → droite)** :

1. Ad Name
2. Impressions
3. Link CTR (Outbound) → Hook quality
4. Amount Spent
5. ATC Rate → Landing page fit
6. IC Rate → Offre désir
7. Conversions
8. CPA → Validation vs cible
9. ROAS → Profitabilité

---

## 🎯 6 Types de Business

1. 🛍 **DTC** - Achat en ligne direct
2. 📞 **Lead Gen** - Devis/contact/appel
3. 📅 **RBS** - Réservation date+heure
4. 📍 **DTS** - Venue physique boutique
5. 🎫 **Event** - Billet/inscription événement
6. 🔄 **Subscription** - Abonnement récurrent

Chaque type influence sélection formats et angles.

---

## 📚 Frameworks Intégrés

- Market Sophistication (5 niveaux Eugene Schwartz)
- 4 Besoins Humains Universels
- Emotional Spending (Identité + Émotion)
- Tradeoffs (Sacrifice vs Gain)
- TOF/MOF/BOF Entonnoir
- 6 Hook Patterns
- 13 Winning Templates
- **14 Formats Origins** (NOUVEAU v5.0)

---

## 🔄 Workflow Typique

1. **Collecte infos** : Budget, CPA, Type Business
2. **Analyse stratégique** : Desires, Market Sophistication, Sub-Avatars
3. **Sélection formats** : Decision tree Type Business + Entonnoir + Template
4. **Génération concepts** : 3-9 concepts selon budget
5. **Package final** : Configuration campagne + Métriques + Roadmap

---

## 💡 Tips & Best Practices

### ✅ DO
- Toujours spécifier format Origins exact avec justification
- Lire fichiers `references/` avant génération
- Adapter langage à l'avatar (pas jargon)
- Créer variations substantiellement différentes
- Justifier chaque choix stratégique

### ❌ DON'T
- Ne jamais dire "Image Static" sans préciser type
- Ne pas inventer formats hors 14 formats Origins
- Ne pas fragmenter audiences (Open Targeting)
- Ne pas choisir structure sans considérer budget
- Ne pas copier templates verbatim sans adapter

---

## 🆕 Nouveautés v5.0 Détaillées

### 1. Intégration Formats Origins

- **14 formats détaillés** extraits du document "Evolve Ad Formats" Origins
- **Caractéristiques précises** pour chaque format
- **Quand utiliser** chaque format (contexte, entonnoir, business type)
- **Exemples visuels** et références

### 2. Format Selection Strategy

Decision tree à 3 critères pour choisir format optimal :
1. **Entonnoir** (TOF/MOF/BOF)
2. **Type Business** (6 catégories)
3. **Winning Template** (13 templates)

Résultat : Format précis + Justification en 1 ligne

### 3. Descriptions Visuelles Détaillées

Chaque concept génère maintenant :
- **Description visuelle ultra-précise** pour brief designer
- **Éléments visuels** : composition, couleurs, texte overlay, produit positioning
- **Ambiance et style** : pour génération prompts Higgsfield
- **Prêt pour meta-ads-static-images-creator**

### 4. Mapping Complet

- **Par Type Business** : Formats prioritaires pour chaque catégorie
- **Par Winning Template** : Format optimal image + vidéo
- **Par Entonnoir** : Vidéo (TOF) vs Image (MOF/BOF)

### 5. Fichier ad-formats.md

Nouveau fichier référence complet avec :
- Descriptions détaillées 14 formats
- Quand utiliser chaque format
- Exemples visuels et liens
- Tableaux mapping formats × business × templates
- Notes critiques et erreurs à éviter

---

## 🔗 Intégrations

### Avec meta-ads-static-images-creator

Workflow intégré :
1. **meta-ads-creative-generator** génère concept + description visuelle détaillée
2. **meta-ads-static-images-creator** utilise description pour créer prompt Higgsfield
3. **Higgsfield** génère l'image finale

### Avec bbp-script-writer

Synergies possibles :
- Adapter concepts TOF Vidéo UGC pour BBP
- Langage réunionnais + angles locaux

---

## 📞 Support & Questions

Pour questions ou améliorations :
- Créer une conversation avec Claude dans le projet
- Référencer ce README et SKILL.md
- Inclure contexte spécifique (budget, business type, etc.)

---

## 📝 Changelog

Voir `CHANGELOG-v5.0.md` pour détails complets des changements.

**Version courante : 5.0**  
**Dernière mise à jour : Novembre 2025**  
**Créé pour : Bourbon Média**

---

**Enjoy crafting winning Meta Ads! 🚀**
