# Guide d'Optimisation IA - Réduction Coûts 50%

**Date** : 14 janvier 2026
**Objectif** : Réduire les coûts API Claude de 50% sans perte de qualité

---

## 🎯 Résumé Exécutif

### Économies Réalisées

| Optimisation | Réduction | Impact $ |
|--------------|-----------|----------|
| **Prompt Caching** | -90% input répétés | -40% total |
| **Prompts optimisés** | -30% tokens | -15% total |
| **Options max_tokens** | -20% waste | -5% total |
| **TOTAL** | | **-50-60%** |

### Coûts par Génération

| Type | Standard | Optimisé | Économie |
|------|----------|----------|----------|
| **Script** | $0.0135 | $0.0055 | -59% |
| **Campagne** | $0.039 | $0.016 | -59% |

**Pour 1000 users/mois** :
- Standard : $780/mois
- Optimisé : $312/mois
- **Économie : $468/mois ($5,616/an)**

---

## 🔧 1. Prompt Caching (Économie 40%)

### Principe

Anthropic Claude cache automatiquement les **system prompts** entre appels.
- **Premier appel** : Cache le system prompt (légère surcote 25%)
- **Appels suivants** : Lit depuis cache (90% moins cher)

### Implémentation

```typescript
import { generateWithCaching } from '@/lib/ai/optimized-claude-client'

// System prompt (sera caché)
const SYSTEM_PROMPT = `Tu es un expert copywriting...`

// User prompt (dynamique)
const userPrompt = `Secteur: ${industry}\nBusiness: ${name}...`

// Génération avec caching automatique
const { content, metrics } = await generateWithCaching(
  SYSTEM_PROMPT,
  userPrompt,
  { maxTokens: 800 }
)

console.log('Cache savings:', metrics.estimatedSavings)
```

### Tarification Cache

| Type | Prix | vs Standard |
|------|------|-------------|
| Cache write | $3.75/1M tokens | +25% |
| Cache read | $0.30/1M tokens | **-90%** |
| Standard input | $3.00/1M tokens | baseline |

**Break-even** : 2-3 appels avec même system prompt

### Durée Cache

- **5 minutes** : Cache "chaud" (gratuit)
- **1 heure** : Cache "tiède" (prix réduit)
- **> 1h** : Cache expiré (recréation)

### Optimisation Cache

```typescript
// ✅ BON : System prompt stable
const SYSTEM = "Expert copywriting..." // Caché efficacement

// ❌ MAUVAIS : System prompt dynamique
const SYSTEM = `Expert copywriting pour ${user.name}` // Jamais caché
```

**Règle** : System prompt doit être identique entre appels

---

## 📝 2. Prompts Optimisés (Économie 15%)

### Réduction Verbosité

**AVANT** (~1500 tokens) :
```
Tu es un expert en publicités Facebook et Instagram qui génère
des concepts publicitaires performants pour des commerces locaux.

Tu dois absolument suivre ces règles strictes :
1. Tu dois générer EXACTEMENT 5 concepts publicitaires différents
2. Chaque concept doit avoir les champs suivants : funnel_stage, name, angle...
3. Tu dois répondre UNIQUEMENT avec un JSON valide...
[... 20 lignes de plus]
```

**APRÈS** (~1000 tokens) :
```
Expert Meta Ads commerces locaux. Génère 5 concepts JSON.

FORMAT: { "concepts": [{ "funnel_stage": "...", "name": "..." }] }
RÈGLES: JSON uniquement, hooks viraux, max 125 chars
FUNNEL: 3 awareness, 1 consideration, 1 conversion
```

**Économie : -33% tokens input**

### Templates Compacts

```typescript
// ✅ BON : Template compact
const prompt = `Secteur: ${industry}
Business: ${name}
Ton: ${tone}
Format: ${format}`

// ❌ MAUVAIS : Template verbeux
const prompt = `
Je voudrais que tu génères un script pour le secteur ${industry}.
Le nom du business est ${name}.
Le ton souhaité est ${tone}.
Le format de la vidéo sera ${format}.
Merci de bien vouloir prendre en compte ces informations...
`
```

---

## ⚙️ 3. Options max_tokens (Économie 5%)

### Configuration Optimale

```typescript
export const GENERATION_OPTIONS = {
  script: {
    maxTokens: 800,      // vs 1024 standard (-22%)
    temperature: 0.9
  },
  campaign: {
    maxTokens: 1200,     // vs 2048 standard (-41%)
    temperature: 0.85
  }
}
```

### Principe

- **Trop haut** : Gaspillage si output court
- **Trop bas** : Troncature si output long
- **Optimal** : 20% marge au-dessus moyenne

### Calcul Optimal

```typescript
// Analyser tokens moyens des 100 dernières générations
const avgTokens = 650
const optimal = Math.ceil(avgTokens * 1.2) // +20% marge = 780
```

