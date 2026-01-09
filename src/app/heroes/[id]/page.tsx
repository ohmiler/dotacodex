import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/layout/Navbar';
import HeroDetail from '@/components/heroes/HeroDetail';
import { db } from '@/lib/db';
import { heroes, items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';

// Revalidate every 24 hours (reduced from 1 hour to save reads)
export const revalidate = 86400;

// Cache all heroes for 24 hours
const getAllHeroes = unstable_cache(
    async () => {
        return await db.select().from(heroes);
    },
    ['all-heroes'],
    { revalidate: 86400 }
);

// Cache all items for 24 hours
const getAllItems = unstable_cache(
    async () => {
        return await db.select().from(items);
    },
    ['all-items'],
    { revalidate: 86400 }
);

// Cache individual hero by ID for 24 hours
const getHeroById = unstable_cache(
    async (heroId: number) => {
        return await db.query.heroes.findFirst({
            where: eq(heroes.id, heroId),
        });
    },
    ['hero-by-id'],
    { revalidate: 86400 }
);

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

    const hero = await getHeroById(heroId);

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

    // Use cached queries
    const hero = await getHeroById(heroId);

    if (!hero) {
        notFound();
    }

    // These are now cached - won't hit DB if already cached
    const allHeroes = await getAllHeroes();
    const allItems = await getAllItems();

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
