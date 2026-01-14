# PRD: VuVenu MVP V1

## Introduction

VuVenu est une plateforme SaaS B2B qui permet aux commerces de proximité (restaurants, salons, boutiques, artisans, prestataires locaux) de créer rapidement du contenu marketing performant pour les réseaux sociaux, sans expertise en marketing digital.

Le MVP V1 comprend deux modules principaux :

1. **Générateur de Scripts Vidéos** : Crée des scripts optimisés pour Reels/TikTok (30-60 sec)
2. **Meta Ads Generator** : Génère des concepts publicitaires complets avec images IA et guide l'utilisateur jusqu'au lancement de sa campagne

**Problème résolu** : Les commerçants locaux veulent plus de visibilité mais ne savent pas quoi publier, n'ont pas le temps, et trouvent les outils comme Meta Ads Manager trop complexes.

**Proposition de valeur** : "VuVenu te permet en tant que gérant d'une entreprise locale d'attirer plus de clients grâce à un outil tout-en-un qui t'apporte la meilleure visibilité sur les réseaux sociaux possible, rapidement et avec le moindre effort."

---

## Goals

- Valider que des commerçants de proximité sont prêts à payer pour ce type d'outil
- Générer des revenus récurrents (objectif : 10 000€ MRR à 12 mois)
- Construire une base technique solide pour ajouter d'autres outils (Carousel Generator, Website Builder, Campagnes Créateurs)
- Permettre à un utilisateur de générer son premier script en moins de 5 minutes après inscription
- Atteindre un taux de complétion du Wizard de lancement > 70%
- Convertir > 20% des trials en clients payants

---

## User Stories

### Authentification & Onboarding

#### US-001: Inscription par email

**Description:** As a new user, I want to create an account with my email so that I can access VuVenu.

**Acceptance Criteria:**

- [ ] Formulaire avec champs : email, mot de passe, confirmation mot de passe
- [ ] Validation email format correct
- [ ] Validation mot de passe minimum 8 caractères
- [ ] Message d'erreur clair si email déjà utilisé
- [ ] Envoi d'un email de vérification après inscription
- [ ] Redirection vers page "Vérifiez votre email" après soumission
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-002: Vérification email

**Description:** As a new user, I want to verify my email so that my account is activated.

**Acceptance Criteria:**

- [ ] Clic sur lien dans email redirige vers VuVenu
- [ ] Compte marqué comme vérifié en base de données
- [ ] Redirection automatique vers onboarding après vérification
- [ ] Message d'erreur si lien expiré ou invalide
- [ ] Possibilité de renvoyer l'email de vérification
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-003: Connexion

**Description:** As a returning user, I want to log in so that I can access my account.

**Acceptance Criteria:**

- [ ] Formulaire avec champs : email, mot de passe
- [ ] Bouton "Mot de passe oublié" visible
- [ ] Message d'erreur clair si identifiants incorrects
- [ ] Redirection vers dashboard après connexion réussie
- [ ] Session persistante (rester connecté)
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-004: Mot de passe oublié

**Description:** As a user who forgot my password, I want to reset it so that I can regain access to my account.

**Acceptance Criteria:**

- [ ] Formulaire avec champ email
- [ ] Envoi d'un email avec lien de réinitialisation
- [ ] Page de saisie nouveau mot de passe
- [ ] Confirmation de changement réussi
- [ ] Lien expire après 1 heure
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-005: Onboarding - Informations commerce

**Description:** As a new user, I want to provide information about my business so that VuVenu can personalize my content.

**Acceptance Criteria:**

- [ ] Étape 1 : Nom du commerce (champ texte obligatoire)
- [ ] Étape 2 : Type d'activité (select : Restaurant, Salon/Coiffure, Boutique, Artisan, Prestataire de service, Autre)
- [ ] Étape 3 : Description de la cible client (textarea, 2-3 phrases)
- [ ] Étape 4 : Objectif principal (select : Attirer plus de clients, Fidéliser mes clients, Lancer une offre/promo, Faire connaître ma marque)
- [ ] Barre de progression visible (4 étapes)
- [ ] Possibilité de revenir en arrière
- [ ] Données sauvegardées en base de données
- [ ] Redirection vers choix de plan après complétion
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-006: Déconnexion

**Description:** As a logged-in user, I want to log out so that my account is secure.

**Acceptance Criteria:**

- [ ] Bouton déconnexion visible dans le header/sidebar
- [ ] Clic déconnecte l'utilisateur et redirige vers page de connexion
- [ ] Session supprimée côté serveur
- [ ] npm run typecheck passes

---

### Dashboard

#### US-007: Affichage dashboard principal

**Description:** As a logged-in user, I want to see an overview of my account so that I know what I can do.

**Acceptance Criteria:**

- [ ] Affichage du nom du commerce en haut
- [ ] Card "Générer un script vidéo" avec bouton CTA
- [ ] Card "Créer une campagne Meta Ads" avec bouton CTA (grisé si plan Starter)
- [ ] Section "Dernières créations" (5 derniers scripts/campagnes)
- [ ] Affichage du plan actuel et utilisation (ex: "3/10 scripts ce mois")
- [ ] Message de bienvenue pour les nouveaux utilisateurs
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-008: Sidebar navigation

**Description:** As a user, I want a sidebar menu so that I can navigate between sections.

**Acceptance Criteria:**

- [ ] Logo VuVenu en haut
- [ ] Liens : Dashboard, Scripts Vidéos, Campagnes Meta Ads, Paramètres
- [ ] Indicateur visuel de la page active
- [ ] Responsive : menu hamburger sur mobile
- [ ] Bouton déconnexion en bas
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Générateur de Scripts Vidéos

#### US-009: Formulaire génération script

**Description:** As a user, I want to fill a form describing what I want to promote so that VuVenu generates a script for me.

**Acceptance Criteria:**

