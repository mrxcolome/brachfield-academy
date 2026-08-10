'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth-client'
import { loginSchema } from '@/features/auth/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const parsed = loginSchema.safeParse(data)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos')
      return
    }
    setPending(true)
    const res = await signIn.email({ email: parsed.data.email, password: parsed.data.password })
    setPending(false)
    if (res.error) {
      // Mensaje genérico: no revelar si el email existe (briefing §72)
      setError(
        res.error.status === 403
          ? 'Confirma tu correo antes de entrar. Te hemos reenviado el enlace.'
          : 'Correo o contraseña incorrectos.',
      )
      return
    }
    router.push('/app')
  }

  return (
    <>
      <h1 className="mb-5 text-xl font-bold">Entrar</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
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
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        {error && (
          <p role="alert" className="text-[13px] text-danger">
            {error}
          </p>
        )}
        <Button type="submit" block disabled={pending}>
          {pending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
      <div className="mt-4 flex flex-col gap-1.5 text-center text-[13px]">
        <Link href="/forgot-password">¿Has olvidado tu contraseña?</Link>
        <span className="text-muted">
          ¿Aún no tienes cuenta? <Link href="/signup">Suscríbete</Link>
        </span>
      </div>
    </>
  )
}
