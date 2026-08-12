// Flujo 2: registro → verificación de email → login → paywall.
import { test, expect } from '@playwright/test'
import { withDb, E2E_PASSWORD } from './utils/db'

test('registro, verificación y primer login llevan al checkout', async ({ page }) => {
  const email = `e2e-signup-${Date.now()}@e2e.brachfieldacademy.test`

  await page.goto('/signup')
  await page.fill('input[name="name"]', 'Nueva Persona')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', E2E_PASSWORD)
  await page.click('button[type="submit"]')

  // La cuenta exige verificar el correo antes de entrar
  await page.waitForURL(/\/verify-email/, { timeout: 15000 })
  await expect(page.getByText('Confirma tu correo')).toBeVisible()

  // Verificación (el enlace llega por email; aquí se simula el clic)
  await withDb((c) => c.query(`update "user" set "emailVerified" = true where email = $1`, [email]))

  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', E2E_PASSWORD)
  await page.click('button[type="submit"]')

  // Sin suscripción: el guard le envía al checkout, no al área privada
  await page.waitForURL(/\/(checkout|app)/, { timeout: 15000 })
  await expect(page).toHaveURL(/\/checkout/)
})
