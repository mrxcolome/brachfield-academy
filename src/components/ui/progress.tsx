import { cn } from '@/lib/cn'

export interface ProgressProps {
  value: number
  className?: string
  label?: string
}

export function Progress({ value, className, label }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-1.5 overflow-hidden rounded-full bg-track', className)}
    >
      <div className="h-full bg-brand transition-[width]" style={{ width: `${clamped}%` }} />
    </div>
  )
}
