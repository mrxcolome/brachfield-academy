import { chromium } from 'playwright-core'

const routes = [
  '/', '/precio', '/catalogo', '/curso-publico', '/login', '/registro', '/checkout', '/onboarding',
  '/app', '/app/explorar', '/app/buscar', '/app/categoria', '/app/curso', '/app/leccion', '/app/audio',
  '/app/documento', '/app/biblioteca', '/app/herramientas', '/app/itinerario', '/app/mi-formacion',
  '/app/favoritos', '/app/actualidad', '/app/eventos', '/app/evento', '/app/pregunta-a-pere',
  '/app/caso-practico', '/app/perfil', '/app/suscripcion', '/app/confirmacion',
]

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  const t = m.text()
  // ruido ambiental del sandbox: proxy TLS de fonts.googleapis.com
  if (m.type() === 'error' && !/ERR_CERT_AUTHORITY_INVALID|fonts\.g/i.test(t)) errors.push(t)
})

for (const r of routes) {
  await page.goto(`http://localhost:4173/#${r}`, { waitUntil: 'networkidle' })
  const text = (await page.textContent('body'))?.trim() ?? ''
  if (text.length < 40) errors.push(`${r}: página casi vacía (${text.length} chars)`)
}

// móvil: comprobar bottom nav
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://localhost:4173/#/app', { waitUntil: 'networkidle' })
const navVisible = await page.isVisible('.mobile-nav')
if (!navVisible) errors.push('mobile: bottom nav no visible a 390px')
const sidebarVisible = await page.isVisible('.app-sidebar')
if (sidebarVisible) errors.push('mobile: sidebar visible a 390px (debería ocultarse)')

await page.screenshot({ path: process.env.SCRATCH + '/home-desktop.png', fullPage: false })
await browser.close()

if (errors.length) { console.log('ERRORES:\n' + errors.join('\n')); process.exit(1) }
console.log(`OK — ${routes.length} rutas sin errores de consola; responsive móvil correcto`)
