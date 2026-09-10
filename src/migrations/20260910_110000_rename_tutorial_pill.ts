import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  -- Tutorial → Consejo y Píldora → Artículo (decisión del propietario 10/09):
  -- mapear ANTES del cast, favoritos desnormalizados incluidos.
  UPDATE "payload"."contents" SET "content_type" = 'ADVICE' WHERE "content_type" = 'TUTORIAL';
  UPDATE "payload"."contents" SET "content_type" = 'ARTICLE' WHERE "content_type" = 'PILL';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'ADVICE' WHERE "version_content_type" = 'TUTORIAL';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'ARTICLE' WHERE "version_content_type" = 'PILL';
  UPDATE "public"."favorite" SET "contentType" = 'ADVICE' WHERE "contentType" = 'TUTORIAL';
  UPDATE "public"."favorite" SET "contentType" = 'ARTICLE' WHERE "contentType" = 'PILL';
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('ADVICE', 'ARTICLE', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('ADVICE', 'ARTICLE', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  UPDATE "payload"."contents" SET "content_type" = 'TUTORIAL' WHERE "content_type" = 'ADVICE';
  UPDATE "payload"."contents" SET "content_type" = 'PILL' WHERE "content_type" = 'ARTICLE';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'TUTORIAL' WHERE "version_content_type" = 'ADVICE';
  UPDATE "payload"."_contents_v" SET "version_content_type" = 'PILL' WHERE "version_content_type" = 'ARTICLE';
  UPDATE "public"."favorite" SET "contentType" = 'TUTORIAL' WHERE "contentType" = 'ADVICE';
  UPDATE "public"."favorite" SET "contentType" = 'PILL' WHERE "contentType" = 'ARTICLE';
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('TUTORIAL', 'PILL', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('TUTORIAL', 'PILL', 'INTERVIEW', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}
