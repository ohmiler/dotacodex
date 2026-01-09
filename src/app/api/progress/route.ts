import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

const isDev = process.env.NODE_ENV !== 'production';

// Helper function to get user ID from JWT token
async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
    if (!process.env.NEXTAUTH_SECRET) {
        console.error('[Progress API] NEXTAUTH_SECRET is not configured');
        return null;
    }
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
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
    try {
        const userId = await getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { topicSlug, completed = true } = body;

        if (!topicSlug || typeof topicSlug !== 'string') {
            return NextResponse.json(
                { error: 'Invalid topicSlug' },
                { status: 400 }
            );
        }

        const topicId = slugToId(topicSlug);

        // Check if record exists using raw SQL
        const existingResult = await db.run(sql`
            SELECT id FROM user_progress 
            WHERE user_id = ${userId} AND topic_id = ${topicId}
            LIMIT 1
        `);

        const existing = existingResult.rows?.[0];
        const completedInt = completed ? 1 : 0;
        const completedAt = completed ? Date.now() : null;

        if (existing) {
            // Update using raw SQL
            await db.run(sql`
                UPDATE user_progress 
                SET completed = ${completedInt}, completed_at = ${completedAt}
                WHERE id = ${existing.id}
            `);
        } else {
            // Insert using raw SQL
            await db.run(sql`
                INSERT INTO user_progress (user_id, topic_id, completed, completed_at)
                VALUES (${userId}, ${topicId}, ${completedInt}, ${completedAt})
            `);
        }

        return NextResponse.json({
            success: true,
            topicId,
            topicSlug,
            message: completed ? 'Topic marked as complete' : 'Topic marked as incomplete',
        });
    } catch (error) {
        console.error('[Progress API] Error:', error);
        // Hide error details in production
        const errorDetails = isDev && error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            {
                error: 'Failed to update progress',
                ...(errorDetails && { details: errorDetails }),
            },
            { status: 500 }
        );
    }
}
