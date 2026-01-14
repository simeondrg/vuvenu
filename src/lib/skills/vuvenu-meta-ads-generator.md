---
name: vuvenu-meta-ads-generator
description: Génère des campagnes Meta Ads complètes pour commerces locaux avec la méthodologie Bourbon Média v5.0 - classification business (6 types), formats Origins (14 formats), structure budget-based, et génération concepts TOF/MOF/BOF. Remplace workflow complexe par interface VuVenu native.
tools:
  - Read
model: sonnet
---

# VuVenu Meta Ads Generator v2.0

## Mission

Créer des campagnes Meta Ads professionnelles pour commerces locaux en appliquant la méthodologie éprouvée avec classification business précise, formats Origins, et structure budget-based.

## Quand utiliser cette skill

- L'utilisateur demande de créer une campagne Meta Ads
- Mention "publicité Facebook", "Meta Ads", "campagne publicitaire"
- Demande de "promouvoir" un produit/service
- Besoin de "générer plus de clients" via publicité

---

## PHASE 1 : Classification Business Type

### Arbre de Décision (6 Questions)

**Question 1** : Le client paye-t-il directement en ligne ?
→ **Oui** → 🛍️ **DTC (Direct-To-Consumer)**
→ **Non** → Question 2

**Question 2** : Le client doit-il demander un devis / contacter avant d'acheter ?
→ **Oui** → 📞 **Lead Generation**
→ **Non** → Question 3

**Question 3** : Le client doit-il réserver un créneau (horaire obligatoire) ?
→ **Oui** → 📅 **RBS (Reservation-Based Commerce)**
→ **Non** → Question 4

**Question 4** : Le client doit-il se déplacer en boutique pour consommer / acheter ?
→ **Oui** → 📍 **DTS (Drive-To-Store)**
→ **Non** → Question 5

**Question 5** : Le client achète-t-il un billet ou s'inscrit-il à un événement ?
→ **Oui** → 🎫 **Event & Ticketing**
→ **Non** → Question 6

**Question 6** : Le client paye-t-il un abonnement mensuel / récurrent ?
→ **Oui** → 🔄 **Subscription**
→ **Non** → Retour à classification manuelle

### Conversions Finales par Type

- 🛍️ **DTC** : Achat en ligne (Add to Cart → Purchase)
- 📞 **Lead Gen** : Demande devis / message / appel (Lead Form)
- 📅 **RBS** : Réservation avec date + heure (Booking)
- 📍 **DTS** : Venue physique (Store Visit / Direction Click)
- 🎫 **Event** : Billet acheté / inscription (Event Response)
- 🔄 **Subscription** : Abonnement activé (Subscription)

---

## PHASE 2 : Structure Campagne Budget-Based

### Règles de Structure

**Budget < 70€/jour :**

- **Structure** : 1 CBO (Campaign Budget Optimization)
- **Ad Sets** : 2 maximum (Winners + Testing)
- **Min Spend** : Réduit (risque : sous-financement)

**Budget ≥ 70€/jour :**

- **Structure** : 1 CBO avec Min/Max Spend optimisés
- **Ad Sets** : 2-3 (Winners + Testing + Scale)
- **Min Spend** : CPA × 4 (Winners), CPA × 1.5 (Testing)

### Calculs Min/Max Spend

**Winners Ad Set :**

- Min Spend : CPA cible × 4
- Max Spend : CPA cible × 8

**Testing Ad Set :**

- Min Spend : CPA cible × 1.5
- Max Spend : CPA cible × 4

**Validation Budget :**
Si Budget Total < (Min Winners + Min Testing) → **Avertissement utilisateur**

---

## PHASE 3 : Sélection Formats Origins

### 14 Formats Disponibles

**FORMATS VIDÉO (6)**

1. **Voiceover with b-roll** - Voice-off + séquences produit/service
2. **Subtitles with b-roll** - Sous-titres + montage dynamique
3. **Slideshow Video w Text** - Images + texte animé
4. **Authentic UGC/Talking head** - Personne face caméra
5. **Professional video** - Production soignée, qualité studio
6. **Animation** - Motion design, graphiques animés

**FORMATS IMAGE (8)**

1. **Static Graphic/Design** - Visuel graphique avec texte
2. **Product Photo** - Photo produit sur fond stylisé
3. **Infographic designs** - Information visualisée
4. **Collage/Multi-image** - Plusieurs visuels combinés
5. **Quote/Text overlay** - Citation sur visuel d'ambiance
6. **Native content style** - Aspect contenu organique
7. **Meme/Trend format** - Format tendance, humour
8. **UGC image style** - Style contenu utilisateur authentique

