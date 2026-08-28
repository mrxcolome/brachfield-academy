-- AlterTable
ALTER TABLE "user" ADD COLUMN     "loginCount" INTEGER NOT NULL DEFAULT 0;

-- Precarga: los accesos ya registrados hasta hoy (sesiones existentes)
UPDATE "user" u
SET "loginCount" = (SELECT count(*) FROM "session" s WHERE s."userId" = u.id);
