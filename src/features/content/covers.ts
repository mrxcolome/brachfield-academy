// Portadas de tarjetas y fichas, en tres niveles (decisión del propietario,
// 2026-08-16):
//   1. La imagen de portada subida por el editor en el CMS (coverImage).
//   2. Si no hay, una foto automática de la serie de marca según el formato
//      del contenido o el área del curso (public/landing/*.webp).
//   3. Si tampoco (imposible hoy: los mapas cubren todos los casos), la
//      ilustración SVG de marca — la aplica SmartCover como red final.
import type { Content, Course } from '@/payload/payload-types'

export const DEFAULT_COVER_BY_TYPE: Record<Content['contentType'], string> = {
  VIDEO: '/landing/formato-videos.webp',
  AUDIO: '/landing/formato-podcasts.webp',
  ARTICLE: '/landing/formato-guias.webp',
  PDF: '/landing/formato-guias.webp',
  GUIDE: '/landing/formato-guias.webp',
  CHECKLIST: '/landing/formato-checklists.webp',
  TEMPLATE: '/landing/formato-plantillas.webp',
  WEBINAR: '/landing/formato-webinars.webp',
  CASE_STUDY: '/landing/formato-casos.webp',
  NEWS: '/landing/formato-actualizaciones.webp',
  TOOL: '/landing/formato-recursos.webp',
}

/** Nombres de categoría del seed → foto de área de la serie de marca. */
const COVER_BY_CATEGORY: Record<string, string> = {
  'Credit Management': '/landing/area-credit-management.webp',
  'Prevención de impagos': '/landing/area-prevencion.webp',
  'Riesgo de crédito': '/landing/area-riesgo.webp',
  'Recobro de impagados': '/landing/area-recobro.webp',
  Negociación: '/landing/area-negociacion.webp',
  Legislación: '/landing/area-legislacion.webp',
  'Gestión financiera': '/landing/area-financiera.webp',
  'Organización del departamento': '/landing/area-organizacion.webp',
}

const COURSE_FALLBACK = '/landing/formato-cursos.webp'

/** Fotos de área de TODAS las categorías conocidas del elemento (depth>=1). */
function categoryCovers(categories: Course['categories'] | Content['categories']): string[] {
  const covers: string[] = []
  for (const cat of categories ?? []) {
    if (typeof cat === 'object' && cat.name) {
      const byArea = COVER_BY_CATEGORY[cat.name]
      if (byArea && !covers.includes(byArea)) covers.push(byArea)
    }
  }
  return covers
}

/**
 * Elige una candidata de forma ESTABLE por id: el mismo contenido muestra
 * siempre la misma foto, pero piezas vecinas del mismo tema o formato se
 * reparten entre sus candidatas y no repiten imagen en una misma parrilla.
 */
function pickStable(candidates: string[], id: number, fallback: string): string {
  return candidates[Math.abs(id) % candidates.length] ?? fallback
}

function uploadedUrl(coverImage: Content['coverImage']): string | null {
  // Con depth 0 la relación es un id numérico: no sirve para pintar.
  if (coverImage && typeof coverImage === 'object' && typeof coverImage.url === 'string') {
    return coverImage.url
  }
  return null
}

/**
 * Portada de un contenido: subida por el editor, foto de su área temática, o
 * foto por formato. El área va antes que el formato para que dos piezas del
 * mismo tipo (p. ej. dos vídeos) no compartan imagen si tratan temas distintos.
 */
export function contentCover(
  content: Pick<Content, 'id' | 'coverImage' | 'contentType'> &
    Partial<Pick<Content, 'categories'>>,
): string {
  const uploaded = uploadedUrl(content.coverImage)
  if (uploaded) return uploaded
  const byType = DEFAULT_COVER_BY_TYPE[content.contentType]
  return pickStable([...categoryCovers(content.categories), byType], content.id, byType)
}

/** Portada de un curso: subida por el editor, foto por su primera área conocida, o la genérica de cursos. */
export function courseCover(course: Pick<Course, 'id' | 'coverImage' | 'categories'>): string {
  const uploaded = uploadedUrl(course.coverImage)
  if (uploaded) return uploaded
  return pickStable(
    [...categoryCovers(course.categories), COURSE_FALLBACK],
    course.id,
    COURSE_FALLBACK,
  )
}
