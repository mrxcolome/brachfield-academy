import { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Registro() {
  const navigate = useNavigate()
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/checkout')
  }
  return (
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <div className="kicker" style={{ marginBottom: 6 }}>PASO 1 DE 3</div>
        <h1 style={{ fontSize: 20, margin: '0 0 20px' }}>Crea tu cuenta</h1>
        <label className="field-label" htmlFor="reg-name">Nombre completo</label>
        <input id="reg-name" className="input" placeholder="Javier Soler" style={{ marginBottom: 14 }} />
        <label className="field-label" htmlFor="reg-email">Correo electrónico</label>
        <input id="reg-email" className="input" type="email" placeholder="nombre@empresa.com" style={{ marginBottom: 14 }} />
        <label className="field-label" htmlFor="reg-pass">Contraseña</label>
        <input id="reg-pass" className="input" type="password" placeholder="Mínimo 8 caracteres" style={{ marginBottom: 20 }} />
        <button type="submit" className="btn btn-primary btn-block">Continuar</button>
        <div style={{ textAlign: 'center', fontSize: 13, marginTop: 16, color: 'var(--muted)' }}>
          ¿Ya tienes cuenta? <Link to="/login">Entra</Link>
        </div>
      </form>
    </main>
  )
}
