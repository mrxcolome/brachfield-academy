import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    // Neon Postgres (ADR-008). DATABASE_URL en .env (gitignored).
    url: process.env.DATABASE_URL ?? 'postgresql://pending:pending@localhost:5432/pending',
  },
})
