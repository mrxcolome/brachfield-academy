// Flujo 8: sesiones en directo (en Actualidad) — reservar plaza, persistencia y cancelación.
import { test, expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/member.json' })

test('reservar y cancelar plaza en una sesión en directo', async ({ page }) => {
  // /app/events redirige a Actualidad (rediseño 2026-09-09)
  await page.goto('/app/events')
  await expect(page).toHaveURL(/\/app\/updates/)
  await expect(page.getByRole('heading', { name: 'Actualidad' })).toBeVisible()

  await page.getByRole('button', { name: 'Reservar plaza' }).first().click()
  await expect(page.getByText('✓ Plaza reservada').first()).toBeVisible({ timeout: 10000 })

  // La reserva sobrevive a una recarga (persistida en BD)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Cancelar mi plaza' }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Cancelar mi plaza' }).first().click()
  await expect(page.getByRole('button', { name: 'Reservar plaza' }).first()).toBeVisible({
    timeout: 10000,
  })
})
