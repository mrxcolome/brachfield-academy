'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { marcarVideoBienvenidaVisto } from '@/features/welcome/actions'
import { StreamPlayer } from '@/components/product/stream-player'

/** Bloque del vídeo de bienvenida de Pere. Sin vídeo aún (streamId vacío):
 *  tarjeta de texto sobre imagen. Con vídeo: portada con play que al pulsar
 *  marca el paso de la checklist y carga el reproductor. */
export function WelcomeVideo({ streamId }: { streamId: string }) {
  const [playing, setPlaying] = useState(false)
  const [, startTransition] = useTransition()

  if (!streamId) {
    return (
      <div className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-lg border border-border bg-player p-6">
        <Image
          src="/landing/formato-webinars.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 620px"
          className="object-cover opacity-40"
        />
        <div className="relative text-center text-white">
          <p className="mb-1.5 text-[15px] font-bold">
            Bienvenido a la academia de Pere Brachfield
          </p>
          <p className="mx-auto max-w-md text-[13px] leading-relaxed opacity-90">
            Más de 30 años ayudando a empresas a cobrar mejor y sufrir menos impagos — y ahora,
            contigo cada mes.
          </p>
        </div>
      </div>
    )
  }

  if (playing) {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <StreamPlayer streamId={streamId} title="Pere te da la bienvenida" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setPlaying(true)
        startTransition(async () => {
          await marcarVideoBienvenidaVisto()
        })
      }}
      className="relative flex min-h-52 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border bg-player"
      aria-label="Reproducir: Pere te da la bienvenida (1 minuto)"
    >
      <Image
        src="/landing/formato-webinars.webp"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 620px"
        className="object-cover opacity-45"
      />
      <span className="relative text-center text-white">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-brand">
          ▶
        </span>
        <span className="block text-[15px] font-bold">Pere te da la bienvenida</span>
        <span className="block font-mono text-[11.5px] opacity-80">1 min</span>
      </span>
    </button>
  )
}
