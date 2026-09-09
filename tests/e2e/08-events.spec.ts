// Flujo 8: sesiones en directo — reservar plaza, persistencia y cancelación.
import { test, expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/member.json' })

test('reservar y cancelar plaza en una sesión en directo', async ({ page }) => {
  // Página propia de nuevo desde el 10/09 (Actualidad quedó solo para noticias)
  await page.goto('/app/events')
  await expect(page.getByRole('heading', { name: 'Sesiones en directo' })).toBeVisible()

  await page.getByRole('button', { name: 'Reservar plaza' }).first().click()
  await expect(page.getByText('✓ Plaza reservada').first()).toBeVisible({ timeout: 10000 })
  // El ✓ es optimista: esperar a que la server action termine (botón habilitado)
  // antes de recargar, o la recarga puede leer la BD antes del insert.
  await expect(page.getByRole('button', { name: 'Cancelar mi plaza' }).first()).toBeEnabled({
    timeout: 10000,
  })

  // La reserva sobrevive a una recarga (persistida en BD)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Cancelar mi plaza' }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Cancelar mi plaza' }).first().click()
  await expect(page.getByRole('button', { name: 'Reservar plaza' }).first()).toBeVisible({
    timeout: 10000,
  })
})
