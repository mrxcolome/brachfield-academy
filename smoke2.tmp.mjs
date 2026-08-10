import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const S = process.env.SCRATCH
await page.goto('http://localhost:4173/#/app', { waitUntil: 'networkidle' })
await page.screenshot({ path: S + '/home-1440.png' })
await page.goto('http://localhost:4173/#/', { waitUntil: 'networkidle' })
await page.screenshot({ path: S + '/landing-1440.png' })
await browser.close()
console.log('capturas listas')
