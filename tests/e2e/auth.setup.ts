import { test as setup, expect, Page } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Créer un utilisateur de test et se connecter
  await page.goto('/login')

  // Simuler une connexion avec un utilisateur de test
  await page.fill('[data-testid="email"]', 'test@vuvenu.fr')
  await page.fill('[data-testid="password"]', 'password123')
  await page.click('[data-testid="login-submit"]')

  // Attendre la redirection vers le dashboard
  await page.waitForURL('/dashboard')
  await expect(page.getByText('Bonjour')).toBeVisible()

  // Sauvegarder l'état d'authentification
  await page.context().storageState({ path: authFile })
})