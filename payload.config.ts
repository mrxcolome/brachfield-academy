import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { Admins } from '@/payload/collections/admins'
import { Categories, Tags } from '@/payload/collections/taxonomy'
import { Media } from '@/payload/collections/media'
import { Contents } from '@/payload/collections/contents'
import { Courses } from '@/payload/collections/courses'
import { Events } from '@/payload/collections/events'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// R2 (Cloudflare) solo cuando hay credenciales (producción). En desarrollo
// los uploads siguen en disco local — el sandbox no alcanza la red de R2.
const r2Configured = Boolean(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET,
)

export default buildConfig({
  admin: {
    user: 'admins',
    meta: { titleSuffix: ' · Brachfield Academy' },
    components: {
      graphics: {
        Logo: '@/payload/branding#Logo',
        Icon: '@/payload/branding#Icon',
      },
    },
  },
  collections: [Admins, Categories, Tags, Media, Contents, Courses, Events],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  db: postgresAdapter({
    // Mismo Postgres que la app, schema separado (DATABASE.md)
    schemaName: 'payload',
    pool: { connectionString: process.env.DATABASE_URL },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload/payload-types.ts'),
  },
  upload: { limits: { fileSize: 25_000_000 } },
  plugins: r2Configured
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.R2_BUCKET as string,
          config: {
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
          },
        }),
      ]
    : [],
})
