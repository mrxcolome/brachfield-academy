import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// 20/10/2026 (decisiones del propietario): (1) cada pieza tiene UN formato — vídeo, texto,
// audio o documento — y la ficha del alumno solo enseña ese material; (2) fuera los niveles.
// Idempotente (IF EXISTS / IF NOT EXISTS) para que un reintento del workflow no falle.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "payload"."enum_contents_format" AS ENUM('VIDEO', 'TEXT', 'AUDIO', 'DOCUMENT');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "payload"."enum__contents_v_version_format" AS ENUM('VIDEO', 'TEXT', 'AUDIO', 'DOCUMENT');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TABLE "payload"."contents" ADD COLUMN IF NOT EXISTS "format" "payload"."enum_contents_format";
  ALTER TABLE "payload"."_contents_v" ADD COLUMN IF NOT EXISTS "version_format" "payload"."enum__contents_v_version_format";
  ALTER TABLE "payload"."contents" DROP COLUMN IF EXISTS "level";
  ALTER TABLE "payload"."_contents_v" DROP COLUMN IF EXISTS "version_level";
  DROP TYPE IF EXISTS "payload"."enum_contents_level";
  DROP TYPE IF EXISTS "payload"."enum__contents_v_version_level";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "payload"."enum_contents_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  CREATE TYPE "payload"."enum__contents_v_version_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  ALTER TABLE "payload"."contents" ADD COLUMN "level" "payload"."enum_contents_level";
  ALTER TABLE "payload"."_contents_v" ADD COLUMN "version_level" "payload"."enum__contents_v_version_level";
  ALTER TABLE "payload"."contents" DROP COLUMN "format";
  ALTER TABLE "payload"."_contents_v" DROP COLUMN "version_format";
  DROP TYPE "payload"."enum_contents_format";
  DROP TYPE "payload"."enum__contents_v_version_format";`)
}
