import { defineConfig } from 'drizzle-kit';

// Use Turso URL if available, otherwise use local SQLite
const dbUrl = process.env.TURSO_DATABASE_URL || 'file:./data/dotacodex.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
    out: './drizzle',
    schema: './src/lib/db/schema.ts',
    dialect: 'turso',
    dbCredentials: {
        url: dbUrl,
        authToken: authToken,
    },
});
