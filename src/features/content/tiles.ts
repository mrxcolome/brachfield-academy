// Las 10 tipologías como escaparate (rediseño 2026-09-09): compartidas entre
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
  {
    label: 'Entrevistas',
    promise: 'Escucha a quien lo vive',
    img: '/landing/formato-podcasts.webp',
    href: '/app/library?tipo=INTERVIEW',
  },
  {
    label: 'Sesiones en directo',
    promise: 'Con Pere, en vivo — y su replay',
    img: '/landing/formato-webinars.webp',
    href: '/app/events',
  },
] as const

export const COMPACT_TILES = [
  {
    glyph: '▤',
    label: 'Guías',
    promise: 'La referencia para consultar',
    href: '/app/library?tipo=GUIDE',
  },
  { glyph: '✓', label: 'Checklists', promise: 'Verifica que no te dejas nada', href: '/app/tools' },
  {
    glyph: '▦',
    label: 'Plantillas',
    promise: 'Listas para adaptar y usar hoy',
    href: '/app/tools',
  },
  {
    glyph: '▣',
    label: 'Casos prácticos',
    promise: 'Qué pasó y qué aprender',
    href: '/app/library?tipo=CASE_STUDY',
  },
] as const
