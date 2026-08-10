import { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/app')
  }
  return (
    <main className="auth-wrap">
      <form className="auth-card" style={{ width: 380 }} onSubmit={onSubmit}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Logo />
        </div>
        <label className="field-label" htmlFor="login-email">Correo electrónico</label>
        <input id="login-email" className="input" type="email" placeholder="nombre@empresa.com" style={{ marginBottom: 14 }} />
        <label className="field-label" htmlFor="login-pass">Contraseña</label>
        <input id="login-pass" className="input" type="password" placeholder="••••••••" style={{ marginBottom: 18 }} />
        <button type="submit" className="btn btn-primary btn-block" style={{ marginBottom: 14 }}>Entrar</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
          <span style={{ fontSize: 12, color: 'var(--faint)' }}>o</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
        </div>
        <button type="button" className="btn btn-secondary btn-block" style={{ marginBottom: 8, fontSize: 13.5, color: 'var(--ink)' }}>Continuar con Google</button>
        <button type="button" className="btn btn-secondary btn-block" style={{ fontSize: 13.5, color: 'var(--ink)' }}>Continuar con LinkedIn</button>
        <div style={{ textAlign: 'center', fontSize: 13, marginTop: 18, color: 'var(--muted)' }}>
          ¿Aún no tienes cuenta? <Link to="/registro">Suscríbete</Link>
        </div>
      </form>
    </main>
  )
}
