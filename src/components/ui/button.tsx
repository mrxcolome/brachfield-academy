import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'outline' | 'ghost' | 'dark' | 'accent' | 'success' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  outline: 'border border-border-chip bg-surface text-brand hover:bg-brand-soft',
  ghost: 'bg-border-faint text-ink-2 hover:bg-border-soft',
  dark: 'bg-surface-dark text-white hover:opacity-90',
  accent: 'bg-accent text-accent-ink hover:opacity-90',
  success: 'bg-success text-white hover:opacity-90',
  danger: 'bg-danger text-white hover:opacity-90',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-4.5 py-2.5 text-sm',
  lg: 'px-5.5 py-3.5 text-[15px]',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block = false, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...props}
    />
  )
})