- [ ] Champ "Qu'est-ce que tu veux promouvoir ?" (textarea, obligatoire, placeholder avec exemple)
- [ ] Select "Format" : Reel/TikTok 30 sec, Reel/TikTok 60 sec
- [ ] Select "Ton" : Professionnel, Décontracté, Enthousiaste
- [ ] Champs optionnels dans section dépliable : Offre spéciale, Prix, Date limite
- [ ] Bouton "Générer mon script" désactivé si champs obligatoires vides
- [ ] Vérification limite mensuelle avant génération
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-010: Génération script via IA

**Description:** As a user, I want VuVenu to generate a video script based on my input so that I have ready-to-use content.

**Acceptance Criteria:**

- [ ] Clic sur "Générer" affiche un loader avec message "Génération en cours..."
- [ ] Appel à l'API Anthropic (Claude 3.5 Sonnet) avec prompt optimisé
- [ ] Prompt inclut : infos commerce (onboarding), input utilisateur, format, ton
- [ ] Temps de génération < 15 secondes
- [ ] Incrémentation compteur scripts_count_month
- [ ] Gestion erreur API avec message utilisateur friendly
- [ ] npm run typecheck passes

#### US-011: Affichage script généré

**Description:** As a user, I want to see my generated script clearly formatted so that I can use it easily.

**Acceptance Criteria:**

- [ ] Script affiché avec sections distinctes : 🎬 Accroche, 📝 Corps, 📢 Call-to-Action
- [ ] Durée estimée affichée (ex: "~45 secondes")
- [ ] Bouton "📋 Copier le script" (copie tout le texte)
- [ ] Bouton "🔄 Régénérer" (nouveau script avec mêmes inputs)
- [ ] Bouton "💾 Sauvegarder"
- [ ] Bouton "✏️ Modifier les paramètres" (retour au formulaire pré-rempli)
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-012: Sauvegarde script

**Description:** As a user, I want to save my script so that I can access it later.

**Acceptance Criteria:**

- [ ] Clic sur "Sauvegarder" enregistre en base de données
- [ ] Titre auto-généré basé sur le contenu (ex: "Script Promo Pizza - 30 janv")
- [ ] Toast de confirmation "Script sauvegardé !"
- [ ] Script apparaît dans la liste "Mes scripts"
- [ ] npm run typecheck passes

#### US-013: Liste des scripts sauvegardés

**Description:** As a user, I want to see all my saved scripts so that I can reuse them.

**Acceptance Criteria:**

- [ ] Liste avec : titre, format, date de création
- [ ] Tri par date (plus récent en premier)
- [ ] Clic sur un script ouvre le détail
- [ ] Bouton supprimer avec confirmation
- [ ] Message "Aucun script" si liste vide avec CTA "Créer mon premier script"
- [ ] Pagination si > 10 scripts
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-014: Détail d'un script sauvegardé

**Description:** As a user, I want to view a saved script so that I can copy or modify it.

**Acceptance Criteria:**

- [ ] Affichage complet du script avec sections
- [ ] Bouton "📋 Copier"
- [ ] Bouton "🗑️ Supprimer" avec confirmation
- [ ] Affichage date de création
- [ ] Lien retour vers liste
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Meta Ads Generator

#### US-015: Formulaire création campagne

**Description:** As a user, I want to fill a form about my campaign so that VuVenu generates Meta Ads concepts.

**Acceptance Criteria:**

- [ ] Vérification plan Pro ou Business requis (sinon afficher upgrade CTA)
- [ ] Vérification limite mensuelle campagnes
- [ ] Champ "Produit/Service à promouvoir" (textarea, obligatoire)
- [ ] Select "Type de business" (DTC, Lead Gen, Drive-to-Store, Reservation, Event, Subscription)
- [ ] Champ "Budget journalier" (number, minimum 5€)
- [ ] Champ "CPA cible" (number, optionnel, placeholder "Ex: 15€")
- [ ] Select "Objectif" : Plus de ventes, Plus de leads, Plus de visites en boutique, Plus de réservations
- [ ] Section optionnelle : URL, Prix, Points forts (USPs), Éléments disponibles (photos, témoignages)
- [ ] Bouton "Générer ma campagne"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-016: Génération concepts campagne via IA

**Description:** As a user, I want VuVenu to generate ad concepts so that I have a complete campaign strategy.

**Acceptance Criteria:**

- [ ] Loader avec étapes affichées : "Analyse de ton commerce...", "Création des concepts...", "Rédaction des textes..."
- [ ] Appel à l'API Anthropic avec prompt basé sur méthodologie Bourbon Média
- [ ] Génération de 3 concepts : TOF (Top of Funnel), MOF (Middle), BOF (Bottom)
- [ ] Chaque concept inclut : Nom, Angle, Type d'ad, Primary Text, Headline, Description
- [ ] Temps de génération < 30 secondes
- [ ] npm run typecheck passes

#### US-017: Génération images via IA

**Description:** As a user, I want VuVenu to generate ad images so that I have ready-to-use creatives.

**Acceptance Criteria:**

- [ ] Après génération concepts, génération auto des images via Gemini API
- [ ] 1 image par concept (3 images total)
- [ ] Format 1:1 (1080x1080px) optimisé Meta Ads
- [ ] Loader avec message "Création des visuels..."
- [ ] Images stockées dans Supabase Storage
- [ ] Incrémentation compteur campaigns_count_month après succès
- [ ] Fallback si erreur Gemini : message + possibilité de régénérer
- [ ] npm run typecheck passes

#### US-018: Affichage campagne générée

**Description:** As a user, I want to see my complete campaign so that I can review it before launching.

**Acceptance Criteria:**

- [ ] Vue d'ensemble avec les 3 concepts en cards
- [ ] Chaque card affiche : Image générée, Nom concept, Angle, Aperçu Primary Text
- [ ] Clic sur card ouvre détail du concept
- [ ] Détail concept : Image full, Primary Text complet, Headline, Description, boutons copier individuels
- [ ] Bouton "📥 Télécharger toutes les images" (zip)
- [ ] Bouton "🚀 Lancer ma campagne" (accède au Wizard)
- [ ] Bouton "💾 Sauvegarder"
- [ ] Bouton "🔄 Régénérer les images" (garde les textes)
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-019: Sauvegarde campagne

