'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const password = String(new FormData(e.currentTarget).get('password') ?? '')
    if (password.length < 8) {
      setError('Mínimo 8 caracteres')
      return
    }
    if (!token) {
      setError('El enlace no es válido. Pide uno nuevo.')
      return
    }
    setPending(true)
    const res = await authClient.resetPassword({ newPassword: password, token })
    setPending(false)
    if (res.error) {
      setError('El enlace ha caducado o no es válido. Pide uno nuevo.')
      return
    }
    router.push('/login')
  }

  return (
    <>
      <h1 className="mb-5 text-xl font-bold">Nueva contraseña</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="password"
          type="password"
          label="Contraseña nueva"
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
          {pending ? 'Guardando…' : 'Guardar y entrar'}
        </Button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}
