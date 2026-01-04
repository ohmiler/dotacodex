import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';

export async function GET() {
    try {
        const allItems = await db.select().from(items);
        return NextResponse.json(allItems);
    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch items' },
            { status: 500 }
        );
    }
}
