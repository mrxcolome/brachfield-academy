import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../components/ui'
import { Avatar } from '../components/art'

const sideItems = [
  { glyph: '⌂', label: 'Inicio', to: '/app' },
  { glyph: '◎', label: 'Explorar', to: '/app/explorar' },
  { glyph: '▤', label: 'Mi formación', to: '/app/mi-formacion' },
  { glyph: '▥', label: 'Biblioteca', to: '/app/biblioteca' },
  { glyph: '▦', label: 'Herramientas', to: '/app/herramientas' },
  { glyph: '◈', label: 'Actualidad', to: '/app/actualidad' },
  { glyph: '▣', label: 'Eventos', to: '/app/eventos' },
  { glyph: '♡', label: 'Favoritos', to: '/app/favoritos' },
]

const mobileItems = [
  { glyph: '⌂', label: 'Inicio', to: '/app' },
  { glyph: '◎', label: 'Explorar', to: '/app/explorar' },
  { glyph: '⌕', label: 'Buscar', to: '/app/buscar' },
  { glyph: '▤', label: 'Mi formación', to: '/app/mi-formacion' },
  { glyph: '●', label: 'Perfil', to: '/app/perfil' },
]

/** Shell del área privada: sidebar desktop, topbar con buscador global, bottom nav móvil. */
export default function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Menú lateral">
        <Link to="/app" className="logo">
          <Logo size={15} />
        </Link>
        {sideItems.map((it) => (
          <NavLink key={it.to} to={it.to} end={it.to === '/app'} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            <span className="glyph" aria-hidden>{it.glyph}</span>
            {it.label}
          </NavLink>
        ))}
      </aside>

      <div className="app-main">
        <div className="app-topbar">
          <Link to="/app/buscar" className="global-search">
            ¿Qué necesitas resolver hoy?
          </Link>
          <div className="topbar-icons">
            <a href="#" aria-label="Notificaciones" onClick={(e) => e.preventDefault()}>🔔</a>
            <Link to="/app/favoritos" aria-label="Favoritos">♡</Link>
            <Link to="/app/perfil" aria-label="Perfil">
              <Avatar size={32} />
            </Link>
          </div>
        </div>
        <main className="app-content">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Navegación móvil">
        {mobileItems.map((it) => (
          <NavLink key={it.to} to={it.to} end={it.to === '/app'} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="glyph" aria-hidden>{it.glyph}</span>
            {it.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
