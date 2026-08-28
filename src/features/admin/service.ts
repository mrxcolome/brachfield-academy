// Zona de administración (Fase 14): datos del dominio de aplicación que el
// CMS no ve — usuarios, suscripciones, preguntas, descargas, búsquedas.
// Solo Prisma: testeable sin cargar Payload.
import { db } from '@/lib/db'

const DAY = 86400000

export interface AdminKpis {
  activeMembers: number
  newUsers30d: number
  downloads30d: number
  pendingQuestions: number
  upcomingReservations: number
}

export async function getAdminKpis(): Promise<AdminKpis> {
  const since30d = new Date(Date.now() - 30 * DAY)
  const [activeMembers, newUsers30d, downloads30d, pendingQuestions, upcomingReservations] =
    await Promise.all([
      db.user.count({
        where: {
          deletedAt: null,
          subscriptions: { some: { status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] } } },
        },
      }),
      db.user.count({ where: { createdAt: { gte: since30d }, deletedAt: null } }),
      db.downloadLog.count({ where: { createdAt: { gte: since30d } } }),
      db.question.count({ where: { status: 'PENDING' } }),
      db.eventRegistration.count({ where: { status: 'RESERVED' } }),
    ])
  return { activeMembers, newUsers30d, downloads30d, pendingQuestions, upcomingReservations }
}

export interface SearchStats {
  top: { query: string; count: number }[]
  noResults: { query: string; count: number }[]
}

/** Qué busca la gente y qué busca y NO encuentra (huecos editoriales). */
export async function getSearchStats(days = 30): Promise<SearchStats> {
  const since = new Date(Date.now() - days * DAY)
  const [top, noResults] = await Promise.all([
    db.searchQuery.groupBy({
      by: ['query'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { query: 'desc' } },
      take: 8,
    }),
    db.searchQuery.groupBy({
      by: ['query'],
      where: { createdAt: { gte: since }, resultsCount: 0 },
      _count: { _all: true },
      orderBy: { _count: { query: 'desc' } },
      take: 8,
    }),
  ])
  return {
    top: top.map((r) => ({ query: r.query, count: r._count._all })),
    noResults: noResults.map((r) => ({ query: r.query, count: r._count._all })),
  }
}

export async function listUsers(q?: string) {
  return db.user.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: 'insensitive' } },
              { name: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { company: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      company: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      loginCount: true,
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { status: true, currentPeriodEnd: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export async function listQuestions() {
  return db.question.findMany({
    include: { user: { select: { name: true, lastName: true, email: true } } },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  })
}

/**
 * Responde (o descarta/selecciona) una pregunta y notifica al autor.
 * Separado de la server action para poder testearlo contra Postgres.
 */
export async function resolveQuestion(
  questionId: string,
  input: { status: 'ANSWERED' | 'SELECTED' | 'DISCARDED'; answer?: string },
): Promise<boolean> {
  const question = await db.question.findUnique({ where: { id: questionId } })
  if (!question) return false

  await db.question.update({
    where: { id: questionId },
    data: {
      status: input.status,
      ...(input.status === 'ANSWERED'
        ? { answer: input.answer ?? null, answerType: 'TEXT', answeredAt: new Date() }
        : {}),
    },
  })

  if (input.status === 'ANSWERED') {
    await db.notification.create({
      data: {
        userId: question.userId,
        type: 'SYSTEM',
        title: 'Pere ha respondido tu pregunta',
        message: question.question.slice(0, 140),
        url: '/app/notifications',
      },
    })
  }
  return true
}

// ─────────────── Actividad de alumnos (ficha por usuario) ────────────────

/** Datos crudos de actividad de un alumno; los títulos CMS los resuelve activity.ts. */
export async function getStudentActivity(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      company: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      loginCount: true,
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { status: true, currentPeriodEnd: true },
      },
    },
  })
  if (!user) return null

  const take = 15
  const [sessions, searches, downloads, favorites, progress, reservations] = await Promise.all([
    db.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
      select: { createdAt: true },
    }),
    db.searchQuery.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
      select: { query: true, resultsCount: true, createdAt: true },
    }),
    db.downloadLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
      select: { contentId: true, createdAt: true },
    }),
    db.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
      select: { contentId: true, createdAt: true },
    }),
    db.userProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take,
      select: { courseId: true, status: true, completedAt: true, updatedAt: true },
    }),
    db.eventRegistration.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take,
      select: { eventId: true, status: true, createdAt: true, updatedAt: true },
    }),
  ])

  return { user, sessions, searches, downloads, favorites, progress, reservations }
}

// ──────────────── Actividad editorial (tab Editores) ─────────────────────

export async function getEditorialActivity() {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [recent, editors, changes30d, logins] = await Promise.all([
    db.editorialActivity.findMany({ orderBy: { createdAt: 'desc' }, take: 40 }),
    db.editorialActivity.groupBy({
      by: ['editorEmail', 'editorName'],
      _max: { createdAt: true },
    }),
    db.editorialActivity.groupBy({
      by: ['editorEmail'],
      where: { createdAt: { gte: since30d }, action: { not: 'LOGIN' } },
      _count: { _all: true },
    }),
    db.editorialActivity.groupBy({
      by: ['editorEmail'],
      where: { action: 'LOGIN' },
      _max: { createdAt: true },
      _count: { _all: true },
    }),
  ])

  const changesByEmail = new Map(changes30d.map((c) => [c.editorEmail, c._count._all]))
  const loginByEmail = new Map(logins.map((l) => [l.editorEmail, l]))
  const summary = editors
    .map((e) => ({
      email: e.editorEmail,
      name: e.editorName,
      lastActivity: e._max.createdAt,
      lastLogin: loginByEmail.get(e.editorEmail)?._max.createdAt ?? null,
      loginCount: loginByEmail.get(e.editorEmail)?._count._all ?? 0,
      changes30d: changesByEmail.get(e.editorEmail) ?? 0,
    }))
    .sort((a, b) => (b.lastActivity?.getTime() ?? 0) - (a.lastActivity?.getTime() ?? 0))

  return { recent, summary }
}
