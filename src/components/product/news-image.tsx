'use client'

import { useState } from 'react'

/** Imagen de una noticia externa con respaldo de marca: si la URL del medio
 *  falla (retirada, bloqueada), entra la foto de la serie de la academia. */
export function NewsImage({
  src,
  fallback,
  className,
}: {
  src: string | null
  fallback: string
  className?: string
}) {
  const [broken, setBroken] = useState(false)
  const url = !src || broken ? fallback : src
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
      className={className}
    />
  )
}
