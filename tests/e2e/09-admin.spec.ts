// Flujo 9: administración — autorización por rol y cola de preguntas.
import { test, expect } from '@playwright/test'

test.describe('miembro sin rol', () => {
  test.use({ storageState: 'tests/e2e/.auth/member.json' })

  test('no puede entrar en /app/admin (el servidor le expulsa)', async ({ page }) => {
    await page.goto('/app/admin')
    await page.waitForURL(/\/app$/)
    await expect(page.getByRole('heading', { name: /Hola/ })).toBeVisible()
  })
})

test.describe('admin', () => {
  test.use({ storageState: 'tests/e2e/.auth/admin.json' })

  test('ve los KPIs del resumen', async ({ page }) => {
    await page.goto('/app/admin')
    await expect(page.getByText('Miembros activos')).toBeVisible()
    await expect(page.getByText('Preguntas pendientes')).toBeVisible()
  })

  test('responde una pregunta y queda resuelta', async ({ page }) => {
    await page.goto('/app/admin/questions')
    await expect(page.getByText(/intereses de demora sin pacto/)).toBeVisible()

    await page
      .getByPlaceholder(/Escribe la respuesta/)
      .first()
      .fill('Sí: la Ley 3/2004 los devenga automáticamente, sin necesidad de pacto expreso.')
    await page.getByRole('button', { name: 'Responder y notificar' }).first().click()

    // La pregunta sale de pendientes y aparece como respondida
    await expect(page.getByText('Respondida').first()).toBeVisible({ timeout: 10000 })
  })
})
