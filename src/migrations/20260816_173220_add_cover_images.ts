import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."contents" ADD COLUMN "cover_image_id" integer;
  ALTER TABLE "payload"."_contents_v" ADD COLUMN "version_cover_image_id" integer;
  ALTER TABLE "payload"."courses" ADD COLUMN "cover_image_id" integer;
  ALTER TABLE "payload"."_courses_v" ADD COLUMN "version_cover_image_id" integer;
  ALTER TABLE "payload"."contents" ADD CONSTRAINT "contents_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v" ADD CONSTRAINT "_contents_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."courses" ADD CONSTRAINT "courses_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v" ADD CONSTRAINT "_courses_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contents_cover_image_idx" ON "payload"."contents" USING btree ("cover_image_id");
  CREATE INDEX "_contents_v_version_version_cover_image_idx" ON "payload"."_contents_v" USING btree ("version_cover_image_id");
  CREATE INDEX "courses_cover_image_idx" ON "payload"."courses" USING btree ("cover_image_id");
  CREATE INDEX "_courses_v_version_version_cover_image_idx" ON "payload"."_courses_v" USING btree ("version_cover_image_id");`)
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
