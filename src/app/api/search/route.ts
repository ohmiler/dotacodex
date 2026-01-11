import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroes, items } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    if (!query || query.length < 1) {
        return NextResponse.json([]);
    }

    try {
        // Search heroes
        const heroResults = await db
            .select({
                id: heroes.id,
                name: heroes.name,
                localizedName: heroes.localizedName,
                img: heroes.img,
                primaryAttr: heroes.primaryAttr,
                roles: heroes.roles,
            })
            .from(heroes)
            .where(
                sql`LOWER(${heroes.localizedName}) LIKE ${'%' + query + '%'} OR LOWER(${heroes.name}) LIKE ${'%' + query + '%'}`
            )
            .limit(10);

        // Search items (filter recipes in JS since boolean handling is tricky in SQLite)
        const itemResultsRaw = await db
            .select({
                id: items.id,
                name: items.name,
                localizedName: items.localizedName,
                img: items.img,
                cost: items.cost,
                recipe: items.recipe,
            })
            .from(items)
            .where(
                sql`(LOWER(${items.localizedName}) LIKE ${'%' + query + '%'} OR LOWER(${items.name}) LIKE ${'%' + query + '%'}) AND ${items.cost} > 0`
            )
            .limit(20);

        // Filter out recipes and limit
        const itemResults = itemResultsRaw
            .filter((item: typeof itemResultsRaw[number]) => !item.recipe)
            .slice(0, 10);

        // Combine and format results
        const results = [
            ...heroResults.map((hero: typeof heroResults[number]) => ({
                type: 'hero' as const,
                id: hero.id,
                name: hero.name,
                localizedName: hero.localizedName || hero.name,
                img: hero.img,
                primaryAttr: hero.primaryAttr,
                roles: hero.roles,
            })),
            ...itemResults.map((item: typeof itemResults[number]) => ({
                type: 'item' as const,
                id: item.id,
                name: item.name,
                localizedName: item.localizedName || item.name,
                img: item.img
                    ? (item.img.startsWith('http') ? item.img : `https://cdn.cloudflare.steamstatic.com${item.img}`)
                    : null,
                cost: item.cost,
            })),
        ];

        // Sort by relevance (exact match first, then starts with, then contains)
        results.sort((a, b) => {
            const aName = a.localizedName.toLowerCase();
            const bName = b.localizedName.toLowerCase();

            // Exact match first
            if (aName === query) return -1;
            if (bName === query) return 1;

            // Starts with
            const aStarts = aName.startsWith(query);
            const bStarts = bName.startsWith(query);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // Heroes before items by default
            if (a.type === 'hero' && b.type === 'item') return -1;
            if (a.type === 'item' && b.type === 'hero') return 1;

            return aName.localeCompare(bName);
        });

        return NextResponse.json(results.slice(0, 15));
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
