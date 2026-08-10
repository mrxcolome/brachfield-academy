// Navegación del área privada (briefing §12). Un solo lugar de verdad.

export const SIDEBAR_NAV = [
  { href: '/app', label: 'Inicio', glyph: '⌂' },
  { href: '/app/learning', label: 'Mi formación', glyph: '▤' },
  { href: '/app/explore', label: 'Explorar', glyph: '◎' },
  { href: '/app/library', label: 'Biblioteca', glyph: '▥' },
  { href: '/app/tools', label: 'Herramientas', glyph: '▦' },
  { href: '/app/updates', label: 'Actualidad', glyph: '◈' },
  { href: '/app/events', label: 'Eventos', glyph: '▣' },
  { href: '/app/favorites', label: 'Favoritos', glyph: '♡' },
] as const

export const MOBILE_NAV = [
  { href: '/app', label: 'Inicio', glyph: '⌂' },
  { href: '/app/explore', label: 'Explorar', glyph: '◎' },
  { href: '/app/search', label: 'Buscar', glyph: '⌕' },
  { href: '/app/learning', label: 'Mi formación', glyph: '▤' },
  { href: '/app/account', label: 'Perfil', glyph: '●' },
] as const