**Description:** As a user, I want to save my campaign so that I can access it later and launch it when ready.

**Acceptance Criteria:**

- [ ] Clic sur "Sauvegarder" enregistre tous les concepts, textes et URLs images
- [ ] Titre auto-généré
- [ ] Toast de confirmation
- [ ] Campagne apparaît dans liste "Mes campagnes"
- [ ] Statut initial : "Brouillon"
- [ ] npm run typecheck passes

#### US-020: Liste des campagnes

**Description:** As a user, I want to see all my campaigns so that I can manage them.

**Acceptance Criteria:**

- [ ] Liste avec : titre, date, statut (Brouillon, En cours de lancement, Lancée)
- [ ] Miniature de la première image
- [ ] Clic ouvre le détail
- [ ] Bouton supprimer avec confirmation
- [ ] Pagination si > 10 campagnes
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Wizard de Lancement

#### US-021: Wizard étape 1 - Téléchargement créatives

**Description:** As a user launching a campaign, I want to download my ad images so that I can upload them to Meta.

**Acceptance Criteria:**

- [ ] Header avec progression : ● Étape 1 ○ ○ ○ ○ ○ ○
- [ ] Titre étape : "Télécharge tes créatives"
- [ ] Galerie des 3 images générées avec aperçu
- [ ] Bouton "📥 Télécharger toutes les images (.zip)"
- [ ] Boutons téléchargement individuel par image
- [ ] Checkbox "✅ J'ai téléchargé mes images"
- [ ] Bouton "Suivant" activé seulement si checkbox cochée
- [ ] Mise à jour statut campagne : "En cours de lancement"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-022: Wizard étape 2 - Ouvrir Meta Ads Manager

**Description:** As a user, I want clear instructions to open Meta Ads Manager so that I don't get lost.

**Acceptance Criteria:**

- [ ] Titre étape : "Ouvre Meta Ads Manager"
- [ ] Lien cliquable vers business.facebook.com/adsmanager (ouvre nouvel onglet)
- [ ] Image/screenshot montrant l'interface Meta Ads Manager
- [ ] Texte explicatif simple : "Clique sur le bouton '+ Créer' pour commencer une nouvelle campagne"
- [ ] Checkbox "✅ J'ai ouvert Meta Ads Manager"
- [ ] Boutons Retour / Suivant
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-023: Wizard étape 3 - Créer la campagne

**Description:** As a user, I want to know exactly what settings to use so that my campaign is well configured.

**Acceptance Criteria:**

- [ ] Titre étape : "Configure ta campagne"
- [ ] Paramètres recommandés affichés avec boutons "📋 Copier" :
  - Objectif : [selon choix utilisateur, ex: "Ventes"]
  - Budget : [budget saisi]€/jour
  - Durée : "Continue - tu pourras arrêter quand tu veux"
- [ ] Image/screenshot montrant où entrer ces paramètres
- [ ] Astuce encadrée : "💡 Garde les autres paramètres par défaut pour commencer"
- [ ] Checkbox "✅ J'ai créé ma campagne avec ces paramètres"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-024: Wizard étape 4 - Configurer l'audience

**Description:** As a user, I want guidance on targeting so that my ads reach the right people.

**Acceptance Criteria:**

- [ ] Titre étape : "Définis ton audience"
- [ ] Recommandation ciblage basée sur type de business :
  - Drive-to-Store : "Cible les personnes dans un rayon de 15km autour de ton commerce"
  - Autres : "Laisse 'Audience Advantage+' activé - Meta trouvera les bonnes personnes"
- [ ] Image/screenshot montrant la section audience
- [ ] Warning encadré : "⚠️ Évite de trop restreindre ton audience au début"
- [ ] Checkbox "✅ J'ai configuré mon audience"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-025: Wizard étape 5 - Ajouter les publicités

**Description:** As a user, I want to easily copy my ad texts so that I can paste them in Meta.

**Acceptance Criteria:**

- [ ] Titre étape : "Ajoute tes publicités"
- [ ] Instructions numérotées : "1. Clique sur 'Nouvelle publicité' 2. Upload l'image 3. Colle les textes"
- [ ] Pour chaque concept (3), card avec :
  - Image miniature (rappel visuel)
  - Primary Text avec bouton "📋 Copier"
  - Headline avec bouton "📋 Copier"
  - Description avec bouton "📋 Copier"
- [ ] Image/screenshot montrant où coller chaque texte dans Meta
- [ ] Checkbox "✅ J'ai ajouté mes 3 publicités"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-026: Wizard étape 6 - Vérification finale

**Description:** As a user, I want a checklist before publishing so that I don't make mistakes.

**Acceptance Criteria:**

- [ ] Titre étape : "Vérifie avant de publier"
- [ ] Checklist visuelle (non interactive, rappel) :
  - ✓ Budget : [X]€/jour
  - ✓ 3 publicités ajoutées
  - ✓ Images en bonne qualité
  - ✓ Textes sans fautes
  - ✓ Mode de paiement configuré
- [ ] Lien "Voir l'aperçu dans Meta" (ouvre nouvel onglet)
- [ ] Warning encadré : "⚠️ Des frais s'appliquent dès que tu cliques sur Publier"
- [ ] Checkbox "✅ J'ai tout vérifié, je suis prêt à publier"
- [ ] Bouton Suivant devient "Publier ma campagne"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-027: Wizard étape 7 - Succès

**Description:** As a user who launched a campaign, I want confirmation and next steps so that I know what to do.

**Acceptance Criteria:**

