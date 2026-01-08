import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { userBookmarks, heroes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET - Get user's favorite heroes
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
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
            .where(
                and(
                    eq(userBookmarks.userId, session.user.id),
                    // Only get hero bookmarks (heroId is not null)
                )
            );

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
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
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
                eq(userBookmarks.userId, session.user.id),
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
            userId: session.user.id,
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
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
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
                    eq(userBookmarks.userId, session.user.id),
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
