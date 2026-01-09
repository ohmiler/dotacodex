import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/layout/Navbar';
import HeroDetail from '@/components/heroes/HeroDetail';
import { db } from '@/lib/db';
import { heroes, items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';
import openDota from '@/lib/opendota';

// Revalidate every 24 hours
export const revalidate = 86400;

// Cache all heroes for 24 hours (shared across all pages)
const getAllHeroes = unstable_cache(
    async () => {
        return await db.select().from(heroes);
    },
    ['all-heroes'],
    { revalidate: 86400 }
);

// Cache all items for 24 hours (shared across all pages)
const getAllItems = unstable_cache(
    async () => {
        return await db.select().from(items);
    },
    ['all-items'],
    { revalidate: 86400 }
);

// Cache individual hero by ID for 24 hours
const getHeroById = async (heroId: number) => {
    const cached = unstable_cache(
        async () => {
            return await db.query.heroes.findFirst({
                where: eq(heroes.id, heroId),
            });
        },
        [`hero-${heroId}`],
        { revalidate: 86400 }
    );
    return cached();
};

// Cache hero matchups for 24 hours (with heroId in key)
const getCachedMatchups = async (heroId: number) => {
    const cached = unstable_cache(
        async () => {
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
        [`hero-matchups-${heroId}`],
        { revalidate: 86400 }
    );
    return cached();
};

// Cache hero item builds for 24 hours (with heroId in key)
const getCachedItemBuilds = async (heroId: number) => {
    const cached = unstable_cache(
        async () => {
            try {
                const itemPopularity = await openDota.getHeroItemPopularity(heroId);

                const processItems = (itemsData: Record<string, number>, limit: number = 6) => {
                    return Object.entries(itemsData)
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
        [`hero-items-${heroId}`],
        { revalidate: 86400 }
    );
    return cached();
};

// Cache hero abilities for 24 hours
const getCachedHeroAbilities = async (heroName: string) => {
    const cached = unstable_cache(
        async () => {
            try {
                // Fetch both endpoints in parallel
                const [heroAbilitiesMapping, allAbilities] = await Promise.all([
                    openDota.getHeroAbilitiesMapping(),
                    openDota.getAbilities(),
                ]);

                // Get abilities for this hero (convert name to npc format)
                const npcName = `npc_dota_hero_${heroName}`;
                const heroAbilityList = heroAbilitiesMapping[npcName];

                if (!heroAbilityList?.abilities) {
                    return [];
                }

                // Get detailed info for each ability
                type AbilityInfo = {
                    name: string;
                    dname: string;
                    desc: string;
                    behavior: string | string[] | undefined;
                    dmg_type: string | undefined;
                    mc: string | string[] | undefined;
                    cd: string | string[] | undefined;
                    img: string | undefined;
                    is_innate: boolean;
                    attrib: Array<{ key: string; header: string; value: string | string[] }> | undefined;
                };

                const abilities: AbilityInfo[] = heroAbilityList.abilities
                    .map(abilityName => {
                        const detail = allAbilities[abilityName];
                        if (!detail) return null;

                        // Skip hidden, generic, and talent abilities
                        const behavior = Array.isArray(detail.behavior)
                            ? detail.behavior
                            : [detail.behavior];

                        if (behavior.includes('Hidden')) return null;
                        if (abilityName.includes('special_bonus')) return null;
                        if (!detail.dname) return null;

                        return {
                            name: abilityName,
                            dname: detail.dname,
                            desc: detail.desc || '',
                            behavior: detail.behavior,
                            dmg_type: detail.dmg_type,
                            mc: detail.mc,
                            cd: detail.cd,
                            img: detail.img,
                            is_innate: detail.is_innate || false,
                            attrib: detail.attrib,
                        };
                    })
                    .filter((ability): ability is AbilityInfo => ability !== null);

                return abilities;
            } catch (error) {
                console.error('Error fetching hero abilities:', error);
                return [];
            }
        },
        [`hero-abilities-${heroName}`],
        { revalidate: 86400 }
    );
    return cached();
};

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

    // Fetch hero data quickly (from DB - fast)
    const [hero, allHeroes, allItems] = await Promise.all([
        getHeroById(heroId),
        getAllHeroes(),
        getAllItems(),
    ]);

    if (!hero) {
        notFound();
    }

    // Map hero to expected type
    const heroData = {
        ...hero,
        roles: hero.roles || [],
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                {/* Page loads immediately with basic hero info */}
                {/* Counters and items stream in via Suspense */}
                <Suspense fallback={<HeroDetailSkeleton />}>
                    <HeroDetailWithData
                        heroId={heroId}
                        heroData={heroData}
                        allHeroes={allHeroes.map((h: typeof allHeroes[number]) => ({ ...h, roles: h.roles || [] }))}
                        allItems={allItems}
                    />
                </Suspense>
            </main>
        </div>
    );
}

// Async component that fetches slow data (OpenDota)
async function HeroDetailWithData({
    heroId,
    heroData,
    allHeroes,
    allItems,
}: {
    heroId: number;
    heroData: Parameters<typeof HeroDetail>[0]['hero'];
    allHeroes: Parameters<typeof HeroDetail>[0]['allHeroes'];
    allItems: NonNullable<Parameters<typeof HeroDetail>[0]['allItems']>;
}) {
    // Extract hero name for abilities lookup (e.g., "Anti-Mage" -> "antimage")
    const heroName = heroData.name.replace('npc_dota_hero_', '');

    // Fetch OpenDota data in parallel (with timeout and proper cache keys)
    const [matchups, itemBuilds, abilities] = await Promise.all([
        getCachedMatchups(heroId),
        getCachedItemBuilds(heroId),
        getCachedHeroAbilities(heroName),
    ]);

    return (
        <HeroDetail
            hero={heroData}
            allHeroes={allHeroes}
            allItems={allItems}
            counters={matchups.counters}
            goodAgainst={matchups.goodAgainst}
            itemBuilds={itemBuilds}
            abilities={abilities}
        />
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
