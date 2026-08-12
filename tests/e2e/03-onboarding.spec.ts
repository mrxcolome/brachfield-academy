// Flujo 3: onboarding completo (4 pasos) → dashboard personalizado.
import { test, expect } from '@playwright/test'
import { E2E_PASSWORD, FRESH_EMAIL, withDb } from './utils/db'

test('un miembro nuevo completa el onboarding y llega al dashboard', async ({ page }) => {
  // Estado PENDING garantizado aunque el spec se repita
  await withDb((c) =>
    c.query(`update "user" set "onboardingStatus"='PENDING' where email=$1`, [FRESH_EMAIL]),
  )

  await page.goto('/login')
  await page.fill('input[type="email"]', FRESH_EMAIL)
  await page.fill('input[type="password"]', E2E_PASSWORD)
  await page.click('button[type="submit"]')

  await page.waitForURL(/\/onboarding/, { timeout: 15000 })

  // Paso 1: bienvenida
  await page.getByRole('button', { name: 'Empezar' }).click()
  // Paso 2: perfil profesional
  await page.getByRole('button', { name: 'Administración / Cobros' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  // Paso 3: objetivos (multi)
  await page.getByRole('button', { name: 'Mejorar el recobro' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  // Paso 4: nivel
  await page.getByRole('button', { name: /Intermedio/ }).click()
  await page.getByRole('button', { name: 'Entrar en mi Academia' }).click()

  await page.waitForURL(/\/app$/, { timeout: 15000 })
  await expect(page.getByRole('heading', { name: /Hola/ })).toBeVisible()
  await expect(page.getByText('Recomendado para ti')).toBeVisible()
})
