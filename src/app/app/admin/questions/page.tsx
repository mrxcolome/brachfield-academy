import { requireRole } from '@/features/auth/guards'
import { listQuestions } from '@/features/admin/service'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { QuestionActions } from './question-actions'

export const metadata = { title: 'Administración · Preguntas' }

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  SELECTED: 'Seleccionada para Q&A',
  ANSWERED: 'Respondida',
  PUBLISHED: 'Publicada',
  DISCARDED: 'Descartada',
}

export default async function AdminQuestionsPage() {
  await requireRole('ADMIN', 'EDITOR')
  const questions = await listQuestions()
  const pending = questions.filter((q) => q.status === 'PENDING' || q.status === 'SELECTED')
  const resolved = questions.filter((q) => q.status !== 'PENDING' && q.status !== 'SELECTED')

  if (questions.length === 0) {
    return (
      <EmptyState
        icon="?"
        title="No hay preguntas de alumnos"
        description="Cuando la sección «Pregunta a Pere» esté abierta a los alumnos, la cola aparecerá aquí."
      />
    )
  }

  function Card({ q }: { q: (typeof questions)[number] }) {
    return (
      <article className="rounded-lg border border-border bg-surface p-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{STATUS_LABEL[q.status] ?? q.status}</Badge>
          <span className="font-mono text-[11px] text-muted">
            {q.user.name} {q.user.lastName ?? ''} · {q.user.email} ·{' '}
            {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(
              q.createdAt,
            )}
          </span>
        </div>
        <p className="mb-2 text-sm leading-relaxed font-semibold">{q.question}</p>
        {q.answer && (
          <p className="mb-2 border-l-2 border-accent pl-3 text-[13px] leading-relaxed text-ink-2">
            {q.answer}
          </p>
        )}
        {(q.status === 'PENDING' || q.status === 'SELECTED') && (
          <QuestionActions questionId={q.id} />
        )}
      </article>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Pendientes ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-[13px] text-muted">Nada pendiente. 🎉</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((q) => (
              <Card key={q.id} q={q} />
            ))}
          </div>
        )}
      </section>

      {resolved.length > 0 && (
        <section>
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Resueltas</h2>
          <div className="flex flex-col gap-3">
            {resolved.map((q) => (
              <Card key={q.id} q={q} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
