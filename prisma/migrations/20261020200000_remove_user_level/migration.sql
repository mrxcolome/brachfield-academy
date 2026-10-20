-- Niveles retirados de toda la academia (decisión del propietario 20/10/2026).
ALTER TABLE "user" DROP COLUMN IF EXISTS "level";
DROP TYPE IF EXISTS "Level";
