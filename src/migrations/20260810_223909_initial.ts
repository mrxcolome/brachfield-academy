import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS "payload";
   CREATE TYPE "payload"."enum_admins_role" AS ENUM('admin', 'editor');
  CREATE TYPE "payload"."enum_contents_content_type" AS ENUM('VIDEO', 'AUDIO', 'ARTICLE', 'PDF', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'WEBINAR', 'CASE_STUDY', 'NEWS', 'TOOL');
  CREATE TYPE "payload"."enum_contents_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  CREATE TYPE "payload"."enum_contents_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__contents_v_version_content_type" AS ENUM('VIDEO', 'AUDIO', 'ARTICLE', 'PDF', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'WEBINAR', 'CASE_STUDY', 'NEWS', 'TOOL');
  CREATE TYPE "payload"."enum__contents_v_version_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  CREATE TYPE "payload"."enum__contents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_courses_modules_lessons_lesson_type" AS ENUM('video', 'audio', 'text', 'document');
  CREATE TYPE "payload"."enum_courses_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  CREATE TYPE "payload"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__courses_v_version_modules_lessons_lesson_type" AS ENUM('video', 'audio', 'text', 'document');
  CREATE TYPE "payload"."enum__courses_v_version_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
  CREATE TYPE "payload"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_events_event_type" AS ENUM('WEBINAR', 'QA', 'MASTERCLASS', 'CASE', 'LEGAL_UPDATE');
  CREATE TYPE "payload"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__events_v_version_event_type" AS ENUM('WEBINAR', 'QA', 'MASTERCLASS', 'CASE', 'LEGAL_UPDATE');
  CREATE TYPE "payload"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "payload"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "payload"."admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "payload"."enum_admins_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."contents_transcript" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ts" numeric,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."contents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"subtitle" varchar,
  	"excerpt" varchar,
  	"content_type" "payload"."enum_contents_content_type",
  	"level" "payload"."enum_contents_level",
  	"duration" varchar,
  	"premium" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"thumbnail_id" integer,
  	"body" jsonb,
  	"stream_id" varchar,
  	"audio_file_id" integer,
  	"document_file_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_contents_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."contents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"contents_id" integer
  );
  
  CREATE TABLE "payload"."_contents_v_version_transcript" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ts" numeric,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_contents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_subtitle" varchar,
  	"version_excerpt" varchar,
  	"version_content_type" "payload"."enum__contents_v_version_content_type",
  	"version_level" "payload"."enum__contents_v_version_level",
  	"version_duration" varchar,
  	"version_premium" boolean DEFAULT true,
  	"version_featured" boolean DEFAULT false,
  	"version_thumbnail_id" integer,
  	"version_body" jsonb,
  	"version_stream_id" varchar,
  	"version_audio_file_id" integer,
  	"version_document_file_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__contents_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_contents_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"contents_id" integer
  );
  
  CREATE TABLE "payload"."courses_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."courses_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."courses_modules_lessons_transcript" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ts" numeric,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."courses_modules_lessons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lesson_type" "payload"."enum_courses_modules_lessons_lesson_type" DEFAULT 'video',
  	"duration" varchar,
  	"stream_id" varchar,
  	"body" jsonb
  );
  
  CREATE TABLE "payload"."courses_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "payload"."courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"teacher" varchar DEFAULT 'Pere Brachfield',
  	"level" "payload"."enum_courses_level",
  	"duration" varchar,
  	"thumbnail_id" integer,
  	"certificate_enabled" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_courses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"contents_id" integer
  );
  
  CREATE TABLE "payload"."_courses_v_version_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_courses_v_version_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_courses_v_version_modules_lessons_transcript" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ts" numeric,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_courses_v_version_modules_lessons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lesson_type" "payload"."enum__courses_v_version_modules_lessons_lesson_type" DEFAULT 'video',
  	"duration" varchar,
  	"stream_id" varchar,
  	"body" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_courses_v_version_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_teacher" varchar DEFAULT 'Pere Brachfield',
  	"version_level" "payload"."enum__courses_v_version_level",
  	"version_duration" varchar,
  	"version_thumbnail_id" integer,
  	"version_certificate_enabled" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_courses_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"contents_id" integer
  );
  
  CREATE TABLE "payload"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"event_type" "payload"."enum_events_event_type",
  	"start_at" timestamp(3) with time zone,
  	"end_at" timestamp(3) with time zone,
  	"capacity" numeric,
  	"speaker" varchar DEFAULT 'Pere Brachfield',
  	"stream_url" varchar,
  	"replay_content_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_event_type" "payload"."enum__events_v_version_event_type",
  	"version_start_at" timestamp(3) with time zone,
  	"version_end_at" timestamp(3) with time zone,
  	"version_capacity" numeric,
  	"version_speaker" varchar DEFAULT 'Pere Brachfield',
  	"version_stream_url" varchar,
  	"version_replay_content_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "payload"."enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "payload"."enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload"."payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "payload"."enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"categories_id" integer,
  	"tags_id" integer,
  	"media_id" integer,
  	"contents_id" integer,
  	"courses_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contents_transcript" ADD CONSTRAINT "contents_transcript_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contents" ADD CONSTRAINT "contents_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."contents" ADD CONSTRAINT "contents_audio_file_id_media_id_fk" FOREIGN KEY ("audio_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."contents" ADD CONSTRAINT "contents_document_file_id_media_id_fk" FOREIGN KEY ("document_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."contents_rels" ADD CONSTRAINT "contents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contents_rels" ADD CONSTRAINT "contents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "payload"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contents_rels" ADD CONSTRAINT "contents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contents_rels" ADD CONSTRAINT "contents_rels_contents_fk" FOREIGN KEY ("contents_id") REFERENCES "payload"."contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v_version_transcript" ADD CONSTRAINT "_contents_v_version_transcript_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_contents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v" ADD CONSTRAINT "_contents_v_parent_id_contents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."contents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v" ADD CONSTRAINT "_contents_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v" ADD CONSTRAINT "_contents_v_version_audio_file_id_media_id_fk" FOREIGN KEY ("version_audio_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v" ADD CONSTRAINT "_contents_v_version_document_file_id_media_id_fk" FOREIGN KEY ("version_document_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v_rels" ADD CONSTRAINT "_contents_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_contents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v_rels" ADD CONSTRAINT "_contents_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "payload"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v_rels" ADD CONSTRAINT "_contents_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_contents_v_rels" ADD CONSTRAINT "_contents_v_rels_contents_fk" FOREIGN KEY ("contents_id") REFERENCES "payload"."contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_objectives" ADD CONSTRAINT "courses_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_requirements" ADD CONSTRAINT "courses_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_modules_lessons_transcript" ADD CONSTRAINT "courses_modules_lessons_transcript_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses_modules_lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_modules_lessons" ADD CONSTRAINT "courses_modules_lessons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_modules" ADD CONSTRAINT "courses_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses" ADD CONSTRAINT "courses_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_rels" ADD CONSTRAINT "courses_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "payload"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_rels" ADD CONSTRAINT "courses_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_rels" ADD CONSTRAINT "courses_rels_contents_fk" FOREIGN KEY ("contents_id") REFERENCES "payload"."contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_version_objectives" ADD CONSTRAINT "_courses_v_version_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_version_requirements" ADD CONSTRAINT "_courses_v_version_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_version_modules_lessons_transcript" ADD CONSTRAINT "_courses_v_version_modules_lessons_transcript_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v_version_modules_lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_version_modules_lessons" ADD CONSTRAINT "_courses_v_version_modules_lessons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v_version_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_version_modules" ADD CONSTRAINT "_courses_v_version_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v" ADD CONSTRAINT "_courses_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "payload"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_contents_fk" FOREIGN KEY ("contents_id") REFERENCES "payload"."contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events" ADD CONSTRAINT "events_replay_content_id_contents_id_fk" FOREIGN KEY ("replay_content_id") REFERENCES "payload"."contents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_version_replay_content_id_contents_id_fk" FOREIGN KEY ("version_replay_content_id") REFERENCES "payload"."contents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "payload"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "payload"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contents_fk" FOREIGN KEY ("contents_id") REFERENCES "payload"."contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "payload"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "payload"."admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "payload"."admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "payload"."admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "payload"."admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "payload"."admins" USING btree ("email");
  CREATE UNIQUE INDEX "categories_name_idx" ON "payload"."categories" USING btree ("name");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "payload"."categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "payload"."categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "payload"."categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_name_idx" ON "payload"."tags" USING btree ("name");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "payload"."tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "payload"."tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "payload"."tags" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "contents_transcript_order_idx" ON "payload"."contents_transcript" USING btree ("_order");
  CREATE INDEX "contents_transcript_parent_id_idx" ON "payload"."contents_transcript" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contents_slug_idx" ON "payload"."contents" USING btree ("slug");
  CREATE INDEX "contents_content_type_idx" ON "payload"."contents" USING btree ("content_type");
  CREATE INDEX "contents_thumbnail_idx" ON "payload"."contents" USING btree ("thumbnail_id");
  CREATE INDEX "contents_audio_file_idx" ON "payload"."contents" USING btree ("audio_file_id");
  CREATE INDEX "contents_document_file_idx" ON "payload"."contents" USING btree ("document_file_id");
  CREATE INDEX "contents_updated_at_idx" ON "payload"."contents" USING btree ("updated_at");
  CREATE INDEX "contents_created_at_idx" ON "payload"."contents" USING btree ("created_at");
  CREATE INDEX "contents__status_idx" ON "payload"."contents" USING btree ("_status");
  CREATE INDEX "contents_rels_order_idx" ON "payload"."contents_rels" USING btree ("order");
  CREATE INDEX "contents_rels_parent_idx" ON "payload"."contents_rels" USING btree ("parent_id");
  CREATE INDEX "contents_rels_path_idx" ON "payload"."contents_rels" USING btree ("path");
  CREATE INDEX "contents_rels_categories_id_idx" ON "payload"."contents_rels" USING btree ("categories_id");
  CREATE INDEX "contents_rels_tags_id_idx" ON "payload"."contents_rels" USING btree ("tags_id");
  CREATE INDEX "contents_rels_contents_id_idx" ON "payload"."contents_rels" USING btree ("contents_id");
  CREATE INDEX "_contents_v_version_transcript_order_idx" ON "payload"."_contents_v_version_transcript" USING btree ("_order");
  CREATE INDEX "_contents_v_version_transcript_parent_id_idx" ON "payload"."_contents_v_version_transcript" USING btree ("_parent_id");
  CREATE INDEX "_contents_v_parent_idx" ON "payload"."_contents_v" USING btree ("parent_id");
  CREATE INDEX "_contents_v_version_version_slug_idx" ON "payload"."_contents_v" USING btree ("version_slug");
  CREATE INDEX "_contents_v_version_version_content_type_idx" ON "payload"."_contents_v" USING btree ("version_content_type");
  CREATE INDEX "_contents_v_version_version_thumbnail_idx" ON "payload"."_contents_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_contents_v_version_version_audio_file_idx" ON "payload"."_contents_v" USING btree ("version_audio_file_id");
  CREATE INDEX "_contents_v_version_version_document_file_idx" ON "payload"."_contents_v" USING btree ("version_document_file_id");
  CREATE INDEX "_contents_v_version_version_updated_at_idx" ON "payload"."_contents_v" USING btree ("version_updated_at");
  CREATE INDEX "_contents_v_version_version_created_at_idx" ON "payload"."_contents_v" USING btree ("version_created_at");
  CREATE INDEX "_contents_v_version_version__status_idx" ON "payload"."_contents_v" USING btree ("version__status");
  CREATE INDEX "_contents_v_created_at_idx" ON "payload"."_contents_v" USING btree ("created_at");
  CREATE INDEX "_contents_v_updated_at_idx" ON "payload"."_contents_v" USING btree ("updated_at");
  CREATE INDEX "_contents_v_latest_idx" ON "payload"."_contents_v" USING btree ("latest");
  CREATE INDEX "_contents_v_autosave_idx" ON "payload"."_contents_v" USING btree ("autosave");
  CREATE INDEX "_contents_v_rels_order_idx" ON "payload"."_contents_v_rels" USING btree ("order");
  CREATE INDEX "_contents_v_rels_parent_idx" ON "payload"."_contents_v_rels" USING btree ("parent_id");
  CREATE INDEX "_contents_v_rels_path_idx" ON "payload"."_contents_v_rels" USING btree ("path");
  CREATE INDEX "_contents_v_rels_categories_id_idx" ON "payload"."_contents_v_rels" USING btree ("categories_id");
  CREATE INDEX "_contents_v_rels_tags_id_idx" ON "payload"."_contents_v_rels" USING btree ("tags_id");
  CREATE INDEX "_contents_v_rels_contents_id_idx" ON "payload"."_contents_v_rels" USING btree ("contents_id");
  CREATE INDEX "courses_objectives_order_idx" ON "payload"."courses_objectives" USING btree ("_order");
  CREATE INDEX "courses_objectives_parent_id_idx" ON "payload"."courses_objectives" USING btree ("_parent_id");
  CREATE INDEX "courses_requirements_order_idx" ON "payload"."courses_requirements" USING btree ("_order");
  CREATE INDEX "courses_requirements_parent_id_idx" ON "payload"."courses_requirements" USING btree ("_parent_id");
  CREATE INDEX "courses_modules_lessons_transcript_order_idx" ON "payload"."courses_modules_lessons_transcript" USING btree ("_order");
  CREATE INDEX "courses_modules_lessons_transcript_parent_id_idx" ON "payload"."courses_modules_lessons_transcript" USING btree ("_parent_id");
  CREATE INDEX "courses_modules_lessons_order_idx" ON "payload"."courses_modules_lessons" USING btree ("_order");
  CREATE INDEX "courses_modules_lessons_parent_id_idx" ON "payload"."courses_modules_lessons" USING btree ("_parent_id");
  CREATE INDEX "courses_modules_order_idx" ON "payload"."courses_modules" USING btree ("_order");
  CREATE INDEX "courses_modules_parent_id_idx" ON "payload"."courses_modules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "payload"."courses" USING btree ("slug");
  CREATE INDEX "courses_thumbnail_idx" ON "payload"."courses" USING btree ("thumbnail_id");
  CREATE INDEX "courses_updated_at_idx" ON "payload"."courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "payload"."courses" USING btree ("created_at");
  CREATE INDEX "courses__status_idx" ON "payload"."courses" USING btree ("_status");
  CREATE INDEX "courses_rels_order_idx" ON "payload"."courses_rels" USING btree ("order");
  CREATE INDEX "courses_rels_parent_idx" ON "payload"."courses_rels" USING btree ("parent_id");
  CREATE INDEX "courses_rels_path_idx" ON "payload"."courses_rels" USING btree ("path");
  CREATE INDEX "courses_rels_categories_id_idx" ON "payload"."courses_rels" USING btree ("categories_id");
  CREATE INDEX "courses_rels_tags_id_idx" ON "payload"."courses_rels" USING btree ("tags_id");
  CREATE INDEX "courses_rels_contents_id_idx" ON "payload"."courses_rels" USING btree ("contents_id");
  CREATE INDEX "_courses_v_version_objectives_order_idx" ON "payload"."_courses_v_version_objectives" USING btree ("_order");
  CREATE INDEX "_courses_v_version_objectives_parent_id_idx" ON "payload"."_courses_v_version_objectives" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_requirements_order_idx" ON "payload"."_courses_v_version_requirements" USING btree ("_order");
  CREATE INDEX "_courses_v_version_requirements_parent_id_idx" ON "payload"."_courses_v_version_requirements" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_modules_lessons_transcript_order_idx" ON "payload"."_courses_v_version_modules_lessons_transcript" USING btree ("_order");
  CREATE INDEX "_courses_v_version_modules_lessons_transcript_parent_id_idx" ON "payload"."_courses_v_version_modules_lessons_transcript" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_modules_lessons_order_idx" ON "payload"."_courses_v_version_modules_lessons" USING btree ("_order");
  CREATE INDEX "_courses_v_version_modules_lessons_parent_id_idx" ON "payload"."_courses_v_version_modules_lessons" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_modules_order_idx" ON "payload"."_courses_v_version_modules" USING btree ("_order");
  CREATE INDEX "_courses_v_version_modules_parent_id_idx" ON "payload"."_courses_v_version_modules" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_parent_idx" ON "payload"."_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "payload"."_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_thumbnail_idx" ON "payload"."_courses_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "payload"."_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "payload"."_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version__status_idx" ON "payload"."_courses_v" USING btree ("version__status");
  CREATE INDEX "_courses_v_created_at_idx" ON "payload"."_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "payload"."_courses_v" USING btree ("updated_at");
  CREATE INDEX "_courses_v_latest_idx" ON "payload"."_courses_v" USING btree ("latest");
  CREATE INDEX "_courses_v_autosave_idx" ON "payload"."_courses_v" USING btree ("autosave");
  CREATE INDEX "_courses_v_rels_order_idx" ON "payload"."_courses_v_rels" USING btree ("order");
  CREATE INDEX "_courses_v_rels_parent_idx" ON "payload"."_courses_v_rels" USING btree ("parent_id");
  CREATE INDEX "_courses_v_rels_path_idx" ON "payload"."_courses_v_rels" USING btree ("path");
  CREATE INDEX "_courses_v_rels_categories_id_idx" ON "payload"."_courses_v_rels" USING btree ("categories_id");
  CREATE INDEX "_courses_v_rels_tags_id_idx" ON "payload"."_courses_v_rels" USING btree ("tags_id");
  CREATE INDEX "_courses_v_rels_contents_id_idx" ON "payload"."_courses_v_rels" USING btree ("contents_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "payload"."events" USING btree ("slug");
  CREATE INDEX "events_replay_content_idx" ON "payload"."events" USING btree ("replay_content_id");
  CREATE INDEX "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "payload"."events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "payload"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "payload"."_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_replay_content_idx" ON "payload"."_events_v" USING btree ("version_replay_content_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "payload"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "payload"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "payload"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "payload"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "payload"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "payload"."_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload"."payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload"."payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload"."payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload"."payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload"."payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload"."payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload"."payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload"."payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload"."payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload"."payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload"."payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_contents_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("contents_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload"."payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."admins_sessions" CASCADE;
  DROP TABLE "payload"."admins" CASCADE;
  DROP TABLE "payload"."categories" CASCADE;
  DROP TABLE "payload"."tags" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."contents_transcript" CASCADE;
  DROP TABLE "payload"."contents" CASCADE;
  DROP TABLE "payload"."contents_rels" CASCADE;
  DROP TABLE "payload"."_contents_v_version_transcript" CASCADE;
  DROP TABLE "payload"."_contents_v" CASCADE;
  DROP TABLE "payload"."_contents_v_rels" CASCADE;
  DROP TABLE "payload"."courses_objectives" CASCADE;
  DROP TABLE "payload"."courses_requirements" CASCADE;
  DROP TABLE "payload"."courses_modules_lessons_transcript" CASCADE;
  DROP TABLE "payload"."courses_modules_lessons" CASCADE;
  DROP TABLE "payload"."courses_modules" CASCADE;
  DROP TABLE "payload"."courses" CASCADE;
  DROP TABLE "payload"."courses_rels" CASCADE;
  DROP TABLE "payload"."_courses_v_version_objectives" CASCADE;
  DROP TABLE "payload"."_courses_v_version_requirements" CASCADE;
  DROP TABLE "payload"."_courses_v_version_modules_lessons_transcript" CASCADE;
  DROP TABLE "payload"."_courses_v_version_modules_lessons" CASCADE;
  DROP TABLE "payload"."_courses_v_version_modules" CASCADE;
  DROP TABLE "payload"."_courses_v" CASCADE;
  DROP TABLE "payload"."_courses_v_rels" CASCADE;
  DROP TABLE "payload"."events" CASCADE;
  DROP TABLE "payload"."_events_v" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_jobs_log" CASCADE;
  DROP TABLE "payload"."payload_jobs" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TYPE "payload"."enum_admins_role";
  DROP TYPE "payload"."enum_contents_content_type";
  DROP TYPE "payload"."enum_contents_level";
  DROP TYPE "payload"."enum_contents_status";
  DROP TYPE "payload"."enum__contents_v_version_content_type";
  DROP TYPE "payload"."enum__contents_v_version_level";
  DROP TYPE "payload"."enum__contents_v_version_status";
  DROP TYPE "payload"."enum_courses_modules_lessons_lesson_type";
  DROP TYPE "payload"."enum_courses_level";
  DROP TYPE "payload"."enum_courses_status";
  DROP TYPE "payload"."enum__courses_v_version_modules_lessons_lesson_type";
  DROP TYPE "payload"."enum__courses_v_version_level";
  DROP TYPE "payload"."enum__courses_v_version_status";
  DROP TYPE "payload"."enum_events_event_type";
  DROP TYPE "payload"."enum_events_status";
  DROP TYPE "payload"."enum__events_v_version_event_type";
  DROP TYPE "payload"."enum__events_v_version_status";
  DROP TYPE "payload"."enum_payload_jobs_log_task_slug";
  DROP TYPE "payload"."enum_payload_jobs_log_state";
  DROP TYPE "payload"."enum_payload_jobs_task_slug";`)
}
