import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  -- Tipología «Actualidad» retirada (decisión del propietario 10/09: la
  -- actualidad vive en el tablón de noticias, no como pieza del catálogo).
  -- Mapear ANTES del cast por si existiera alguna pieza NEWS.
  UPDATE "payload"."contents" SET "content_type" = 'GUIDE' WHERE "content_type" = 'NEWS';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'GUIDE' WHERE "version_content_type" = 'NEWS';
  UPDATE "public"."favorite" SET "contentType" = 'GUIDE' WHERE "contentType" = 'NEWS';
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('TUTORIAL', 'PILL', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('TUTORIAL', 'PILL', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('TUTORIAL', 'PILL', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY', 'NEWS');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('TUTORIAL', 'PILL', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY', 'NEWS');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}
