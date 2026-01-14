# 🎨 BRIEF CRÉATIF - BRANDING VUVENU

> Ce document est le brief créatif complet pour créer l'identité visuelle de VuVenu.
> **Direction artistique** : Inspiré du rapport Vogue Business x Archrival "Gen Z Broke the Marketing Funnel"
> Utilise ce brief avec Gemini pour générer les éléments visuels.

---

## 1. CONTEXTE DU PROJET

### 1.1 Qu'est-ce que VuVenu ?

**VuVenu** est un SaaS de marketing digital simplifié pour les commerces de proximité.

| Élément     | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| **Nom**     | VuVenu (jeu de mots : "Vu" = visible + "Venu" = venir au commerce)              |
| **Tagline** | "Sois vu, fais venir"                                                           |
| **Mission** | Permettre aux petits commerces de créer du contenu marketing pro sans expertise |
| **Cible**   | Restaurants, salons de coiffure, boutiques, artisans, prestataires de services  |
| **Marché**  | La Réunion d'abord, puis France entière                                         |

### 1.2 Personnalité de marque

| Trait          | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| **Audacieux**  | On ose, on se démarque, on n'est pas un énième outil corporate |
| **Accessible** | Simple à comprendre, pas de jargon technique                   |
| **Moderne**    | Esthétique actuelle, digitale, Gen Z friendly                  |
| **Local**      | Ancré dans le tissu local, proche des commerçants              |
| **Efficace**   | Résultats concrets, pas de promesses vagues                    |

### 1.3 Ton de voix

- Tutoiement (proche, accessible)
- Enthousiaste mais pas forcé
- Direct, sans bullshit
- Encourageant, positif
- Parfois un peu impertinent

---

## 2. DIRECTION ARTISTIQUE

### 2.1 Référence principale

**Style Vogue Business x Archrival "Gen Z Broke the Marketing Funnel"**

Ce style se caractérise par :

- Éléments **pixelisés/8-bit** (carrés, formes géométriques)
- Mélange de **photos découpées** et **illustrations**
- Couleurs **vives et audacieuses**
- Mise en page **asymétrique et dynamique**
- Ambiance **jeune, digitale mais humaine**

### 2.2 Palette de couleurs

| Nom                 | Hex       | Usage                             |
| ------------------- | --------- | --------------------------------- |
| **Lime Électrique** | `#BFFF00` | Accent principal, CTA, highlights |
| **Bleu Pixel**      | `#60A5FA` | Éléments graphiques, backgrounds  |
| **Violet Doux**     | `#C4B5FD` | Sections secondaires, cards       |
| **Rose Pâle**       | `#FECDD3` | Backgrounds doux, hover states    |
| **Crème**           | `#FFFBEB` | Background principal              |
| **Noir Profond**    | `#0F172A` | Texte principal                   |
| **Blanc**           | `#FFFFFF` | Texte sur fonds sombres           |

### 2.3 Typographie

| Usage                  | Font                                         | Style                       |
| ---------------------- | -------------------------------------------- | --------------------------- |
| **Titres principaux**  | Inter ou Satoshi                             | Bold, uppercase pour impact |
| **Sous-titres**        | Inter                                        | Semi-bold                   |
| **Corps de texte**     | Inter                                        | Regular                     |
| **Accents/Highlights** | Script élégant (ex: Playfair Display Italic) | Pour "magic", "meaning"     |

### 2.4 Éléments graphiques signature

1. **Pixels/Carrés décoratifs**
   - Petits carrés colorés (lime, bleu) dispersés
   - Effet "digital rain" ou "digital growth"
   - Rappelle le côté tech sans être froid

2. **Découpes photos**
   - Photos de vrais commerçants/clients
   - Détourées avec bords nets ou légèrement pixelisés
   - Mélangées aux éléments graphiques

3. **Highlights texte**
   - Mots clés surlignés en couleur (lime, bleu, violet)
   - Effet "marqueur fluo" digital

4. **Formes organiques + géométriques**
   - Cercles doux + carrés pixelisés
   - Contraste entre humain et digital

---

## 3. LOGO

### 3.1 Concept du logo

