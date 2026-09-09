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
import { parseRssItems, extractArticleImage, type ParsedItem } from './parse'
import { isRelevantHeadline } from './relevance'

const MAX_HEADLINES_TO_CURATE = 60
const MAX_SELECTED_PER_RUN = 2
// Frescura: algunos RSS arrastran piezas viejas — una «noticia del día»
// nunca puede tener más de una semana (sufrido en el estreno: un artículo
// de febrero se coló en el tablón).
const MAX_ITEM_AGE_DAYS = 7

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
  /** Noticias antiguas guardadas sin imagen a las que se les recuperó la real. */
  repaired: number
  /** Noticias antiguas sin etiqueta a las que se les puso tema y clave. */
  labeled: number
  curator: 'claude' | 'keywords'
  sources: { name: string; items: number; error?: string }[]
}

export async function getSectorNews(limit = 30, topic?: string): Promise<SectorNewsItem[]> {
  return db.sectorNews.findMany({
    where: topic ? { topic } : undefined,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

/** Temas con alguna noticia publicada, en el orden canónico de NEWS_TOPICS. */
export async function getSectorNewsTopics(): Promise<string[]> {
  const rows = await db.sectorNews.findMany({
    where: { topic: { not: null } },
    distinct: ['topic'],
    select: { topic: true },
  })
  const present = new Set(rows.map((r) => r.topic))
  return NEWS_TOPICS.filter((t) => present.has(t))
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

const FETCH_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  accept: 'text/html, application/xhtml+xml, */*',
}

/** Visita el artículo y saca su imagen principal (og:image) — para noticias
 *  cuyo RSS no la trae. Nunca lanza; timeout corto para no comer el cron. */
async function fetchArticleImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return extractArticleImage(await res.text())
  } catch {
    return null
  }
}

const EDITOR_SYSTEM =
  'Eres el editor de actualidad de la academia de Credit Management de Pere Brachfield. Tu público: responsables financieros y de cobros de empresas españolas. Solo te interesan noticias con impacto directo en su trabajo: morosidad, impagos, plazos de pago, concursos de acreedores, insolvencias, intereses de demora, crédito comercial, seguros de crédito, normativa de pagos y datos macro que afecten al cobro. Descarta política general, bolsa, deporte y cualquier titular sin relación clara. Eres MUY selectivo: solo lo verdaderamente destacado del día.'

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
      system: EDITOR_SYSTEM,
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

/** Autocuración editorial: noticias ya publicadas sin etiqueta temática (las
 *  de la versión inicial del tablón, o de una pasada sin IA) — Claude les pone
 *  tema y, si les falta, la clave didáctica. Nunca lanza; 0 si no hay clave API. */
async function backfillCuration(): Promise<number> {
  if (!process.env.ANTHROPIC_API_KEY) return 0
  const rows = await db.sectorNews.findMany({
    where: { topic: null },
    orderBy: { publishedAt: 'desc' },
    take: 6,
  })
  if (rows.length === 0) return 0
  try {
    const client = new Anthropic()
    const listado = rows.map((r, i) => `${i}. [${r.source}] ${r.title}`).join('\n')
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1500,
      system: EDITOR_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Estas noticias ya están publicadas en el tablón de la academia, pero sin etiqueta temática ni clave:\n\n${listado}\n\nPara CADA una:
- "tema": una etiqueta exacta de esta lista: ${NEWS_TOPICS.join(' · ')}
- "clave": UNA frase didáctica que responda «¿por qué te importa esto si gestionas el crédito de tu empresa?» — concreta, sin repetir el titular.

Responde SOLO con un array JSON: [{"i": <número>, "tema": "...", "clave": "..."}].`,
        },
      ],
    })
    const text = response.content.find((b) => b.type === 'text')?.text ?? ''
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end <= start) return 0
    const parsed = JSON.parse(text.slice(start, end + 1)) as {
      i: number
      tema?: string
      clave?: string
    }[]
    if (!Array.isArray(parsed)) return 0
    let labeled = 0
    for (const p of parsed) {
      if (!Number.isInteger(p.i) || p.i < 0 || p.i >= rows.length) continue
      const row = rows[p.i]!
      const topic =
        NEWS_TOPICS.find((t) => t.toLowerCase() === String(p.tema ?? '').toLowerCase()) ?? null
      if (!topic) continue
      await db.sectorNews.update({
        where: { id: row.id },
        data: {
          topic,
          summary: row.summary || String(p.clave ?? '').slice(0, 300),
        },
      })
      labeled++
    }
    return labeled
  } catch (err) {
    console.error('[sector-news] etiquetado de noticias antiguas falló:', err)
    return 0
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
  const maxAge = MAX_ITEM_AGE_DAYS * 24 * 60 * 60 * 1000
  const fresh = all
    .filter((i) => !known.has(i.url) && Date.now() - i.publishedAt.getTime() < maxAge)
    .slice(0, MAX_HEADLINES_TO_CURATE)

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
    const imageUrl = item.imageUrl ?? (await fetchArticleImage(item.url))
    await db.sectorNews.upsert({
      where: { url: item.url },
      create: {
        title: item.title,
        url: item.url,
        source: item.source,
        summary: pick.summary,
        imageUrl,
        topic: pick.topic,
        relatedSlug: pick.related?.slug ?? null,
        relatedTitle: pick.related?.title ?? null,
        relatedKind: pick.related?.kind ?? null,
        publishedAt: item.publishedAt,
      },
      update: {},
    })
  }

  // Autocuración: noticias guardadas sin imagen (p. ej. las de la versión
  // anterior del tablón) — se intenta recuperar la real del artículo.
  const missing = await db.sectorNews.findMany({
    where: { imageUrl: null },
    orderBy: { publishedAt: 'desc' },
    take: 6,
    select: { id: true, url: true },
  })
  const found = await Promise.all(missing.map((row) => fetchArticleImage(row.url)))
  let repaired = 0
  for (const [i, row] of missing.entries()) {
    const img = found[i]
    if (!img) continue
    await db.sectorNews.update({ where: { id: row.id }, data: { imageUrl: img } })
    repaired++
  }

  const labeled = await backfillCuration()

  return { ok: true, added: selected.length, repaired, labeled, curator, sources }
}
