import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroDetail from '@/components/heroes/HeroDetail';
import { db } from '@/lib/db';
import { heroes, items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';

// Revalidate every 1 hour (ISR)
export const revalidate = 3600;

// Generate static pages for all heroes at build time
export async function generateStaticParams() {
    const allHeroes = await db.select({ id: heroes.id }).from(heroes);
    return allHeroes.map((hero: { id: number }) => ({
        id: String(hero.id),
    }));
}

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const heroId = parseInt(id);

    const hero = await db.query.heroes.findFirst({
        where: eq(heroes.id, heroId),
    });

    if (!hero) {
        return { title: 'Hero Not Found - DotaCodex' };
    }

    const description = `เรียนรู้วิธีเล่น ${hero.localizedName} ใน Dota 2 - ${hero.primaryAttr} hero | Learn how to play ${hero.localizedName} with item builds, counters, and tips.`;

    return {
        title: `${hero.localizedName} - Hero Guide`,
        description,
        openGraph: {
            title: `${hero.localizedName} | DotaCodex`,
            description,
            images: hero.img ? [{ url: hero.img, width: 256, height: 144, alt: hero.localizedName }] : undefined,
        },
        twitter: {
            card: 'summary',
            title: `${hero.localizedName} | DotaCodex`,
            description,
            images: hero.img ? [hero.img] : undefined,
        },
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
                        allHeroes={allHeroes.map((h: typeof allHeroes[number]) => ({ ...h, roles: h.roles || [] }))}
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
