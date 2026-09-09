// El tablón «El sector, al día»: recogida de fuentes RSS + curación diaria.
// Con ANTHROPIC_API_KEY, Claude hace de editor (selecciona lo relevante para
// un credit manager y escribe un resumen de una línea); sin ella, el filtro
// por palabras clave (relevance.ts) mantiene el tablón digno.
import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { db } from '@/lib/db'
import { NEWS_SOURCES } from './sources'
import { parseRssItems, type ParsedItem } from './parse'
import { isRelevantHeadline } from './relevance'
import { generateArticle, publishArticle, hasArticleToday } from './writer'
import { getCategories } from '@/features/content/service'

const MAX_HEADLINES_TO_CURATE = 60
const MAX_SELECTED_PER_RUN = 6
const PRUNE_AFTER_DAYS = 45

export interface SectorNewsItem {
  id: string
  title: string
  url: string
  source: string
  summary: string
  publishedAt: Date
}

export interface RefreshResult {
  ok: boolean
  added: number
  curator: 'claude' | 'keywords'
  sources: { name: string; items: number; error?: string }[]
  /** Crónica del día redactada y publicada (o null si hoy no la hubo). */
  article: { title: string; slug: string } | null
}

export async function getSectorNews(limit = 10): Promise<SectorNewsItem[]> {
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
        // UA de navegador: algunos medios (p. ej. El Economista) responden 403
        // a lectores RSS que no lo parezcan — comprobado en el estreno (9/09).
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

/** Claude como editor: devuelve los índices elegidos con su resumen de una
 *  línea, o null si no hay clave o la llamada falla (→ fallback keywords). */
async function curateWithClaude(
  items: ParsedItem[],
): Promise<{ index: number; summary: string }[] | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null
  try {
    const client = new Anthropic()
    const listado = items.map((it, i) => `${i}. [${it.source}] ${it.title}`).join('\n')
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2000,
      system:
        'Eres el editor del tablón de actualidad de una academia de Credit Management dirigida por Pere Brachfield. Tu público: responsables financieros y de cobros de empresas españolas. Solo te interesan noticias con impacto directo en su trabajo: morosidad, impagos, plazos de pago, concursos de acreedores, insolvencias, intereses de demora, crédito comercial, seguros de crédito, normativa de pagos (Ley Crear y Crecer, factura electrónica) y datos macro de morosidad. Descarta política general, bolsa, deporte, motor y cualquier titular sin relación clara.',
      messages: [
        {
          role: 'user',
          content: `Titulares de hoy:\n\n${listado}\n\nElige como máximo ${MAX_SELECTED_PER_RUN} titulares relevantes (puede que ninguno lo sea) y escribe para cada uno un resumen de UNA frase, neutro y útil, sin repetir el titular. Responde SOLO con un array JSON: [{"i": <número del titular>, "resumen": "<frase>"}]. Si ninguno es relevante, responde [].`,
        },
      ],
    })
    const text = response.content.find((b) => b.type === 'text')?.text ?? ''
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end <= start) return null
    const parsed = JSON.parse(text.slice(start, end + 1)) as { i: number; resumen: string }[]
    if (!Array.isArray(parsed)) return null
    return parsed
      .filter((p) => Number.isInteger(p.i) && p.i >= 0 && p.i < items.length)
      .slice(0, MAX_SELECTED_PER_RUN)
      .map((p) => ({ index: p.i, summary: String(p.resumen ?? '').slice(0, 300) }))
  } catch (err) {
    console.error('[sector-news] curación con Claude falló:', err)
    return null
  }
}

/** Ejecuta una pasada completa: recoger → curar → guardar → podar. */
export async function refreshSectorNews(): Promise<RefreshResult> {
  const { items: all, sources } = await fetchAllSources()

  // sin duplicar lo ya publicado en el tablón
  const known = new Set(
    (
      await db.sectorNews.findMany({
        where: { url: { in: all.map((i) => i.url) } },
        select: { url: true },
      })
    ).map((r) => r.url),
  )
  const fresh = all.filter((i) => !known.has(i.url)).slice(0, MAX_HEADLINES_TO_CURATE)

  let selected: { item: ParsedItem; summary: string }[] = []
  let curator: RefreshResult['curator'] = 'keywords'
  if (fresh.length > 0) {
    const curated = await curateWithClaude(fresh)
    if (curated) {
      curator = 'claude'
      selected = curated.map((c) => ({ item: fresh[c.index]!, summary: c.summary }))
    } else {
      selected = fresh
        .filter((i) => isRelevantHeadline(i.title))
        .slice(0, MAX_SELECTED_PER_RUN)
        .map((item) => ({ item, summary: '' }))
    }
  }

  for (const { item, summary } of selected) {
    await db.sectorNews.upsert({
      where: { url: item.url },
      create: {
        title: item.title,
        url: item.url,
        source: item.source,
        summary,
        publishedAt: item.publishedAt,
      },
      update: {},
    })
  }

  await db.sectorNews.deleteMany({
    where: { publishedAt: { lt: new Date(Date.now() - PRUNE_AFTER_DAYS * 86400000) } },
  })

  // La crónica del día «como Pere»: máximo una al día (guardia en el
  // catálogo). Entrada: los titulares frescos de esta pasada o, si no los
  // hay, lo recogido en el tablón durante las últimas 24 horas — así el
  // botón puede estrenar la crónica aunque los titulares ya estén guardados.
  let article: RefreshResult['article'] = null
  if (process.env.ANTHROPIC_API_KEY && !(await hasArticleToday())) {
    let input: ParsedItem[] = selected.map((s) => s.item)
    if (input.length === 0) {
      const recent = await db.sectorNews.findMany({
        where: { fetchedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        orderBy: { publishedAt: 'desc' },
        take: 12,
      })
      input = recent.map((r) => ({
        title: r.title,
        url: r.url,
        source: r.source,
        publishedAt: r.publishedAt,
        description: r.summary,
      }))
    }
    if (input.length > 0) {
      const categories = (await getCategories()).map((c) => c.name)
      const generated = await generateArticle(input, categories)
      if (generated) article = await publishArticle(generated)
    }
  }

  return { ok: true, added: selected.length, curator, sources, article }
}
