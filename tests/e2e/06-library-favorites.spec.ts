// Flujo 6: biblioteca con filtros → ficha → guardar favorito → página Favoritos.
import { test, expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/member.json' })

test('filtrar la biblioteca, guardar un favorito y verlo en Favoritos', async ({ page }) => {
  await page.goto('/app/library')
  await expect(page.getByText(/12 resultados/)).toBeVisible()

  // Filtro por formato
  await page.getByRole('link', { name: 'Checklist', exact: true }).click()
  await expect(page.getByText(/1 resultado/)).toBeVisible()

  // Ficha + guardar
  await page.getByRole('link', { name: /Checklist para prevenir impagos/ }).click()
  await page.waitForURL(/\/app\/contents\//)
  await page.getByRole('button', { name: 'Guardar' }).click()
  await expect(page.getByRole('button', { name: 'Quitar de guardados' })).toBeVisible()

  // Aparece en Favoritos
  await page.goto('/app/favorites')
  await expect(page.getByRole('link', { name: /Checklist para prevenir impagos/ })).toBeVisible()

  // Quitar favorito desde la ficha
  await page.getByRole('link', { name: /Checklist para prevenir impagos/ }).click()
  await page.getByRole('button', { name: 'Quitar de guardados' }).click()
  await expect(page.getByRole('button', { name: 'Guardar' })).toBeVisible()
})