- [ ] Animation de célébration (confettis)
- [ ] Titre : "🎉 Félicitations ! Ta campagne est en ligne !"
- [ ] Conseils post-lancement en cards :
  - "⏳ Laisse tourner 3-5 jours avant de juger les résultats"
  - "📊 Vérifie tes stats dans Meta Ads Manager"
  - "💡 Les premiers jours servent à l'apprentissage de l'algorithme"
- [ ] Bouton "Voir ma campagne dans Meta" (lien externe)
- [ ] Bouton "Retour au dashboard"
- [ ] Statut campagne mis à jour : "Lancée"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-028: Sauvegarde progression Wizard

**Description:** As a user, I want my wizard progress saved so that I can continue later if interrupted.

**Acceptance Criteria:**

- [ ] Étape courante (wizard_step) sauvegardée en base à chaque passage
- [ ] Si user quitte et revient sur la campagne, reprend à la dernière étape
- [ ] Badge "Reprendre" visible sur campagne en statut "En cours de lancement"
- [ ] npm run typecheck passes

---

### Paramètres & Compte

#### US-029: Page paramètres

**Description:** As a user, I want to manage my account settings so that I can update my information.

**Acceptance Criteria:**

- [ ] Section "Mon commerce" : modifier nom, type, cible, objectif (formulaire identique onboarding)
- [ ] Section "Mon compte" : affichage email (non modifiable pour MVP)
- [ ] Section "Mot de passe" : modifier mot de passe (ancien + nouveau + confirmation)
- [ ] Section "Abonnement" : afficher plan actuel, usage, bouton "Gérer mon abonnement"
- [ ] Bouton sauvegarder par section avec toast confirmation
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-030: Gestion abonnement via Stripe

**Description:** As a user, I want to manage my subscription so that I can upgrade, downgrade, or cancel.

**Acceptance Criteria:**

- [ ] Bouton "Gérer mon abonnement" redirige vers Stripe Customer Portal
- [ ] Dans portal : changer de plan, mettre à jour carte, voir factures, annuler
- [ ] Retour automatique vers VuVenu après modification
- [ ] Changements reflétés dans VuVenu via webhook (plan, statut)
- [ ] npm run typecheck passes

---

### Billing & Stripe

#### US-031: Page pricing (public)

**Description:** As a visitor, I want to see pricing plans so that I can choose the right one.

**Acceptance Criteria:**

- [ ] 3 cards côte à côte (responsive : empilées sur mobile)
- [ ] **Starter 59€/mois** : 10 scripts vidéos/mois
- [ ] **Pro 119€/mois** : 30 scripts + 5 campagnes Meta Ads + Wizard (badge "Populaire")
- [ ] **Business 249€/mois** : Illimité + Support prioritaire
- [ ] Toggle Mensuel / Annuel (-17%, équivalent 2 mois offerts)
- [ ] Bouton "Commencer" sur chaque plan
- [ ] FAQ pricing en accordion en dessous
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-032: Sélection plan après onboarding

**Description:** As a new user, I want to choose and pay for a plan so that I can use VuVenu.

**Acceptance Criteria:**

- [ ] Page /choose-plan affichée après onboarding
- [ ] Même affichage que page pricing publique
- [ ] Clic sur plan crée session Stripe Checkout
- [ ] Email pré-rempli dans Checkout
- [ ] Après paiement réussi : redirection vers /dashboard avec toast "Bienvenue !"
- [ ] Profil mis à jour : subscription_status = 'active', subscription_tier = [plan choisi]
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-033: Webhook Stripe

**Description:** As the system, I need to handle Stripe webhooks so that subscription changes are reflected.

**Acceptance Criteria:**

- [ ] Endpoint POST /api/webhooks/stripe
- [ ] Vérification signature Stripe (STRIPE_WEBHOOK_SECRET)
- [ ] Événements gérés :
  - checkout.session.completed → activer abonnement
  - customer.subscription.updated → mettre à jour plan/statut
  - customer.subscription.deleted → désactiver abonnement
  - invoice.payment_failed → marquer statut "past_due"
- [ ] Logs des événements reçus (pour debug)
- [ ] Réponse 200 OK à Stripe
- [ ] npm run typecheck passes

#### US-034: Application des limites par plan

**Description:** As the system, I need to enforce usage limits so that plans have differentiated value.

**Acceptance Criteria:**

- [ ] Limites définies :
  - Starter (59€) : 10 scripts/mois, 0 campagne
  - Pro (119€) : 30 scripts/mois, 5 campagnes/mois
  - Business (249€) : Illimité
- [ ] Compteurs scripts_count_month et campaigns_count_month dans profiles
- [ ] Vérification limite AVANT génération (pas après)
- [ ] Si limite atteinte : modal "Limite atteinte" avec bouton "Passer au plan supérieur"
- [ ] Compteurs reset automatique le 1er de chaque mois (via counts_reset_at)
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-035: Reset mensuel des compteurs

**Description:** As the system, I need to reset usage counters monthly so that users get fresh limits.

**Acceptance Criteria:**

- [ ] À chaque action (génération script/campagne), vérifier si counts_reset_at < début du mois courant
- [ ] Si oui : reset scripts_count_month = 0, campaigns_count_month = 0, counts_reset_at = NOW()
- [ ] Puis procéder à la génération
- [ ] npm run typecheck passes

---

### Landing Page (Marketing)

#### US-036: Hero section

**Description:** As a visitor, I want to understand what VuVenu does immediately so that I know if it's for me.

**Acceptance Criteria:**

- [ ] Headline : "Attire plus de clients sans être expert en marketing"
- [ ] Sous-titre : "Génère des scripts vidéos et des campagnes publicitaires en quelques clics. Conçu pour les commerces de proximité."
- [ ] CTA principal : "Commencer maintenant" → /register
- [ ] CTA secondaire : "Voir les tarifs" → scroll vers pricing
- [ ] Visual : mockup de l'interface VuVenu
- [ ] Responsive : texte centré sur mobile
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-037: Section bénéfices

**Description:** As a visitor, I want to see the benefits so that I understand the value.

**Acceptance Criteria:**

