'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { anadirLeccion, borrarLeccion, guardarLeccion, moverLeccion } from '@/features/sala/actions'
import type { SalaLesson } from '@/features/sala/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VideoUpload } from './video-upload'

interface DraftLesson {
  title: string
  lessonType: 'video' | 'text'
  duration: string
  streamId: string
  text: string
}

const EMPTY: DraftLesson = { title: '', lessonType: 'video', duration: '', streamId: '', text: '' }

function LessonForm({
  initial,
  pending,
  onSave,
  onCancel,
}: {
  initial: DraftLesson
  pending: boolean
  onSave: (d: DraftLesson) => void
  onCancel?: () => void
}) {
  const [d, setD] = useState(initial)
  const set = (patch: Partial<DraftLesson>) => setD((prev) => ({ ...prev, ...patch }))

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-input bg-bg p-4">
      <Input
        label="Título de la lección"
        value={d.title}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="Ej. Cómo redactar el primer requerimiento de pago"
      />
      <div className="flex flex-wrap gap-2">
        {(['video', 'text'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set({ lessonType: t })}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold ${
              d.lessonType === t
                ? 'border-brand bg-brand text-white'
                : 'border-border-input bg-surface text-ink-2'
            }`}
          >
            {t === 'video' ? '▶ Vídeo' : '¶ Solo texto'}
          </button>
        ))}
      </div>
      {d.lessonType === 'video' && (
        <div className="flex flex-col gap-2">
          {d.streamId ? (
            <p className="text-[13px]">
              Vídeo conectado ✓{' '}
              <span className="font-mono text-[11.5px] text-muted">{d.streamId}</span>{' '}
              <button
                type="button"
                className="font-semibold text-brand-link underline"
                onClick={() => set({ streamId: '' })}
              >
                cambiar
              </button>
            </p>
          ) : (
            <>
              <VideoUpload
                onReady={(uid, duration) =>
                  set({ streamId: uid, ...(duration ? { duration } : {}) })
                }
              />
              <details className="text-[12.5px] text-muted">
                <summary className="cursor-pointer">¿El vídeo ya está en Cloudflare?</summary>
                <div className="mt-2">
                  <Input
                    label="Pega su código (UID de 32 caracteres)"
                    value={d.streamId}
                    onChange={(e) => set({ streamId: e.target.value.trim() })}
                    placeholder="p. ej. 31c9291ab41…"
                  />
                </div>
              </details>
            </>
          )}
          <Input
            label="Duración"
            value={d.duration}
            onChange={(e) => set({ duration: e.target.value })}
            placeholder="Se rellena sola al subir el vídeo — ej. 12 min"
          />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold">
          {d.lessonType === 'text' ? 'El texto de la lección' : 'Texto de apoyo (opcional)'}
        </label>
        <textarea
          rows={d.lessonType === 'text' ? 8 : 3}
          value={d.text}
          onChange={(e) => set({ text: e.target.value })}
          placeholder="Escribe en párrafos normales; se publican tal cual."
          className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" disabled={pending} onClick={() => onSave(d)}>
          {pending ? 'Guardando…' : 'Guardar lección'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  )
}

export function LessonsEditor({ courseId, lessons }: { courseId: number; lessons: SalaLesson[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(lessons.length === 0)
  const [editing, setEditing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function run(fn: () => Promise<{ error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) setError(res.error)
      else {
        setAdding(false)
        setEditing(null)
        router.refresh()
      }
    })
  }

  function onDelete(lesson: SalaLesson) {
    setError(null)
    startTransition(async () => {
      const res = await borrarLeccion({ id: courseId, lessonId: lesson.id })
      if (res.warning) {
        const ok = window.confirm(
          `⚠ ${res.warning} ${res.warning === 1 ? 'alumno tiene' : 'alumnos tienen'} progreso en «${lesson.title}». Si la borras, ese progreso se pierde y no se puede recuperar.\n\n¿Borrar de todos modos?`,
        )
        if (!ok) return
        const res2 = await borrarLeccion({ id: courseId, lessonId: lesson.id, confirm: true })
        if (res2.error) return setError(res2.error)
      } else if (res.error) {
        return setError(res.error)
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {lessons.length === 0 && !adding && (
        <p className="text-sm text-muted">Todavía no hay lecciones.</p>
      )}
      <ol className="flex flex-col gap-2">
        {lessons.map((l, i) =>
          editing === l.id ? (
            <li key={l.id}>
              <LessonForm
                initial={{
                  title: l.title,
                  lessonType: l.lessonType,
                  duration: l.duration ?? '',
                  streamId: l.streamId ?? '',
                  text: l.text ?? '',
                }}
                pending={pending}
                onSave={(d) => run(() => guardarLeccion({ ...d, id: courseId, lessonId: l.id }))}
                onCancel={() => setEditing(null)}
              />
            </li>
          ) : (
            <li
              key={l.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3"
            >
              <span className="font-mono text-[11.5px] text-muted">{i + 1}</span>
              <span aria-hidden className="text-brand-link">
                {l.lessonType === 'video' ? '▶' : '¶'}
              </span>
              <span className="min-w-40 flex-1 text-[14px] font-semibold">{l.title}</span>
              {l.lessonType === 'video' && !l.streamId && (
                <span className="text-[12px] font-semibold text-accent-ink">sin vídeo aún</span>
              )}
              {l.duration && (
                <span className="font-mono text-[11.5px] text-muted">{l.duration}</span>
              )}
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Subir «${l.title}» una posición`}
                  disabled={pending || i === 0}
                  onClick={() => run(() => moverLeccion({ id: courseId, lessonId: l.id, dir: -1 }))}
                  className="rounded border border-border-input px-2 py-1 text-[12px] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Bajar «${l.title}» una posición`}
                  disabled={pending || i === lessons.length - 1}
                  onClick={() => run(() => moverLeccion({ id: courseId, lessonId: l.id, dir: 1 }))}
                  className="rounded border border-border-input px-2 py-1 text-[12px] disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setEditing(l.id)}
                  className="rounded border border-border-input px-2.5 py-1 text-[12px] font-semibold"
                >
                  Editar
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onDelete(l)}
                  className="rounded border border-border-input px-2.5 py-1 text-[12px] font-semibold text-danger"
                >
                  Borrar
                </button>
              </span>
            </li>
          ),
        )}
      </ol>

      {adding ? (
        <LessonForm
          initial={EMPTY}
          pending={pending}
          onSave={(d) => run(() => anadirLeccion({ ...d, id: courseId }))}
          onCancel={lessons.length > 0 ? () => setAdding(false) : undefined}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="self-start rounded-sm border border-border-input px-4 py-2.5 text-[13px] font-semibold text-ink hover:bg-bg"
        >
          + Añadir lección
        </button>
      )}
      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
