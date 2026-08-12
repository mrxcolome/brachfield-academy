// Flujo 5: buscador global — FTS sin acentos y navegación al resultado.
import { test, expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/member.json' })

test('buscar sin acentos encuentra y navega al contenido', async ({ page }) => {
  await page.goto('/app/search?q=prescripcion')
  await expect(page.getByText(/resultados? para/)).toBeVisible()
  await page.getByRole('link', { name: /plazos de prescripción/i }).click()
  await page.waitForURL(/\/app\/contents\//)
  await expect(page.getByRole('heading', { name: /prescripción/i })).toBeVisible()
})

test('una búsqueda sin resultados lo dice claramente', async ({ page }) => {
  await page.goto('/app/search?q=zxqv987inexistente')
  await expect(page.getByText(/Sin resultados/)).toBeVisible()
})
