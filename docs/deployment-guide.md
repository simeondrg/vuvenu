# Guide de Déploiement - VuVenu

> Configuration et déploiement en production de VuVenu SaaS

## Table des Matières

- [Prérequis](#prérequis)
- [Configuration Environnement](#configuration-environnement)
- [Base de Données](#base-de-données)
- [Services Externes](#services-externes)
- [Déploiement Vercel](#déploiement-vercel)
- [Configuration DNS](#configuration-dns)
- [Monitoring Production](#monitoring-production)
- [Sécurité](#sécurité)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prérequis

### Comptes & Services Requis

- [ ] **Vercel** : Compte Pro pour domaine custom
- [ ] **Supabase** : Projet avec plan Pro ($25/mois)
- [ ] **Anthropic** : API key Claude 3.5 Sonnet
- [ ] **Google AI** : API key pour Gemini (optionnel)
- [ ] **Stripe** : Compte Live pour paiements
- [ ] **Domaine** : DNS manageable (Cloudflare recommandé)

### Outils Locaux

```bash
# CLI Vercel
npm i -g vercel

# CLI Supabase
npm i -g supabase

# CLI Stripe
brew install stripe/stripe-cli/stripe  # macOS
```

---

## Configuration Environnement

### Variables Production

Créer `.env.production` :

```bash
# App
NEXT_PUBLIC_APP_URL=https://vuvenu.fr
NODE_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# APIs IA
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Prix (Live)
STRIPE_PRICE_STARTER_MONTHLY=price_live_starter
STRIPE_PRICE_PRO_MONTHLY=price_live_pro
STRIPE_PRICE_BUSINESS_MONTHLY=price_live_business

# Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DATADOG_API_KEY=... # Optionnel
SENTRY_DSN=... # Optionnel
```

### Validation Configuration

```bash
# Script de validation
#!/bin/bash
echo "🔍 Validation configuration production..."

# Vérifier variables critiques
required_vars=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "ANTHROPIC_API_KEY"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Variable manquante: $var"
    exit 1
  fi
done

echo "✅ Configuration valide"
```

---

## Base de Données

### 1. Migration Supabase

```sql
-- Production schema
-- Exécuter dans Supabase SQL Editor

-- Enable RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_concepts ENABLE ROW LEVEL SECURITY;

-- Policies de sécurité
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Scripts - lecture/écriture propre utilisateur
CREATE POLICY "Users can view own scripts"
ON scripts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create scripts"
ON scripts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Campagnes - lecture/écriture propre utilisateur
CREATE POLICY "Users can view own campaigns"
ON campaigns FOR SELECT
USING (auth.uid() = user_id);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_scripts_user_created
ON scripts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_created
ON campaigns(user_id, created_at DESC);

-- Fonctions pour reset mensuel des compteurs
CREATE OR REPLACE FUNCTION reset_monthly_counts()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET scripts_count_month = 0,
      campaigns_count_month = 0,
      counts_reset_at = NOW()
  WHERE counts_reset_at < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql;

-- Tâche cron pour reset automatique (1er de chaque mois)
SELECT cron.schedule(
  'monthly-reset',
  '0 0 1 * *',
  'SELECT reset_monthly_counts();'
);
```

### 2. Backup & Restauration

```bash
# Script backup quotidien
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR

# Backup via Supabase CLI
supabase db dump \
  --db-url "$SUPABASE_DB_URL" \
  --data-only \
  --file "$BACKUP_DIR/vuvenu_$DATE.sql"

# Upload vers S3/Cloud Storage
aws s3 cp "$BACKUP_DIR/vuvenu_$DATE.sql" \
  s3://vuvenu-backups/db/ \
  --storage-class STANDARD_IA

echo "✅ Backup terminé: vuvenu_$DATE.sql"
```

---

## Services Externes

### 1. Configuration Stripe

```bash
# Configuration produits Stripe Live
stripe products create \
  --name "VuVenu Starter" \
  --description "Plan de démarrage - 10 scripts/mois"

stripe prices create \
  --currency eur \
  --unit-amount 5900 \
  --recurring[interval]=month \
  --product prod_starter

# Webhook endpoint
stripe endpoints create \
  --url https://vuvenu.fr/api/webhooks/stripe \
  --enabled-events customer.subscription.created \
  --enabled-events customer.subscription.updated \
  --enabled-events customer.subscription.deleted \
  --enabled-events invoice.payment_succeeded \
  --enabled-events invoice.payment_failed
```

### 2. Monitoring Anthropic

```typescript
// lib/monitoring/anthropic-usage.ts
export async function checkAnthropicUsage() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/usage', {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      }
    })

    const usage = await response.json()

    // Alerter si proche de la limite
    if (usage.usage_percent > 80) {
      await sendSlackAlert({
        level: 'warning',
        message: `Usage Claude à ${usage.usage_percent}%`,
        details: `${usage.tokens_used}/${usage.token_limit} tokens utilisés`
      })
    }

    return usage
  } catch (error) {
    logger.error('Failed to check Anthropic usage', error)
  }
}
```

---

## Déploiement Vercel

### 1. Configuration Projet

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "functions": {
    "app/api/generate/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    },
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 10,
      "memory": 512
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://vuvenu.fr"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/app/(.*)",
      "destination": "/dashboard",
      "permanent": false
    }
  ]
}
```

### 2. Script de Déploiement

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Déploiement VuVenu production..."

# 1. Tests pré-déploiement
echo "🧪 Tests pré-déploiement..."
npm run test:critical
npm run typecheck
npm run lint

# 2. Build local pour vérification
echo "🏗️ Build de vérification..."
npm run build

# 3. Variables d'environnement
echo "🔐 Configuration environnement..."
vercel env rm NODE_ENV production --yes || true
vercel env add NODE_ENV production <<< "production"

# Ajouter toutes les variables depuis .env.production
while IFS= read -r line; do
  if [[ $line == *"="* ]] && [[ $line != "#"* ]]; then
    key=$(echo $line | cut -d'=' -f1)
    value=$(echo $line | cut -d'=' -f2-)
    echo "Adding $key..."
    vercel env rm "$key" production --yes || true
    vercel env add "$key" production <<< "$value"
  fi
done < .env.production

# 4. Déploiement
echo "🚀 Déploiement vers production..."
vercel --prod

# 5. Tests post-déploiement
echo "🔍 Tests post-déploiement..."
curl -f https://vuvenu.fr/api/health/status || {
  echo "❌ Health check failed"
  exit 1
}

echo "✅ Déploiement terminé avec succès !"
echo "🌍 Site disponible: https://vuvenu.fr"
```

---

## Configuration DNS

### Cloudflare (Recommandé)

```bash
# Configuration DNS via API Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "vuvenu.fr",
    "content": "cname.vercel-dns.com",
    "ttl": 1,
    "proxied": true
  }'

# Configuration SSL/TLS
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/ssl" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"value": "full"}'
```

### Vérifications DNS

```bash
# Vérifier propagation DNS
dig vuvenu.fr
dig www.vuvenu.fr

# Test SSL
curl -I https://vuvenu.fr

# Test redirections
curl -I http://vuvenu.fr  # Doit rediriger vers HTTPS
```

---

## Monitoring Production

### 1. Dashboard de Monitoring

```typescript
// pages/admin/monitoring.tsx
export default function MonitoringPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoring Production</h1>

      {/* Health Status */}
      <MonitoringDashboard />

      {/* Business Metrics */}
      <BusinessMetricsDashboard />

      {/* Performance */}
      <PerformanceDashboard />
    </div>
  )
}
```

### 2. Alertes Critiques

```typescript
// lib/monitoring/alerts.ts
export const ALERT_THRESHOLDS = {
  // Performance
  responseTime: 5000,      // 5s
  errorRate: 0.05,         // 5%

  // Business
  dailySignups: 0,         // Aucun signup en 24h
  conversionRate: 0.01,    // < 1%

  // Technique
  diskUsage: 0.85,         // 85% disk
  memoryUsage: 0.90,       // 90% RAM

  // APIs externes
  claudeLatency: 30000,    // 30s
  stripeFailure: 0.02      // 2% échec paiement
}

export async function checkCriticalAlerts() {
  const checks = await Promise.allSettled([
    checkResponseTime(),
    checkErrorRate(),
    checkBusinessMetrics(),
    checkResourceUsage(),
    checkExternalAPIs()
  ])

  const alerts = checks
    .filter(check => check.status === 'rejected')
    .map(check => check.reason)

  if (alerts.length > 0) {
    await sendCriticalAlert(alerts)
  }
}
```

### 3. Métriques Temps Réel

```typescript
// lib/monitoring/real-time.ts
export function setupRealTimeMonitoring() {
  // Collecter métriques toutes les minutes
  setInterval(async () => {
    const metrics = await gatherSystemMetrics()
    await sendToDatadog(metrics)
    await updateDashboard(metrics)
  }, 60000)

  // Health checks toutes les 30s
  setInterval(async () => {
    const health = await healthChecker.checkAll()

    if (health.overall !== 'healthy') {
      await notifyOperations(health)
    }
  }, 30000)
}
```

---

## Sécurité

### 1. Checklist Sécurité

```bash
# audit-security.sh
#!/bin/bash

echo "🔒 Audit sécurité VuVenu..."

# 1. Dépendances vulnérables
npm audit --audit-level moderate

# 2. Headers de sécurité
curl -I https://vuvenu.fr | grep -E "(Strict-Transport-Security|Content-Security-Policy|X-Frame-Options)"

# 3. Test endpoints sensibles
curl -f https://vuvenu.fr/api/admin && echo "⚠️ Endpoint admin accessible"
curl -f https://vuvenu.fr/.env && echo "⚠️ Fichier .env accessible"

# 4. Rate limiting
for i in {1..10}; do
  curl -w "%{http_code}\n" -s -o /dev/null https://vuvenu.fr/api/generate/script
done

echo "✅ Audit sécurité terminé"
```

### 2. Configuration WAF

```javascript
// Cloudflare WAF Rules
const wafRules = [
  {
    expression: '(http.request.method eq "POST" and http.request.uri.path contains "/api/generate" and rate(1m) > 10)',
    action: 'block',
    description: 'Rate limit génération'
  },
  {
    expression: 'http.request.headers["user-agent"] contains "bot" and not http.request.headers["user-agent"] contains "googlebot"',
    action: 'challenge',
    description: 'Challenge bots suspects'
  }
]
```

---

## Maintenance

### 1. Maintenance Programmée

```bash
# maintenance-mode.sh
#!/bin/bash

if [ "$1" == "enable" ]; then
  # Activer mode maintenance
  vercel env add MAINTENANCE_MODE production <<< "true"
  vercel --prod
  echo "🚧 Mode maintenance activé"

elif [ "$1" == "disable" ]; then
  # Désactiver mode maintenance
  vercel env rm MAINTENANCE_MODE production
  vercel --prod
  echo "✅ Mode maintenance désactivé"

else
  echo "Usage: ./maintenance-mode.sh [enable|disable]"
fi
```

### 2. Mise à Jour de Production

```bash
# update.sh
#!/bin/bash

echo "🔄 Mise à jour production VuVenu..."

# 1. Backup avant mise à jour
./backup.sh

# 2. Tests sur preview
vercel --preview
echo "Preview: $(vercel --preview --json | jq -r '.url')"
read -p "Tests OK sur preview ? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Mise à jour annulée"
  exit 1
fi

# 3. Mode maintenance
./maintenance-mode.sh enable

# 4. Déploiement
vercel --prod

# 5. Tests post-déploiement
sleep 10
curl -f https://vuvenu.fr/api/health/status || {
  echo "❌ Health check failed - Rollback"
  # Rollback automatique
  exit 1
}

# 6. Désactiver maintenance
./maintenance-mode.sh disable

echo "✅ Mise à jour terminée !"
```

---

## Troubleshooting

### Problèmes Courants

#### 1. Génération Scripts Lente/Timeout

**Symptômes** : Timeout 30s, erreur `ERR-CLAUDE-001`

**Diagnostic** :
```bash
# Vérifier latence Claude
curl -w "%{time_total}\n" -s -o /dev/null https://api.anthropic.com/v1/complete

# Vérifier logs
vercel logs --limit 50
```

**Solutions** :
- Augmenter timeout fonction Vercel
- Optimiser prompts (réduire tokens)
- Implémenter fallback provider
- Cache des réponses courantes

#### 2. Erreurs Base de Données

**Symptômes** : `ERR-DB-001`, timeouts connexion

**Diagnostic** :
```sql
-- Dans Supabase SQL Editor
SELECT
  query,
  state,
  wait_event,
  query_start
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;
```

**Solutions** :
- Optimiser requêtes lentes
- Ajouter index manquants
- Upgrader plan Supabase
- Implémenter connection pooling

#### 3. Paiements Stripe Échouent

**Diagnostic** :
```bash
# Vérifier webhook
stripe logs tail --filter-account acct_xxx

# Test webhook local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Solutions** :
- Vérifier signature webhook
- Synchroniser produits Live
- Logs détaillés paiements

#### 4. Monitoring Inaccessible

**Diagnostic** :
```bash
# Test direct endpoint
curl -v https://vuvenu.fr/api/health/status

# Vérifier functions Vercel
vercel logs --function=/api/health/status
```

#### 5. Performance Dégradée

**Diagnostic** :
```bash
# Core Web Vitals
lighthouse https://vuvenu.fr --chrome-flags="--headless" --output=json

# Bundle size
npm run analyze
```

### Contacts Urgence

- **Technique** : dev@vuvenu.fr
- **Stripe** : Support chat dashboard
- **Supabase** : Support plan Pro
- **Vercel** : Support dashboard
- **On-call** : +33 XXX XXX XXX

### Scripts de Diagnostic

```bash
# health-check.sh - Diagnostic complet
#!/bin/bash

echo "🩺 Diagnostic système VuVenu..."

# 1. Connectivité de base
curl -f https://vuvenu.fr || echo "❌ Site inaccessible"

# 2. API Health
curl -f https://vuvenu.fr/api/health/status || echo "❌ Health API down"

# 3. Base de données
timeout 10s psql $DATABASE_URL -c "SELECT 1;" || echo "❌ DB inaccessible"

# 4. APIs externes
curl -f https://api.anthropic.com/v1/me || echo "❌ Claude API down"
curl -f https://api.stripe.com/v1/account || echo "❌ Stripe API down"

# 5. Métriques performance
curl -w "@curl-format.txt" -s -o /dev/null https://vuvenu.fr

echo "✅ Diagnostic terminé"
```

---

## Contacts & Support

### Équipe VuVenu
- **CTO** : tech@vuvenu.fr
- **DevOps** : ops@vuvenu.fr
- **Support** : support@vuvenu.fr

### Partenaires
- **Vercel** : Support Pro dashboard
- **Supabase** : support@supabase.com
- **Stripe** : https://support.stripe.com

### Monitoring
- **Status Page** : https://status.vuvenu.fr
- **Incident** : PagerDuty integration
- **Métriques** : https://monitoring.vuvenu.fr

---

*Guide mis à jour le 14 janvier 2026*