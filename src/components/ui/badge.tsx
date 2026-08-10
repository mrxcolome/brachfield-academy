import { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'soft' | 'new' | 'success' | 'outline'

const variants: Record<Variant, string> = {
  soft: 'bg-surface text-brand-link',
  new: 'bg-accent text-accent-ink font-mono uppercase tracking-wide',
  success: 'bg-success text-white font-mono uppercase tracking-wide',
  outline: 'border border-border-chip text-ink-2 bg-transparent',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

export function Badge({ variant = 'soft', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
