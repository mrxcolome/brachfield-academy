// Setup de los E2E: crea los usuarios de prueba, deja la BD en el estado
// que cada flujo espera y guarda las sesiones (storageState) de miembro y admin.
import { test as setup, expect } from '@playwright/test'
import {
  signUpViaApi,
  prepareE2eState,
  E2E_PASSWORD,
  MEMBER_EMAIL,
  FRESH_EMAIL,
  ADMIN_EMAIL,
} from './utils/db'

const BASE = 'http://localhost:3000'

setup('preparar usuarios y sesiones', async ({ page }) => {
  await signUpViaApi(BASE, 'Mila Miembro', MEMBER_EMAIL)
  await signUpViaApi(BASE, 'Fabián Fresco', FRESH_EMAIL)
  await signUpViaApi(BASE, 'Ada Admin', ADMIN_EMAIL)
  await prepareE2eState()

  // Sesión del miembro
  await page.goto('/login')
  await page.fill('input[type="email"]', MEMBER_EMAIL)
  await page.fill('input[type="password"]', E2E_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/app**')
  await expect(page.getByRole('heading', { name: /Hola/ })).toBeVisible()
  await page.context().storageState({ path: 'tests/e2e/.auth/member.json' })

  // Sesión del admin (contexto limpio)
  await page.context().clearCookies()
  await page.goto('/login')
  await page.fill('input[type="email"]', ADMIN_EMAIL)
  await page.fill('input[type="password"]', E2E_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/app**')
  await page.context().storageState({ path: 'tests/e2e/.auth/admin.json' })
})
