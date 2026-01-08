import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { userProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

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
        hash = hash & hash; // Convert to 32-bit integer
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

        // Get all progress for the user
        const progress = await db
            .select({
                id: userProgress.id,
                topicId: userProgress.topicId,
                completed: userProgress.completed,
                completedAt: userProgress.completedAt,
            })
            .from(userProgress)
            .where(eq(userProgress.userId, userId));

        // Count completed
        const completedCount = progress.filter((p: typeof progress[number]) => p.completed).length;

        return NextResponse.json({
            progress,
            completedCount,
            totalCount: progress.length,
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
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
            console.log('[Progress API] No user ID - returning 401');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { topicSlug, completed = true } = body;
        console.log('[Progress API] Topic slug:', topicSlug, 'Completed:', completed);

        if (!topicSlug || typeof topicSlug !== 'string') {
            console.log('[Progress API] Invalid topicSlug');
            return NextResponse.json(
                { error: 'Invalid topicSlug' },
                { status: 400 }
            );
        }

        // Convert slug to numeric ID for database
        const topicId = slugToId(topicSlug);
        console.log('[Progress API] Topic ID (hash):', topicId);

        // Check if progress record exists
        console.log('[Progress API] Checking existing record...');
        let existing = null;
        try {
            const existingRecords = await db
                .select()
                .from(userProgress)
                .where(
                    and(
                        eq(userProgress.userId, userId),
                        eq(userProgress.topicId, topicId)
                    )
                )
                .limit(1);
            existing = existingRecords[0];
            console.log('[Progress API] Existing record:', existing ? 'found' : 'not found');
        } catch (selectError) {
            console.error('[Progress API] Select error:', selectError);
            throw selectError;
        }

        if (existing) {
            // Update existing record
            console.log('[Progress API] Updating existing record ID:', existing.id);
            try {
                await db
                    .update(userProgress)
                    .set({
                        completed: completed,
                        completedAt: completed ? new Date() : null,
                    })
                    .where(eq(userProgress.id, existing.id));
                console.log('[Progress API] Update successful');
            } catch (updateError) {
                console.error('[Progress API] Update error:', updateError);
                throw updateError;
            }
        } else {
            // Create new progress record
            console.log('[Progress API] Inserting new record...');
            try {
                await db.insert(userProgress).values({
                    userId: userId,
                    topicId: topicId,
                    completed: completed,
                    completedAt: completed ? new Date() : null,
                });
                console.log('[Progress API] Insert successful');
            } catch (insertError) {
                console.error('[Progress API] Insert error:', insertError);
                throw insertError;
            }
        }

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