- [ ] Titre section : "Tout ce qu'il te faut pour être visible"
- [ ] 4 bénéfices en grid (2x2 desktop, 1 colonne mobile) :
  - 🎬 "Scripts vidéos en 2 minutes" - "Des scripts prêts à filmer pour tes Reels et TikToks"
  - 📢 "Campagnes Meta Ads guidées" - "On te guide étape par étape jusqu'au lancement"
  - ✨ "Contenu personnalisé" - "Adapté à ton commerce, pas du générique"
  - ⚡ "Zéro expertise requise" - "Si tu sais utiliser ton téléphone, tu sais utiliser VuVenu"
- [ ] Icônes ou illustrations pour chaque bénéfice
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-038: Section "Comment ça marche"

**Description:** As a visitor, I want to see how it works so that it feels simple.

**Acceptance Criteria:**

- [ ] Titre : "Simple comme 1, 2, 3"
- [ ] 3 étapes numérotées avec visuels :
  1. "Décris ce que tu veux promouvoir" - illustration formulaire
  2. "VuVenu génère ton contenu" - illustration IA/magie
  3. "Publie et attire des clients" - illustration succès/clients
- [ ] Flèches ou connecteurs entre les étapes
- [ ] CTA en fin de section : "Essayer maintenant"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-039: Section témoignages

**Description:** As a visitor, I want social proof so that I trust the product.

**Acceptance Criteria:**

- [ ] Titre : "Ils ont testé VuVenu"
- [ ] 3 témoignages en cards :
  - Photo (placeholder ou vraie si beta testeurs)
  - Nom + type de commerce
  - Quote (2-3 phrases)
- [ ] Pour le lancement : utiliser témoignages de beta testeurs ou placeholder "Bientôt des témoignages"
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-040: Section pricing (landing)

**Description:** As a visitor, I want to see pricing on the landing page so that I can decide quickly.

**Acceptance Criteria:**

- [ ] Identique à US-031 (réutilisation composant)
- [ ] Ancre #pricing pour navigation interne
- [ ] npm run typecheck passes

#### US-041: Section FAQ

**Description:** As a visitor, I want answers to common questions so that my doubts are addressed.

**Acceptance Criteria:**

- [ ] Titre : "Questions fréquentes"
- [ ] 6 questions en accordion :
  - "C'est quoi VuVenu ?"
  - "C'est pour qui ?"
  - "J'ai besoin de compétences techniques ?"
  - "Combien ça coûte ?"
  - "Je peux annuler quand je veux ?"
  - "Comment fonctionne le générateur de campagnes ?"
- [ ] Réponses courtes et claires (2-4 phrases)
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-042: Footer

**Description:** As a visitor, I want a footer with legal links and contact info.

**Acceptance Criteria:**

- [ ] Logo VuVenu (version petite)
- [ ] Liens légaux : CGV, Politique de confidentialité, Mentions légales
- [ ] Email contact : contact@vuvenu.fr
- [ ] Copyright : "© 2026 VuVenu. Tous droits réservés."
- [ ] Responsive
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Pages Légales

#### US-043: Page CGV

**Description:** As a business, I need Terms of Service to be legally compliant.

**Acceptance Criteria:**

- [ ] Route /cgv accessible
- [ ] Contenu CGV adapté SaaS B2B français incluant :
  - Objet du service
  - Conditions d'inscription
  - Tarifs et modalités de paiement
  - Durée et résiliation
  - Responsabilités et garanties
  - Propriété intellectuelle (contenu généré)
  - Protection des données (renvoi vers politique confidentialité)
- [ ] Date de dernière mise à jour en haut
- [ ] npm run typecheck passes

#### US-044: Page Politique de Confidentialité

**Description:** As a business, I need a Privacy Policy for RGPD compliance.

**Acceptance Criteria:**

- [ ] Route /confidentialite accessible
- [ ] Conforme RGPD incluant :
  - Identité du responsable de traitement
  - Données collectées et finalités
  - Durée de conservation
  - Droits des utilisateurs (accès, rectification, suppression, portabilité)
  - Politique cookies
  - Sous-traitants : Supabase (BDD), Stripe (paiement), Anthropic (IA), Google (IA), Vercel (hébergement)
- [ ] npm run typecheck passes

#### US-045: Page Mentions Légales

**Description:** As a business, I need legal mentions as required by French law.

**Acceptance Criteria:**

- [ ] Route /mentions-legales accessible
- [ ] Informations requises :
  - Éditeur : [Nom, Adresse, SIRET de Bourbon Media]
  - Directeur de la publication : Siméon
  - Hébergeur : Vercel Inc., adresse USA
  - Contact : contact@vuvenu.fr
- [ ] npm run typecheck passes

---

## Functional Requirements

### Authentification

- FR-1: Le système doit permettre l'inscription par email + mot de passe
- FR-2: Le système doit envoyer un email de vérification après inscription (Supabase Auth)
- FR-3: Le système doit permettre la connexion avec email + mot de passe
- FR-4: Le système doit permettre la réinitialisation de mot de passe par email
- FR-5: Le système doit maintenir une session persistante (refresh token)
- FR-6: Le système doit protéger les routes /dashboard/\* aux utilisateurs connectés uniquement

### Onboarding

- FR-7: Le système doit collecter 4 informations : nom commerce, type activité, cible client, objectif principal
- FR-8: Le système doit créer un profil dans la table `profiles` lié à l'utilisateur
- FR-9: Le système doit marquer onboarding_completed = true après complétion

### Générateur Scripts

- FR-10: Le système doit accepter : description (obligatoire), format (30s/60s), ton (3 options)
- FR-11: Le système doit vérifier la limite mensuelle avant génération
- FR-12: Le système doit appeler l'API Anthropic Claude 3.5 Sonnet avec prompt structuré
- FR-13: Le système doit formater le script en 3 sections : Accroche, Corps, CTA
- FR-14: Le système doit incrémenter scripts_count_month après génération réussie
- FR-15: Le système doit permettre copier, régénérer, sauvegarder le script
- FR-16: Le système doit stocker les scripts dans la table `scripts`

