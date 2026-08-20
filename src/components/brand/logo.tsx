// Logo oficial de Brachfield Academy (actualizado por el propietario el
// 2026-08-20 — servido TAL CUAL, sin redibujar): icono de cuadrado girado
// GRANATE + cuadrados NARANJAS en ambas versiones; el nombre va en negro
// sobre fondos claros (logo.svg) y en blanco sobre oscuros (logo-neg.svg,
// derivado del oficial cambiando solo el color del nombre, según la muestra
// visual del propietario). icon.svg / icon-neg.svg son SOLO el símbolo
// (idéntico en ambas), encuadre recortado, para favicon y espacios pequeños.
// Proporción del logo completo: 2521×312 (≈8.08:1) — fijar la altura y dejar
// que el ancho se derive solo.
import { cn } from '@/lib/cn'

export const LOGO_GARNET = '#A21E26'
export const LOGO_ORANGE = '#E88800'

type LogoVariant = 'positive' | 'negative'

/** Símbolo de los cuatro cuadrados, solo. */
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
    // eslint-disable-next-line @next/next/no-img-element -- SVG estático de marca, sin optimización
    <img
      src={variant === 'negative' ? '/brand/icon-neg.svg' : '/brand/icon.svg'}
      alt=""
      aria-hidden="true"
      className={className}
      style={{ height: size, width: 'auto' }}
    />
  )
}

/** Logo completo oficial (símbolo + wordmark). `height` en píxeles. */
export function BrandLogo({
  height = 32,
  variant = 'positive',
  className,
}: {
  height?: number
  variant?: LogoVariant
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG estático de marca, sin optimización
    <img
      src={variant === 'negative' ? '/brand/logo-neg.svg' : '/brand/logo.svg'}
      alt="Brachfield Academy"
      className={cn('inline-block', className)}
      style={{ height, width: 'auto' }}
    />
  )
}
