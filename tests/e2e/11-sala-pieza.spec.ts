// Flujo 11: la Sala crea un Consejo en formato TEXTO (20/10/2026) — se elige el formato con un
// clic, solo aparece el campo de ese formato y la ficha del alumno NO enseña reproductor.
import { test, expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/admin.json' })

test('consejo de texto: formato a un clic y ficha sin reproductor', async ({ page }) => {
  const title = `Consejo e2e ${Date.now()}`
  await page.goto('/app/sala/contenido/nuevo')
  await page
    .getByRole('button', { name: /Consejo/ })
    .first()
    .click()
  await page.getByLabel('Título').fill(title)
  await page.getByLabel(/frases/i).fill('Dos frases de prueba para la tarjeta del consejo.')
  await page.locator('#c-cat').selectOption({ index: 1 })
  await expect(page.getByText('Nivel')).toHaveCount(0)
  await page.getByRole('button', { name: /Crear el borrador/ }).click()

  // Paso 2: la pregunta del formato y las cuatro opciones
  await expect(page.getByText('¿En qué formato es este consejo?')).toBeVisible()
  await expect(page.getByText('Sube el vídeo')).toHaveCount(0)
  await page.getByRole('button', { name: /Texto/ }).click()
  await expect(page.getByLabel('Escribe el texto')).toBeVisible()
  await expect(page.getByText(/Sube el vídeo|Sube el audio|Sube el documento/)).toHaveCount(0)
  await page.getByLabel('Escribe el texto').fill('El cuerpo del consejo, en texto.')
  await page.getByRole('button', { name: /Guardar y seguir/ }).click()

  // Paso 3: portada (sin claves de IA en local solo se ofrece subirla) → publicar
  await page.waitForURL(/paso=3/)
  await expect(page.getByText('Subir una imagen')).toBeVisible()
  await page.getByRole('link', { name: /Revisar y publicar/ }).click()
  await expect(page.getByText('Formato: Texto')).toBeVisible()
  await page.getByRole('button', { name: /^Publicar/ }).click()
  // «Verla como alumno» abre otra pestaña: se sigue su enlace en esta
  const href = await page.getByRole('link', { name: /Verla como alumno/ }).getAttribute('href')
  await page.goto(href!)

  await expect(page.getByRole('heading', { name: title })).toBeVisible()
  await expect(page.getByText('El cuerpo del consejo, en texto.')).toBeVisible()
  await expect(page.getByText('REPRODUCTOR DE VÍDEO')).toHaveCount(0)
})
