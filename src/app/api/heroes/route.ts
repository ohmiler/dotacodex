import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroes } from '@/lib/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const role = searchParams.get('role');
        const attribute = searchParams.get('attribute');

        let query = db.select().from(heroes);

        // Apply filters
        const conditions = [];

        if (search) {
            conditions.push(
                or(
                    like(heroes.localizedName, `%${search}%`),
                    like(heroes.name, `%${search}%`)
                )
            );
        }

        if (attribute) {
            conditions.push(eq(heroes.primaryAttr, attribute));
        }

        // Execute query
        const heroList = await query;

        // Filter by role (done in JS since roles is JSON)
        let filteredHeroes = heroList;
        if (role) {
            filteredHeroes = heroList.filter(hero =>
                hero.roles && (hero.roles as string[]).includes(role)
            );
        }

        return NextResponse.json(filteredHeroes);
    } catch (error) {
        console.error('Error fetching heroes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch heroes' },
            { status: 500 }
        );
    }
}