### Meta Ads Generator

- FR-17: Le système doit vérifier que l'utilisateur a un plan Pro ou Business
- FR-18: Le système doit vérifier la limite mensuelle de campagnes
- FR-19: Le système doit collecter : produit (obligatoire), type business, budget, CPA, objectif
- FR-20: Le système doit générer 3 concepts (TOF/MOF/BOF) via API Anthropic
- FR-21: Le système doit générer 1 image par concept via API Gemini (1080x1080)
- FR-22: Le système doit stocker les images dans Supabase Storage
- FR-23: Le système doit incrémenter campaigns_count_month après génération réussie
- FR-24: Le système doit permettre téléchargement images (individuel et zip)

### Wizard Lancement

- FR-25: Le système doit afficher 7 étapes séquentielles avec progression visuelle
- FR-26: Le système doit bloquer le passage à l'étape suivante sans validation checkbox
- FR-27: Le système doit sauvegarder wizard_step à chaque progression
- FR-28: Le système doit mettre à jour le statut campagne : draft → launching → launched

### Billing

- FR-29: Le système doit proposer 3 plans avec les limites définies
- FR-30: Le système doit créer une session Stripe Checkout pour le paiement initial
- FR-31: Le système doit traiter les webhooks Stripe pour synchroniser l'abonnement
- FR-32: Le système doit rediriger vers Stripe Customer Portal pour gestion
- FR-33: Le système doit reset les compteurs le 1er de chaque mois

### Limites par Plan

| Plan     | Scripts/mois | Campagnes/mois | Prix |
| -------- | ------------ | -------------- | ---- |
| Starter  | 10           | 0              | 59€  |
| Pro      | 30           | 5              | 119€ |
| Business | Illimité     | Illimité       | 249€ |

---

## Non-Goals (Out of Scope MVP V1)

- ❌ Connexion directe à l'API Meta Ads (création automatique de campagnes) - V1.1
- ❌ Générateur de Carousels / Slideshows - V2
- ❌ Website Builder / Landing Page Generator - V3
- ❌ Marketplace Créateurs de contenu - V4
- ❌ Application mobile native (PWA suffit)
- ❌ Multi-langues (français uniquement)
- ❌ Multi-utilisateurs / équipes / rôles
- ❌ Templates de scripts pré-faits
- ❌ Éditeur WYSIWYG de scripts
- ❌ Analytics / suivi des performances des campagnes dans VuVenu
- ❌ Intégration calendrier de publication
- ❌ Export PDF des campagnes
- ❌ Mode hors-ligne
- ❌ API publique
- ❌ Authentification sociale (Google, Facebook login)

---

## Design Considerations

### Principes UX

- **Simplicité** : Maximum 3 clics pour accomplir une action principale
- **Guidage** : Toujours montrer la prochaine étape (jamais de cul-de-sac)
- **Mobile-first** : 60%+ des commerçants utilisent leur téléphone
- **Feedback immédiat** : Loaders, toasts, animations pour chaque action
- **Accessibilité** : Contrastes WCAG AA, cibles tactiles 44px minimum

### Design System

| Élément          | Choix                         |
| ---------------- | ----------------------------- |
| Framework UI     | shadcn/ui                     |
| Couleur primaire | Bleu #2563EB (confiance)      |
| Couleur accent   | Orange #F97316 (énergie, CTA) |
| Couleur succès   | Vert #22C55E                  |
| Couleur erreur   | Rouge #EF4444                 |
| Typographie      | Inter (Google Fonts)          |
| Icônes           | Lucide Icons                  |
| Coins            | Arrondis (radius-md: 6px)     |

### Responsive Breakpoints

- Mobile : < 640px (1 colonne)
- Tablet : 640-1024px (2 colonnes)
- Desktop : > 1024px (sidebar + contenu)

---

## Technical Considerations

### Stack Technique

| Couche      | Technologie                 | Justification                     |
| ----------- | --------------------------- | --------------------------------- |
| Framework   | Next.js 14 (App Router)     | Standard, SSR, Server Actions     |
| Langage     | TypeScript (strict)         | Sécurité types, maintenabilité    |
| Styling     | Tailwind CSS + shadcn/ui    | Rapide, composants accessibles    |
| Auth        | Supabase Auth               | Intégré, emails inclus            |
| Database    | Supabase PostgreSQL         | RLS, temps réel, gratuit au début |
| Storage     | Supabase Storage            | Images campagnes, intégré         |
| IA Texte    | Anthropic Claude 3.5 Sonnet | Meilleur rapport qualité/prix     |
| IA Images   | Google Gemini (Imagen 3)    | ~$0.02/image, bonne qualité       |
| Paiements   | Stripe                      | Standard, Customer Portal         |
| Déploiement | Vercel                      | Intégration Next.js parfaite      |
| Validation  | Zod                         | Schémas TypeScript-first          |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL (CDN + Edge)                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 APP                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │   API       │  │   Server    │         │
│  │  (RSC)      │  │  Routes     │  │  Actions    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    SUPABASE     │ │   EXTERNAL AI   │ │     STRIPE      │
│                 │ │                 │ │                 │
│ • Auth          │ │ • Anthropic     │ │ • Checkout      │
│ • PostgreSQL    │ │   (texte)       │ │ • Webhooks      │
│ • Storage       │ │ • Gemini        │ │ • Portal        │
│ • RLS           │ │   (images)      │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Schéma Base de Données

