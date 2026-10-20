// Formato de una pieza (decisión del propietario 20/10/2026): quien crea la pieza elige UNO
// — vídeo, texto, audio o documento — y la ficha del alumno muestra solo ese material.
// Módulo plano, compartido cliente/servidor.

export type ContentFormat = 'VIDEO' | 'TEXT' | 'AUDIO' | 'DOCUMENT'

export const FORMAT_OPTIONS: {
  value: ContentFormat
  label: string
  glyph: string
  hint: string
}[] = [
  { value: 'VIDEO', label: 'Vídeo', glyph: '▶', hint: 'Pere o Cristina explicándolo a cámara' },
  { value: 'TEXT', label: 'Texto', glyph: '¶', hint: 'Escrito para leer en pantalla' },
  { value: 'AUDIO', label: 'Audio', glyph: '♪', hint: 'Para escuchar, como un pódcast' },
  {
    value: 'DOCUMENT',
    label: 'Documento',
    glyph: '↓',
    hint: 'Un PDF, Word o Excel para descargar',
  },
]

/** El formato elegido o, en piezas anteriores al campo, el que se deduce del material. */
export function resolveFormat(piece: {
  format?: ContentFormat | null
  streamId?: string | null
  audioFile?: unknown
  documentFile?: unknown
  hasText?: boolean
}): ContentFormat | null {
  if (piece.format) return piece.format
  if (piece.streamId) return 'VIDEO'
  if (piece.audioFile) return 'AUDIO'
  if (piece.documentFile) return 'DOCUMENT'
  if (piece.hasText) return 'TEXT'
  return null
}
