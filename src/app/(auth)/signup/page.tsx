'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-client'
import { signupSchema } from '@/features/auth/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
    const res = await signUp.email(parsed.data)
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
    <>
      <p className="mb-1 font-mono text-[11px] tracking-wide text-muted uppercase">Paso 1 de 3</p>
      <h1 className="mb-5 text-xl font-bold">Crea tu cuenta</h1>
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
      <p className="mt-4 text-center text-[13px] text-muted">
        ¿Ya tienes cuenta? <Link href="/login">Entra</Link>
      </p>
    </>
  )
}
