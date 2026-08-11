import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."courses" DROP COLUMN "level";
  ALTER TABLE "payload"."_courses_v" DROP COLUMN "version_level";
  DROP TYPE "payload"."enum_courses_level";
  DROP TYPE "payload"."enum__courses_v_version_level";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_courses_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  CREATE TYPE "payload"."enum__courses_v_version_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  ALTER TABLE "payload"."courses" ADD COLUMN "level" "payload"."enum_courses_level";
  ALTER TABLE "payload"."_courses_v" ADD COLUMN "version_level" "payload"."enum__courses_v_version_level";`)
}
