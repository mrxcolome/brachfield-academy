// Creación de subidas directas a Cloudflare Stream (protocolo tus).
// El navegador manda aquí SOLO la petición de creación; Cloudflare responde
// con una URL de un solo uso y los chunks del vídeo viajan directos del
// navegador a Cloudflare — ni el archivo ni el token pasan por Vercel.
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('No autorizado', { status: 401 })
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (!dbUser || !['ADMIN', 'EDITOR'].includes(dbUser.role)) {
    return new Response('No autorizado', { status: 403 })
  }

  const account = process.env.R2_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_STREAM_TOKEN
  if (!account || !token) {
    return new Response('Cloudflare Stream no está configurado', { status: 503 })
  }

  const upstream = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/stream?direct_user=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': req.headers.get('upload-length') ?? '',
        'Upload-Metadata': req.headers.get('upload-metadata') ?? '',
      },
    },
  )
  const location = upstream.headers.get('location')
  const mediaId = upstream.headers.get('stream-media-id')
  if (!upstream.ok || !location) {
    console.error('[sala] Stream direct upload falló', upstream.status, await upstream.text())
    return new Response('Cloudflare no aceptó la subida', { status: 502 })
  }
  return new Response(null, {
    status: 201,
    headers: {
      Location: location,
      'Tus-Resumable': '1.0.0',
      ...(mediaId ? { 'stream-media-id': mediaId } : {}),
      'Access-Control-Expose-Headers': 'Location, stream-media-id',
    },
  })
}
