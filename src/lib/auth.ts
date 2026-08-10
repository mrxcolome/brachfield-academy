// Better Auth — configuración (ADR-001).
// FASE 3: se instancia aquí betterAuth({...}) con adapter de Prisma,
// email+password con verificación, reset y roles. No se activa antes de
// tener DATABASE_URL (Fase 2) para no fingir una auth que no funciona.
export const AUTH_PENDING_PHASE = 3
