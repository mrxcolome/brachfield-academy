// Logo oficial de Brachfield Academy (2026-08). Dos versiones cerradas por
// el propietario — el logo va SIEMPRE tal cual, sin inventar colores ni
// estructuras:
//   positive (fondos claros): cuadrado girado azul + 3 naranjas;
//                             "Brachfield" tinta + "Academy" azul.
//   negative (fondos oscuros): cuadrado girado BLANCO + 3 naranjas;
//                             "Brachfield" blanco + "Academy" NARANJA.
// El wordmark va como texto HTML para heredar la tipografía del sitio.
import { cn } from '@/lib/cn'

export const LOGO_NAVY = '#2b4a7c'
export const LOGO_ORANGE = '#ee8b0a'

type LogoVariant = 'positive' | 'negative'

/** Icono de los cuatro cuadrados. */
export function LogoMark({
  size = 28,
  variant = 'positive',
  className,
}: {
  size?: number
  variant?: LogoVariant
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="4"
        y="10"
        width="38"
        height="38"
        rx="3"
        fill={variant === 'negative' ? '#ffffff' : LOGO_NAVY}
        transform="rotate(-12 23 29)"
      />
      <rect x="54" y="12" width="34" height="34" rx="3" fill={LOGO_ORANGE} />
      <rect x="10" y="54" width="34" height="34" rx="3" fill={LOGO_ORANGE} />
      <rect x="54" y="54" width="34" height="34" rx="3" fill={LOGO_ORANGE} />
    </svg>
  )
}

/**
 * Logo completo: icono + wordmark. `textClassName` controla el tamaño del
 * texto (el icono escala con `markSize`).
 */
export function BrandLogo({
  markSize = 28,
  variant = 'positive',
  textClassName = 'text-base',
  className,
}: {
  markSize?: number
  variant?: LogoVariant
  textClassName?: string
  className?: string
}) {
  const negative = variant === 'negative'
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={markSize} variant={variant} />
      <span
        className={cn('leading-none font-bold tracking-tight whitespace-nowrap', textClassName)}
      >
        <span className={negative ? 'text-white' : 'text-ink'}>Brachfield</span>{' '}
        <span style={{ color: negative ? LOGO_ORANGE : LOGO_NAVY }}>Academy</span>
      </span>
    </span>
  )
}
