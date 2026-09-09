// Parser RSS mínimo y puro (sin dependencias): extrae título, enlace y fecha
// de los <item> de un canal RSS 2.0. Suficiente para titulares; cualquier
// item malformado se descarta en silencio.

export interface ParsedItem {
  title: string
  url: string
  source: string
  publishedAt: Date
  /** Entradilla del RSS (texto plano, recortado): materia prima del redactor. */
  description: string
}

function unwrap(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, '')
    .trim()
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))
  return m?.[1] != null ? unwrap(m[1]) : null
}

export function parseRssItems(xml: string, source: string): ParsedItem[] {
  const items: ParsedItem[] = []
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
    const block = m[0]
    const title = tag(block, 'title')
    const url = tag(block, 'link')
    const dateRaw = tag(block, 'pubDate') ?? tag(block, 'dc:date')
    if (!title || !url || !url.startsWith('http')) continue
    const publishedAt = dateRaw ? new Date(dateRaw) : new Date()
    if (Number.isNaN(publishedAt.getTime())) continue
    const description = (tag(block, 'description') ?? '').slice(0, 500)
    items.push({ title, url, source, publishedAt, description })
  }
  return items
}
