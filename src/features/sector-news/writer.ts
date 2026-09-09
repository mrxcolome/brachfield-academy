// El redactor: convierte la actualidad del sector en una pieza «Actualidad»
// del catálogo escrita en la voz de Pere Brachfield, y la publica.
// Regla de oro anti-invención: la crónica solo puede apoyarse en los hechos
// que traen el titular y la entradilla de la fuente, que queda citada al pie.
import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { cms } from '@/lib/cms'
import type { ParsedItem } from './parse'

// GUÍA DE ESTILO destilada de artículos reales del blog de Pere
// (perebrachfield.com, muestras aportadas por el propietario el 9/09/2026:
// «Las principales causas de los impagos de facturas» y «Un cambio de
// criterio del Tribunal Supremo reduce… la prescripción»).
const PERE_STYLE = `Escribes como Pere Brachfield — abogado y la máxima autoridad en morosología y credit management de España — para el blog de su academia. Imita fielmente su voz real:
- Tono sobrio, didáctico y profesional; nunca sensacionalista ni coloquial. Frases bien construidas, algunas largas y explicativas, seguidas de una reformulación clarificadora.
- Sus conectores característicos (úsalos con naturalidad, no todos a la vez): «Ahora bien», «Sin embargo», «Dicho de otro modo», «En otras palabras», «Así pues», «Por consiguiente», «Consecuentemente», «Asimismo», «Igualmente», «En definitiva», «Lo cierto es que», «Salta a la vista».
- Didactismo jurídico: cuando aparece un concepto técnico o legal, lo explica con precisión (artículo y norma si procede) y distingue siempre lo que dice la ley de la interpretación o de su opinión. Le gusta el apunte histórico o etimológico breve y, muy de vez en cuando, una analogía memorable.
- Orientación práctica: el análisis desemboca en las «consecuencias prácticas» y en qué debe revisar o hacer el lector en su empresa (condiciones de venta, plazos, contratos, gestión de cobro).
- Habla en primera persona con mesura cuando aporta criterio profesional («a mi juicio», «mi recomendación es»).
- Estructura: abre situando el hecho y su porqué, desarrolla ordenadamente, y cierra en modo conclusión práctica («En definitiva…»).`

export interface GeneratedArticle {
  titular: string
  entradilla: string
  parrafos: string[]
  categoria: string
  fuenteNombre: string
  fuenteUrl: string
}

/** Redacta (o decide no redactar) la crónica del día a partir de los
 *  titulares frescos. Devuelve null si no hay historia que lo merezca. */
export async function generateArticle(
  items: ParsedItem[],
  categories: string[],
): Promise<GeneratedArticle | null> {
  if (!process.env.ANTHROPIC_API_KEY || items.length === 0) return null
  const client = new Anthropic()
  const listado = items
    .map(
      (it, i) =>
        `${i}. [${it.source}] ${it.title}\n   ${it.description || '(sin entradilla)'}\n   ${it.url}`,
    )
    .join('\n')
  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 3000,
      system: PERE_STYLE,
      messages: [
        {
          role: 'user',
          content: `Noticias de hoy en la prensa económica:\n\n${listado}\n\nSi UNA de estas noticias es de verdad relevante para responsables de crédito y cobro de empresas españolas (morosidad, impagos, plazos de pago, concursos, demora, normativa de pagos), redacta la crónica del día para el blog de la academia. Si ninguna lo merece, responde exactamente: null

Reglas estrictas:
- Basarte SOLO en los hechos del titular y la entradilla elegidos. PROHIBIDO inventar cifras, fechas, declaraciones o detalles que no aparezcan ahí. Puedes añadir contexto general de morosología que sea conocimiento asentado (leyes vigentes, plazos legales) y tu recomendación práctica.
- Titular propio (no copiar el de la fuente), estilo Pere.
- Entradilla de 1-2 frases (aparece en la tarjeta).
- 3 o 4 párrafos de 60-110 palabras, terminando con la recomendación práctica.
- Elegir la categoría más adecuada de esta lista exacta: ${categories.join(' · ')}

Responde SOLO con un objeto JSON:
{"titular": "...", "entradilla": "...", "parrafos": ["...", "..."], "categoria": "...", "fuente": {"nombre": "...", "url": "..."}}`,
        },
      ],
    })
    const text = response.content.find((b) => b.type === 'text')?.text.trim() ?? ''
    if (text === 'null' || text.toLowerCase().startsWith('null')) return null
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end <= start) return null
    const raw = JSON.parse(text.slice(start, end + 1)) as {
      titular?: string
      entradilla?: string
      parrafos?: string[]
      categoria?: string
      fuente?: { nombre?: string; url?: string }
    }
    if (
      !raw.titular ||
      !raw.entradilla ||
      !Array.isArray(raw.parrafos) ||
      raw.parrafos.length === 0
    )
      return null
    const fuenteUrl = raw.fuente?.url ?? ''
    // la fuente citada debe ser una de las noticias reales del listado
    const match = items.find((it) => it.url === fuenteUrl)
    if (!match) return null
    return {
      titular: raw.titular.slice(0, 180),
      entradilla: raw.entradilla.slice(0, 400),
      parrafos: raw.parrafos.map((p) => String(p)).slice(0, 5),
      categoria: raw.categoria ?? '',
      fuenteNombre: raw.fuente?.nombre ?? match.source,
      fuenteUrl,
    }
  } catch (err) {
    console.error('[sector-news] redacción falló:', err)
    return null
  }
}

// ── Publicación en el catálogo ─────────────────────────────────

function textNode(text: string) {
  return { type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }
}

function paragraph(children: unknown[]) {
  return { type: 'paragraph', version: 1, children, direction: 'ltr', format: '', indent: 0 }
}

/** Cuerpo lexical: los párrafos de la crónica + la fuente citada con enlace. */
export function articleToLexical(article: GeneratedArticle) {
  const children: unknown[] = article.parrafos.map((p) => paragraph([textNode(p.trim())]))
  children.push(
    paragraph([
      textNode('Fuente: '),
      {
        type: 'link',
        version: 3,
        fields: { url: article.fuenteUrl, newTab: true, linkType: 'custom' },
        children: [textNode(article.fuenteNombre)],
        direction: 'ltr',
        format: '',
        indent: 0,
      },
    ]),
  )
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children,
    },
  }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

/** Publica la crónica como contenido «Actualidad» (portada de marca
 *  automática vía covers). Devuelve título y slug de la pieza. */
export async function publishArticle(
  article: GeneratedArticle,
): Promise<{ title: string; slug: string }> {
  const payload = await cms()

  const cats = await payload.find({ collection: 'categories', limit: 50 })
  const category =
    cats.docs.find((c) => c.name.toLowerCase() === article.categoria.toLowerCase()) ??
    cats.docs[0] ??
    null

  const base = slugify(article.titular) || 'actualidad'
  let slug = base
  for (let n = 2; n < 20; n++) {
    const clash = await payload.find({
      collection: 'contents',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    if (clash.docs.length === 0) break
    slug = `${base}-${n}`
  }

  const doc = await payload.create({
    collection: 'contents',
    draft: false,
    overrideAccess: true,
    data: {
      _status: 'published',
      title: article.titular,
      slug,
      excerpt: article.entradilla,
      contentType: 'NEWS',
      premium: true,
      categories: category ? [category.id] : [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: articleToLexical(article) as any,
      publishedAt: new Date().toISOString(),
    },
  })
  return { title: doc.title, slug: doc.slug ?? slug }
}
