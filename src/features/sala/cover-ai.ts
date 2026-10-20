// Portada creada con IA para las piezas de la Sala (pedido del propietario 20/10/2026):
// Claude lee la pieza y escribe la descripción de la foto; Magnific la genera. Necesita
// ANTHROPIC_API_KEY y MAGNIFIC_API_KEY; sin ellas la Sala solo ofrece subir una imagen.
import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { magnificDisponible } from './magnific'

export const portadaIADisponible = () =>
  Boolean(process.env.ANTHROPIC_API_KEY) && magnificDisponible()

const SYSTEM = `Eres el director de arte de Brachfield Academy, la academia online de Pere Brachfield sobre
credit management, prevención de impagos y recobro para empresas españolas. Escribes descripciones
(prompts) de fotografías de portada para un generador de imágenes. Respondes SOLO con el prompt, en
inglés, en un único párrafo, sin comillas ni explicaciones.`

export async function describirPortada(piece: {
  concept: string
  format: string
  title: string
  excerpt: string
  text: string
  indicaciones?: string
}): Promise<string> {
  const client = new Anthropic()
  const res = await client.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 1200,
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: `Escribe el prompt de la FOTO DE PORTADA de esta pieza de la academia. Debe ilustrar su idea
central con una escena concreta y creíble del mundo de la empresa española (oficinas, despachos,
reuniones, facturas, almacenes, comercios, bancos…), coherente con lo que cuenta, nunca genérica.

Estilo fijo de la serie (inclúyelo): fotografía documental editorial realista, luz natural cálida,
tonos cálidos con acentos azul marino, poca profundidad de campo, composición horizontal 16:9 con
aire. Personas, si aparecen, de espaldas, de perfil o desenfocadas (nunca caras protagonistas).

Prohibido y debe decirlo el prompt: sin texto, sin letras, sin números legibles, sin logotipos,
sin marcas de agua, sin pantallas con texto.

Tipo de pieza: ${piece.concept} (formato ${piece.format})
Título: «${piece.title}»
Resumen: «${piece.excerpt}»
${piece.text ? `<texto>\n${piece.text.slice(0, 12000)}\n</texto>` : ''}
${piece.indicaciones ? `Indicaciones de quien la publica (respétalas): ${piece.indicaciones}` : ''}`,
      },
    ],
  })
  const text = res.content.find((b) => b.type === 'text')?.text.trim() ?? ''
  if (!text) throw new Error('sin prompt')
  return text
}
