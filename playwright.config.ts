// E2E de los 9 flujos críticos (Fase 16, briefing §97).
// Local (sandbox): usa el Chromium preinstalado en /opt/pw-browsers.
// CI: `npx playwright install chromium` instala el navegador que toque.
import { defineConfig, devices } from '@playwright/test'
import fs from 'node:fs'
import 'dotenv/config'

const sandboxChromium = '/opt/pw-browsers/chromium'
const executablePath = fs.existsSync(sandboxChromium) ? sandboxChromium : undefined

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false, // los flujos comparten usuarios de prueba y BD local
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  reporter: process.env.CI ? [['list'], ['github']] : [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    { name: 'setup', testMatch: /global\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { ...process.env, AUTH_RATE_LIMIT_DISABLED: '1' },
  },
})
