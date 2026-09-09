// «El sector, al día» (v2 visual, decisión del propietario 9/09: curación
// honesta, nada de redacción sintética firmada): cada día 1-2 noticias
// destacadas del nicho, con imagen, etiqueta temática, la clave didáctica
// para el alumno y, si procede, el contenido relacionado del catálogo.
// El histórico no se borra: cronológico, lo más nuevo arriba.
import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { db } from '@/lib/db'
import { getPublishedContents, getPublishedCourses } from '@/features/content/service'
import { NEWS_SOURCES } from './sources'
import { parseRssItems, type ParsedItem } from './parse'
import { isRelevantHeadline } from './relevance'

const MAX_HEADLINES_TO_CURATE = 60
const MAX_SELECTED_PER_RUN = 2

export const NEWS_TOPICS = [
  'Morosidad',
  'Impagos',
  'Normativa',
  'Concursos',
  'Plazos de pago',
  'Macroeconomía',
  'Financiación',
  'Riesgo de crédito',
] as const

export interface SectorNewsItem {
  id: string
  title: string
  url: string
  source: string
  summary: string
  imageUrl: string | null
  topic: string | null
  relatedSlug: string | null
  relatedTitle: string | null
  relatedKind: string | null
  publishedAt: Date
}

export interface RefreshResult {
  ok: boolean
  added: number
  curator: 'claude' | 'keywords'
  sources: { name: string; items: number; error?: string }[]
}

export async function getSectorNews(limit = 30): Promise<SectorNewsItem[]> {
  return db.sectorNews.findMany({ orderBy: { publishedAt: 'desc' }, take: limit })
}

async function fetchAllSources(): Promise<{
  items: ParsedItem[]
  sources: RefreshResult['sources']
}> {
  const items: ParsedItem[] = []
  const sources: RefreshResult['sources'] = []
  for (const source of NEWS_SOURCES) {
    try {
      const res = await fetch(source.url, {
        // UA de navegador: algunos medios responden 403 a lectores RSS
        // que no lo parezcan — comprobado en el estreno (9/09).
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
          accept: 'application/rss+xml, application/xml, text/xml, */*',
        },
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      })
      if (!res.ok) {
        sources.push({ name: source.name, items: 0, error: `HTTP ${res.status}` })
        continue
      }
      const parsed = parseRssItems(await res.text(), source.name)
      items.push(...parsed)
      sources.push({ name: source.name, items: parsed.length })
    } catch (err) {
      sources.push({
        name: source.name,
        items: 0,
        error: err instanceof Error ? err.message : 'error de red',
      })
    }
  }
  return { items, sources }
}

interface CatalogRef {
  kind: 'course' | 'content'
  slug: string
  title: string
}

async function catalogRefs(): Promise<CatalogRef[]> {
  const [courses, contents] = await Promise.all([
    getPublishedCourses(),
    getPublishedContents({ limit: 50 }),
  ])
  return [
    ...courses.map((c) => ({ kind: 'course' as const, slug: c.slug ?? '', title: c.title })),
    ...contents.map((c) => ({ kind: 'content' as const, slug: c.slug ?? '', title: c.title })),
  ].filter((r) => r.slug)
}

interface CuratedPick {
  index: number
  summary: string
  topic: string | null
  related: CatalogRef | null
}

/** Claude como editor: elige las 1-2 noticias MÁS destacadas del día para un
 *  credit manager, escribe «la clave para ti», etiqueta el tema y sugiere
 *  contenido relacionado del catálogo. null → fallback por palabras clave. */
