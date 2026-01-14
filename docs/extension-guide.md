# Guide d'Extension - VuVenu

> Guide complet pour étendre et personnaliser la plateforme VuVenu

## Table des Matières

- [Architecture Overview](#architecture-overview)
- [Ajouter de Nouveaux Formats](#ajouter-de-nouveaux-formats)
- [Créer des Providers IA](#créer-des-providers-ia)
- [Système de Plugins](#système-de-plugins)
- [Hooks Personnalisés](#hooks-personnalisés)
- [Middleware Personnalisé](#middleware-personnalisé)
- [Thèmes & Styling](#thèmes--styling)
- [Configuration Avancée](#configuration-avancée)
- [Déploiement](#déploiement)

---

## Architecture Overview

VuVenu est construit avec une architecture modulaire permettant l'extension facile :

```
src/
├── app/                    # Next.js App Router
├── components/            # Composants réutilisables
├── lib/                  # Logique métier
│   ├── ai/              # Providers IA
│   ├── monitoring/      # Système monitoring
│   ├── security/        # Sécurité & auth
│   └── utils/           # Utilitaires
├── hooks/               # React hooks
├── types/              # Définitions TypeScript
└── plugins/            # Extensions (vos additions)
```

### Principes de Design

1. **Modulaire** : Chaque feature est isolée
2. **Type-Safe** : TypeScript strict
3. **Testable** : Hooks et utils testés
4. **Extensible** : Interfaces claires
5. **Performant** : Lazy loading, optimisations

---

## Ajouter de Nouveaux Formats

### 1. Définir le Type

```typescript
// types/content.ts
export type ContentFormat = 'reels' | 'posts' | 'stories' | 'podcast' // ← Nouveau

export interface FormatConfig {
  name: string
  duration: [number, number]  // [min, max] en secondes
  aspectRatio: string
  platform: string[]
  features: string[]
}
```

### 2. Configuration du Format

```typescript
// lib/content/formats.ts
export const CONTENT_FORMATS: Record<ContentFormat, FormatConfig> = {
  // ... formats existants
  podcast: {
    name: 'Podcast',
    duration: [180, 600],     // 3-10 minutes
    aspectRatio: '1:1',       // Audio, pas de ratio
    platform: ['spotify', 'apple', 'youtube'],
    features: ['narration', 'music', 'intro', 'outro']
  }
}
```

### 3. Prompt Spécialisé

```typescript
// lib/ai/prompts/podcast.ts
export function createPodcastPrompt(data: ScriptGenerationRequest): string {
  return `
Tu es un expert en création de contenu podcast pour ${data.industry}.

CONTEXTE:
- Format: Podcast (audio uniquement)
- Durée: ${data.duration || '300'} secondes
- Ton: ${data.tone}
- Sujet: ${data.topic || 'général'}

STRUCTURE REQUISE:
1. INTRO (15s): Accroche + présentation
2. DÉVELOPPEMENT (70%): Contenu principal
3. CALL-TO-ACTION (10%): Incitation claire
4. OUTRO (15s): Signature + next steps

CONTRAINTES:
- Langage naturel pour audio
- Pauses marquées avec [PAUSE]
- Indications de ton avec [ENTHOUSIASTE], [CALME]
- Pas de références visuelles

Génère un script podcast engageant et professionnel.
`
}
```

### 4. Composant UI

```typescript
// components/scripts/format-selector.tsx
const formatIcons = {
  reels: VideoIcon,
  posts: ImageIcon,
  stories: CircleIcon,
  podcast: MicIcon  // ← Nouveau
}

const formatLabels = {
  reels: 'Reels/TikTok',
  posts: 'Posts Instagram',
  stories: 'Stories',
  podcast: 'Podcast'  // ← Nouveau
}
```

### 5. Logic de Génération

```typescript
// lib/ai/generators/script-generator.ts
export async function generateScript(data: ScriptGenerationRequest): Promise<ScriptResponse> {
  const promptGenerator = getPromptGenerator(data.format)

  // Prompts spécialisés par format
  const prompts = {
    reels: createReelsPrompt,
    posts: createPostsPrompt,
    stories: createStoriesPrompt,
    podcast: createPodcastPrompt  // ← Nouveau
  }

  const prompt = prompts[data.format](data)
  return await callAI(prompt)
}
```

---

## Créer des Providers IA

### 1. Interface Provider

```typescript
// lib/ai/types.ts
export interface AIProvider {
  name: string
  models: string[]
  capabilities: ('text' | 'image' | 'audio')[]
  pricing: {
    inputTokens: number   // Prix pour 1k tokens input
    outputTokens: number  // Prix pour 1k tokens output
  }
  generate(prompt: string, options?: GenerationOptions): Promise<AIResponse>
  estimateCost(prompt: string): Promise<number>
}

export interface GenerationOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}
```

### 2. Implémentation Provider

```typescript
// lib/ai/providers/mistral-provider.ts
import { AIProvider, GenerationOptions, AIResponse } from '../types'

export class MistralProvider implements AIProvider {
  name = 'mistral'
  models = ['mistral-7b', 'mistral-8x7b', 'mistral-large']
  capabilities = ['text'] as const
  pricing = {
    inputTokens: 0.25,    // €0.25 pour 1k tokens
    outputTokens: 0.25
  }

  constructor(private apiKey: string) {}

  async generate(prompt: string, options: GenerationOptions = {}): Promise<AIResponse> {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'mistral-7b',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000
      })
    })

    const data = await response.json()

    return {
      content: data.choices[0].message.content,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      },
      model: data.model,
      provider: this.name
    }
  }

  async estimateCost(prompt: string): Promise<number> {
    const estimatedTokens = prompt.length / 4 // Approximation
    return estimatedTokens * this.pricing.inputTokens / 1000
  }
}
```

### 3. Enregistrement Provider

```typescript
// lib/ai/registry.ts
import { AIProvider } from './types'
import { ClaudeProvider } from './providers/claude-provider'
import { GeminiProvider } from './providers/gemini-provider'
import { MistralProvider } from './providers/mistral-provider'

class AIRegistry {
  private providers = new Map<string, AIProvider>()

  register(provider: AIProvider) {
    this.providers.set(provider.name, provider)
  }

  get(name: string): AIProvider | undefined {
    return this.providers.get(name)
  }

  getAll(): AIProvider[] {
    return Array.from(this.providers.values())
  }

  getBestForTask(task: 'text' | 'image' | 'audio'): AIProvider {
    return this.getAll()
      .filter(p => p.capabilities.includes(task))
      .sort((a, b) => a.pricing.outputTokens - b.pricing.outputTokens)[0]
  }
}

export const aiRegistry = new AIRegistry()

// Configuration des providers
if (process.env.ANTHROPIC_API_KEY) {
  aiRegistry.register(new ClaudeProvider(process.env.ANTHROPIC_API_KEY))
}

if (process.env.GOOGLE_AI_API_KEY) {
  aiRegistry.register(new GeminiProvider(process.env.GOOGLE_AI_API_KEY))
}

if (process.env.MISTRAL_API_KEY) {
  aiRegistry.register(new MistralProvider(process.env.MISTRAL_API_KEY))
}
```

### 4. Usage Intelligent

```typescript
// lib/ai/smart-generator.ts
export async function smartGenerate(
  prompt: string,
  task: 'text' | 'image' | 'audio',
  budget?: number
): Promise<AIResponse> {
  const providers = aiRegistry.getAll()
    .filter(p => p.capabilities.includes(task))

  if (budget) {
    // Filtrer par budget
    const affordableProviders = await Promise.all(
      providers.map(async (p) => ({
        provider: p,
        cost: await p.estimateCost(prompt)
      }))
    ).then(results =>
      results.filter(r => r.cost <= budget)
        .map(r => r.provider)
    )

    if (affordableProviders.length === 0) {
      throw new Error(`Budget insuffisant. Minimum requis: €${Math.min(...await Promise.all(providers.map(p => p.estimateCost(prompt))))}`)
    }

    providers = affordableProviders
  }

  // Choisir le meilleur provider (performance/prix)
  const bestProvider = providers[0] // Logic plus complexe possible

  return await bestProvider.generate(prompt)
}
```

---

## Système de Plugins

### 1. Interface Plugin

```typescript
// lib/plugins/types.ts
export interface VuVenuPlugin {
  name: string
  version: string
  description: string
  author: string

  // Lifecycle hooks
  install?(): Promise<void>
  uninstall?(): Promise<void>
  activate?(): Promise<void>
  deactivate?(): Promise<void>

  // Extension points
  routes?: PluginRoute[]
  components?: PluginComponent[]
  hooks?: PluginHook[]
  middleware?: PluginMiddleware[]
}

export interface PluginRoute {
  path: string
  handler: (req: Request) => Promise<Response>
}
```

### 2. Plugin Example

```typescript
// plugins/analytics/index.ts
export default {
  name: 'advanced-analytics',
  version: '1.0.0',
  description: 'Analyses avancées pour VuVenu',
  author: 'VuVenu Team',

  async install() {
    // Créer tables, configurations
    console.log('Installing analytics plugin...')
  },

  routes: [{
    path: '/api/analytics/dashboard',
    handler: async (req) => {
      const data = await getAnalyticsData()
      return new Response(JSON.stringify(data))
    }
  }],

  components: [{
    name: 'AnalyticsDashboard',
    component: lazy(() => import('./components/dashboard'))
  }],

  hooks: [{
    event: 'script.generated',
    handler: async (data) => {
      await trackScriptGeneration(data)
    }
  }]
} satisfies VuVenuPlugin
```

### 3. Plugin Manager

```typescript
// lib/plugins/manager.ts
class PluginManager {
  private plugins = new Map<string, VuVenuPlugin>()
  private active = new Set<string>()

  async install(plugin: VuVenuPlugin) {
    await plugin.install?.()
    this.plugins.set(plugin.name, plugin)
    console.log(`Plugin ${plugin.name} installed`)
  }

  async activate(name: string) {
    const plugin = this.plugins.get(name)
    if (!plugin) throw new Error(`Plugin ${name} not found`)

    await plugin.activate?.()
    this.active.add(name)

    // Enregistrer routes
    plugin.routes?.forEach(route => {
      router.register(route.path, route.handler)
    })

    // Enregistrer hooks
    plugin.hooks?.forEach(hook => {
      eventEmitter.on(hook.event, hook.handler)
    })
  }

  getActivePlugins(): VuVenuPlugin[] {
    return Array.from(this.active)
      .map(name => this.plugins.get(name)!)
  }
}
```

---

## Hooks Personnalisés

### 1. Hook de Génération Avancée

```typescript
// hooks/use-advanced-generation.ts
export function useAdvancedGeneration() {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>()

  useEffect(() => {
    setProviders(aiRegistry.getAll())
  }, [])

  const generateWithProvider = useCallback(async (
    prompt: string,
    providerName: string,
    options?: GenerationOptions
  ) => {
    const provider = aiRegistry.get(providerName)
    if (!provider) throw new Error(`Provider ${providerName} not available`)

    return await provider.generate(prompt, options)
  }, [])

  const estimateCosts = useCallback(async (prompt: string) => {
    const costs = await Promise.all(
      providers.map(async (p) => ({
        provider: p.name,
        cost: await p.estimateCost(prompt)
      }))
    )

    return costs.sort((a, b) => a.cost - b.cost)
  }, [providers])

  return {
    providers,
    selectedProvider,
    setSelectedProvider,
    generateWithProvider,
    estimateCosts
  }
}
```

### 2. Hook de Monitoring Business

```typescript
// hooks/use-business-metrics.ts
export function useBusinessMetrics(userId: string) {
  const [metrics, setMetrics] = useState<BusinessMetrics>()

  const trackEvent = useCallback((event: string, properties?: object) => {
    VuVenuMetrics.trackUserSatisfaction({
      userId,
      plan: 'pro', // À récupérer du context
      feature: event,
      ...properties
    })
  }, [userId])

  const trackGeneration = useCallback((data: ScriptGenerationMetrics) => {
    VuVenuMetrics.trackScriptGeneration({ ...data, userId })
  }, [userId])

  const getInsights = useCallback(async () => {
    // Analyser les métriques pour donner des insights
    const usage = await fetchUserUsage(userId)
    const recommendations = generateRecommendations(usage)

    return {
      usage,
      recommendations,
      nextActions: getNextActions(usage)
    }
  }, [userId])

  return {
    metrics,
    trackEvent,
    trackGeneration,
    getInsights
  }
}
```

---

## Middleware Personnalisé

### 1. Middleware de Cache Intelligent

```typescript
// lib/middleware/smart-cache.ts
export function createSmartCacheMiddleware(options: CacheOptions) {
  return async (request: NextRequest, next: () => Promise<Response>) => {
    const cacheKey = generateCacheKey(request)
    const cached = await getFromCache(cacheKey)

    if (cached && !isExpired(cached)) {
      return new Response(cached.data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }

    const response = await next()

    if (response.ok && isCacheable(request)) {
      await setCache(cacheKey, await response.clone().text(), options.ttl)
    }

    return response
  }
}
```

### 2. Middleware A/B Testing

```typescript
// lib/middleware/ab-testing.ts
export function createABTestMiddleware(tests: ABTest[]) {
  return async (request: NextRequest, next: () => Promise<Response>) => {
    const userId = await getUserId(request)
    const assignments = await getABAssignments(userId, tests)

    // Injecter les assignments dans les headers
    const response = await next()

    assignments.forEach(assignment => {
      response.headers.set(`X-AB-${assignment.testName}`, assignment.variant)
    })

    return response
  }
}
```

---

## Thèmes & Styling

### 1. Système de Thèmes

```typescript
// lib/theming/types.ts
export interface Theme {
  name: string
  displayName: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  fonts: {
    sans: string
    serif: string
    mono: string
  }
  spacing: {
    unit: number
    scale: number[]
  }
}
```

### 2. Thème Personnalisé

```typescript
// themes/restaurant-theme.ts
export const restaurantTheme: Theme = {
  name: 'restaurant',
  displayName: 'Restaurant Premium',
  colors: {
    primary: '#D2691E',      // Orange terre cuite
    secondary: '#8B4513',    // Marron
    accent: '#FFD700',       // Or
    background: '#FFF8DC',   // Crème
    foreground: '#2F1B14'    // Marron foncé
  },
  fonts: {
    sans: 'Montserrat, sans-serif',
    serif: 'Playfair Display, serif',
    mono: 'JetBrains Mono, monospace'
  },
  spacing: {
    unit: 8,
    scale: [0, 4, 8, 16, 24, 32, 48, 64, 96, 128]
  }
}
```

### 3. Provider de Thème

```typescript
// components/theme-provider.tsx
const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>()

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    // Appliquer les variables CSS
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value)
    })
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

---

## Configuration Avancée

### 1. Configuration Multi-Environnement

```typescript
// config/index.ts
export interface VuVenuConfig {
  ai: {
    providers: string[]
    fallbackStrategy: 'round-robin' | 'cheapest' | 'fastest'
    retryAttempts: number
  }
  monitoring: {
    enabled: boolean
    sampleRate: number
    alertWebhook?: string
  }
  features: {
    [key: string]: boolean
  }
  limits: {
    [plan: string]: {
      scripts: number
      campaigns: number
      apiCalls: number
    }
  }
}

const configs: Record<string, VuVenuConfig> = {
  development: {
    ai: {
      providers: ['claude'],
      fallbackStrategy: 'round-robin',
      retryAttempts: 3
    },
    monitoring: {
      enabled: true,
      sampleRate: 1.0
    },
    features: {
      newFormatPreview: true,
      advancedAnalytics: true
    },
    limits: {
      starter: { scripts: 100, campaigns: 10, apiCalls: 1000 },
      pro: { scripts: 300, campaigns: 50, apiCalls: 5000 },
      business: { scripts: -1, campaigns: -1, apiCalls: -1 }
    }
  },

  production: {
    ai: {
      providers: ['claude', 'gemini'],
      fallbackStrategy: 'fastest',
      retryAttempts: 5
    },
    monitoring: {
      enabled: true,
      sampleRate: 0.1,
      alertWebhook: process.env.SLACK_WEBHOOK_URL
    },
    features: {
      newFormatPreview: false,
      advancedAnalytics: true
    },
    limits: {
      starter: { scripts: 10, campaigns: 0, apiCalls: 100 },
      pro: { scripts: 30, campaigns: 5, apiCalls: 500 },
      business: { scripts: -1, campaigns: -1, apiCalls: 2000 }
    }
  }
}

export const config = configs[process.env.NODE_ENV || 'development']
```

---

## Déploiement

### 1. Docker pour Développement

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Extensions personnalisées
COPY plugins/ ./plugins/
COPY themes/ ./themes/

# Installation
COPY package*.json ./
RUN npm ci

# Copier le code
COPY . .

# Variables d'environnement pour extensions
ENV ENABLE_PLUGINS=true
ENV THEME_DIRECTORY=/app/themes
ENV PLUGIN_DIRECTORY=/app/plugins

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### 2. Configuration Vercel

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "ENABLE_PLUGINS": "true",
    "CUSTOM_THEME": "restaurant"
  },
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024
    }
  },
  "regions": ["cdg1"]
}
```

### 3. Script de Déploiement

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Déploiement VuVenu avec extensions..."

# Build avec plugins
npm run build:with-plugins

# Tests des extensions
npm run test:plugins

# Validation configuration
npm run validate:config

# Déploiement
if [ "$NODE_ENV" = "production" ]; then
  vercel --prod
else
  vercel --preview
fi

echo "✅ Déploiement terminé !"
```

---

## Exemples Complets

### Plugin de Notification

```typescript
// plugins/notifications/index.ts
export default {
  name: 'notifications',
  version: '1.0.0',
  description: 'Système de notifications push',

  install: async () => {
    // Initialiser service worker
  },

  hooks: [{
    event: 'script.completed',
    handler: async ({ userId, scriptId }) => {
      await sendNotification(userId, {
        title: 'Script généré !',
        body: 'Votre nouveau script est prêt',
        action: `/scripts/${scriptId}`
      })
    }
  }]
} satisfies VuVenuPlugin
```

### Thème Secteur Spécialisé

```typescript
// themes/medical-theme.ts
export const medicalTheme: Theme = {
  name: 'medical',
  displayName: 'Santé & Bien-être',
  colors: {
    primary: '#2E86AB',      // Bleu médical
    secondary: '#A23B72',    // Magenta
    accent: '#F18F01',       // Orange
    background: '#F8F9FA',   // Gris très clair
    foreground: '#212529'    // Noir charbon
  },
  components: {
    // Composants spécialisés
    'medical-disclaimer': MedicalDisclaimer,
    'certification-badge': CertificationBadge
  }
}
```

---

## Support Développeur

### Ressources

- 🔧 **CLI VuVenu** : `npm install -g @vuvenu/cli`
- 📚 **Starters** : `vuvenu create-plugin <name>`
- 🧪 **Testing Utils** : `@vuvenu/test-utils`
- 📖 **TypeScript Definitions** : `@vuvenu/types`

### Communauté

- 💬 **Discord Dev** : [discord.gg/vuvenu-dev](https://discord.gg/vuvenu-dev)
- 🐙 **GitHub** : [github.com/vuvenu/extensions](https://github.com/vuvenu/extensions)
- 📋 **Roadmap** : [roadmap.vuvenu.fr](https://roadmap.vuvenu.fr)

---

*Guide mis à jour le 14 janvier 2026*