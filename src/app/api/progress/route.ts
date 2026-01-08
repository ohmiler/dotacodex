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

        // Convert slug to numeric ID for database
        const topicId = slugToId(topicSlug);

        // Check if progress record exists
        const existing = await db.query.userProgress.findFirst({
            where: and(
                eq(userProgress.userId, userId),
                eq(userProgress.topicId, topicId)
            ),
        });

        if (existing) {
            // Update existing record
            await db
                .update(userProgress)
                .set({
                    completed: completed,
                    completedAt: completed ? new Date() : null,
                })
                .where(eq(userProgress.id, existing.id));
        } else {
            // Create new progress record
            await db.insert(userProgress).values({
                userId: userId,
                topicId: topicId,
                completed: completed,
                completedAt: completed ? new Date() : null,
            });
        }

        return NextResponse.json({
            success: true,
            topicId,
            topicSlug,
            message: completed ? 'Topic marked as complete' : 'Topic marked as incomplete',
        });
    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
            { error: 'Failed to update progress' },
            { status: 500 }
        );
    }
}
