import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Editada 2026-08-17 para ser idempotente: la BD de producción quedó rezagada
// (solo tenía la migración inicial) y debe poder aplicar esta venga del estado
// que venga. En bases que ya la ejecutaron no cambia nada.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."courses" DROP COLUMN IF EXISTS "level";
  ALTER TABLE "payload"."_courses_v" DROP COLUMN IF EXISTS "version_level";
  DROP TYPE IF EXISTS "payload"."enum_courses_level";
  DROP TYPE IF EXISTS "payload"."enum__courses_v_version_level";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_courses_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  CREATE TYPE "payload"."enum__courses_v_version_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  ALTER TABLE "payload"."courses" ADD COLUMN "level" "payload"."enum_courses_level";
  ALTER TABLE "payload"."_courses_v" ADD COLUMN "version_level" "payload"."enum__courses_v_version_level";`)
}
