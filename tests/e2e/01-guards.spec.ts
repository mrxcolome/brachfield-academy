// Flujo 1: los guards protegen el área privada (server-side, no solo UI).
import { test, expect } from '@playwright/test'

test.describe('guards de acceso', () => {
  test('sin sesión, /app redirige a login', async ({ page }) => {
    await page.goto('/app')
    await expect(page).toHaveURL(/\/login/)
  })

  test('sin sesión, /app/admin redirige a login', async ({ page }) => {
    await page.goto('/app/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('sin sesión, una lección de curso redirige a login', async ({ page }) => {
    await page.goto('/app/courses/gestion-y-prevencion-de-impagados')
    await expect(page).toHaveURL(/\/login/)
  })
})