### Decision Tree Format

**1. Identifier Entonnoir**

- **TOF (Top Funnel)** → Priorité Vidéo (engagement max)
- **MOF/BOF** → Priorité Image (conversion focus)

**2. Identifier Business Type**

- **DTC** → Product Photo, UGC style
- **Lead Gen** → Infographic, Professional
- **RBS** → UGC video, Native content
- **DTS** → Authentic UGC, Static Graphic
- **Event** → Slideshow, Collage
- **Subscription** → Professional video, Quote

**3. Croiser Critères + Budget**

- Budget élevé → Formats premium (Professional, Animation)
- Budget standard → Formats authentiques (UGC, Static)

---

## PHASE 4 : Génération Concepts TOF/MOF/BOF

### Templates Winning (13 disponibles)

1. **Avatar Callout** - "Propriétaire de [business], ceci est pour toi"
2. **Solution Exaggeration** - "La solution ultime à [problème]"
3. **This is NOT [Product]** - "Ce n'est PAS un [concurrent], c'est..."
4. **Specific Pain Point** - "[Pain] ? Nous avons la solution"
5. **Accidental Ideal Outcome** - "Par accident, nous avons créé..."
6. **Relatable Hook** - "Nous aussi, on était comme toi..."
7. **The Free Ad** - "Essai gratuit / Découverte offerte"
8. **Simplified Us vs Them** - "Nous vs la concurrence"
9. **Stealing Credibility** - "Utilisé par [autorité reconnue]"
10. **Indirect Avatar** - S'adresser à l'entourage de la cible
11. **Classy Offer** - Présentation premium de l'offre
12. **Pubity Style** - Format viral type média social
13. **Minimal Us vs Them** - Comparaison subtile

### Structure de Génération

**Pour chaque concept (TOF, MOF, BOF) :**

1. **Sélection Template** basée sur business type
2. **Sélection Format** via decision tree
3. **Génération Copy** (Primary Text + Headline + Description)
4. **Description Visuelle** détaillée (200+ mots)
5. **Justification** du choix format

---

## PHASE 5 : Output Campagne Complète

### Template de Sortie

```markdown
═══════════════════════════════════════════════════════════════
CAMPAGNE META ADS — [Commerce]
═══════════════════════════════════════════════════════════════

📊 ANALYSE BUSINESS
├── Type Business : [DTC/Lead Gen/RBS/DTS/Event/Subscription]
├── Conversion Finale : [Action de conversion spécifique]
├── CPA Cible : [Montant]€
└── Budget Journalier : [Montant]€/jour

🏗️ STRUCTURE CAMPAGNE RECOMMANDÉE

**Structure :** [1 CBO / 1 CBO + Min/Max / Campagnes séparées]

**Ad Sets Configuration :**

- **WINNERS Ad Set**
  - Min Spend : [Calcul]€/jour
  - Max Spend : [Calcul]€/jour
  - Audience : Retargeting + Lookalike

- **TESTING Ad Set**
  - Min Spend : [Calcul]€/jour
  - Max Spend : [Calcul]€/jour
  - Audience : Intérêts + Comportements

**⚠️ VALIDATION BUDGET :**
[Okay / Warning si budget insuffisant + recommandations]

🎯 CONCEPTS CRÉATIFS

**CONCEPT 1 - TOF (Awareness)**

- **Template :** [Nom du template winning]
- **Format :** [Format Origins sélectionné]
- **Justification :** [Pourquoi ce format pour TOF + Business Type]

_Copy Publicitaire :_
**Primary Text :** [180 caractères max]
**Headline :** [40 caractères max]
**Description :** [90 caractères max]

_Description Visuelle :_
**Composition :** [Layout, hiérarchie visuelle]
**Éléments :** [Produit, texte, personnes]
**Couleurs :** [Palette, dominantes, accents]
**Ambiance :** [Mood général, émotions]
**Style :** [Technique, post-processing]

**CONCEPT 2 - MOF (Consideration)**
[Même structure que Concept 1]

**CONCEPT 3 - BOF (Conversion)**
[Même structure que Concept 1]

📈 MÉTRIQUES DE PERFORMANCE ATTENDUES

**TOF - Awareness :**

- CPM : [Fourchette]€
- CTR : [Pourcentage]%
- Objectif : Reach & Engagement

**MOF - Consideration :**

- CPC : [Fourchette]€
- CTR : [Pourcentage]%
- Objectif : Traffic & Interest

**BOF - Conversion :**

- CPA : [Fourchette]€
- Conversion Rate : [Pourcentage]%
- Objectif : Sales & Leads

🚀 CONFIGURATION META ADS MANAGER

**Campagne :**
```

