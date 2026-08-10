// Recomendaciones por perfil (briefing §10): reglas simples sobre el
// catálogo. En Fase 13 se enriquece con intereses + historial.
import { courses, type PublicCourse } from '@/features/content/catalog'
import type { ProfessionalProfile } from '@/generated/prisma/enums'

const PROFILE_COURSE_SLUGS: Record<ProfessionalProfile, string[]> = {
  CFO: [
    'organizacion-del-departamento-de-credit-management',
    'analisis-de-riesgo-de-clientes',
    'gestion-y-prevencion-de-impagados',
  ],
  CREDIT_MANAGER: [
    'gestion-y-prevencion-de-impagados',
    'analisis-de-riesgo-de-clientes',
    'organizacion-del-departamento-de-credit-management',
  ],
  COLLECTIONS: [
    'como-recuperar-un-impagado-paso-a-paso',
    'negociacion-avanzada-con-deudores',
    'marco-legal-de-la-morosidad-comercial',
  ],
  CONTROLLER: [
    'analisis-de-riesgo-de-clientes',
    'organizacion-del-departamento-de-credit-management',
    'gestion-y-prevencion-de-impagados',
  ],
  MANAGEMENT: [
    'gestion-y-prevencion-de-impagados',
    'como-recuperar-un-impagado-paso-a-paso',
    'analisis-de-riesgo-de-clientes',
  ],
  LAWYER: [
    'marco-legal-de-la-morosidad-comercial',
    'como-recuperar-un-impagado-paso-a-paso',
    'negociacion-avanzada-con-deudores',
  ],
  CONSULTANT: [
    'organizacion-del-departamento-de-credit-management',
    'gestion-y-prevencion-de-impagados',
    'marco-legal-de-la-morosidad-comercial',
  ],
  OTHER: [
    'gestion-y-prevencion-de-impagados',
    'como-recuperar-un-impagado-paso-a-paso',
    'analisis-de-riesgo-de-clientes',
  ],
}

export function recommendedCourses(profile: ProfessionalProfile | null): PublicCourse[] {
  const slugs = PROFILE_COURSE_SLUGS[profile ?? 'OTHER'] ?? PROFILE_COURSE_SLUGS.OTHER
  return slugs
    .map((s) => courses.find((c) => c.slug === s))
    .filter((c): c is PublicCourse => Boolean(c))
}
