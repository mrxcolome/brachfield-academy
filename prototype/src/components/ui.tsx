import { CSSProperties, ReactNode } from 'react'

/** Placeholder rayado para imágenes/fotos (patrón del prototipo). */
export function StripePh({ label, style, className = '' }: { label?: string; style?: CSSProperties; className?: string }) {
  return (
    <div className={`stripe-ph ${className}`} style={style} role="img" aria-label={label ?? 'Imagen'}>
      {label && <span>{label}</span>}
    </div>
  )
}

export function Progress({ value, height = 6, style }: { value: number; height?: number; style?: CSSProperties }) {
  return (
    <div
      className="progress"
      style={{ height, ...style }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

export function Logo({ size = 16 }: { size?: number }) {
  return (
    <span style={{ fontWeight: 700, fontSize: size, letterSpacing: '-0.01em' }}>
      Brachfield <em style={{ fontStyle: 'normal', color: 'var(--brand-link)' }}>Academy</em>
    </span>
  )
}

export function Kicker({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="kicker" style={{ marginBottom: 8, ...style }}>{children}</div>
}