Le logo VuVenu doit :

- Être **reconnaissable** même en petit (favicon)
- Intégrer l'idée de **visibilité** (œil, regard, lumière)
- Avoir une touche **pixel/digital**
- Fonctionner en **couleur et monochrome**

### 3.2 Directions créatives pour le logo

**Option A : "L'œil pixel"**

- Forme d'œil stylisée
- Pupille = carré pixelisé (rappel digital)
- Couleur : Lime sur fond sombre ou inverse

**Option B : "V connecté"**

- Les deux V de VuVenu connectés
- Forme qui évoque un "check" (validation, succès)
- Éléments pixelisés autour

**Option C : "Spotlight"**

- Forme de spot lumineux / projecteur
- L'idée d'être "sous les projecteurs" = visible
- Style néon/digital

### 3.3 Déclinaisons nécessaires

| Format                | Usage                            |
| --------------------- | -------------------------------- |
| Logo complet          | Header, pied de page, documents  |
| Logo compact          | Mobile, petits espaces           |
| Favicon               | Onglet navigateur (32x32, 16x16) |
| Logo monochrome blanc | Sur fonds colorés                |
| Logo monochrome noir  | Sur fonds clairs                 |

---

## 4. ÉLÉMENTS UI

### 4.1 Boutons

```css
/* Primaire */
.btn-primary {
  background: #bfff00;
  color: #0f172a;
  border-radius: 8px;
  font-weight: 600;
  /* Hover: légèrement plus lumineux + scale 1.02 */
}

/* Secondaire */
.btn-secondary {
  background: transparent;
  border: 2px solid #0f172a;
  color: #0f172a;
  /* Hover: background #0F172A, texte blanc */
}
```

### 4.2 Cards

```css
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  /* Hover: légère élévation + bordure lime subtile */
}
```

### 4.3 Inputs

```css
.input {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  /* Focus: border #BFFF00 */
}
```

### 4.4 Navigation

```css
/* Sidebar dashboard */
.sidebar {
  background: #0f172a;
}
.sidebar-link-active {
  color: #bfff00;
}
.sidebar-link {
  color: #94a3b8;
}
```

---

## 5. PROMPTS GEMINI POUR GÉNÉRATION

### 5.1 Prompt Logo

```
Create a modern logo for "VuVenu", a SaaS marketing platform for local businesses.

Style:
- Inspired by Vogue Business x Archrival visual identity
- Mix of pixel/8-bit elements with clean modern design
- Bold, youthful, digital but human

Concept:
- The name means "Seen" + "Come" (visibility bringing customers)
- Should evoke: visibility, spotlight, digital growth, success
- Include subtle pixel/square elements

Colors:
- Primary: Electric lime (#BFFF00)
- Secondary: Pixel blue (#60A5FA)
- Can use on dark (#0F172A) or light backgrounds

Requirements:
- Simple enough for favicon
- Works in monochrome
- Modern, not corporate
- Memorable and unique
```

### 5.2 Prompt Landing Page Hero

```
Design a hero section for VuVenu, a marketing SaaS for local businesses.

Visual style:
- Inspired by Vogue Business x Archrival "Gen Z Broke the Marketing Funnel" report
- Pixelated decorative elements (lime green, blue squares)
- Cut-out photos of happy local business owners (bakery, salon, restaurant)
- Asymmetric, dynamic layout
- Highlighted text effect (lime, blue, violet backgrounds on key words)

Content to include:
- Headline: "Sois vu, fais venir"
- Subheadline: "Le marketing digital enfin simple pour ton commerce"
- CTA button: "Essayer gratuitement" (lime background)
- Secondary CTA: "Voir comment ça marche"

Color palette:
- Background: Cream (#FFFBEB)
- Accent: Electric lime (#BFFF00)
- Secondary: Pixel blue (#60A5FA), Soft violet (#C4B5FD)
- Text: Dark (#0F172A)

Mood: Energetic, accessible, modern, local-business friendly
```

### 5.3 Prompt Dashboard

