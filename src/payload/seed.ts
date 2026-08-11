// Seed editorial de Payload (Fase 7). Idempotente: borra y recrea el
// contenido seed. Ejecutar: npx tsx src/payload/seed.ts
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../../payload.config'
import { courses as catalogCourses } from '../features/content/catalog'

const seedDirname = path.dirname(fileURLToPath(import.meta.url))

// Rich text mínimo (Lexical): párrafos desde strings
function rt(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1 }],
      })),
    },
  }
}

const CATEGORIES = [
  'Credit Management',
  'Prevención de impagos',
  'Riesgo de crédito',
  'Recobro de impagados',
  'Negociación',
  'Legislación',
  'Gestión financiera',
  'Organización del departamento',
  'Clientes morosos',
  'Instrumentos de cobro',
  'Casos prácticos',
]

const TAGS = [
  'factura vencida',
  'burofax',
  'prescripción',
  'DSO',
  'moroso',
  'pago',
  'negociación',
  'riesgo',
  'crédito',
  'cliente',
  'SEPA',
  'confirming',
  'factoring',
  'judicial',
]

const VIDEOS: { title: string; slug: string; duration: string; excerpt: string }[] = [
  {
    title: 'Cómo responder a "la factura está pendiente de aprobación"',
    slug: 'responder-factura-pendiente-aprobacion',
    duration: '8 min',
    excerpt:
      'La excusa más repetida en los departamentos de cobro, desmontada con tres preguntas concretas.',
  },
  {
    title: 'Cuándo enviar un burofax',
    slug: 'cuando-enviar-un-burofax',
    duration: '6 min',
    excerpt:
      'Qué certifica un burofax, cuánto cuesta, qué debe decir y qué efectos tiene sobre la prescripción.',
  },
  {
    title: 'Cómo calcular intereses de demora',
    slug: 'como-calcular-intereses-de-demora',
    duration: '9 min',
    excerpt: 'Tipo legal, tipo pactado y la Ley 3/2004, con ejemplos numéricos reales.',
  },
  {
    title: 'Qué hacer si el cliente pide otro aplazamiento',
    slug: 'cliente-pide-otro-aplazamiento',
    duration: '7 min',
    excerpt:
      'El segundo aplazamiento es señal de alarma: criterios para decidir y contrapartidas que pedir.',
  },
  {
    title: 'Primer contacto con un cliente moroso',
    slug: 'primer-contacto-cliente-moroso',
    duration: '11 min',
    excerpt: 'Los primeros 15 días marcan la probabilidad de cobro. Guion de la primera llamada.',
  },
  {
    title: 'Las siete excusas más frecuentes de un moroso',
    slug: 'siete-excusas-frecuentes-moroso',
    duration: '10 min',
    excerpt:
      'Del "no me ha llegado la factura" al "ahora no puedo pagar": una respuesta profesional para cada una.',
  },
  {
    title: 'Cómo detectar señales de riesgo antes del impago',
    slug: 'senales-riesgo-antes-impago',
    duration: '8 min',
    excerpt:
      'Pedidos que crecen con pagos que se alargan y otras cinco señales tempranas de deterioro.',
  },
  {
    title: 'Cuándo dejar de negociar una deuda',
    slug: 'cuando-dejar-de-negociar',
    duration: '9 min',
    excerpt:
      'Señales objetivas de que la negociación está agotada y cómo preparar el salto a la vía judicial.',
  },
]

