export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div aria-hidden className="mb-3 text-3xl">
        ✉️
      </div>
      <h1 className="mb-2 text-xl font-bold">Confirma tu correo</h1>
      <p className="text-sm leading-relaxed text-muted">
        Te hemos enviado un enlace de confirmación. Ábrelo para activar tu cuenta y continuar con la
        suscripción.
      </p>
      <p className="mt-4 text-[13px] text-muted">¿No lo encuentras? Revisa la carpeta de spam.</p>
    </div>
  )
}
