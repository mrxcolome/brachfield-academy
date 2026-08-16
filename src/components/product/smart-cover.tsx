import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Cover } from '@/components/art'

/**
 * Portada de tarjeta/ficha: pinta la foto resuelta por covers.ts y, como red
 * final, la ilustración SVG de marca. Las portadas son decorativas (el título
 * va siempre en texto al lado), por eso alt="".
 */
export function SmartCover({
  src,
  title,
  kind,
  style,
}: {
  src: string | null
  title: string
  kind: Parameters<typeof Cover>[0]['kind']
  style?: CSSProperties
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={800}
        height={450}
        className="w-full object-cover"
        style={{ aspectRatio: '16/10', ...style }}
      />
    )
  }
  return <Cover title={title} kind={kind} style={{ aspectRatio: '16/10', ...style }} />
}
