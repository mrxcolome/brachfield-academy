// Descargas de herramientas (Fase 11). En producción la URL es un enlace
// firmado de R2 con caducidad corta (el fichero se sirve directo desde
// Cloudflare, sin pasar por nuestro servidor). En desarrollo, sin credenciales
// R2, se sirve el fichero local a través de Payload.
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { Media } from '@/payload/payload-types'

const SIGNED_URL_TTL_SECONDS = 300 // 5 min: suficiente para iniciar la descarga
const INLINE_TTL_SECONDS = 3 * 60 * 60 // audio: debe sobrevivir a la escucha completa

function r2Client(): S3Client | null {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) return null
  return new S3Client({
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    region: 'auto',
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  })
}

/**
 * URL para un fichero de la colección media.
 * - `attachment` (por defecto): descarga con el nombre original, caducidad corta.
 * - `inline`: reproducción en la página (audio), caducidad larga para que la
 *   escucha completa y los saltos de posición no se corten.
 */
export async function downloadUrlFor(
  media: Media,
  disposition: 'attachment' | 'inline' = 'attachment',
): Promise<string | null> {
  const filename = media.filename
  if (!filename) return null

  const client = r2Client()
  if (!client) {
    // Desarrollo: Payload sirve el fichero desde disco local
    return media.url ?? `/api/media/file/${encodeURIComponent(filename)}`
  }

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: filename,
      ResponseContentDisposition:
        disposition === 'attachment'
          ? `attachment; filename="${filename.replace(/"/g, '')}"`
          : 'inline',
    }),
    { expiresIn: disposition === 'attachment' ? SIGNED_URL_TTL_SECONDS : INLINE_TTL_SECONDS },
  )
}
