/**
 * Mapping des niches spécifiques vers les 22 groupes d'industries
 * Permet la sélection automatique du rapport viral approprié
 */

export interface IndustryGroup {
  id: string
  name: string
  folder: string // Nom du dossier dans research/industries/
  niches: string[]
  viralAccounts?: string[] // Comptes viraux principaux
  topFormats?: string[] // Formats les plus performants
}

export const INDUSTRY_GROUPS: IndustryGroup[] = [
  // FOOD & DRINK (5 groupes)
  {
    id: 'restauration-table',
    name: 'Restauration Table',
    folder: 'Restauration table',
    niches: [
      'restaurant traditionnel',
      'restaurant gastronomique',
      'brasserie',
      'bistrot',
      'cuisine du monde',
      'crêperie',
      'fruits de mer',
      'restaurant français',
      'cuisine italienne',
      'cuisine asiatique',
      'cuisine indienne',
      'restaurant japonais',
    ],
    viralAccounts: ['@gordonramsay', '@chefclub', '@tasty'],
    topFormats: ['Behind the scenes cuisine', 'Food preparation', 'Chef reaction'],
  },

  {
    id: 'fast-food-street',
    name: 'Fast Food & Street Food',
    folder: 'Fast Food et Street Food',
    niches: [
      'burger',
      'kebab',
      'pizza',
      'tacos',
      'food truck',
      'snack',
      'fish & chips',
      'bagel',
      'poke bowl',
      'sandwich',
      'frites',
      'hot dog',
      'burrito',
      'wrap',
    ],
    topFormats: ['Food assembly', 'Speed cooking', 'Size comparison'],
  },

  {
    id: 'boulangerie-sucre',
    name: 'Boulangerie & Sucré',
    folder: 'Boulangerie & Sucré',
    niches: [
      'boulangerie',
      'pâtisserie',
      'chocolatier',
      'glacier',
      'donuts',
      'cupcakes',
      'confiserie',
      'macarons',
      'viennoiserie',
      'gâteaux',
      'pain artisanal',
      'croissant',
    ],
    topFormats: ['Pastry making', 'Decoration process', 'Before/After baking'],
  },

  {
    id: 'cafe-boissons',
    name: 'Café & Boissons',
    folder: 'Café & Boissons',
    niches: [
      'coffee shop',
      'salon de thé',
      'bar à jus',
      'bubble tea',
      'smoothie bar',
      'café',
      'barista',
      'torréfaction',
    ],
    topFormats: ['Latte art', 'Brewing process', 'Drink preparation'],
  },

  {
    id: 'bars-nightlife',
    name: 'Bars & Nightlife',
    folder: 'Bars & Nightlife',
    niches: [
      'bar cocktails',
      'bar à vin',
      'pub',
      'rooftop',
      'nightclub',
      'speakeasy',
      'brasserie artisanale',
      'cave à vin',
      'bar lounge',
    ],
    topFormats: ['Cocktail making', 'Ambiance showcase', 'Behind the bar'],
  },

  // BEAUTÉ & BIEN-ÊTRE (3 groupes)
  {
    id: 'coiffure-barbier',
    name: 'Coiffure & Barbier',
    folder: 'Coiffure & Barbier',
    niches: [
      'salon coiffure',
      'barbier',
      'coloriste',
      'extensions',
      'locks',
      'afro',
      'lissage',
      'coupe homme',
      'coupe femme',
      'balayage',
      'permanente',
      'défrisage',
    ],
    viralAccounts: ['@salonchampsbarbier', '@coloristbae'],
    topFormats: ['Hair transformation', 'Cutting process', 'Color reveal'],
  },

  {
    id: 'esthetique-soins',
    name: 'Esthétique & Soins',
    folder: 'Esthétique & Soins',
    niches: [
      'institut beauté',
      'onglerie',
      'cils',
      'sourcils',
      'microblading',
      'épilation',
      'soin visage',
      'manucure',
      'pédicure',
      'massage facial',
      'nettoyage de peau',
      'extension cils',
    ],
    topFormats: ['Before/After treatment', 'Precision work', 'Relaxation moment'],
  },

  {
    id: 'bien-etre-relaxation',
    name: 'Bien-être & Relaxation',
    folder: 'Bien-être & Relaxation',
    niches: [
      'spa',
      'massage',
      'hammam',
      'soins corps',
      'thalasso',
      'réflexologie',
      'aromathérapie',
      'sauna',
      'balnéothérapie',
      'massage thaï',
      'shiatsu',
    ],
    topFormats: ['Relaxation ambiance', 'Treatment showcase', 'Zen moments'],
  },

  // SPORT (1 groupe)
  {
    id: 'fitness-coaching',
    name: 'Fitness & Coaching',
    folder: 'Fitness & Coaching',
    niches: [
      'salle de sport',
      'coach sportif',
      'crossfit',
      'yoga',
      'pilates',
      'boxe',
      'arts martiaux',
      'danse',
      'musculation',
      'cardio',
      'fitness',
      'personal trainer',
      'cours collectifs',
    ],
    topFormats: ['Workout demonstration', 'Transformation', 'Exercise tutorial'],
  },

  // MODE & RETAIL (3 groupes)
  {
    id: 'boutique-mode-femme',
    name: 'Boutique Mode Femme',
    folder: 'Boutique Mode Femme',
    niches: [
      'prêt-à-porter femme',
      'chaussures femme',
      'accessoires',
      'lingerie',
      'maroquinerie',
      'bijoux',
      'sacs',
      'robes',
      'mode féminine',
    ],
    topFormats: ['Outfit styling', 'Product showcase', 'Try-on sessions'],
  },

  {
    id: 'boutique-mode-mixte',
    name: 'Boutique Mode Mixte/Homme',
    folder: 'Boutique Mode Mixte',
    niches: [
      'streetwear',
      'boutique homme',
      'sneakers',
      'vintage',
      'friperie',
      'costumes',
      'mode masculine',
      'casquettes',
      'urban wear',
    ],
    topFormats: ['Style transformation', 'Product drops', 'Outfit combinations'],
  },

  {
    id: 'commerce-retail',
    name: 'Commerce & Retail',
    folder: 'Commerce & Retail',
    niches: [
      'fleuriste',
      'déco maison',
      'bijouterie',
      'librairie',
      'papeterie',
      'cadeaux',
      'bougies',
      'artisanat',
      'antiquités',
      'horlogerie',
    ],
    topFormats: ['Product arrangement', 'Behind the scenes', 'Seasonal displays'],
  },

  // SERVICES VISUELS (2 groupes)
  {
    id: 'artisans-corps',
    name: 'Artisans Corps',
    folder: 'Artisans corps',
    niches: [
      'tatoueur',
      'piercing',
      'dermographe',
      'maquillage permanent',
      'tattoo artist',
      'body art',
      'modification corporelle',
    ],
    topFormats: ['Process timelapse', 'Healing progress', 'Design showcase'],
  },

  {
    id: 'automobile',
    name: 'Automobile',
    folder: 'Automobile',
    niches: [
      'detailing',
      'garage',
      'carwash',
      'concession auto',
      'concession moto',
      'pneus',
      'vitres teintées',
      'mécanique',
      'carrosserie',
      'tuning',
    ],
    topFormats: ['Before/After cleaning', 'Repair process', 'Car transformation'],
  },

  // IMMOBILIER & HÉBERGEMENT (2 groupes)
  {
    id: 'immobilier',
    name: 'Immobilier',
    folder: 'Immobilier',
    niches: [
      'agence immo',
      'promoteur',
      'architecte intérieur',
      'home staging',
      'décorateur',
      'courtier',
      'agent immobilier',
      'syndic',
    ],
    topFormats: ['Property tours', 'Before/After staging', 'Neighborhood highlights'],
  },

  {
    id: 'hebergement',
    name: 'Hébergement',
    folder: 'Hébergement',
    niches: [
      'hôtel',
      'airbnb',
      'gîte',
      "chambre d'hôtes",
      'camping',
      'glamping',
      'lodge',
      'resort',
      "maison d'hôtes",
    ],
    topFormats: ['Room reveals', 'Guest experiences', 'Location highlights'],
  },

  // LOISIRS & ÉVÉNEMENTS (2 groupes)
  {
    id: 'activites-loisirs',
    name: 'Activités & Loisirs',
    folder: 'Activités & Loisirs',
    niches: [
      'escape game',
      'bowling',
      'karting',
      'laser game',
      'parc attractions',
      'zoo',
      'aquarium',
      'mini-golf',
      'paintball',
      'accrobranche',
    ],
    topFormats: ['Action moments', 'Group fun', 'Facility showcase'],
  },

  {
    id: 'evenementiel',
    name: 'Événementiel',
    folder: 'Événementiel',
    niches: [
      'photographe mariage',
      'wedding planner',
      'dj',
      'traiteur',
      'décorateur événement',
      'animation',
      'organisation événements',
    ],
    topFormats: ['Event highlights', 'Setup process', 'Celebration moments'],
  },

  // SANTÉ & EXPERTISE (2 groupes)
  {
    id: 'sante-paramedical',
    name: 'Santé & Paramédical',
    folder: 'Santé & Paramédical',
    niches: [
      'dentiste',
      'kiné',
      'ostéo',
      'ophtalmo',
      'dermato',
      'psy',
      'nutritionniste',
      'podologue',
      'sage-femme',
      'médecin',
      'pharmacie',
      'cabinet médical',
    ],
    topFormats: ['Educational content', 'Facility tours', 'Patient testimonials'],
  },

  {
    id: 'services-pro-conseil',
    name: 'Services Pro & Conseil',
    folder: 'Services pro & Conseil',
    niches: [
      'avocat',
      'comptable',
      'notaire',
      'consultant',
      'coach business',
      'formation',
      'rh',
      'assurance',
      'expertise comptable',
      'conseil',
    ],
    topFormats: ['Expert tips', 'Behind the desk', 'Client success stories'],
  },

  // ARTISANAT & BTP (1 groupe)
  {
    id: 'artisans-btp',
    name: 'Artisans BTP',
    folder: 'Artisans BTP',
    niches: [
      'plombier',
      'électricien',
      'peintre',
      'menuisier',
      'carreleur',
      'maçon',
      'couvreur',
      'pisciniste',
      'paysagiste',
      'chauffagiste',
      'serrurier',
      'vitrier',
    ],
    topFormats: ['Work process', 'Before/After projects', 'Problem solving'],
  },

  // FAMILLE & ANIMAUX (2 groupes)
  {
    id: 'enfance-famille',
    name: 'Enfance & Famille',
    folder: 'Enfance & Famille',
    niches: [
      'crèche',
      'photographe bébé',
      'boutique enfant',
      'jouets',
      'activités kids',
      'anniversaires',
      'ludothèque',
      "garde d'enfants",
    ],
    topFormats: ['Kid reactions', 'Family moments', 'Play activities'],
  },

  {
    id: 'animaux',
    name: 'Animaux',
    folder: 'Animaux',
    niches: [
      'toilettage',
      'vétérinaire',
      'pension',
      'éleveur',
      'animalerie',
      'éducateur canin',
      'pet sitting',
      'dressage',
      'garde animaux',
    ],
    viralAccounts: [
      '@girlwithedogs (7.1M)',
      '@dogsbylogan (6.5M)',
      '@gabrielfeitosagrooming (2.9M)',
    ],
    topFormats: [
      'Transformation (500K-5M vues)',
      'ASMR Grooming (500K-7M vues)',
      'POV Animal (100K-1.2M vues)',
    ],
  },
]

