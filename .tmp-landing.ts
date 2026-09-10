import { chromium } from '@playwright/test'
const out = process.env.OUT ?? '/tmp'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const desk = await browser.newPage({ viewport: { width: 1360, height: 900 } })
await desk.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await desk.waitForTimeout(1500)
await desk.screenshot({ path: `${out}/landing-desktop.png`, fullPage: true })
const mob = await browser.newPage({ viewport: { width: 400, height: 850 } })
await mob.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await mob.waitForTimeout(1500)
await mob.screenshot({ path: `${out}/landing-mobile.png`, fullPage: true })
await browser.close()
console.log('OK')
