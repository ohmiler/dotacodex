import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroDetail from '@/components/heroes/HeroDetail';
import { db } from '@/lib/db';
import { heroes, items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const heroId = parseInt(id);

    const hero = await db.query.heroes.findFirst({
        where: eq(heroes.id, heroId),
    });

    if (!hero) {
        return { title: 'Hero Not Found - DotaCodex' };
    }

    return {
        title: `${hero.localizedName} - DotaCodex`,
        description: `Learn how to play ${hero.localizedName} in Dota 2. Stats, abilities, tips and counters.`,
    };
}

export default async function HeroPage({ params }: Props) {
    const { id } = await params;
    const heroId = parseInt(id);

    if (isNaN(heroId)) {
        notFound();
    }

    const hero = await db.query.heroes.findFirst({
        where: eq(heroes.id, heroId),
    });

    if (!hero) {
        notFound();
    }

    // Get all heroes for counter/synergy display
    const allHeroes = await db.select().from(heroes);

    // Get all items for item build display
    const allItems = await db.select().from(items);

    // Map hero to expected type
    const heroData = {
        ...hero,
        roles: hero.roles || [],
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                <Suspense fallback={<HeroDetailSkeleton />}>
                    <HeroDetail
                        hero={heroData}
                        allHeroes={allHeroes.map(h => ({ ...h, roles: h.roles || [] }))}
                        allItems={allItems}
                    />
                </Suspense>
            </main>
        </div>
    );
}

function HeroDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
            <div className="h-8 w-48 bg-[var(--color-surface)] rounded mb-4" />
            <div className="h-64 bg-[var(--color-surface)] rounded-xl mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-48 bg-[var(--color-surface)] rounded-xl" />
                <div className="h-48 bg-[var(--color-surface)] rounded-xl" />
            </div>
        </div>
    );
}
