import { test, expect, Page, Route } from '@playwright/test'

test.describe('Génération de scripts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('doit permettre de créer un script complet', async ({ page }) => {
    // Naviguer vers la création de script
    await page.click('[data-tour="create-script-btn"]')
    await expect(page).toHaveURL('/scripts/new')

    // Étape 1: Sélectionner l'industrie
    await page.click('[data-testid="industry-coiffure"]')
    await page.click('[data-testid="step-next"]')

    // Étape 2: Choisir le format et le ton
    await page.click('[data-testid="format-reels"]')
    await page.click('[data-testid="tone-amical"]')
    await page.click('[data-testid="step-next"]')

    // Étape 3: Générer le script
    await page.fill('[data-testid="custom-topic"]', 'Nouvelle coupe tendance')

    // Mock de l'appel API pour éviter les coûts
    await page.route('/api/generate/script', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          script: {
            id: 'test-script-123',
            title: 'Script de test',
            content: 'Voici un script de test généré automatiquement...',
            format: 'reels',
            tone: 'amical'
          }
        })
      })
    })

    await page.click('[data-testid="generate-script-btn"]')

    // Vérifier que le script a été généré
    await expect(page.getByText('Script généré avec succès')).toBeVisible()
    await expect(page.getByText('Voici un script de test')).toBeVisible()

    // Vérifier qu'on peut sauvegarder
    await page.click('[data-testid="save-script"]')
    await expect(page.getByText('Script sauvegardé')).toBeVisible()
  })

  test('doit afficher les limites du plan', async ({ page }) => {
    // Simuler un utilisateur qui a atteint ses limites
    await page.route('/api/generate/script', (route: Route) => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Limite de scripts atteinte'
        })
      })
    })

    await page.goto('/scripts/new')

    // Essayer de générer un script
    await page.click('[data-testid="industry-restaurant"]')
    await page.click('[data-testid="step-next"]')
    await page.click('[data-testid="format-tiktok"]')
    await page.click('[data-testid="tone-fun"]')
    await page.click('[data-testid="step-next"]')
    await page.click('[data-testid="generate-script-btn"]')

    // Vérifier le message de limite
    await expect(page.getByText('Limite de scripts atteinte')).toBeVisible()
    await expect(page.getByText('Passer au plan Pro')).toBeVisible()
  })

  test('doit valider les champs requis', async ({ page }) => {
    await page.goto('/scripts/new')

    // Essayer de passer à l'étape suivante sans sélectionner d'industrie
    await page.click('[data-testid="step-next"]')

    // Vérifier que l'erreur est affichée
    await expect(page.getByText('Veuillez sélectionner un secteur')).toBeVisible()

    // Sélectionner une industrie et vérifier qu'on peut continuer
    await page.click('[data-testid="industry-fitness"]')
    await page.click('[data-testid="step-next"]')

    // Vérifier qu'on est passé à l'étape suivante
    await expect(page.getByText('Format de vidéo')).toBeVisible()
  })
})

test.describe('Navigation dans les scripts', () => {
  test('doit afficher la liste des scripts', async ({ page }) => {
    // Mock de la liste des scripts
    await page.route('/api/scripts', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          scripts: [
            {
              id: '1',
              title: 'Script Restaurant #1',
              format: 'reels',
              created_at: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              title: 'Script Coiffure #1',
              format: 'tiktok',
              created_at: '2024-01-14T15:30:00Z'
            }
          ]
        })
      })
    })

    await page.goto('/scripts')

    // Vérifier que les scripts sont affichés
    await expect(page.getByText('Script Restaurant #1')).toBeVisible()
    await expect(page.getByText('Script Coiffure #1')).toBeVisible()

    // Vérifier les détails
    await expect(page.getByText('reels')).toBeVisible()
    await expect(page.getByText('tiktok')).toBeVisible()
  })

  test('doit permettre de voir un script individuel', async ({ page }) => {
    const scriptId = 'test-script-123'

    // Mock du script individuel
    await page.route(`/api/scripts/${scriptId}`, (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: scriptId,
          title: 'Mon super script',
          content: 'Contenu complet du script viral...',
          format: 'reels',
          tone: 'inspirant',
          created_at: '2024-01-15T10:00:00Z',
          input_data: {
            industry: 'fitness',
            topic: 'Motivation sportive'
          }
        })
      })
    })

    await page.goto(`/scripts/${scriptId}`)

    // Vérifier le contenu du script
    await expect(page.getByText('Mon super script')).toBeVisible()
    await expect(page.getByText('Contenu complet du script viral')).toBeVisible()
    await expect(page.getByText('fitness')).toBeVisible()
    await expect(page.getByText('inspirant')).toBeVisible()

    // Vérifier les actions disponibles
    await expect(page.getByRole('button', { name: 'Copier le script' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Télécharger PDF' })).toBeVisible()
  })
})