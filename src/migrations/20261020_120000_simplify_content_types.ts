import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Tipologías simplificadas (decisión del propietario 20/10/2026): Cursos + 5 piezas —
// Consejo, Artículo, Guía, Checklist y Plantilla. Fuera Entrevista, Sesión en directo
// (replay) y Caso práctico. Mapear ANTES del cast por si quedara alguna pieza.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  UPDATE "payload"."contents" SET "content_type" = 'ARTICLE' WHERE "content_type" = 'INTERVIEW';
  UPDATE "payload"."contents" SET "content_type" = 'ADVICE' WHERE "content_type" = 'WEBINAR';
  UPDATE "payload"."contents" SET "content_type" = 'GUIDE' WHERE "content_type" = 'CASE_STUDY';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'ARTICLE' WHERE "version_content_type" = 'INTERVIEW';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'ADVICE' WHERE "version_content_type" = 'WEBINAR';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'GUIDE' WHERE "version_content_type" = 'CASE_STUDY';
  UPDATE "public"."favorite" SET "contentType" = 'ARTICLE' WHERE "contentType" = 'INTERVIEW';
  UPDATE "public"."favorite" SET "contentType" = 'ADVICE' WHERE "contentType" = 'WEBINAR';
  UPDATE "public"."favorite" SET "contentType" = 'GUIDE' WHERE "contentType" = 'CASE_STUDY';
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('ADVICE', 'ARTICLE', 'GUIDE', 'CHECKLIST', 'TEMPLATE');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('ADVICE', 'ARTICLE', 'GUIDE', 'CHECKLIST', 'TEMPLATE');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('ADVICE', 'ARTICLE', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('ADVICE', 'ARTICLE', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}
