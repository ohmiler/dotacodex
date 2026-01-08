import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// Helper function to get user ID from JWT token
async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
    });
    return token?.id as string || null;
}

// Helper: Convert topic slug to a numeric ID (simple hash)
function slugToId(slug: string): number {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        const char = slug.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// GET - Get user's learning progress
export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Use raw SQL for better Turso compatibility
        const result = await db.run(sql`
            SELECT id, user_id, topic_id, completed, completed_at 
            FROM user_progress 
            WHERE user_id = ${userId}
        `);

        const progress = result.rows || [];
        const completedCount = progress.filter((p: Record<string, unknown>) => p.completed === 1).length;

        return NextResponse.json({
            progress: progress.map((p: Record<string, unknown>) => ({
                id: p.id,
                topicId: p.topic_id,
                completed: p.completed === 1,
                completedAt: p.completed_at,
            })),
            completedCount,
            totalCount: progress.length,
        });
    } catch (error) {
        console.error('[Progress API] GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch progress' },
            { status: 500 }
        );
    }
}

// POST - Mark a topic as complete
export async function POST(request: NextRequest) {
    console.log('[Progress API] POST request received');

    try {
        const userId = await getUserIdFromToken(request);
        console.log('[Progress API] User ID:', userId);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { topicSlug, completed = true } = body;
        console.log('[Progress API] Topic slug:', topicSlug);

        if (!topicSlug || typeof topicSlug !== 'string') {
            return NextResponse.json(
                { error: 'Invalid topicSlug' },
                { status: 400 }
            );
        }

        const topicId = slugToId(topicSlug);
        console.log('[Progress API] Topic ID (hash):', topicId);

        // Check if record exists using raw SQL
        const existingResult = await db.run(sql`
            SELECT id FROM user_progress 
            WHERE user_id = ${userId} AND topic_id = ${topicId}
            LIMIT 1
        `);

        const existing = existingResult.rows?.[0];
        console.log('[Progress API] Existing record:', existing ? 'found' : 'not found');

        const completedInt = completed ? 1 : 0;
        const completedAt = completed ? Date.now() : null;

        if (existing) {
            // Update using raw SQL
            console.log('[Progress API] Updating record...');
            await db.run(sql`
                UPDATE user_progress 
                SET completed = ${completedInt}, completed_at = ${completedAt}
                WHERE id = ${existing.id}
            `);
        } else {
            // Insert using raw SQL
            console.log('[Progress API] Inserting new record...');
            await db.run(sql`
                INSERT INTO user_progress (user_id, topic_id, completed, completed_at)
                VALUES (${userId}, ${topicId}, ${completedInt}, ${completedAt})
            `);
        }

        console.log('[Progress API] Success!');
        return NextResponse.json({
            success: true,
            topicId,
            topicSlug,
            message: completed ? 'Topic marked as complete' : 'Topic marked as incomplete',
        });
    } catch (error) {
        console.error('[Progress API] Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to update progress',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