Nom : [Commerce] - [Mois Année]
Objectif : [Conversions/Leads/Traffic selon Business Type]
Budget : [Montant]€/jour - CBO Activé
Optimization : [Événement de conversion optimal]

```

**Audience Ciblage :**
- **Géographie :** [Local + rayon selon business]
- **Âge :** [Fourchette adaptée à l'avatar]
- **Intérêts :** [3-5 intérêts spécifiques au secteur]
- **Comportements :** [Selon business type]

🎨 VISUELS À CRÉER

**Pour Image Generator Skill :**
- [Liste des descriptions visuelles prêtes pour IA]
- [Spécifications techniques par format]
- [Prompts Higgsfield/Midjourney optimisés]

📋 CHECKLIST LANCEMENT

- [ ] Campagne configurée Meta Ads Manager
- [ ] Audiences créées et validées
- [ ] Visuels générés et uploadés
- [ ] Pixel Meta installé sur site
- [ ] Événements de conversion trackés
- [ ] Budget et planning définis
- [ ] KPIs de monitoring établis

🔄 STRATÉGIE D'OPTIMISATION

**Semaine 1 :** Test des 3 concepts, identification winners
**Semaine 2 :** Scale concepts performants, kill sous-performers
**Semaine 3 :** Optimisation audiences + créatives
**Semaine 4 :** Déploiement horizontal + augmentation budget
```

---

## PHASE 6 : Wizard de Lancement (7 Étapes)

### Objectif Wizard

**LA** différentiation clé VuVenu : guider l'utilisateur de la campagne générée jusqu'au lancement réel dans Meta Ads Manager.

### Étape 1 : Téléchargement Créatives

**Page** : `/campaigns/[id]/launch?step=1`
**Objectif** : S'assurer que l'utilisateur a les 6 images (3 concepts × 2 variations)

```markdown
🎯 **ÉTAPE 1/7 - TÉLÉCHARGE TES CRÉATIVES**

📁 **Tes images sont prêtes !**

- TOF Concept : 2 variations (1080x1080)
- MOF Concept : 2 variations (1080x1080)
- BOF Concept : 2 variations (1080x1080)

**Actions** :

- [ ] 📥 Télécharger toutes les images (.zip)
- [ ] 📱 Vérifier la qualité sur mobile
- [ ] ✅ J'ai mes 6 images prêtes

💡 **Astuce** : Sauvegarde ces images dans un dossier dédié à ta campagne.
```

### Étape 2 : Ouvrir Meta Ads Manager

**Objectif** : Guider vers Meta Ads Manager sans perdre l'utilisateur

```markdown
🎯 **ÉTAPE 2/7 - OUVRE META ADS MANAGER**

🚀 **Connecte-toi à ton compte publicitaire**

- 👆 [Ouvrir Meta Ads Manager](https://business.facebook.com/adsmanager)
- 📍 Une fois connecté, clique sur **"+ Créer"** pour commencer

**Capture d'écran avec flèche** → Bouton "Créer" encerclé

**Actions** :

- [ ] ✅ J'ai ouvert Meta Ads Manager
- [ ] ✅ Je vois le bouton "Créer"

⚠️ **Important** : Garde VuVenu ouvert dans un autre onglet !
```

### Étape 3 : Créer la Campagne

**Objectif** : Paramètres optimaux sans confusion

```markdown
🎯 **ÉTAPE 3/7 - CONFIGURE TA CAMPAGNE**

⚙️ **Paramètres recommandés** (à copier exactement) :

**Objectif de campagne** : [Conversions/Trafic selon type business] 📋 Copier
**Nom de campagne** : [BusinessName] - [DateMois] 📋 Copier
**Budget** : [BudgetSaisi]€/jour 📋 Copier
**Type** : Budget de campagne (CBO activé) 📋 Copier

💡 **Important** : Garde TOUS les autres paramètres par défaut pour commencer.

**Actions** :

- [ ] ✅ J'ai créé ma campagne avec ces paramètres
- [ ] ✅ Budget configuré en CBO
```

### Étape 4 : Configurer l'Audience

**Objectif** : Ciblage optimal selon type de business

