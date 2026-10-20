// Catálogo de conceptos de la Sala — módulo compartido cliente/servidor
// (el selector del asistente lo importa desde el navegador).
import type { Content } from '@/payload/payload-types'

export type SalaConceptType = Exclude<Content['contentType'], never>

/** Las 5 piezas sueltas que la Sala puede crear (los cursos van aparte), con su promesa como guía. */
export const SALA_CONCEPTS: {
  value: SalaConceptType
  label: string
  glyph: string
  hint: string
}[] = [
  {
    value: 'ADVICE',
    label: 'Consejo',
    glyph: '▶',
    hint: 'Consejos prácticos de Pere: evitar impagados, recuperarlos…',
  },
  { value: 'ARTICLE', label: 'Artículo', glyph: '◆', hint: 'Un artículo firmado por Pere' },
  { value: 'GUIDE', label: 'Guía', glyph: '▤', hint: 'La referencia para consultar sobre un tema' },
  { value: 'CHECKLIST', label: 'Checklist', glyph: '✓', hint: 'Verifica que no te dejas nada' },
  {
    value: 'TEMPLATE',
    label: 'Plantilla',
    glyph: '▦',
    hint: 'El documento listo para adaptar y usar hoy',
  },
]
