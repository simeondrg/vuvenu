# API Reference - VuVenu

> Documentation complète des API endpoints de VuVenu SaaS

## Table des Matières

- [Authentication](#authentication)
- [Génération de Scripts](#génération-de-scripts)
- [Génération de Campagnes](#génération-de-campagnes)
- [Gestion Utilisateur](#gestion-utilisateur)
- [Monitoring & Health](#monitoring--health)
- [Webhook Stripe](#webhook-stripe)
- [Codes d'Erreur](#codes-derreur)
- [Rate Limiting](#rate-limiting)

---

## Authentication

Tous les endpoints API (sauf monitoring public) nécessitent une authentification via Supabase Auth.

### Headers requis
```http
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
```

### Récupération du token
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

---

## Génération de Scripts

### `POST /api/generate/script`

Génère un script vidéo optimisé pour les réseaux sociaux.

#### Request Body
```typescript
interface ScriptGenerationRequest {
  industry: string           // Secteur d'activité
  format: 'reels' | 'posts' | 'stories'  // Format de contenu
  tone: 'amical' | 'professionnel' | 'énergique' | 'créatif'
  topic?: string            // Sujet spécifique (optionnel)
  targetAudience?: string   // Public cible (optionnel)
  duration?: number         // Durée en secondes (15-60)
}
```

#### Exemple de requête
```json
{
  "industry": "restaurant",
  "format": "reels",
  "tone": "amical",
  "topic": "Nouveau menu automne",
  "targetAudience": "familles locales",
  "duration": 30
}
```

#### Response (200 OK)
```typescript
interface ScriptResponse {
  success: true
  script: {
    id: string
    content: string          // Script généré
    format: string
    tone: string
    tokensUsed: number      // Tokens Claude utilisés
    estimatedDuration: number
    hooks: string[]         // Accroches suggérées
    cta: string            // Call-to-action
    hashtags: string[]     // Hashtags recommandés
    createdAt: string
  }
  usage: {
    scriptsUsed: number    // Scripts utilisés ce mois
    scriptsLimit: number   // Limite du plan
    remaining: number      // Scripts restants
  }
}
```

#### Codes d'erreur spécifiques
- `401` : Non authentifié
- `403` : Limite de scripts atteinte (`ERR-LIMIT-001`)
- `400` : Données invalides (`ERR-VALID-001`)
- `502` : Service Claude indisponible (`ERR-CLAUDE-001`)

---

## Génération de Campagnes

### `POST /api/generate/campaign`

Génère une campagne publicitaire complète avec concepts et visuels.

#### Request Body
```typescript
interface CampaignRequest {
  industry: string
  objective: 'traffic' | 'conversions' | 'awareness'
  budget: {
    daily: number          // Budget quotidien en €
    duration: number       // Durée en jours
  }
  targetAudience: {
    age: [number, number]  // Tranche d'âge
    location: string       // Zone géographique
    interests: string[]    // Centres d'intérêt
  }
  creative?: {
    style: 'moderne' | 'vintage' | 'minimaliste'
    colors: string[]       // Palette couleurs
  }
}
```

#### Response (200 OK)
```typescript
interface CampaignResponse {
  success: true
  campaign: {
    id: string
    title: string
    concepts: Array<{
      id: string
      name: string
      funnel_stage: 'awareness' | 'consideration' | 'conversion'
      ad_type: 'image' | 'video' | 'carousel'
      primaryText: string
      headline: string
      description: string
      imagePrompt?: string   // Prompt pour génération image
      targeting: object      // Configuration ciblage
    }>
    budget: object
    estimatedReach: number
    estimatedCPM: number
    createdAt: string
  }
  usage: {
    campaignsUsed: number
    campaignsLimit: number
    remaining: number
  }
}
```

---

## Gestion Utilisateur

### `GET /api/user/profile`

Récupère le profil utilisateur complet.

#### Response
```typescript
interface UserProfile {
  id: string
  businessName: string
  businessType: string
  subscriptionTier: 'starter' | 'pro' | 'business'
  subscriptionStatus: 'active' | 'past_due' | 'canceled'
  usage: {
    scriptsCountMonth: number
    campaignsCountMonth: number
    countsResetAt: string
  }
  onboardingCompleted: boolean
  createdAt: string
}
```

### `PUT /api/user/profile`

Met à jour le profil utilisateur.

#### Request Body
```json
{
  "businessName": "Mon Nouveau Commerce",
  "businessType": "salon_beaute",
  "targetAudience": "femmes 25-45 ans"
}
```

---

## Monitoring & Health

### `GET /api/health/status`

Endpoint de monitoring complet du système (public).

#### Response
```typescript
interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down'
  timestamp: string
  version: string
  services: {
    database: ServiceHealth
    claude: ServiceHealth
    gemini: ServiceHealth
    stripe: ServiceHealth
    storage: ServiceHealth
    system: ServiceHealth
  }
  alerts: Alert[]
  metrics: {
    responseTime: number
    uptime: number
    memoryUsage: object
  }
}

interface ServiceHealth {
  health: {
    status: 'healthy' | 'degraded' | 'down'
    responseTime: number
    lastCheck: string
    error?: string
  }
  circuit?: {
    state: 'CLOSED' | 'HALF_OPEN' | 'OPEN'
    failures: number
  }
  critical: boolean
}
```

### `GET /api/health/circuit-status`

État spécifique des circuit breakers.

---

## Webhook Stripe

### `POST /api/webhooks/stripe`

Webhook pour événements Stripe (signatures vérifiées).

#### Événements traités
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## Codes d'Erreur

### Format de réponse d'erreur
```typescript
interface ErrorResponse {
  success: false
  error: string           // Message utilisateur (français)
  code: string           // Code technique
  title: string          // Titre user-friendly
  action?: string        // Action recommandée
  helpUrl?: string       // Lien d'aide
  technical?: string     // Info technique (logs)
}
```

### Codes principaux

| Code | Description | Action |
|------|-------------|--------|
| `ERR-AUTH-001` | Non authentifié | Reconnexion requise |
| `ERR-AUTH-002` | Session expirée | Rafraîchir la session |
| `ERR-LIMIT-001` | Limite scripts atteinte | Upgrade plan |
| `ERR-LIMIT-002` | Limite campagnes atteinte | Upgrade plan |
| `ERR-LIMIT-003` | Rate limit dépassé | Attendre 30s |
| `ERR-VALID-001` | Données invalides | Corriger formulaire |
| `ERR-VALID-002` | Texte trop long | Réduire texte |
| `ERR-VALID-003` | Contenu dangereux | Modifier contenu |
| `ERR-CLAUDE-001` | Timeout Claude | Réessayer |
| `ERR-CLAUDE-002` | Rate limit Claude | Attendre |
| `ERR-GEMINI-001` | Timeout Gemini | Réessayer |
| `ERR-DB-001` | Erreur base données | Contacter support |
| `ERR-STRIPE-001` | Erreur paiement | Vérifier carte |

---

## Rate Limiting

### Limites par endpoint

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| `POST /api/generate/script` | 5 req | 1 minute |
| `POST /api/generate/campaign` | 2 req | 1 minute |
| `GET /api/user/profile` | 30 req | 1 minute |
| `PUT /api/user/profile` | 5 req | 1 minute |

### Headers de rate limiting
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995200
```

### Dépassement de limite
```json
{
  "success": false,
  "error": "Trop de demandes. Attendez 30 secondes avant de réessayer.",
  "code": "ERR-LIMIT-003",
  "title": "Ralentissez un peu ! 🚦",
  "action": "Attendez 30 secondes puis réessayez",
  "retryAfter": 30
}
```

---

## SDK JavaScript (Optionnel)

### Installation
```bash
npm install @vuvenu/sdk
```

### Usage
```typescript
import VuVenuSDK from '@vuvenu/sdk'

const vuvenu = new VuVenuSDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://vuvenu.fr'
})

// Génération de script
const script = await vuvenu.scripts.generate({
  industry: 'restaurant',
  format: 'reels',
  tone: 'amical',
  topic: 'Menu automne'
})

// Génération de campagne
const campaign = await vuvenu.campaigns.generate({
  industry: 'restaurant',
  objective: 'traffic',
  budget: { daily: 20, duration: 7 }
})
```

---

## Exemples d'Intégration

### React Hook personnalisé
```typescript
import { useState } from 'react'

export function useScriptGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateScript = async (data: ScriptGenerationRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate/script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generateScript, loading, error }
}
```

### Gestion d'erreurs robuste
```typescript
async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall()
  } catch (error) {
    if (error.response?.status === 401) {
      // Rediriger vers login
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Afficher upgrade prompt
      showUpgradeModal()
    } else if (error.response?.status === 429) {
      // Afficher rate limit notice
      showRateLimitNotice()
    } else {
      // Erreur générique
      showErrorToast(error.message)
    }
    throw error
  }
}
```

---

## Support & Contact

- 📧 **API Support** : dev@vuvenu.fr
- 📱 **Discord** : [discord.gg/vuvenu](https://discord.gg/vuvenu)
- 📚 **Documentation** : [docs.vuvenu.fr](https://docs.vuvenu.fr)
- 🐛 **Issues** : [github.com/vuvenu/issues](https://github.com/vuvenu/issues)

---

*Dernière mise à jour : 14 janvier 2026*