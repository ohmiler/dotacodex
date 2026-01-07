import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Create database client based on environment
const createDatabaseClient = () => {
    // Production: Use Turso
    if (process.env.TURSO_DATABASE_URL) {
        const client = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });
        return drizzle(client, { schema });
    }

    // Development: Use local SQLite
    // Dynamic import for better-sqlite3 (only used in development)
    if (typeof window === 'undefined') {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const Database = require('better-sqlite3');
            const path = require('path');
            const fs = require('fs');

            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const sqlite = new Database(path.join(dataDir, 'dotacodex.db'));
            // Use the better-sqlite3 drizzle adapter
            const { drizzle: drizzleBetterSqlite3 } = require('drizzle-orm/better-sqlite3');
            return drizzleBetterSqlite3(sqlite, { schema });
        } catch (error) {
            console.error('Failed to initialize local SQLite:', error);
            throw new Error('Database initialization failed');
        }
    }

    throw new Error('No database configuration found');
};

export const db = createDatabaseClient();
export default db;
