// Datos del titular del sitio. ÚNICO sitio a editar cuando el propietario
// confirme los datos fiscales — las cuatro páginas legales leen de aquí.
// Los valores [PENDIENTE] se muestran tal cual para que sea evidente qué falta.

export const COMPANY = {
  /** Razón social o nombre del titular (persona física o sociedad). */
  name: 'Pere Joaquim Brachfield (BRACHFIELD Credit & Risk Consultants)',
  /** NIF/CIF del titular. */
  taxId: '46230494N',
  /** Domicilio fiscal completo. */
  address: 'Avenida de Gran Via de Carlos III, 76, 08028 Barcelona, España',
  /** Teléfono de contacto. */
  phone: '93 296 96 61',
  /** Email de contacto general y para derechos RGPD. */
  email: 'info@perebrachfield.com',
  /** Nombre comercial del servicio. */
  brand: 'Brachfield Academy',
  /** Dominio actual del servicio. */
  url: 'https://brachfield-academy-app.vercel.app',
  /** Fecha de última revisión de los textos legales. */
  updated: '13 de agosto de 2026',
} as const

/** true si aún quedan datos por completar (aviso visible en las páginas). */
export const COMPANY_INCOMPLETE = Object.values(COMPANY).some(
  (v) => typeof v === 'string' && v.startsWith('[PENDIENTE'),
)
