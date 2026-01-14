-- =============================================
-- VuVenu MVP - Schéma Initial de Base de Données
-- Migration 001 - Création des tables et RLS
-- =============================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: profiles
-- Extension du système auth.users de Supabase
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  target_audience TEXT,
  main_goal TEXT,

  -- Intégration Stripe
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'active', 'past_due', 'canceled')),
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'pro', 'business')),

  -- Compteurs mensuels pour limites
  scripts_count_month INTEGER DEFAULT 0,
  campaigns_count_month INTEGER DEFAULT 0,
  counts_reset_at TIMESTAMPTZ DEFAULT NOW(),

  -- État de l'onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: scripts
-- Génération et stockage des scripts vidéos
-- =============================================
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Métadonnées du script
  title TEXT NOT NULL,
  input_data JSONB NOT NULL, -- Paramètres de génération (business_type, format, tone, etc.)
  content TEXT NOT NULL,     -- Le script généré

  -- Paramètres de génération
  format TEXT NOT NULL,      -- reel, tiktok, story
  tone TEXT NOT NULL,        -- professionnel, décontracté, énergique

  -- Statistiques
  tokens_used INTEGER,       -- Pour tracking coûts API

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: campaigns
-- Campagnes publicitaires Meta Ads
-- =============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Informations campagne
  title TEXT NOT NULL,
  input_data JSONB NOT NULL, -- Paramètres de génération (business_type, budget, objectifs, etc.)

  -- État et progression
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'launched', 'paused', 'completed')),
  wizard_step INTEGER DEFAULT 0, -- Pour le wizard de lancement (0-7)

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: campaign_concepts
-- Concepts publicitaires générés pour chaque campagne
-- Relation 1:N avec campaigns
-- =============================================
CREATE TABLE campaign_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Position dans l'entonnoir
  funnel_stage TEXT NOT NULL CHECK (funnel_stage IN ('top', 'middle', 'bottom')),

  -- Informations concept
  name TEXT NOT NULL,        -- "Découverte Produit", "Témoignages Clients"
  angle TEXT,                -- L'angle créatif unique
  ad_type TEXT,              -- video_ugc, image_static, etc.

  -- Textes publicitaires
  primary_text TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT,

  -- Image générée
  image_url TEXT,            -- URL stockage Supabase
  image_prompt TEXT,         -- Prompt utilisé pour génération

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIGGERS pour updated_at automatique
-- =============================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Application des triggers
CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_campaigns
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================
-- INDEXES pour performance
-- =============================================
CREATE INDEX idx_scripts_user_id_created ON scripts(user_id, created_at DESC);
CREATE INDEX idx_campaigns_user_id_created ON campaigns(user_id, created_at DESC);
CREATE INDEX idx_campaign_concepts_campaign_id ON campaign_concepts(campaign_id);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Sécurité critique : users ne voient que leurs données
-- =============================================

-- Activation RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_concepts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLITIQUES RLS : profiles
-- =============================================
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- =============================================
-- POLITIQUES RLS : scripts
-- =============================================
CREATE POLICY "Users can view own scripts"
ON scripts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scripts"
ON scripts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts"
ON scripts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
ON scripts FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- POLITIQUES RLS : campaigns
-- =============================================
CREATE POLICY "Users can view own campaigns"
ON campaigns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campaigns"
ON campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
ON campaigns FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
ON campaigns FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- POLITIQUES RLS : campaign_concepts
-- Accès indirect via campaigns (JOIN)
-- =============================================
CREATE POLICY "Users can view concepts of own campaigns"
ON campaign_concepts FOR SELECT
USING (
  campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create concepts for own campaigns"
ON campaign_concepts FOR INSERT
WITH CHECK (
  campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update concepts of own campaigns"
ON campaign_concepts FOR UPDATE
USING (
  campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete concepts of own campaigns"
ON campaign_concepts FOR DELETE
USING (
  campaign_id IN (
    SELECT id FROM campaigns WHERE user_id = auth.uid()
  )
);

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour réinitialiser les compteurs mensuels
CREATE OR REPLACE FUNCTION reset_monthly_counts()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    scripts_count_month = 0,
    campaigns_count_month = 0,
    counts_reset_at = NOW()
  WHERE counts_reset_at < NOW() - INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VUES UTILES pour l'application
-- =============================================

-- Vue pour le dashboard utilisateur
CREATE VIEW user_dashboard AS
SELECT
  p.id,
  p.business_name,
  p.subscription_tier,
  p.subscription_status,
  p.scripts_count_month,
  p.campaigns_count_month,

  -- Limites selon le tier
  CASE p.subscription_tier
    WHEN 'starter' THEN 10
    WHEN 'pro' THEN 30
    WHEN 'business' THEN 999999
    ELSE 0
  END as scripts_limit_month,

  CASE p.subscription_tier
    WHEN 'starter' THEN 0
    WHEN 'pro' THEN 5
    WHEN 'business' THEN 999999
    ELSE 0
  END as campaigns_limit_month,

  -- Statistiques d'usage
  (SELECT COUNT(*) FROM scripts WHERE user_id = p.id) as total_scripts,
  (SELECT COUNT(*) FROM campaigns WHERE user_id = p.id) as total_campaigns,

  p.created_at,
  p.onboarding_completed
FROM profiles p
WHERE p.id = auth.uid();

-- =============================================
-- COMMENTAIRES POUR DOCUMENTATION
-- =============================================
COMMENT ON TABLE profiles IS 'Extension du profil utilisateur avec données business et abonnement';
COMMENT ON TABLE scripts IS 'Scripts vidéos générés par IA pour réseaux sociaux';
COMMENT ON TABLE campaigns IS 'Campagnes publicitaires Meta Ads avec wizard de lancement';
COMMENT ON TABLE campaign_concepts IS 'Concepts créatifs générés pour chaque campagne (3 par campagne)';

COMMENT ON COLUMN profiles.subscription_tier IS 'starter (59€): 10 scripts, pro (119€): 30 scripts + 5 campagnes, business (249€): illimité';
COMMENT ON COLUMN profiles.counts_reset_at IS 'Date de dernière réinitialisation des compteurs mensuels';
COMMENT ON COLUMN scripts.input_data IS 'JSONB avec paramètres: business_type, format, tone, target_audience, etc.';
COMMENT ON COLUMN campaigns.wizard_step IS 'Étape du wizard: 0=draft, 1-7=étapes lancement, 8=completed';