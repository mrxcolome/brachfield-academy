// Flujo 4: curso → lección → completar → progreso visible en el dashboard.
import { test, expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/member.json' })

test('completar una lección actualiza el progreso y el dashboard', async ({ page }) => {
  await page.goto('/app/courses/gestion-y-prevencion-de-impagados')
  await expect(page.getByRole('heading', { name: /Gestión y prevención/ })).toBeVisible()

  // Entrar en la primera lección
  await page
    .getByRole('link', { name: /empezar|continuar/i })
    .first()
    .click()
  await page.waitForURL(/\/app\/courses\/.+\/.+/)

  // Completar
  await page.getByRole('button', { name: /completada|completar/i }).click()
  await expect(page.getByText(/1 de \d+/)).toBeVisible({ timeout: 10000 })

  // El dashboard ofrece continuar donde lo dejó
  await page.goto('/app')
  await expect(page.getByText('Continúa donde lo dejaste')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Continuar' })).toBeVisible()

  // Mi formación refleja el curso en progreso
  await page.goto('/app/learning')
  await expect(page.getByText('En progreso')).toBeVisible()
})