```sql
-- Extension auth.users gérée par Supabase

-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  target_audience TEXT,
  main_goal TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'active', 'past_due', 'canceled')),
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'pro', 'business')),
  scripts_count_month INTEGER DEFAULT 0,
  campaigns_count_month INTEGER DEFAULT 0,
  counts_reset_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scripts vidéos
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL, -- {description, format, tone, offer, price, deadline}
  content TEXT NOT NULL,
  format TEXT NOT NULL,
  tone TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campagnes Meta Ads
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL, -- {product, business_type, budget, cpa, objective, ...}
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'launching', 'launched')),
  wizard_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concepts publicitaires (3 par campagne)
CREATE TABLE campaign_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  funnel_stage TEXT NOT NULL CHECK (funnel_stage IN ('tof', 'mof', 'bof')),
  name TEXT NOT NULL,
  angle TEXT,
  ad_type TEXT,
  primary_text TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_concepts_campaign_id ON campaign_concepts(campaign_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_concepts ENABLE ROW LEVEL SECURITY;

-- Policies : users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own scripts" ON scripts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scripts" ON scripts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scripts" ON scripts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON campaigns FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own concepts" ON campaign_concepts FOR SELECT
  USING (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid()));
CREATE POLICY "Users can insert own concepts" ON campaign_concepts FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid()));
CREATE POLICY "Users can delete own concepts" ON campaign_concepts FOR DELETE
  USING (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid()));
```

### Variables d'Environnement

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Server-side only

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...

