import { Link, Outlet } from 'react-router-dom'
import { Logo } from '../components/ui'

/** Cabecera del área pública: logo, navegación, Entrar + CTA principal. */
export default function PublicLayout() {
  return (
    <>
      <header className="pub-header">
        <Link to="/" className="logo" aria-label="Brachfield Academy — inicio">
          <Logo />
        </Link>
        <nav className="pub-nav" aria-label="Navegación principal">
          <Link to="/">Membresía</Link>
          <Link to="/catalogo">Explorar</Link>
          <Link to="/#sobre-pere">Sobre Pere</Link>
          <Link to="/precio">Precio</Link>
        </nav>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" style={{ fontSize: 14, color: 'var(--ink-3)' }}>
            Entrar
          </Link>
          <Link to="/registro" className="btn btn-primary btn-sm">
            Acceder a Brachfield Academy
          </Link>
        </div>
      </header>
      <Outlet />
    </>
  )
}