const GUIDES: {
  title: string
  slug: string
  type: 'GUIDE' | 'CHECKLIST' | 'TEMPLATE'
  duration: string
  excerpt: string
  body: string[]
}[] = [
  {
    title: 'Checklist para prevenir impagos antes de vender',
    slug: 'checklist-prevenir-impagos-antes-de-vender',
    type: 'CHECKLIST',
    duration: '5 min',
    excerpt:
      'Once puntos de control para evaluar el riesgo de un cliente nuevo antes de concederle crédito comercial.',
    body: [
      'Antes de dar de alta a un cliente nuevo o ampliar su límite de crédito, repasa estos once puntos de control.',
      'Verificar datos registrales y solvencia · Consultar ficheros de morosidad · Solicitar referencias comerciales · Comprobar poderes de quien firma · Analizar cuentas anuales · Fijar un límite inicial prudente · Condiciones de pago por escrito · Medio de pago seguro · Cláusula de reserva de dominio · Revisión del límite a los 6 meses · Registrarlo todo en la ficha del cliente.',
    ],
  },
  {
    title: 'Guía: plazos de prescripción de deuda comercial',
    slug: 'guia-plazos-prescripcion-deuda',
    type: 'GUIDE',
    duration: '9 min',
    excerpt:
      'Cuándo prescribe cada tipo de deuda y cómo interrumpir la prescripción correctamente.',
    body: [
      'Con carácter general, la acción para reclamar deudas comerciales prescribe a los cinco años (art. 1964 CC), pero existen plazos especiales por sector y tipo de contrato.',
      'Cada reclamación fehaciente interrumpe la prescripción y reinicia el contador: por eso el burofax con certificación de texto es la herramienta clave para deudas antiguas.',
    ],
  },
  {
    title: 'Email de factura vencida',
    slug: 'plantilla-email-factura-vencida',
    type: 'TEMPLATE',
    duration: '2 min',
    excerpt:
      'Segunda comunicación, a los 15–20 días del vencimiento: tono firme, fecha concreta y consecuencias profesionales.',
    body: [
      'Asunto: Factura {nº} vencida — solicitud de fecha de pago.',
      'Pese a nuestro recordatorio del {fecha}, la factura {nº}, vencida el {fecha}, por {importe} €, continúa pendiente. Necesitamos que nos indique antes del {fecha límite} la fecha concreta de la transferencia.',
      'Le recordamos que el retraso devenga intereses de demora conforme a la Ley 3/2004 y que, de no recibir respuesta, suspenderemos nuevos suministros hasta regularizar la situación.',
    ],
  },
  {
    title: 'Cómo documentar un acuerdo de pago',
    slug: 'como-documentar-acuerdo-de-pago',
    type: 'GUIDE',
    duration: '7 min',
    excerpt:
      'Un acuerdo verbal no protege: qué debe contener el documento para que el acuerdo se cumpla o sea ejecutable.',
    body: [
      'Todo acuerdo de aplazamiento debe recogerse por escrito con: identificación de las partes y de la deuda, calendario de pagos con importes y fechas, reconocimiento de deuda expreso, garantías si las hay y cláusula de vencimiento anticipado por impago de un plazo.',
      'El reconocimiento de deuda firmado convierte una reclamación discutible en un título sólido para el proceso monitorio.',
    ],
  },
]