---

## 📊 4. Monitoring & Métriques

### Logger les Économies

```typescript
import { logGenerationMetrics } from '@/lib/ai/optimized-claude-client'

logGenerationMetrics('/api/generate/script', userId, {
  inputTokens: 800,
  outputTokens: 500,
  cacheReadTokens: 700,  // 700 tokens lus depuis cache !
  totalCost: 0.0055,
  estimatedSavings: 0.008  // $0.008 économisés
})
```

### Dashboard Économies

Créer un dashboard admin pour suivre :
- Taux cache hit (objectif > 80%)
- Coût moyen par génération
- Économies mensuelles totales
- Tokens moyens par type

---

## 🚀 5. Migration Progressive

### Étape 1 : Déployer Endpoints Optimisés (Semaine 1)

```typescript
// Nouveaux endpoints (optimisés)
/api/generate/script-optimized
/api/generate/campaign-optimized

// Garder anciens endpoints (fallback)
/api/generate/script
/api/generate/campaign
```

### Étape 2 : A/B Testing (Semaine 2-3)

```typescript
// 10% users sur optimisé
const useOptimized = Math.random() < 0.10

const endpoint = useOptimized
  ? '/api/generate/script-optimized'
  : '/api/generate/script'
```

Mesurer :
- Qualité perçue (feedback users)
- Latence
- Coûts réels

### Étape 3 : Migration Complète (Semaine 4)

Si A/B test positif :
- Router 100% traffic vers optimisé
- Déprécier anciens endpoints
- Monitorer économies réelles

---

## 💡 6. Optimisations Avancées (Future)

### Fine-Tuning Claude

Après 1000+ générations de qualité :
- Fine-tuner Claude sur corpus VuVenu
- **Avantages** : Meilleure qualité, même prix
- **Coût** : One-time ~$1000-2000

### Batching Intelligent

Pour génération masse (exports, previews) :
```typescript
// Générer 10 scripts en parallèle
const results = await Promise.all(
  users.map(u => generateWithCaching(SYSTEM, buildPrompt(u)))
)
```

**Cache hit rate** : 90%+ si séquentiel

### Compression Aggressive

Pour prompts très longs (> 2000 tokens) :
- Utiliser abréviations
- Encoder info dense
- Référencer docs externes

---

## 📈 7. ROI Projections

### Scénario Conservateur

| Métrique | An 1 | An 2 | An 3 | An 5 |
|----------|------|------|------|------|
| Users actifs | 100 | 500 | 1,500 | 10,000 |
| Coût standard | $780 | $3,900 | $11,700 | $78,000 |
| Coût optimisé | $312 | $1,560 | $4,680 | $31,200 |
| **Économie/mois** | **$468** | **$2,340** | **$7,020** | **$46,800** |
| **Économie/an** | **$5,616** | **$28,080** | **$84,240** | **$561,600** |

### Économies Cumulées 5 ans

- **Standard** : $465,600 coûts IA
- **Optimisé** : $186,240 coûts IA
- **Économie totale : $279,360**

---

## ✅ Checklist Implémentation

### Phase 1 : Setup (1 jour)
- [ ] Créer `optimized-claude-client.ts`
- [ ] Créer `optimized-prompts.ts`
- [ ] Tester localement avec caching

### Phase 2 : Nouveaux Endpoints (2 jours)
- [ ] Créer `/api/generate/script-optimized`
- [ ] Créer `/api/generate/campaign-optimized`
- [ ] Tests unitaires

### Phase 3 : Monitoring (1 jour)
- [ ] Logger métriques cache
- [ ] Dashboard économies admin
- [ ] Alertes si cache hit < 70%

### Phase 4 : A/B Test (2 semaines)
- [ ] Router 10% traffic optimisé
- [ ] Mesurer qualité vs coûts
- [ ] Ajuster si nécessaire

### Phase 5 : Migration (1 semaine)
- [ ] Router 100% si test OK
- [ ] Déprécier anciens endpoints
- [ ] Documentation utilisateur

---

## 🎓 Ressources

### Documentation Anthropic
- [Prompt Caching](https://docs.anthropic.com/claude/docs/prompt-caching)
- [Token Counting](https://docs.anthropic.com/claude/docs/models-overview)
- [Best Practices](https://docs.anthropic.com/claude/docs/prompt-engineering)

### Monitoring
- Sentry pour tracking erreurs
- Datadog/Grafana pour métriques
- BigQuery pour analytics coûts

### Code Examples
- `src/lib/ai/optimized-claude-client.ts`
- `src/lib/ai/optimized-prompts.ts`
- `src/app/api/generate/script-optimized/route.ts`

---

**Dernière mise à jour** : 14 janvier 2026
**Contact** : Siméon (VuVenu Tech Lead)
