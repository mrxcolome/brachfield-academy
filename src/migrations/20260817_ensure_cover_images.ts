import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Reparación de 20260816_173220_add_cover_images: en producción la migración
// quedó registrada como aplicada sin que las columnas llegaran a crearse, y
// las ejecuciones posteriores la saltaban. Esta versión es idempotente (solo
// crea lo que falte), así que es segura tanto en bases sanas como en la rota.
export async function up({ db }: MigrateUpArgs): Promise<void> {
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

// No hay marcha atrás propia: deshacer las columnas es el down de
// 20260816_173220_add_cover_images. Aquí no se toca nada.
export async function down(_args: MigrateDownArgs): Promise<void> {}
