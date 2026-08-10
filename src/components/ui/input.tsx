'use client'

import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id: idProp, ...props },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12.5px] font-semibold">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'rounded-sm border bg-surface px-3 py-2.5 text-sm',
          'placeholder:text-muted-2',
          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link',
          error ? 'border-danger' : 'border-border-input',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
})