```
Design a dashboard interface for VuVenu, a marketing SaaS.

Style:
- Clean, modern, but with playful touches
- Subtle pixel decorations in corners
- Card-based layout
- Dark sidebar (#0F172A) with lime accents (#BFFF00)
- Main area: light cream background

Elements to show:
- Sidebar with: Logo, Dashboard, Scripts Vidéos, Campagnes Meta Ads, Paramètres
- Welcome message: "Salut [Prénom] ! 👋"
- Stats cards: Scripts créés, Campagnes lancées, Jours restants
- Quick actions: "Créer un script", "Nouvelle campagne"
- Recent activity section

Make it feel:
- Professional but not boring
- Accessible to non-tech users
- Encouraging and positive
```

### 5.4 Prompt Icônes/Illustrations

```
Create a set of icons/illustrations for VuVenu marketing SaaS.

Style:
- Mix of line icons and pixel art elements
- Lime (#BFFF00) and blue (#60A5FA) accent colors
- Playful, modern, digital

Icons needed:
1. Video script (camera + text)
2. Meta Ads (target + image)
3. Analytics/Stats (chart going up)
4. Settings (gear with pixel elements)
5. Success/Launch (rocket or checkmark)
6. Local business (storefront)

Each icon should:
- Work at 24x24 and 48x48
- Have a consistent style
- Include subtle pixel decorations
```

---

## 6. APPLICATIONS

### 6.1 Site web (Landing + App)

| Page         | Style dominant                                 |
| ------------ | ---------------------------------------------- |
| Landing hero | Audacieux, photos découpées, pixels décoratifs |
| Features     | Cards propres, icônes illustrées               |
| Pricing      | Clair, highlights sur plan recommandé          |
| Dashboard    | Clean, sidebar sombre, contenu clair           |
| Formulaires  | Simple, focus sur le contenu                   |

### 6.2 Emails transactionnels

- Header : Logo + bande lime
- Corps : Fond blanc, texte noir
- CTA : Bouton lime
- Footer : Gris sobre

### 6.3 Réseaux sociaux

- Templates avec éléments pixelisés
- Photos de commerçants locaux
- Textes courts, percutants
- Couleurs vives (lime, bleu)

---

## 7. DO'S AND DON'TS

### ✅ DO

- Utiliser les couleurs vives avec intention
- Mélanger photos réelles et éléments graphiques
- Garder une hiérarchie claire
- Rester accessible et lisible
- Célébrer les commerces locaux

### ❌ DON'T

- Trop de pixels partout (subtilité)
- Esthétique corporate froide
- Stock photos génériques
- Textes trop longs sur les visuels
- Couleurs ternes ou pastels uniquement

---

## 8. FICHIERS À GÉNÉRER

### Phase 1 : Fondamentaux

1. [ ] Logo VuVenu (toutes déclinaisons)
2. [ ] Palette couleurs (fichier Figma ou CSS)
3. [ ] Favicon
4. [ ] OG Image (1200x630)

### Phase 2 : UI Components

5. [ ] Design système (boutons, inputs, cards)
6. [ ] Icônes personnalisées (set de 10-15)
7. [ ] Illustrations clés (3-5)

### Phase 3 : Pages complètes

8. [ ] Landing page complète
9. [ ] Dashboard design
10. [ ] Formulaire génération script
11. [ ] Page résultats campagne

---

## 9. TAILWIND CONFIG

```javascript
// tailwind.config.js - Configuration VuVenu
module.exports = {
  theme: {
    extend: {
      colors: {
        vuvenu: {
          lime: '#BFFF00',
          blue: '#60A5FA',
          violet: '#C4B5FD',
          rose: '#FECDD3',
          cream: '#FFFBEB',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Inter', 'sans-serif'],
        accent: ['Playfair Display', 'serif'],
      },
    },
  },
}
```

---

## 10. NEXT STEPS

1. **Utilise Gemini** avec les prompts de la section 5 pour générer :
   - Le logo (plusieurs options)
   - Le hero de la landing page
   - Le dashboard

2. **Valide** les directions visuelles

3. **Affine** les éléments choisis

4. **Intègre** dans le projet Next.js

---

_Brief créé le 13 janvier 2026_
_Direction artistique : Style Vogue Business x Archrival_
