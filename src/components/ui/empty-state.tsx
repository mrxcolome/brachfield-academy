import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-5 py-12 text-center', className)}>
      {icon && (
        <div className="text-3xl text-border-input" aria-hidden>
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="max-w-sm text-[13px] text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
