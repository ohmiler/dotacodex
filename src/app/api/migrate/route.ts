import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// POST - Run database migrations (Production requires MIGRATE_SECRET env var)
export async function POST(request: NextRequest) {
    try {
        // In production, require explicit MIGRATE_SECRET
        if (process.env.NODE_ENV === 'production') {
            const migrateSecret = process.env.MIGRATE_SECRET;
            if (!migrateSecret) {
                return NextResponse.json(
                    { error: 'Migration endpoint disabled - MIGRATE_SECRET not configured' },
                    { status: 403 }
                );
            }

            const { searchParams } = new URL(request.url);
            const secret = searchParams.get('secret');

            if (secret !== migrateSecret) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                );
            }
        }

        console.log('[Migrate] Starting database migration...');

        // Drop existing table to recreate with correct schema
        await db.run(sql`DROP TABLE IF EXISTS user_progress`);

        // Create user_progress table
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

        // Create indexes
        await db.run(sql`
            CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)
        `);
        await db.run(sql`
            CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id)
        `);

        return NextResponse.json({
            success: true,
            message: 'Database migration completed - table recreated',
            tables: ['user_progress'],
        });
    } catch (error) {
        console.error('[Migrate] Error:', error);
        const errorMessage = process.env.NODE_ENV === 'production'
            ? 'Migration failed'
            : (error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { error: 'Migration failed', details: errorMessage },
            { status: 500 }
        );
    }
}

// GET - Check migration status (Production requires MIGRATE_SECRET)
export async function GET(request: NextRequest) {
    try {
        // In production, require explicit MIGRATE_SECRET
        if (process.env.NODE_ENV === 'production') {
            const migrateSecret = process.env.MIGRATE_SECRET;
            if (!migrateSecret) {
                return NextResponse.json(
                    { error: 'Endpoint disabled' },
                    { status: 403 }
                );
            }

            const { searchParams } = new URL(request.url);
            const secret = searchParams.get('secret');

            if (secret !== migrateSecret) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                );
            }
        }

        // Check if tables exist
        const result = await db.run(sql`
            SELECT name FROM sqlite_master WHERE type='table' AND name='user_progress'
        `);

        return NextResponse.json({
            success: true,
            tables: {
                user_progress: (result.rows?.length ?? 0) > 0,
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
