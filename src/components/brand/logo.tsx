// Logo oficial de Brachfield Academy (SVG entregados por el propietario el
// 2026-08-12, en public/brand/ — servidos TAL CUAL, sin redibujar):
//   positive (fondos claros): logo.svg — cuadrado girado azul, "Academy" azul.
//   negative (fondos oscuros): logo-neg.svg — cuadrado blanco, "Academy" naranja.
// icon.svg / icon-neg.svg son SOLO el símbolo (mismos rects del archivo
// oficial, encuadre recortado) para favicon y espacios pequeños.
// Proporción del logo completo: 2521×312 (≈8.08:1) — fijar la altura y dejar
// que el ancho se derive solo.
import { cn } from '@/lib/cn'

export const LOGO_NAVY = '#224278'
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
