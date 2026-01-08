import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { userBookmarks, heroes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Helper function to get user ID from JWT token
async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
    });
    return token?.id as string || null;
}

// GET - Get user's favorite heroes
export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get all favorite heroes for the user
        const favorites = await db
            .select({
                id: userBookmarks.id,
                heroId: userBookmarks.heroId,
                createdAt: userBookmarks.createdAt,
                hero: {
                    id: heroes.id,
                    name: heroes.name,
                    localizedName: heroes.localizedName,
                    primaryAttr: heroes.primaryAttr,
                    img: heroes.img,
                    icon: heroes.icon,
                },
            })
            .from(userBookmarks)
            .leftJoin(heroes, eq(userBookmarks.heroId, heroes.id))
            .where(eq(userBookmarks.userId, userId));

        // Filter to only hero bookmarks
        const heroFavorites = favorites.filter((f: typeof favorites[number]) => f.heroId !== null);

        return NextResponse.json({
            favorites: heroFavorites,
            count: heroFavorites.length,
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
            { error: 'Failed to fetch favorites' },
            { status: 500 }
        );
    }
}

// POST - Add a hero to favorites
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
        const { heroId } = body;

        if (!heroId || typeof heroId !== 'number') {
            return NextResponse.json(
                { error: 'Invalid heroId' },
                { status: 400 }
            );
        }

        // Check if already favorited
        const existing = await db.query.userBookmarks.findFirst({
            where: and(
                eq(userBookmarks.userId, userId),
                eq(userBookmarks.heroId, heroId)
            ),
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Hero already in favorites' },
                { status: 409 }
            );
        }

        // Add to favorites
        await db.insert(userBookmarks).values({
            userId: userId,
            heroId: heroId,
        });

        return NextResponse.json({
            success: true,
            message: 'Hero added to favorites',
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json(
            { error: 'Failed to add favorite' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a hero from favorites
export async function DELETE(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const heroId = parseInt(searchParams.get('heroId') || '');

        if (isNaN(heroId)) {
            return NextResponse.json(
                { error: 'Invalid heroId' },
                { status: 400 }
            );
        }

        // Remove from favorites
        await db
            .delete(userBookmarks)
            .where(
                and(
                    eq(userBookmarks.userId, userId),
                    eq(userBookmarks.heroId, heroId)
                )
            );

        return NextResponse.json({
            success: true,
            message: 'Hero removed from favorites',
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
            { error: 'Failed to remove favorite' },
            { status: 500 }
        );
    }
}
