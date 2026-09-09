// Navegación del área privada (briefing §12). Un solo lugar de verdad.
// Rediseño 2026-09-09: 5 entradas por intención + «Nuevo este mes» destacada
// en naranja al final (NEW_NAV_ITEM). Biblioteca, Herramientas y Eventos
// dejaron de ser entradas: viven dentro de Explorar y Actualidad.

export const SIDEBAR_NAV = [
  { href: '/app', label: 'Inicio', glyph: '⌂' },
  { href: '/app/learning', label: 'Mi formación', glyph: '▤' },
  { href: '/app/explore', label: 'Explorar', glyph: '◎' },
  { href: '/app/updates', label: 'Actualidad', glyph: '◈' },
  { href: '/app/favorites', label: 'Favoritos', glyph: '♡' },
] as const

/** La promesa mensual de la academia, separada y en naranja. */
export const NEW_NAV_ITEM = { href: '/app/new', label: 'Nuevo este mes', glyph: '✦' } as const

export const MOBILE_NAV = [
  { href: '/app', label: 'Inicio', glyph: '⌂' },
  { href: '/app/explore', label: 'Explorar', glyph: '◎' },
  { href: '/app/search', label: 'Buscar', glyph: '⌕' },
  { href: '/app/learning', label: 'Mi formación', glyph: '▤' },
  { href: '/app/new', label: 'Nuevo', glyph: '✦' },
] as const
