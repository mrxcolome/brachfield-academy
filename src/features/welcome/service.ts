// Estado del primer aterrizaje: checklist «Tus primeros pasos» calculada
// desde datos que ya existen (progreso, favoritos, reservas) — sin tablas
// nuevas — y la regla de retirada (rules.ts).
import 'server-only'
import { db } from '@/lib/db'
import { getUpcomingEvents } from '@/features/events/service'
import { formatEventDate } from '@/features/events/format'
import { isWelcomeActive, type ChecklistItem } from './rules'
import { WELCOME_VIDEO_STREAM_ID } from './config'

export interface WelcomeState {
  active: boolean
  tourPending: boolean
  videoStreamId: string
  checklist: ChecklistItem[]
}

export async function getWelcomeState(userId: string): Promise<WelcomeState> {
  const [user, lessonsStarted, favorites, reservations, upcoming] = await Promise.all([
    db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { createdAt: true, tourSeenAt: true, welcomeVideoSeenAt: true },
    }),
    db.userProgress.count({ where: { userId } }),
    db.favorite.count({ where: { userId } }),
    db.eventRegistration.count({ where: { userId, status: 'RESERVED' } }),
    getUpcomingEvents(),
  ])

  const nextEvent = upcoming[0] ?? null
  const checklist: ChecklistItem[] = []
  if (WELCOME_VIDEO_STREAM_ID) {
    checklist.push({
      key: 'video',
      label: 'Ver la bienvenida de Pere',
      detail: '1 min',
      href: '/app',
      done: user.welcomeVideoSeenAt != null,
    })
  }
  checklist.push(
    {
      key: 'curso',
      label: 'Empezar tu primer curso',
      detail: 'te lo recomendamos abajo',
      href: '/app/learning',
      done: lessonsStarted > 0,
    },
    {
      key: 'favorito',
      label: 'Guardar tu primer favorito',
      detail: 'el botón «Guardar» de cualquier pieza',
      href: '/app/explore',
      done: favorites > 0,
    },
  )
  if (nextEvent) {
    checklist.push({
      key: 'directo',
      label: 'Reservar plaza en el próximo directo',
      detail: formatEventDate(nextEvent.startAt),
      href: '/app/updates',
      done: reservations > 0,
    })
  }

  return {
    active: isWelcomeActive(user.createdAt, checklist),
    tourPending: user.tourSeenAt == null,
    videoStreamId: WELCOME_VIDEO_STREAM_ID,
    checklist,
  }
}
