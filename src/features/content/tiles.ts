// Las 6 tipologías como escaparate (rediseño 2026-09-09; simplificadas el 20/10/2026): compartidas entre
// Explorar y el aterrizaje de primera visita. Datos planos, sin server-only.

export const COURSES_TILE = {
  label: 'Cursos',
  promise: 'Aprende un tema completo',
  detail:
    'La formación de fondo de la academia: del marco legal de la morosidad al recobro paso a paso.',
  img: '/landing/formato-cursos.webp',
  href: '/app/learning',
} as const

export const MEDIUM_TILES = [
  {
    label: 'Consejos',
    promise: 'El consejo práctico de Pere',
    img: '/landing/formato-videos.webp',
    href: '/app/library?tipo=ADVICE',
  },
  {
    label: 'Artículos',
    promise: 'La pluma de Pere, al grano',
    img: '/landing/formato-recursos.webp',
    href: '/app/library?tipo=ARTICLE',
  },
] as const

export const COMPACT_TILES = [
  {
    glyph: '▤',
    label: 'Guías',
    promise: 'La referencia para consultar',
    href: '/app/library?tipo=GUIDE',
  },
  {
    glyph: '✓',
    label: 'Checklists',
    promise: 'Verifica que no te dejas nada',
    href: '/app/library?tipo=CHECKLIST',
  },
  {
    glyph: '▦',
    label: 'Plantillas',
    promise: 'Listas para adaptar y usar hoy',
    href: '/app/library?tipo=TEMPLATE',
  },
] as const