/**
 * Fonction pour trouver le groupe d'industrie approprié basé sur une niche
 */
export function findIndustryGroup(niche: string): IndustryGroup | null {
  const lowerNiche = niche.toLowerCase()

  return (
    INDUSTRY_GROUPS.find((group) =>
      group.niches.some(
        (groupNiche) =>
          groupNiche.toLowerCase().includes(lowerNiche) ||
          lowerNiche.includes(groupNiche.toLowerCase())
      )
    ) || null
  )
}

/**
 * Fonction pour obtenir toutes les niches d'un groupe spécifique
 */
export function getNichesByGroup(groupId: string): string[] {
  const group = INDUSTRY_GROUPS.find((g) => g.id === groupId)
  return group ? group.niches : []
}

/**
 * Fonction pour suggérer des groupes basés sur le nom du commerce
 */
export function suggestIndustryGroups(businessName: string): IndustryGroup[] {
  const lowerBusinessName = businessName.toLowerCase()
  const suggestions: { group: IndustryGroup; score: number }[] = []

  INDUSTRY_GROUPS.forEach((group) => {
    let score = 0

    // Cherche dans les niches du groupe
    group.niches.forEach((niche) => {
      if (
        lowerBusinessName.includes(niche.toLowerCase()) ||
        niche.toLowerCase().includes(lowerBusinessName.split(' ')[0])
      ) {
        score += 1
      }
    })

    // Bonus si le nom du groupe correspond
    if (lowerBusinessName.includes(group.name.toLowerCase().split(' ')[0])) {
      score += 2
    }

    if (score > 0) {
      suggestions.push({ group, score })
    }
  })

  return suggestions
    .sort((a, b) => b.score - a.score)
    .map((s) => s.group)
    .slice(0, 3) // Top 3 suggestions
}

