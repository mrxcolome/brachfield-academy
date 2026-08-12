// Flujo 7: herramientas — descarga autorizada con registro.
import { test, expect } from '@playwright/test'
import { withDb, MEMBER_EMAIL } from './utils/db'

test.use({ storageState: 'tests/e2e/.auth/member.json' })

test('descargar una plantilla registra la descarga', async ({ page }) => {
  await page.goto('/app/tools')
  await expect(page.getByRole('heading', { name: 'Herramientas' })).toBeVisible()

  // En dev el fichero se sirve vía Payload; en prod sería URL firmada de R2
  const requestPromise = page.waitForRequest(/\/api\/media\/file\/|r2\.cloudflarestorage\.com/, {
    timeout: 15000,
  })
  await page.getByRole('button', { name: 'Descargar' }).first().click()
  await requestPromise

  // La descarga queda en download_log
  const count = await withDb(async (c) => {
    const r = await c.query(
      `select count(*)::int as n from download_log
       where "userId" in (select id from "user" where email = $1)
       and "createdAt" > now() - interval '1 minute'`,
      [MEMBER_EMAIL],
    )
    return r.rows[0].n as number
  })
  expect(count).toBeGreaterThan(0)
})
