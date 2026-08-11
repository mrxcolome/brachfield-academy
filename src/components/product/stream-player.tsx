// Player de Cloudflare Stream (iframe oficial). El UID del vídeo (streamId)
// se pega en el CMS al subir el vídeo al dashboard de Cloudflare.
export function StreamPlayer({ streamId, title }: { streamId: string; title: string }) {
  return (
    <div className="mb-5 aspect-video overflow-hidden rounded-xl bg-player">
      <iframe
        src={`https://iframe.videodelivery.net/${encodeURIComponent(streamId)}`}
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
