-- =============================================
-- VuVenu MVP - Migration 003
-- Ajout du statut 'trialing' pour l'essai gratuit 14 jours
-- =============================================

-- Supprimer l'ancienne contrainte CHECK
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;

-- Ajouter la nouvelle contrainte avec 'trialing'
ALTER TABLE profiles
ADD CONSTRAINT profiles_subscription_status_check
CHECK (subscription_status IN ('none', 'active', 'trialing', 'past_due', 'canceled'));

-- Ajouter une colonne pour stocker la date de fin du trial (optionnel mais utile)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Commentaire explicatif
COMMENT ON COLUMN profiles.subscription_status IS 'Statut: none (pas d''abo), trialing (essai 14j), active, past_due, canceled';
COMMENT ON COLUMN profiles.trial_ends_at IS 'Date de fin de la période d''essai gratuit';