```markdown
🎯 **ÉTAPE 4/7 - DÉFINIS TON AUDIENCE**

🎯 **Ciblage recommandé pour [TypeBusiness]** :

**Si Drive-to-Store** :

- Localisation : 15km autour de [AdresseCommerce]
- Âge : [FourchetteSuggerée] ans
- Audience Advantage+ : ✅ Activé

**Si autres business types** :

- Localisation : [RegionCible]
- Audience Advantage+ : ✅ Activé (Meta trouvera les bonnes personnes)
- Intérêts : [3-5 intérêts spécifiques au secteur]

⚠️ **Évite** : Ne pas trop restreindre au début (< 100k personnes)

**Actions** :

- [ ] ✅ J'ai configuré mon audience selon les recommandations
```

### Étape 5 : Ajouter les Publicités

**Objectif** : Upload images + copy-paste textes facilement

```markdown
🎯 **ÉTAPE 5/7 - AJOUTE TES PUBLICITÉS**

📝 **Instructions** :

1. Clique "Nouvelle publicité"
2. Upload l'image
3. Colle les textes (boutons copier ci-dessous)
4. Répète pour les 3 concepts

**CONCEPT 1 - TOF**
🖼️ [Miniature image TOF]
**Primary Text** : [TexteComplet] 📋 Copier
**Headline** : [Headline] 📋 Copier
**Description** : [Description] 📋 Copier

**CONCEPT 2 - MOF**
[Même structure]

**CONCEPT 3 - BOF**
[Même structure]

**Actions** :

- [ ] ✅ J'ai ajouté mes 3 publicités dans Meta
- [ ] ✅ Toutes les images sont uploadées
```

### Étape 6 : Vérification Finale

**Objectif** : Checklist avant publication

```markdown
🎯 **ÉTAPE 6/7 - VÉRIFIE AVANT DE PUBLIER**

✅ **Checklist finale** :

- Budget : [X]€/jour configuré
- 3 publicités ajoutées avec images
- Images en bonne qualité (pas floues)
- Textes sans fautes d'orthographe
- Mode de paiement configuré dans Stripe

🔍 **Aperçu** : [Lien vers aperçu Meta]

⚠️ **ATTENTION** : Des frais s'appliquent dès que tu cliques sur "Publier" !

**Actions** :

- [ ] ✅ J'ai tout vérifié, je suis prêt à publier
```

### Étape 7 : Succès et Suivi

**Objectif** : Célébration + guidance post-lancement

```markdown
🎉 **FÉLICITATIONS ! TA CAMPAGNE EST EN LIGNE !**

🎊 **Animation confettis** 🎊

📊 **Prochaines étapes** :

**⏳ Les 48 premières heures** :

- L'algorithme Meta apprend → pas de panique si peu de résultats
- Évite de modifier quoi que ce soit

**📈 Après 3-5 jours** :

- Vérifie tes métriques dans Meta Ads Manager
- Si CPC trop élevé → on pourra ajuster l'audience
- Si CTR faible → on pourra tester de nouveaux visuels

**💡 Conseil pro** : Screenshot tes métriques jour 1 pour comparer !

**Actions** :

- [ ] 🔗 [Voir ma campagne dans Meta Ads Manager]
- [ ] 🏠 [Retour au dashboard VuVenu]
```

---

## PHASE 7 : Intégrations VuVenu

### Connexion Image Generator

Transmettre automatiquement les descriptions visuelles détaillées à la skill `vuvenu-image-generator` pour génération des images finales.

### Progression Wizard Sauvegardée

**Base de données** : Champ `wizard_step` dans table `campaigns`

- Sauvegarder étape courante à chaque validation
- Permettre reprise si utilisateur quitte/revient
- Statut campagne : `draft` → `launching` → `launched`

### Sauvegarde Campagne Complète

Stocker en base Supabase (table `campaigns`) :

- Configuration complète avec wizard steps
- Concepts générés + URLs images
- Métriques prédites vs réelles (tracking post-lancement)
- Status workflow + timestamps

### Analytics Integration

- Tracking conversion : concept généré → campagne lancée (taux complétion wizard)
- Performance prédictive : comparer prédictions aux résultats réels Meta
- Optimisation prompts basée sur succès utilisateurs

---

_Skill VuVenu Meta Ads Generator v3.0_
_Workflow complet : Génération → Images → Wizard 7 étapes → Lancement réel_
_Basée sur méthodologie Bourbon Média avec différentiation clé : accompagnement jusqu'au succès_