/**
 * Configuration pour l'interface utilisateur
 */
export const INDUSTRY_CATEGORIES = [
  {
    name: 'Food & Drink',
    groups: [
      'restauration-table',
      'fast-food-street',
      'boulangerie-sucre',
      'cafe-boissons',
      'bars-nightlife',
    ],
    icon: '🍽️',
    color: '#FF6B6B',
  },
  {
    name: 'Beauté & Bien-être',
    groups: ['coiffure-barbier', 'esthetique-soins', 'bien-etre-relaxation'],
    icon: '💄',
    color: '#FF8CC8',
  },
  {
    name: 'Sport & Fitness',
    groups: ['fitness-coaching'],
    icon: '💪',
    color: '#FF9F43',
  },
  {
    name: 'Mode & Retail',
    groups: ['boutique-mode-femme', 'boutique-mode-mixte', 'commerce-retail'],
    icon: '👗',
    color: '#A55EEA',
  },
  {
    name: 'Services Visuels',
    groups: ['artisans-corps', 'automobile'],
    icon: '🎨',
    color: '#26D0CE',
  },
  {
    name: 'Immobilier & Hébergement',
    groups: ['immobilier', 'hebergement'],
    icon: '🏠',
    color: '#3742FA',
  },
  {
    name: 'Loisirs & Événements',
    groups: ['activites-loisirs', 'evenementiel'],
    icon: '🎉',
    color: '#2ED573',
  },
  {
    name: 'Santé & Expertise',
    groups: ['sante-paramedical', 'services-pro-conseil'],
    icon: '🏥',
    color: '#1E90FF',
  },
  {
    name: 'Artisanat & BTP',
    groups: ['artisans-btp'],
    icon: '🔨',
    color: '#FFA502',
  },
  {
    name: 'Famille & Animaux',
    groups: ['enfance-famille', 'animaux'],
    icon: '🐾',
    color: '#FF6348',
  },
]

export default INDUSTRY_GROUPS
