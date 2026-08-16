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

function uploadedUrl(coverImage: Content['coverImage']): string | null {
  // Con depth 0 la relación es un id numérico: no sirve para pintar.
  if (coverImage && typeof coverImage === 'object' && typeof coverImage.url === 'string') {
    return coverImage.url
  }
  return null
}

/** Portada de un contenido: subida por el editor o foto por formato. */
export function contentCover(content: Pick<Content, 'coverImage' | 'contentType'>): string {
  return uploadedUrl(content.coverImage) ?? DEFAULT_COVER_BY_TYPE[content.contentType]
}

/** Portada de un curso: subida por el editor, foto por su primera área conocida, o la genérica de cursos. */
export function courseCover(course: Pick<Course, 'coverImage' | 'categories'>): string {
  const uploaded = uploadedUrl(course.coverImage)
  if (uploaded) return uploaded
  for (const cat of course.categories ?? []) {
    // depth 0 → ids numéricos; con depth>=1 llegan los objetos con name.
    if (typeof cat === 'object' && cat.name) {
      const byArea = COVER_BY_CATEGORY[cat.name]
      if (byArea) return byArea
    }
  }
  return COURSE_FALLBACK
}
