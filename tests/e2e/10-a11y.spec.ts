// Revisión de accesibilidad automática (axe) sobre las páginas clave.
// No sustituye a una auditoría manual, pero corta los fallos objetivos:
// contraste, labels, roles, imágenes sin alt…
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function expectNoSeriousViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(
    serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
    'violaciones serias de accesibilidad',
  ).toEqual([])
}

test.describe('accesibilidad (anónimo)', () => {
  test('landing pública', async ({ page }) => {
    await page.goto('/')
    await expectNoSeriousViolations(page)
  })

  test('login', async ({ page }) => {
    await page.goto('/login')
    await expectNoSeriousViolations(page)
  })
})

test.describe('accesibilidad (miembro)', () => {
  test.use({ storageState: 'tests/e2e/.auth/member.json' })

  test('dashboard', async ({ page }) => {
    await page.goto('/app')
    await expectNoSeriousViolations(page)
  })

  test('biblioteca', async ({ page }) => {
    await page.goto('/app/library')
    await expectNoSeriousViolations(page)
  })
})
