import { describe, expect, it } from 'vitest'
import { parseRssItems, extractArticleImage } from '@/features/sector-news/parse'
import { isRelevantHeadline } from '@/features/sector-news/relevance'

const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Economía</title>
  <item>
    <title><![CDATA[La morosidad empresarial sube un 4% en el tercer trimestre]]></title>
    <link>https://ejemplo.es/morosidad-sube</link>
    <pubDate>Wed, 09 Sep 2026 08:00:00 +0200</pubDate>
  </item>
  <item>
    <title>Resultados del f&uacute;tbol de anoche</title>
    <link>https://ejemplo.es/futbol</link>
    <pubDate>Wed, 09 Sep 2026 07:00:00 +0200</pubDate>
  </item>
  <item>
    <title>Sin enlace válido</title>
    <link>relativo/roto</link>
    <pubDate>Wed, 09 Sep 2026 06:00:00 +0200</pubDate>
  </item>
</channel></rss>`

describe('parseRssItems', () => {
  it('extrae título (CDATA), enlace y fecha, y descarta items rotos', () => {
    const items = parseRssItems(RSS, 'Ejemplo')
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      title: 'La morosidad empresarial sube un 4% en el tercer trimestre',
      url: 'https://ejemplo.es/morosidad-sube',
      source: 'Ejemplo',
    })
    expect(items[0]!.publishedAt.toISOString()).toBe('2026-09-09T06:00:00.000Z')
  })
  it('devuelve vacío ante XML sin items', () => {
    expect(parseRssItems('<rss></rss>', 'X')).toEqual([])
  })
})

describe('isRelevantHeadline', () => {
  it('acepta titulares del nicho, con y sin tildes', () => {
    expect(isRelevantHeadline('El Gobierno revisa los intereses de demora')).toBe(true)
    expect(isRelevantHeadline('Récord de concursos de acreedores en España')).toBe(true)
    expect(isRelevantHeadline('La morosidad baja por primera vez en dos años')).toBe(true)
  })
  it('descarta titulares fuera del nicho', () => {
    expect(isRelevantHeadline('El Real Madrid gana la Champions')).toBe(false)
    expect(isRelevantHeadline('Nueva subida del precio de la vivienda')).toBe(false)
  })
})

describe('extractArticleImage', () => {
  it('saca og:image con property antes de content', () => {
    const html = '<head><meta property="og:image" content="https://m.io/foto.jpg"/></head>'
    expect(extractArticleImage(html)).toBe('https://m.io/foto.jpg')
  })

  it('saca og:image con content antes de property y decodifica &amp;', () => {
    const html = '<meta content="https://m.io/f.jpg?w=1200&amp;h=630" property="og:image:url">'
    expect(extractArticleImage(html)).toBe('https://m.io/f.jpg?w=1200&h=630')
  })

  it('cae a twitter:image y devuelve null si no hay nada', () => {
    expect(extractArticleImage('<meta name="twitter:image" content="https://m.io/tw.png">')).toBe(
      'https://m.io/tw.png',
    )
    expect(extractArticleImage('<html><body>sin metas</body></html>')).toBeNull()
  })
})
