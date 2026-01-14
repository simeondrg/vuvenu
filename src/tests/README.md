# Tests VuVenu

Framework de tests pour l'application VuVenu avec Vitest, Testing Library et mocks complets.

## 🚀 Commandes de test

```bash
# Lancer tous les tests une fois
npm run test:run

# Lancer les tests en mode watch (développement)
npm run test

# Lancer les tests avec couverture
npm run test:coverage

# Interface graphique des tests
npm run test:ui
```

## 📁 Structure des tests

```
src/tests/
├── setup.ts           # Configuration globale des tests
├── README.md          # Documentation (ce fichier)
└── mocks/             # Mocks spécifiques (à créer si nécessaire)

src/
├── lib/
│   ├── utils.test.ts           # Tests des utilitaires
│   └── errors/index.test.ts    # Tests du système d'erreurs
└── components/
    └── ui/button.test.tsx      # Tests du composant Button
```

## 🛠️ Configuration

### Environnement de test
- **Framework**: Vitest (plus rapide que Jest, TypeScript natif)
- **Environnement**: jsdom (simulation navigateur)
- **Mocks**: Supabase, Next.js, APIs externes automatiquement mockées

### Variables d'environnement
Configurées automatiquement dans `setup.ts`:
- Supabase local (port 54321)
- Clés API de test
- URL de l'app en local

## 📝 Écrire des tests

### Test unitaire simple

```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/lib/utils'

describe('Utils', () => {
  it('should format price correctly', () => {
    expect(formatPrice(59.99)).toBe('59,99\u00A0€')
  })
})
```

### Test de composant React

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('should handle clicks', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Test avec mocks Supabase

```typescript
import { mockAuthenticatedUser, mockUnauthenticatedUser } from '@/tests/setup'

describe('Auth Component', () => {
  it('should show user data when authenticated', () => {
    mockAuthenticatedUser()
    // Test avec utilisateur connecté
  })

  it('should redirect when not authenticated', () => {
    mockUnauthenticatedUser()
    // Test avec utilisateur non connecté
  })
})
```

## 🔧 Mocks disponibles

### Supabase
```typescript
// Utilisateur authentifié par défaut
mockAuthenticatedUser()

// Utilisateur non authentifié
mockUnauthenticatedUser()

// Erreur Supabase
mockSupabaseError('Error message')
```

### APIs externes
```typescript
// Réponse fetch
mockFetchResponse({ data: 'test' }, 200)

// APIs IA mockées automatiquement
```

### Next.js
```typescript
// Navigation mockée automatiquement
const mockPush = vi.fn()
vi.mocked(useRouter).mockReturnValue({ push: mockPush })
```

## ⚙️ Utilitaires de test

### Données de test
```typescript
import { mockUser, mockProfile } from '@/tests/setup'

// Utilisateur type pour les tests
console.log(mockUser.email) // "test@vuvenu.fr"
```

### Reset des mocks
```typescript
import { resetAllMocks } from '@/tests/setup'

beforeEach(() => {
  resetAllMocks() // Automatique, mais disponible manuellement
})
```

## 📊 Couverture de code

Objectifs de couverture configurés:
- **Branches**: 70%
- **Fonctions**: 70%
- **Lignes**: 70%
- **Statements**: 70%

Fichiers exclus de la couverture:
- Types TypeScript (`src/types/**`)
- Configuration (`**/*.config.*`)
- Tests eux-mêmes (`src/tests/**`)
- Build Next.js (`.next/**`)

## 🎯 Bonnes pratiques

### Nommage
```typescript
// ✅ Bon
describe('User Profile Component', () => {
  it('should display user name', () => {})
})

// ❌ Éviter
describe('UserProfile', () => {
  it('works', () => {})
})
```

### Structure AAA (Arrange, Act, Assert)
```typescript
it('should calculate total price', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }]

  // Act
  const total = calculateTotal(items)

  // Assert
  expect(total).toBe(30)
})
```

### Tests d'interaction
```typescript
it('should handle form submission', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)

  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

## 🚨 Erreurs courantes

### Espaces dans formatPrice
```typescript
// ❌ Erreur - espace normal
expect(formatPrice(59)).toBe('59 €')

// ✅ Correct - espace insécable
expect(formatPrice(59)).toBe('59\u00A0€')
```

### Événements clavier
```typescript
// ❌ Erreur - keyDown ne déclenche pas onClick
fireEvent.keyDown(button, { key: 'Enter' })

// ✅ Correct - focus + userEvent
button.focus()
await user.keyboard('{Enter}')
```

### Async/await
```typescript
// ❌ Erreur - oubli await
user.click(button)
expect(mockFn).toHaveBeenCalled()

// ✅ Correct
await user.click(button)
expect(mockFn).toHaveBeenCalled()
```

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [User Event](https://testing-library.com/docs/user-event/intro)
- [Mocking with Vitest](https://vitest.dev/guide/mocking.html)