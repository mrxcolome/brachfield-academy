// Reglas de personalización (briefing §10 y §79): puntuación transparente
// por perfil profesional, intereses del onboarding y nivel. Sin ML — cada
// punto tiene una explicación. Módulo puro para poder testearlo.
import type { ProfessionalProfile, Level } from '@/generated/prisma/enums'

export interface ProfileInput {
  professionalProfile: ProfessionalProfile | null
  level: Level | null
  interests: string[] // valores de GOAL_OPTIONS (onboarding)
}

export interface ScorableItem {
  categories: string[] // nombres de categoría
  tags: string[]
  level: string | null
  publishedAt: string | null
}

/** Categorías afines a cada perfil profesional (orden = afinidad). */
export const PROFILE_CATEGORIES: Record<ProfessionalProfile, string[]> = {
  CFO: ['Gestión financiera', 'Riesgo de crédito', 'Organización del departamento'],
  CREDIT_MANAGER: ['Credit Management', 'Riesgo de crédito', 'Prevención de impagos'],
  COLLECTIONS: ['Recobro de impagados', 'Negociación', 'Clientes morosos'],
  CONTROLLER: ['Riesgo de crédito', 'Gestión financiera', 'Prevención de impagos'],
  MANAGEMENT: ['Credit Management', 'Prevención de impagos', 'Gestión financiera'],
  LAWYER: ['Legislación', 'Recobro de impagados', 'Instrumentos de cobro'],
  CONSULTANT: ['Organización del departamento', 'Credit Management', 'Legislación'],
  OTHER: ['Credit Management', 'Prevención de impagos', 'Recobro de impagados'],
}

/** Objetivo del onboarding → categorías que lo cubren. */
export const INTEREST_CATEGORIES: Record<string, string[]> = {
  'Prevenir impagos': ['Prevención de impagos'],
  'Reducir la morosidad': ['Clientes morosos', 'Prevención de impagos'],
  'Mejorar el recobro': ['Recobro de impagados'],
  'Gestionar mejor el riesgo de clientes': ['Riesgo de crédito'],
  'Organizar el departamento de crédito': ['Organización del departamento'],
  'Mejorar las negociaciones de cobro': ['Negociación'],
  'Actualizar mis conocimientos legales': ['Legislación'],
  'Reducir el plazo medio de cobro': ['Instrumentos de cobro', 'Gestión financiera'],
  'Formarme como Credit Manager': ['Credit Management', 'Organización del departamento'],
}

/**
 * Puntuación de un item para un perfil:
 * +3 por categoría afín al perfil profesional
 * +2 por cada interés del onboarding cubierto por el item
 * +1 si el nivel coincide
 */
export function scoreItem(item: ScorableItem, profile: ProfileInput): number {
  let score = 0
  const itemCats = new Set(item.categories)

  const profileCats = PROFILE_CATEGORIES[profile.professionalProfile ?? 'OTHER']
  for (const cat of profileCats) {
    if (itemCats.has(cat)) score += 3
  }

  for (const interest of profile.interests) {
    const cats = INTEREST_CATEGORIES[interest]
    if (cats?.some((c) => itemCats.has(c))) score += 2
  }

  if (profile.level && item.level === profile.level) score += 1

  return score
}

/** Orden: puntuación desc; a igualdad, lo más reciente primero. */
export function rankItems<T extends ScorableItem>(items: T[], profile: ProfileInput): T[] {
  return [...items].sort((a, b) => {
    const diff = scoreItem(b, profile) - scoreItem(a, profile)
    if (diff !== 0) return diff
    return (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
  })
}
