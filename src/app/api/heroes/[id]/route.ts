import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import openDota from '@/lib/opendota';

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

        // Fetch matchups from OpenDota
        let matchups: { heroId: number; gamesPlayed: number; wins: number; winRate: number }[] = [];
        try {
            const matchupsData = await openDota.getHeroMatchups(heroId);
            // Get top 5 counters (heroes that beat this hero) and top 5 good against
            matchups = matchupsData
                .map(m => ({
                    heroId: m.hero_id,
                    gamesPlayed: m.games_played,
                    wins: m.wins,
                    winRate: m.games_played > 0 ? (m.wins / m.games_played) * 100 : 0,
                }))
                .filter(m => m.gamesPlayed >= 100); // Only include heroes with enough games
        } catch (error) {
            console.error('Error fetching matchups:', error);
        }

        // Sort to find counters and synergies
        const counters = [...matchups]
            .sort((a, b) => a.winRate - b.winRate)
            .slice(0, 5);

        const goodAgainst = [...matchups]
            .sort((a, b) => b.winRate - a.winRate)
            .slice(0, 5);

        // Fetch item popularity from OpenDota
        let itemBuilds = null;
        try {
            const itemPopularity = await openDota.getHeroItemPopularity(heroId);

            // Convert item IDs to sorted arrays with top items
            const processItems = (items: Record<string, number>, limit: number = 6) => {
                return Object.entries(items)
                    .map(([itemId, count]) => ({ itemId: parseInt(itemId), count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, limit);
            };

            itemBuilds = {
                startGame: processItems(itemPopularity.start_game_items || {}, 4),
                earlyGame: processItems(itemPopularity.early_game_items || {}, 6),
                midGame: processItems(itemPopularity.mid_game_items || {}, 6),
                lateGame: processItems(itemPopularity.late_game_items || {}, 6),
            };
        } catch (error) {
            console.error('Error fetching item popularity:', error);
        }

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
