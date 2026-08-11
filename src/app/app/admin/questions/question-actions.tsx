'use client'

import { useState, useTransition } from 'react'
import { answerQuestion } from '@/features/admin/actions'

export function QuestionActions({ questionId }: { questionId: string }) {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function submit(status: 'ANSWERED' | 'SELECTED' | 'DISCARDED') {
    setError(null)
    startTransition(async () => {
      const res = await answerQuestion({
        questionId,
        status,
        ...(status === 'ANSWERED' ? { answer } : {}),
      })
      if (res.error) setError(res.error)
    })
  }

  return (
    <div className="mt-2">
      <label htmlFor={`answer-${questionId}`} className="sr-only">
        Respuesta
      </label>
      <textarea
        id={`answer-${questionId}`}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        placeholder="Escribe la respuesta para el miembro…"
        className="mb-2 w-full rounded-md border border-border-input bg-bg px-3 py-2 text-[13px] placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending || answer.trim().length === 0}
          onClick={() => submit('ANSWERED')}
          className="rounded-full bg-brand px-3.5 py-1.5 text-[12.5px] font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
        >
          Responder y notificar
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => submit('SELECTED')}
          className="rounded-full border border-border-chip bg-surface px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-2 hover:bg-bg disabled:opacity-50"
        >
          Para el Q&A mensual
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => submit('DISCARDED')}
          className="rounded-full border border-border-chip bg-surface px-3.5 py-1.5 text-[12.5px] font-semibold text-muted hover:bg-bg disabled:opacity-50"
        >
          Descartar
        </button>
        {error && (
          <span role="alert" className="text-[12px] text-danger">
            {error}
          </span>
        )}
      </div>
    </div>
  )
}
