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

*Copy Publicitaire :*
**Primary Text :** [180 caractères max]
**Headline :** [40 caractères max]
**Description :** [90 caractères max]

*Description Visuelle :*
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

## PHASE 6 : Intégrations VuVenu

### Connexion Image Generator
Transmettre automatiquement les descriptions visuelles détaillées à la skill `vuvenu-image-generator` pour génération des prompts IA.

### Sauvegarde Campagne
Stocker en base Supabase (table `campaigns`) :
- Configuration complète
- Concepts générés
- Métriques prédites
- Status workflow

### Analytics Integration
Préparer les métriques pour tracking performance vs prédictions.

---

*Skill VuVenu Meta Ads Generator v2.0*
*Basée sur méthodologie Bourbon Média avec 18+ frameworks intégrés*