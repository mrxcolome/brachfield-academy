'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-client'
import { signupSchema } from '@/features/auth/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SignupSteps } from '../steps'

// Lo que se lleva el alumno, contado en el momento de la decisión.
const BENEFITS = [
  'Cursos, tutoriales y píldoras de Pere Brachfield',
  'Todas las herramientas y plantillas descargables',
  'Sesiones mensuales en directo con Pere',
  'Pregunta a Pere: consultas ilimitadas',
  'Certificados de finalización',
]

function Benefits({ compact = false }: { compact?: boolean }) {
  const items = compact ? BENEFITS.slice(0, 3) : BENEFITS
  return (
    <>
      <ul className="flex flex-col gap-2.5">
        {items.map((b) => (
          <li key={b} className="flex gap-2.5 text-sm leading-snug text-ink-2">
            <span aria-hidden className="font-bold text-success">
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-border-input pt-4">
        <p className="font-mono text-[13px] font-semibold text-ink">39 €/mes · Sin permanencia</p>
        <p className="mt-1 text-[13px] text-muted">Cancela cuando quieras, en un clic.</p>
      </div>
    </>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const parsed = signupSchema.safeParse(data)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos')
      return
    }
    setPending(true)
    // callbackURL: el enlace del email de verificación deja al alumno en el
    // paso 2 (activar acceso), con sesión ya iniciada (autoSignInAfterVerification).
    const res = await signUp.email({ ...parsed.data, callbackURL: '/checkout' })
    setPending(false)
    if (res.error) {
      setError(
        res.error.code === 'USER_ALREADY_EXISTS'
          ? 'Ya existe una cuenta con este correo. Prueba a entrar.'
          : 'No hemos podido crear la cuenta. Inténtalo de nuevo.',
      )
      return
    }
    router.push('/verify-email')
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.85fr] lg:gap-8">
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <SignupSteps current={1} />
        <h1 className="mb-2 text-xl font-bold sm:text-2xl">Crea tu cuenta de alumno</h1>
        <p className="mb-6 text-sm leading-relaxed text-ink-2">
          Estás a tres pasos de entrar en la escuela del ciclo completo del crédito comercial. Este
          te llevará menos de dos minutos.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            name="name"
            label="Nombre completo"
            placeholder="Javier Soler"
            autoComplete="name"
            required
          />
          <Input
            name="email"
            type="email"
            label="Correo electrónico"
            placeholder="nombre@empresa.com"
            autoComplete="email"
            required
          />
          <Input
            name="password"
            type="password"
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            required
          />
          {error && (
            <p role="alert" className="text-[13px] text-danger">
              {error}
            </p>
          )}
          <Button type="submit" block disabled={pending}>
            {pending ? 'Creando cuenta…' : 'Continuar'}
          </Button>
        </form>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          Después activarás tu acceso con pago seguro (Stripe) y nos contarás qué quieres aprender.
          Sin permanencia.
        </p>
        <p className="mt-4 border-t border-border-soft pt-4 text-center text-[13px] text-muted">
          ¿Ya tienes cuenta? <Link href="/login">Entra</Link>
        </p>
      </div>

      {/* Desktop: el recordatorio de valor acompaña a la decisión */}
      <aside className="hidden rounded-xl border border-border bg-brand-soft p-7 lg:block">
        <p className="mb-3 font-mono text-[11px] tracking-wide text-brand-link uppercase">
          Tu membresía de alumno
        </p>
        <h2 className="mb-4 text-lg font-bold">Todo esto te espera dentro</h2>
        <Benefits />
      </aside>

      {/* Móvil: versión editada, más breve, tras el formulario */}
      <div className="rounded-xl border border-border bg-brand-soft p-5 lg:hidden">
        <h2 className="mb-3 text-[15px] font-bold">Todo esto te espera dentro</h2>
        <Benefits compact />
      </div>
    </div>
  )
}
