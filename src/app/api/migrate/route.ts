import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// Secret key to prevent unauthorized access
const MIGRATE_SECRET = process.env.MIGRATE_SECRET || 'dotacodex-migrate-2024';

// POST - Run database migrations
export async function POST(request: NextRequest) {
    try {
        // Check authorization
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (secret !== MIGRATE_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('[Migrate] Starting database migration...');

        // Drop existing table to recreate with correct schema
        console.log('[Migrate] Dropping existing user_progress table...');
        await db.run(sql`DROP TABLE IF EXISTS user_progress`);

        // Create user_progress table with exact column names matching drizzle schema
        console.log('[Migrate] Creating user_progress table...');
        await db.run(sql`
            CREATE TABLE user_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                topic_id INTEGER NOT NULL,
                completed INTEGER DEFAULT 0,
                score INTEGER,
                completed_at INTEGER
            )
        `);
        console.log('[Migrate] user_progress table created');

        // Create indexes
        await db.run(sql`
            CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)
        `);
        await db.run(sql`
            CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id)
        `);
        console.log('[Migrate] Indexes created');

        return NextResponse.json({
            success: true,
            message: 'Database migration completed - table recreated',
            tables: ['user_progress'],
        });
    } catch (error) {
        console.error('[Migrate] Error:', error);
        return NextResponse.json(
            {
                error: 'Migration failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// GET - Check migration status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (secret !== MIGRATE_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if tables exist
        const result = await db.run(sql`
            SELECT name FROM sqlite_master WHERE type='table' AND name='user_progress'
        `);

        return NextResponse.json({
            success: true,
            tables: {
                user_progress: result.rows?.length > 0 || false,
            },
        });
    } catch (error) {
        console.error('[Migrate] Error checking tables:', error);
        return NextResponse.json(
            { error: 'Failed to check tables' },
            { status: 500 }
        );
    }
}
