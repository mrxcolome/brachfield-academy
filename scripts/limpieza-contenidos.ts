// Borra contenidos de ejemplo del CMS de producción SIEMPRE vía Payload (nunca SQL directo:
// dejaría versiones huérfanas). Lo lanza el workflow «Limpieza de contenidos de ejemplo».
// Uso: npx tsx scripts/limpieza-contenidos.ts "courses=1,2;contents=3,4;events=5"
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const ALLOWED = ['courses', 'contents', 'events'] as const
type Slug = (typeof ALLOWED)[number]

function parse(arg: string): [Slug, number[]][] {
  return arg
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [slug, ids] = part.split('=')
      if (!ALLOWED.includes(slug as Slug)) throw new Error(`Colección no permitida: ${slug}`)
      return [
        slug as Slug,
        (ids ?? '')
          .split(',')
          .map((x) => Number(x.trim()))
          .filter(Number.isInteger),
      ]
    })
}

async function main() {
  const orders = parse(process.argv[2] ?? '')
  if (!orders.length) throw new Error('Sin órdenes de borrado')
  const payload = await getPayload({ config })
  for (const [collection, ids] of orders) {
    for (const id of ids) {
      try {
        const doc = await payload.delete({ collection, id, overrideAccess: true })
        console.log(`${collection} #${id} BORRADO · ${(doc as { title?: string }).title ?? ''}`)
      } catch (e) {
        console.log(`${collection} #${id} NO borrado: ${(e as Error).message}`)
      }
    }
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
