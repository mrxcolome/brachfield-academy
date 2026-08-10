import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Admins } from '@/payload/collections/admins'
import { Categories, Tags } from '@/payload/collections/taxonomy'
import { Media } from '@/payload/collections/media'
import { Contents } from '@/payload/collections/contents'
import { Courses } from '@/payload/collections/courses'
import { Events } from '@/payload/collections/events'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: 'admins',
    meta: { titleSuffix: ' · Brachfield Academy' },
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
})