# App
NEXT_PUBLIC_APP_URL=https://vuvenu.fr
```

### Sécurité

- ✅ Row Level Security (RLS) sur toutes les tables
- ✅ Validation inputs avec Zod (server-side)
- ✅ Webhook Stripe sécurisé par signature
- ✅ Variables d'environnement pour secrets
- ✅ HTTPS obligatoire (Vercel)
- ✅ Rate limiting sur endpoints IA (à implémenter)
- ✅ Sanitization des outputs IA avant affichage

---

## Timeline & Milestones

### Planning 4 semaines (28 jours)

| Semaine | Focus               | Livrables                                     |
| ------- | ------------------- | --------------------------------------------- |
| **1**   | Foundations         | Auth, DB, Onboarding, Dashboard shell         |
| **2**   | Core Product        | Scripts Generator, Meta Ads Generator, Images |
| **3**   | Payment + Marketing | Stripe, Landing page, Pages légales           |
| **4**   | Polish + Launch     | Wizard, Tests, Beta, Corrections, LAUNCH      |

### Détail Semaine 1 - Foundations

| Jour | Tâches                                           | User Stories    |
| ---- | ------------------------------------------------ | --------------- |
| J1   | Setup projet (Next.js, Supabase, GitHub, Vercel) | -               |
| J2   | Auth complète (signup, login, verify, reset)     | US-001 à US-004 |
| J3   | Schema DB + migrations + RLS                     | -               |
| J4   | Onboarding flow (4 étapes)                       | US-005          |
| J5   | Dashboard + Sidebar                              | US-007, US-008  |
| J6   | Tests + corrections                              | -               |
| J7   | Buffer                                           | -               |

**Milestone S1** : User peut s'inscrire, se connecter, compléter onboarding, voir dashboard vide.

### Détail Semaine 2 - Core Product

| Jour | Tâches                                 | User Stories           |
| ---- | -------------------------------------- | ---------------------- |
| J8   | Formulaire génération script           | US-009                 |
| J9   | Intégration Claude API + affichage     | US-010, US-011         |
| J10  | Sauvegarde + liste scripts             | US-012, US-013, US-014 |
| J11  | Formulaire Meta Ads                    | US-015                 |
| J12  | Génération concepts (Claude)           | US-016                 |
| J13  | Génération images (Gemini) + affichage | US-017, US-018         |
| J14  | Sauvegarde + liste campagnes           | US-019, US-020         |

**Milestone S2** : User peut générer scripts et campagnes complètes avec images.

### Détail Semaine 3 - Payment + Marketing

| Jour | Tâches                                    | User Stories    |
| ---- | ----------------------------------------- | --------------- |
| J15  | Setup Stripe (produits, prix)             | -               |
| J16  | Checkout flow + activation                | US-032          |
| J17  | Webhooks + Customer Portal                | US-033, US-030  |
| J18  | Limites par plan                          | US-034, US-035  |
| J19  | Landing page (hero, bénéfices)            | US-036, US-037  |
| J20  | Landing (comment ça marche, pricing, FAQ) | US-038 à US-041 |
| J21  | Pages légales + footer                    | US-042 à US-045 |

**Milestone S3** : User peut payer, landing complète, légalement conforme.

### Détail Semaine 4 - Polish + Launch

| Jour | Tâches                            | User Stories    |
| ---- | --------------------------------- | --------------- |
| J22  | Wizard étapes 1-3                 | US-021 à US-023 |
| J23  | Wizard étapes 4-7                 | US-024 à US-028 |
| J24  | Page paramètres                   | US-029          |
| J25  | Tests end-to-end complets         | -               |
| J26  | Fix bugs critiques                | -               |
| J27  | Beta test (3-5 clients existants) | -               |
| J28  | Fix feedback + **LAUNCH** 🚀      | -               |

**Milestone S4** : MVP complet, testé, lancé avec premiers clients payants.

### Critère Go/No-Go Launch

✅ **GO** si :

- Auth fonctionne (inscription → connexion → reset)
- Scripts vidéos fonctionnent (génération → copie → sauvegarde)
- Meta Ads fonctionne (génération → images → téléchargement)
- Wizard fonctionne (7 étapes complétables)
- Paiement fonctionne (checkout → activation → limites)
- Landing accessible
- Pages légales présentes
- 0 bug critique (bloquant l'utilisation)

❌ **NO-GO** si :

- Bug critique non résolu
- Paiement ne fonctionne pas
- Données utilisateurs perdues/corrompues

---

## Success Metrics

### Métriques Business (12 mois)

| Métrique        | Objectif | Comment mesurer                                     |
| --------------- | -------- | --------------------------------------------------- |
| MRR             | 10 000€  | Stripe Dashboard                                    |
| Clients payants | 80-120   | COUNT profiles WHERE subscription_status = 'active' |
| Churn mensuel   | < 5%     | Annulations / clients actifs                        |
| CAC             | < 50€    | Dépenses marketing / nouveaux clients               |
| LTV             | > 500€   | Revenue moyen par client sur sa durée de vie        |

### Métriques Produit (MVP - 30 premiers jours)

| Métrique               | Objectif  | Comment mesurer                                     |
| ---------------------- | --------- | --------------------------------------------------- |
| Inscriptions           | 50+       | COUNT auth.users                                    |
| Conversions payantes   | 10+ (20%) | COUNT profiles WHERE subscription_status = 'active' |
| Scripts générés        | 200+      | COUNT scripts                                       |
| Campagnes générées     | 30+       | COUNT campaigns                                     |
| Taux complétion Wizard | > 70%     | Campagnes launched / campagnes created              |
| Time to first script   | < 5 min   | Temps signup → premier script généré                |

### Métriques Techniques

| Métrique                  | Objectif | Comment mesurer         |
| ------------------------- | -------- | ----------------------- |
| Temps génération script   | < 15 sec | Logs API                |
| Temps génération campagne | < 45 sec | Logs API                |
| Taux erreur API IA        | < 2%     | Erreurs / appels totaux |
| Uptime                    | > 99.5%  | Vercel Analytics        |

---

## Risks & Mitigations

| Risque                             | Probabilité | Impact | Mitigation                                                                          |
| ---------------------------------- | ----------- | ------ | ----------------------------------------------------------------------------------- |
| Dépassement délai 4 semaines       | Moyenne     | Élevé  | Scope MVP strict, couper features non-essentielles, option 5C (repousser 1 semaine) |
| Coûts API IA explosent             | Faible      | Moyen  | Rate limiting, monitoring quotidien, alertes seuils                                 |
| Gemini change pricing/API          | Faible      | Moyen  | Abstraction couche IA, fallback possible vers autre provider                        |
| Faible conversion trial→paid       | Moyenne     | Élevé  | Onboarding optimisé, support proactif, feedback utilisateurs                        |
| Problèmes Stripe webhooks          | Faible      | Élevé  | Tests intensifs, logs détaillés, monitoring                                         |
| Qualité prompts insuffisante       | Moyenne     | Moyen  | Itération rapide, feedback utilisateurs, A/B testing prompts                        |
| Concurrent lance produit similaire | Faible      | Moyen  | Focus niche locale (La Réunion d'abord), relation client                            |

---

## Open Questions

1. **Trial gratuit ?**
   - Option A : Pas de trial, paiement immédiat
   - Option B : Trial 7 jours avec 3 scripts gratuits
   - **Recommandation** : Option B pour réduire friction

2. **Support au lancement ?**
   - Email seul (contact@vuvenu.fr)
   - WhatsApp Business
   - Chat intégré (Crisp, Intercom)
   - **Recommandation** : Email + WhatsApp pour proximité

3. **Analytics utilisateur ?**
   - Vercel Analytics (basique, inclus)
   - PostHog (events custom, self-hosted possible)
   - Mixpanel (puissant mais payant)
   - **Recommandation** : Vercel Analytics pour MVP, PostHog en V1.1

4. **Nom de domaine final ?**
   - vuvenu.fr ✓ (réservé ?)
   - vuvenu.re (extension locale)
   - Alternative ?

5. **Rédaction légale ?**
   - Templates adaptés par Siméon
   - Avocat spécialisé
   - **Recommandation** : Templates pour MVP, avocat si scale

---

## Appendix

### A. Références Techniques

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Billing Documentation](https://stripe.com/docs/billing)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Google AI Studio](https://aistudio.google.com)
- [shadcn/ui Components](https://ui.shadcn.com)

### B. Skills VuVenu Natives (Claude Code)

Le MVP s'appuie sur **3 skills Claude Code natives** qui remplacent les workflows externes :

**1. VuVenu Script Generator v2.0**

- Fichier : `src/lib/skills/vuvenu-script-generator.md`
- Fonctionnalité : Génération scripts vidéos viraux avec données réelles (22 industries)
- Intégration : Mapping 237 niches → 22 groupes d'industries
- Performance : Hooks testés avec métriques documentées (millions de vues)

**2. VuVenu Meta Ads Generator v3.0**

- Fichier : `src/lib/skills/vuvenu-meta-ads-generator.md`
- Fonctionnalité : Campagnes Meta Ads complètes + **Wizard 7 étapes**
- Classification : 6 business types (DTC, Lead Gen, RBS, DTS, Event, Subscription)
- Différenciation clé : Accompagnement jusqu'au lancement réel dans Meta Ads Manager

**3. VuVenu Image Generator v3.0**

- Fichier : `src/lib/skills/vuvenu-image-generator.md`
- Fonctionnalité : Appel direct API Gemini Imagen (pas de prompts manuels)
- Output : 6 images finales (3 concepts × 2 variations) prêtes pour Meta Ads
- Automatisation : Workflow end-to-end intégré dans VuVenu

**Workflow Intégré** :

```
Script Generator → Meta Ads Generator → Image Generator → Wizard Lancement
```

Ces skills sont **natives Claude Code** et éliminent toute dépendance externe (n8n, workflows manuels).

### C. Roadmap Post-MVP

| Version | Contenu                                           | Timeline       |
| ------- | ------------------------------------------------- | -------------- |
| V1.1    | API Meta Ads (création auto campagnes) + Trial 7j | +4-6 semaines  |
| V2      | Carousel Generator                                | +2-3 semaines  |
| V3      | Website Builder (landing pages)                   | +6-8 semaines  |
| V4      | Campagnes Créateurs (marketplace)                 | +8-12 semaines |
| V5      | App mobile native                                 | +12 semaines   |

---

**Document créé le** : 13 janvier 2026
**Dernière mise à jour** : 13 janvier 2026
**Version** : 1.0
**Statut** : ✅ Validé
**Auteur** : Siméon (Bourbon Media) assisté par Claude
