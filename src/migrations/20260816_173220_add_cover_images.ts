import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Editada 2026-08-17 para ser idempotente (mismo motivo y misma forma que
// 20260817_ensure_cover_images): la BD de producción quedó rezagada y debe
// poder aplicarla venga del estado que venga.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."contents" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;
  ALTER TABLE "payload"."_contents_v" ADD COLUMN IF NOT EXISTS "version_cover_image_id" integer;
  ALTER TABLE "payload"."courses" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;
  ALTER TABLE "payload"."_courses_v" ADD COLUMN IF NOT EXISTS "version_cover_image_id" integer;
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
                   WHERE n.nspname = 'payload' AND c.conname = 'contents_cover_image_id_media_id_fk') THEN
      ALTER TABLE "payload"."contents" ADD CONSTRAINT "contents_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
                   WHERE n.nspname = 'payload' AND c.conname = '_contents_v_version_cover_image_id_media_id_fk') THEN
      ALTER TABLE "payload"."_contents_v" ADD CONSTRAINT "_contents_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
                   WHERE n.nspname = 'payload' AND c.conname = 'courses_cover_image_id_media_id_fk') THEN
      ALTER TABLE "payload"."courses" ADD CONSTRAINT "courses_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
                   WHERE n.nspname = 'payload' AND c.conname = '_courses_v_version_cover_image_id_media_id_fk') THEN
      ALTER TABLE "payload"."_courses_v" ADD CONSTRAINT "_courses_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS "contents_cover_image_idx" ON "payload"."contents" USING btree ("cover_image_id");
  CREATE INDEX IF NOT EXISTS "_contents_v_version_version_cover_image_idx" ON "payload"."_contents_v" USING btree ("version_cover_image_id");
  CREATE INDEX IF NOT EXISTS "courses_cover_image_idx" ON "payload"."courses" USING btree ("cover_image_id");
  CREATE INDEX IF NOT EXISTS "_courses_v_version_version_cover_image_idx" ON "payload"."_courses_v" USING btree ("version_cover_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" DROP CONSTRAINT "contents_cover_image_id_media_id_fk";
  
  ALTER TABLE "payload"."_contents_v" DROP CONSTRAINT "_contents_v_version_cover_image_id_media_id_fk";
  
  ALTER TABLE "payload"."courses" DROP CONSTRAINT "courses_cover_image_id_media_id_fk";
  
  ALTER TABLE "payload"."_courses_v" DROP CONSTRAINT "_courses_v_version_cover_image_id_media_id_fk";
  
  DROP INDEX "payload"."contents_cover_image_idx";
  DROP INDEX "payload"."_contents_v_version_version_cover_image_idx";
  DROP INDEX "payload"."courses_cover_image_idx";
  DROP INDEX "payload"."_courses_v_version_version_cover_image_idx";
  ALTER TABLE "payload"."contents" DROP COLUMN "cover_image_id";
  ALTER TABLE "payload"."_contents_v" DROP COLUMN "version_cover_image_id";
  ALTER TABLE "payload"."courses" DROP COLUMN "cover_image_id";
  ALTER TABLE "payload"."_courses_v" DROP COLUMN "version_cover_image_id";`)
}
