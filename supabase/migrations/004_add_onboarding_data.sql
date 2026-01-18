-- =============================================
-- VuVenu MVP - Migration 004
-- Ajout de la colonne onboarding_data JSONB
-- =============================================

-- Ajouter la colonne onboarding_data pour stocker les données étendues d'onboarding
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT NULL;

-- Commentaire explicatif
COMMENT ON COLUMN profiles.onboarding_data IS 'Données étendues d''onboarding: businessAge, location, marketingExperience, audienceAge, audienceBudget, contentTypes, postingFrequency, brandPersonality, firstScriptTopic, firstCampaignGoal, selectedNiche, completedAt';
