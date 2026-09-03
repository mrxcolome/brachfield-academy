import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  -- Catálogo por conceptos (3/09/2026): mapear los tipos retirados ANTES de
  -- recrear el enum, o el cast fallaría con las filas existentes.
  UPDATE "payload"."contents" SET "content_type" = CASE "content_type"
    WHEN 'VIDEO' THEN 'TUTORIAL' WHEN 'PDF' THEN 'GUIDE'
    WHEN 'ARTICLE' THEN 'GUIDE' WHEN 'TOOL' THEN 'TEMPLATE'
    ELSE "content_type" END;
  UPDATE "payload"."_contents_v" SET "version_content_type" = CASE "version_content_type"
    WHEN 'VIDEO' THEN 'TUTORIAL' WHEN 'PDF' THEN 'GUIDE'
    WHEN 'ARTICLE' THEN 'GUIDE' WHEN 'TOOL' THEN 'TEMPLATE'
    ELSE "version_content_type" END;
  -- Favoritos: contentType desnormalizado en el esquema public (Prisma)
  UPDATE "public"."favorite" SET "contentType" = CASE "contentType"
    WHEN 'VIDEO' THEN 'TUTORIAL' WHEN 'PDF' THEN 'GUIDE'
    WHEN 'ARTICLE' THEN 'GUIDE' WHEN 'TOOL' THEN 'TEMPLATE'
    ELSE "contentType" END;
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('TUTORIAL', 'PILL', 'AUDIO', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY', 'NEWS');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('TUTORIAL', 'PILL', 'AUDIO', 'WEBINAR', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'CASE_STUDY', 'NEWS');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum_contents_content_type";
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('VIDEO', 'AUDIO', 'ARTICLE', 'PDF', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'WEBINAR', 'CASE_STUDY', 'NEWS', 'TOOL');
  ALTER TABLE "payload"."contents" ALTER COLUMN "content_type" SET DATA TYPE "payload"."enum_contents_content_type" USING "content_type"::"payload"."enum_contents_content_type";
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('VIDEO', 'AUDIO', 'ARTICLE', 'PDF', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'WEBINAR', 'CASE_STUDY', 'NEWS', 'TOOL');
  ALTER TABLE "payload"."_contents_v" ALTER COLUMN "version_content_type" SET DATA TYPE "payload"."enum__contents_v_version_content_type" USING "version_content_type"::"payload"."enum__contents_v_version_content_type";`)
}