async function curateWithClaude(
  items: ParsedItem[],
  catalog: CatalogRef[],
): Promise<CuratedPick[] | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null
  try {
    const client = new Anthropic()
    const listado = items
      .map(
        (it, i) =>
          `${i}. [${it.source}] ${it.title}${it.description ? ` — ${it.description.slice(0, 180)}` : ''}`,
      )
      .join('\n')
    const catalogo = catalog.map((c, i) => `${i}. ${c.title}`).join('\n')
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2000,
      system:
        'Eres el editor de actualidad de la academia de Credit Management de Pere Brachfield. Tu público: responsables financieros y de cobros de empresas españolas. Solo te interesan noticias con impacto directo en su trabajo: morosidad, impagos, plazos de pago, concursos de acreedores, insolvencias, intereses de demora, crédito comercial, seguros de crédito, normativa de pagos y datos macro que afecten al cobro. Descarta política general, bolsa, deporte y cualquier titular sin relación clara. Eres MUY selectivo: solo lo verdaderamente destacado del día.',
      messages: [
        {
          role: 'user',
          content: `Titulares de hoy:\n\n${listado}\n\nCatálogo de la academia (cursos y piezas):\n\n${catalogo}\n\nElige como máximo ${MAX_SELECTED_PER_RUN} titulares realmente destacados (puede que ninguno lo sea). Para cada elegido:
- "clave": UNA frase didáctica que responda «¿por qué te importa esto si gestionas el crédito de tu empresa?» — concreta, sin repetir el titular.
- "tema": una etiqueta exacta de esta lista: ${NEWS_TOPICS.join(' · ')}
- "rel": el número del elemento del catálogo que más ayude a profundizar en el tema, o -1 si ninguno encaja de verdad.

Responde SOLO con un array JSON: [{"i": <número del titular>, "clave": "...", "tema": "...", "rel": <número o -1>}]. Si ninguno es destacado, responde [].`,
        },
      ],
    })
    const text = response.content.find((b) => b.type === 'text')?.text ?? ''
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end <= start) return null
    const parsed = JSON.parse(text.slice(start, end + 1)) as {
      i: number
      clave?: string
      tema?: string
      rel?: number
    }[]
    if (!Array.isArray(parsed)) return null
    return parsed
      .filter((p) => Number.isInteger(p.i) && p.i >= 0 && p.i < items.length)
      .slice(0, MAX_SELECTED_PER_RUN)
      .map((p) => ({
        index: p.i,
        summary: String(p.clave ?? '').slice(0, 300),
        topic:
          NEWS_TOPICS.find((t) => t.toLowerCase() === String(p.tema ?? '').toLowerCase()) ?? null,
        related:
          typeof p.rel === 'number' && p.rel >= 0 && p.rel < catalog.length
            ? (catalog[p.rel] ?? null)
            : null,
      }))
  } catch (err) {
    console.error('[sector-news] curación con Claude falló:', err)
    return null
  }
}

/** Ejecuta una pasada completa: recoger → curar → guardar. El histórico no
 *  se poda: la sección es un archivo cronológico. */
export async function refreshSectorNews(): Promise<RefreshResult> {
  const { items: all, sources } = await fetchAllSources()

  // sin duplicar lo ya publicado en la sección
  const known = new Set(
    (
      await db.sectorNews.findMany({
        where: { url: { in: all.map((i) => i.url) } },
        select: { url: true },
      })
    ).map((r) => r.url),
  )
  const fresh = all.filter((i) => !known.has(i.url)).slice(0, MAX_HEADLINES_TO_CURATE)

  let selected: { item: ParsedItem; pick: Omit<CuratedPick, 'index'> }[] = []
  let curator: RefreshResult['curator'] = 'keywords'
  if (fresh.length > 0) {
    const curated = await curateWithClaude(fresh, await catalogRefs())
    if (curated) {
      curator = 'claude'
      selected = curated.map((c) => ({ item: fresh[c.index]!, pick: c }))
    } else {
      selected = fresh
        .filter((i) => isRelevantHeadline(i.title))
        .slice(0, MAX_SELECTED_PER_RUN)
        .map((item) => ({ item, pick: { summary: '', topic: null, related: null } }))
    }
  }

  for (const { item, pick } of selected) {
    await db.sectorNews.upsert({
      where: { url: item.url },
      create: {
        title: item.title,
        url: item.url,
        source: item.source,
        summary: pick.summary,
        imageUrl: item.imageUrl,
        topic: pick.topic,
        relatedSlug: pick.related?.slug ?? null,
        relatedTitle: pick.related?.title ?? null,
        relatedKind: pick.related?.kind ?? null,
        publishedAt: item.publishedAt,
      },
      update: {},
    })
  }

  return { ok: true, added: selected.length, curator, sources }
}
