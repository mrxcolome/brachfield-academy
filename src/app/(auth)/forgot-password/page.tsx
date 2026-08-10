'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '')
    setPending(true)
    // Siempre respondemos igual: no revelar si el email existe
    await authClient.requestPasswordReset({ email, redirectTo: '/reset-password' })
    setPending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="mb-2 text-xl font-bold">Revisa tu correo</h1>
        <p className="text-sm leading-relaxed text-muted">
          Si existe una cuenta con esa dirección, recibirás un enlace para crear una nueva
          contraseña. Caduca en 1 hora.
        </p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-2 text-xl font-bold">Recuperar contraseña</h1>
      <p className="mb-5 text-sm text-muted">Te enviaremos un enlace para crear una nueva.</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="nombre@empresa.com"
          autoComplete="email"
          required
        />
        <Button type="submit" block disabled={pending}>
          {pending ? 'Enviando…' : 'Enviar enlace'}
        </Button>
      </form>
      <p className="mt-4 text-center text-[13px]">
        <Link href="/login">Volver a entrar</Link>
      </p>
    </>
  )
}
