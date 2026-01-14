-- =============================================
-- VuVenu MVP - Migration 002
-- Ajout du champ billing_period pour les abonnements annuels
-- Date: 2026-01-14
-- =============================================

-- Ajouter la colonne billing_period à la table profiles
ALTER TABLE profiles
ADD COLUMN billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly'));

-- Ajouter un commentaire pour documentation
COMMENT ON COLUMN profiles.billing_period IS 'Période de facturation: monthly (mensuel) ou yearly (annuel avec -17%)';

-- Créer un index pour les requêtes filtrées par période
CREATE INDEX idx_profiles_billing_period ON profiles(billing_period) WHERE billing_period IS NOT NULL;

-- Mettre à jour la vue user_dashboard pour inclure billing_period
DROP VIEW IF EXISTS user_dashboard;

CREATE VIEW user_dashboard AS
SELECT
  p.id,
  p.business_name,
  p.subscription_tier,
  p.subscription_status,
  p.billing_period,
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
-- NOTES DE MIGRATION
-- =============================================
-- 1. La colonne billing_period est NULL par défaut (backward-compatible)
-- 2. Les abonnements existants resteront NULL jusqu'au prochain webhook Stripe
-- 3. Les nouveaux abonnements seront 'monthly' ou 'yearly' selon le choix
-- 4. La contrainte CHECK garantit seulement 'monthly' ou 'yearly' (ou NULL)
-- =============================================
