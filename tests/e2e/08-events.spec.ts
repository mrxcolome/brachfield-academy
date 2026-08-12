// Flujo 8: eventos — reservar plaza, persistencia y cancelación.
import { test, expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/member.json' })

test('reservar y cancelar plaza en un evento', async ({ page }) => {
  await page.goto('/app/events')
  await expect(page.getByRole('heading', { name: 'Eventos' })).toBeVisible()

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
