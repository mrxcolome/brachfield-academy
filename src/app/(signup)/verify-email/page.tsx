import { SignupSteps } from '../steps'

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
      <div className="text-left">
        <SignupSteps current={2} />
      </div>
      <div aria-hidden className="mb-3 text-3xl">
        ✉️
      </div>
      <h1 className="mb-2 text-xl font-bold">Ya casi está: confirma tu correo</h1>
      <p className="text-sm leading-relaxed text-muted">
        Te hemos enviado un enlace de confirmación. Ábrelo y seguirás automáticamente con el
        siguiente paso: activar tu acceso de alumno.
      </p>
      <p className="mt-4 text-[13px] text-muted">
        ¿No lo encuentras? Puede tardar un par de minutos — y mira también la carpeta de spam.
      </p>
    </div>
  )
}