async function main() {
  const payload = await getPayload({ config })

  // Limpieza idempotente (solo datos seed, por slug conocido)
  for (const slug of ['contents', 'courses', 'events', 'media', 'tags', 'categories'] as const) {
    await payload.delete({ collection: slug, where: { id: { exists: true } } })
  }

  // Admin de DESARROLLO (nunca en producción: allí el primer usuario se
  // crea desde la pantalla de /admin con credenciales propias)
  if (process.env.SEED_DEV_ADMIN === '1') {
    const admins = await payload.find({ collection: 'admins', limit: 1 })
    if (admins.totalDocs === 0) {
      await payload.create({
        collection: 'admins',
        data: {
          name: 'Admin',
          email: 'admin@brachfieldacademy.test',
          password: 'brachfield-dev-2026',
          role: 'admin',
        },
      })
    }
  }

  // Taxonomía
  const catIds: Record<string, number> = {}
  const cat = (name: string): number[] => {
    const id = catIds[name]
    return id == null ? [] : [id]
  }
  for (const name of CATEGORIES) {
    const slug = name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
    const doc = await payload.create({ collection: 'categories', data: { name, slug } })
    catIds[name] = doc.id as number
  }
  for (const name of TAGS) {
    await payload.create({
      collection: 'tags',
      data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
    })
  }

  // Cursos (desde el catálogo del prototipo, publicados)
  const levelMap = {
    Iniciación: 'BEGINNER',
    Intermedio: 'INTERMEDIATE',
    Avanzado: 'ADVANCED',
  } as const
  // Categorías editoriales por curso (alimentan las recomendaciones, Fase 13)
  const COURSE_CATEGORIES: Record<string, string[]> = {
    'gestion-y-prevencion-de-impagados': ['Prevención de impagos', 'Credit Management'],
    'como-recuperar-un-impagado-paso-a-paso': ['Recobro de impagados', 'Clientes morosos'],
    'negociacion-avanzada-con-deudores': ['Negociación', 'Clientes morosos'],
    'marco-legal-de-la-morosidad-comercial': ['Legislación'],
    'analisis-de-riesgo-de-clientes': ['Riesgo de crédito'],
    'organizacion-del-departamento-de-credit-management': [
      'Organización del departamento',
      'Credit Management',
    ],
  }

  for (const c of catalogCourses) {
    await payload.create({
      collection: 'courses',
      draft: false,
      data: {
        _status: 'published',
        title: c.title,
        slug: c.slug,
        description: c.description,
        level: levelMap[c.level],
        duration: c.duration,
        objectives: c.learn.map((text) => ({ text })),
        categories: (COURSE_CATEGORIES[c.slug] ?? ['Credit Management']).flatMap(cat),
        publishedAt: new Date().toISOString(),
        modules: c.modules.map((m) => ({
          name: m.name,
          lessons: m.lessons.map((title) => ({
            title,
            lessonType: 'video' as const,
            duration: '10 min',
            body: rt(
              `Lección "${title}" del curso ${c.title}. El vídeo se añadirá al conectar Cloudflare Stream.`,
            ),
          })),
        })),
      },
    })
  }

  // Destacados de Explorar (el editor los cambia desde /admin con la casilla "featured")
  const FEATURED = new Set([
    'primer-contacto-cliente-moroso',
    'siete-excusas-frecuentes-moroso',
    'checklist-prevenir-impagos-antes-de-vender',
    'guia-plazos-prescripcion-deuda',
  ])

  const contentIdBySlug: Record<string, number> = {}

  // Vídeos cortos
  for (const v of VIDEOS) {
    const doc = await payload.create({
      collection: 'contents',
      draft: false,
      data: {
        _status: 'published',
        title: v.title,
        slug: v.slug,
        excerpt: v.excerpt,
        contentType: 'VIDEO',
        level: 'INTERMEDIATE',
        duration: v.duration,
        premium: true,
        featured: FEATURED.has(v.slug),
        categories: cat('Recobro de impagados'),
        body: rt(v.excerpt),
        publishedAt: new Date().toISOString(),
      },
    })
    contentIdBySlug[v.slug] = doc.id
  }

  // Guías, checklists y plantillas — con su PDF descargable (Fase 11)
  const PDF_BY_SLUG: Record<string, string> = {
    'checklist-prevenir-impagos-antes-de-vender': 'checklist-prevenir-impagos.pdf',
    'guia-plazos-prescripcion-deuda': 'guia-prescripcion-deuda.pdf',
    'plantilla-email-factura-vencida': 'plantilla-email-factura-vencida.pdf',
    'como-documentar-acuerdo-de-pago': 'guia-documentar-acuerdo-pago.pdf',
  }
  const assetsDir = path.resolve(seedDirname, 'seed-assets')

  for (const g of GUIDES) {
    let documentFile: number | undefined
    const pdf = PDF_BY_SLUG[g.slug]
    if (pdf) {
      const media = await payload.create({
        collection: 'media',
        filePath: path.join(assetsDir, pdf),
        data: { alt: g.title },
      })
      documentFile = media.id
    }
    const doc = await payload.create({
      collection: 'contents',
      draft: false,
      data: {
        _status: 'published',
        title: g.title,
        slug: g.slug,
        excerpt: g.excerpt,
        contentType: g.type,
        duration: g.duration,
        premium: true,
        featured: FEATURED.has(g.slug),
        categories: cat('Prevención de impagos'),
        body: rt(...g.body),
        publishedAt: new Date().toISOString(),
        ...(documentFile != null ? { documentFile } : {}),
      },
    })
    contentIdBySlug[g.slug] = doc.id
  }

  // Relacionados manuales (briefing §80: la relación editorial manda sobre la algorítmica)
  const RELATED: Record<string, string[]> = {
    'primer-contacto-cliente-moroso': [
      'siete-excusas-frecuentes-moroso',
      'cuando-enviar-un-burofax',
    ],
    'cuando-enviar-un-burofax': [
      'guia-plazos-prescripcion-deuda',
      'como-calcular-intereses-de-demora',
    ],
    'siete-excusas-frecuentes-moroso': [
      'responder-factura-pendiente-aprobacion',
      'primer-contacto-cliente-moroso',
    ],
    'checklist-prevenir-impagos-antes-de-vender': ['senales-riesgo-antes-impago'],
    'cliente-pide-otro-aplazamiento': [
      'como-documentar-acuerdo-de-pago',
      'cuando-dejar-de-negociar',
    ],
  }
  for (const [slug, relatedSlugs] of Object.entries(RELATED)) {
    const id = contentIdBySlug[slug]
    const related = relatedSlugs
      .map((s) => contentIdBySlug[s])
      .filter((x): x is number => x != null)
    if (id == null || related.length === 0) continue
    await payload.update({
      collection: 'contents',
      id,
      draft: false,
      data: { relatedContent: related },
    })
  }

  // Eventos
  const in30 = (d: number) => new Date(Date.now() + d * 86400000).toISOString()
  await payload.create({
    collection: 'events',
    draft: false,
    data: {
      _status: 'published',
      title: 'Masterclass: reclamar una deuda sin deteriorar la relación comercial',
      slug: 'masterclass-reclamar-sin-deteriorar',
      eventType: 'MASTERCLASS',
      description:
        'Pere Brachfield analiza estrategias de reclamación que priorizan mantener al cliente, con casos reales y turno de preguntas.',
      startAt: in30(20),
      endAt: in30(20),
      capacity: 200,
    },
  })
  await payload.create({
    collection: 'events',
    draft: false,
    data: {
      _status: 'published',
      title: 'Pregunta a Pere · Q&A mensual',
      slug: 'pregunta-a-pere-mensual',
      eventType: 'QA',
      description:
        'Sesión abierta de preguntas y respuestas: Pere responde en directo a las dudas enviadas por los miembros.',
      startAt: in30(27),
      capacity: 300,
    },
  })

  // Evento pasado con replay (demuestra la sección Replays de /app/events)
  await payload.create({
    collection: 'events',
    draft: false,
    data: {
      _status: 'published',
      title: 'Webinar: cómo responder a las excusas del moroso',
      slug: 'webinar-excusas-del-moroso',
      eventType: 'WEBINAR',
      description:
        'Sesión en directo sobre las excusas más habituales de los morosos y cómo responder a cada una sin perder la relación comercial.',
      startAt: in30(-15),
      endAt: in30(-15),
      replayContent: contentIdBySlug['siete-excusas-frecuentes-moroso'],
    },
  })

  const counts = await Promise.all(
    (['categories', 'tags', 'courses', 'contents', 'events'] as const).map(
      async (c) => `${c}: ${(await payload.find({ collection: c, limit: 0 })).totalDocs}`,
    ),
  )
  console.log('Seed Payload OK →', counts.join(' · '))
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
