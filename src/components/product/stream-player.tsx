// Player de Cloudflare Stream (iframe oficial). El UID del vídeo (streamId)
// se pega en el CMS al subir el vídeo al dashboard de Cloudflare.
// OJO: las cuentas actuales de Stream solo reproducen desde su subdominio
// propio (customer-*.cloudflarestream.com) — la dirección clásica
// iframe.videodelivery.net devuelve error. El subdominio es público (va en
// cada embed); si algún día cambia de cuenta Cloudflare, actualizarlo aquí.
const STREAM_HOST = 'customer-rwzj2lpoidmf4nvf.cloudflarestream.com'

export function StreamPlayer({ streamId, title }: { streamId: string; title: string }) {
  const id = encodeURIComponent(streamId.trim())
  const poster = encodeURIComponent(
    `https://${STREAM_HOST}/${id}/thumbnails/thumbnail.jpg?time=&height=600`,
  )
  return (
    <div className="mb-5 aspect-video overflow-hidden rounded-xl bg-player">
      <iframe
        src={`https://${STREAM_HOST}/${id}/iframe?poster=${poster}`}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  )
}

/** Placeholder honesto mientras un vídeo/audio no tiene streamId o fichero. */
export function PlayerPlaceholder({ kind }: { kind: 'video' | 'audio' }) {
  return (
    <div
      className={
        kind === 'video'
          ? 'mb-5 flex aspect-video items-center justify-center rounded-xl bg-player text-center'
          : 'mb-5 flex items-center justify-center rounded-xl bg-player px-6 py-10 text-center'
      }
    >
      <div>
        <p aria-hidden className="mb-2 text-3xl text-on-dark-muted">
          {kind === 'video' ? '▶' : '◑'}
        </p>
        <p className="font-mono text-xs text-on-dark-muted">
          {kind === 'video' ? 'REPRODUCTOR DE VÍDEO' : 'REPRODUCTOR DE AUDIO'}
        </p>
        <p className="mt-1 px-6 text-[11.5px] text-on-dark-muted">
          Este contenido estará disponible muy pronto
        </p>
      </div>
    </div>
  )
}
