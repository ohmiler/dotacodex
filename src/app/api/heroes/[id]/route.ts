import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import { heroes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import openDota from '@/lib/opendota';

// Cache hero matchups for 24 hours
const getCachedMatchups = unstable_cache(
    async (heroId: number) => {
        try {
            const matchupsData = await openDota.getHeroMatchups(heroId);
            const matchups = matchupsData
                .map(m => ({
                    heroId: m.hero_id,
                    gamesPlayed: m.games_played,
                    wins: m.wins,
                    winRate: m.games_played > 0 ? (m.wins / m.games_played) * 100 : 0,
                }))
                .filter(m => m.gamesPlayed >= 100);

            const counters = [...matchups]
                .sort((a, b) => a.winRate - b.winRate)
                .slice(0, 5);

            const goodAgainst = [...matchups]
                .sort((a, b) => b.winRate - a.winRate)
                .slice(0, 5);

            return { counters, goodAgainst };
        } catch (error) {
            console.error('Error fetching matchups:', error);
            return { counters: [], goodAgainst: [] };
        }
    },
    ['hero-matchups'],
    { revalidate: 86400 } // 24 hours
);

// Cache hero item builds for 24 hours
const getCachedItemBuilds = unstable_cache(
    async (heroId: number) => {
        try {
            const itemPopularity = await openDota.getHeroItemPopularity(heroId);

            const processItems = (items: Record<string, number>, limit: number = 6) => {
                return Object.entries(items)
                    .map(([itemId, count]) => ({ itemId: parseInt(itemId), count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, limit);
            };

            return {
                startGame: processItems(itemPopularity.start_game_items || {}, 4),
                earlyGame: processItems(itemPopularity.early_game_items || {}, 6),
                midGame: processItems(itemPopularity.mid_game_items || {}, 6),
                lateGame: processItems(itemPopularity.late_game_items || {}, 6),
            };
        } catch (error) {
            console.error('Error fetching item popularity:', error);
            return null;
        }
    },
    ['hero-item-builds'],
    { revalidate: 86400 } // 24 hours
);

// Cache this API for 24 hours
export const revalidate = 86400;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const heroId = parseInt(id);

        if (isNaN(heroId)) {
            return NextResponse.json({ error: 'Invalid hero ID' }, { status: 400 });
        }

        // Get hero from local database
        const hero = await db.query.heroes.findFirst({
            where: eq(heroes.id, heroId),
        });

        if (!hero) {
            return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
        }

        // Fetch from cache (or OpenDota if not cached)
        const { counters, goodAgainst } = await getCachedMatchups(heroId);
        const itemBuilds = await getCachedItemBuilds(heroId);

        return NextResponse.json({
            ...hero,
            counters,
            goodAgainst,
            itemBuilds,
        });
    } catch (error) {
        console.error('Error fetching hero:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hero' },
            { status: 500 }
        );
    }
}
