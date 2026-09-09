'use client'

import { useState, useTransition } from 'react'
import { actualizarTablon } from '@/features/sector-news/actions'
import type { RefreshResult } from '@/features/sector-news/service'

/** Botón del Resumen de administración para refrescar el tablón del sector a
 *  mano y ver el estado de cada fuente (útil para estrenar y diagnosticar). */
export function SectorNewsRefresh() {
  const [result, setResult] = useState<RefreshResult | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setResult(await actualizarTablon())
          })
        }
        className="cursor-pointer rounded-sm border border-border-input px-4 py-2 text-[13px] font-semibold text-ink-2 hover:border-brand-link hover:text-ink disabled:opacity-60"
      >
        {pending ? 'Actualizando…' : 'Actualizar el tablón ahora'}
      </button>
      {result && (
        <div className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
          <p>
            {result.added > 0
              ? `${result.added} titulares nuevos añadidos`
              : 'Sin titulares nuevos relevantes'}{' '}
            <span className="text-muted">
              · curación: {result.curator === 'claude' ? 'IA' : 'palabras clave'}
            </span>
          </p>
          <p className="mt-1">
            {result.article ? (
              <>
                Crónica publicada:{' '}
                <a
                  href={`/app/contents/${result.article.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-link"
                >
                  «{result.article.title}» ↗
                </a>
              </>
            ) : (
              <span className="text-muted">Redactor: {result.writerStatus}</span>
            )}
          </p>
          <ul className="mt-1 flex list-none flex-col gap-0.5 p-0 font-mono text-[11.5px]">
            {result.sources.map((s) => (
              <li key={s.name} className={s.error ? 'text-danger' : 'text-muted'}>
                {s.name}: {s.error ? `✕ ${s.error}` : `${s.items} titulares leídos`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
