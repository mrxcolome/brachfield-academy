// Catálogo de conceptos de la Sala — módulo compartido cliente/servidor
// (el selector del asistente lo importa desde el navegador).
import type { Content } from '@/payload/payload-types'

export type SalaConceptType = Exclude<Content['contentType'], never>

/** Los 9 conceptos que la Sala puede crear, con su promesa como guía. */
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
  {
    value: 'INTERVIEW',
    label: 'Entrevista',
    glyph: '◑',
    hint: 'Escucha a quien lo vive, en conversación con Pere',
  },
  {
    value: 'WEBINAR',
    label: 'Sesión en directo',
    glyph: '◉',
    hint: 'El replay de un directo con Pere',
  },
  { value: 'GUIDE', label: 'Guía', glyph: '▤', hint: 'La referencia para consultar sobre un tema' },
  { value: 'CHECKLIST', label: 'Checklist', glyph: '✓', hint: 'Verifica que no te dejas nada' },
  {
    value: 'TEMPLATE',
    label: 'Plantilla',
    glyph: '▦',
    hint: 'El documento listo para adaptar y usar hoy',
  },
  {
    value: 'CASE_STUDY',
    label: 'Caso práctico',
    glyph: '▣',
    hint: 'Una situación real, analizada',
  },
]
