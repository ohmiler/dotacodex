import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/layout/Navbar';
import HeroDetail from '@/components/heroes/HeroDetail';
import { db } from '@/lib/db';
import { heroes, items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';
import openDota from '@/lib/opendota';
import { abilities as dotaAbilities, hero_abilities as dotaHeroAbilities } from 'dotaconstants';
import { generateHeroSlug, getHeroIdFromSlug } from '@/lib/utils';

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
                // Use dotaconstants package data (more accurate and up-to-date)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const heroAbilitiesMapping = dotaHeroAbilities as any as Record<string, { abilities: string[]; talents: { name: string; level: number }[] }>;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const allAbilities = dotaAbilities as any as Record<string, {
                    dname?: string;
                    desc?: string;
                    behavior?: string | string[];
                    dmg_type?: string;
                    mc?: string | string[];
                    cd?: string | string[];
                    img?: string;
                    is_innate?: boolean;
                    attrib?: Array<{ key: string; header: string; value: string | string[] }>;
                }>;

                // Get abilities for this hero (convert name to npc format)
                const npcName = `npc_dota_hero_${heroName}`;
                const heroAbilityList = heroAbilitiesMapping[npcName];

                if (!heroAbilityList) {
                    return { abilities: [], talents: [] };
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

                const abilities: AbilityInfo[] = (heroAbilityList.abilities || [])
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

                // Helper to replace {s:key} with attrib values
                // First checks talent's own attrib, then searches all hero abilities
                const resolveAttributePlaceholders = (
                    text: string,
                    talentAttrib: Array<{ key: string; value: string | string[] }> | undefined,
                    allHeroAbilities: typeof abilities
                ): string => {
                    let result = text.replace(/\{s:([^}]+)\}/g, (match, key) => {
                        // First try talent's own attrib
                        if (talentAttrib) {
                            const attr = talentAttrib.find(a => a.key === key);
                            if (attr) {
                                return Array.isArray(attr.value) ? attr.value[0] : attr.value;
                            }
                        }

                        // If key starts with "bonus_", strip it and search abilities
                        const searchKey = key.replace(/^bonus_/, '');
                        // Also try lowercase version for generated keys (AbilityCastRange -> abilitycastrange)
                        const lowerSearchKey = searchKey.toLowerCase();

                        // Search through hero abilities for matching attrib
                        for (const ability of allHeroAbilities) {
                            if (ability.attrib) {
                                const foundAttr = ability.attrib.find((a: { key: string }) =>
                                    a.key === searchKey || a.key === key ||
                                    a.key === lowerSearchKey || a.key.toLowerCase() === lowerSearchKey
                                );
                                if (foundAttr) {
                                    const val = (foundAttr as { value: string | string[] }).value;
                                    return Array.isArray(val) ? val[val.length - 1] : String(val);
                                }
                            }

                            // Special handling for cooldown reduction talents
                            if (lowerSearchKey === 'abilitycooldown' && ability.cd) {
                                // Return the highest cooldown value (usually the one that gets reduced)
                                const cdVal = ability.cd;
                                const cdNum = Array.isArray(cdVal) ? cdVal[cdVal.length - 1] : cdVal;
                                // For cooldown reduction talents, use a standard value (3s is common)
                                return '3';
                            }
                        }

                        return match; // Return original if not found
                    });

                    // Fix double percent signs
                    result = result.replace(/%%/g, '%');

                    return result;
                };

                // Get talents with display names
                type TalentInfo = {
                    name: string;
                    dname: string;
                    level: number;
                };

                const talents: TalentInfo[] = (heroAbilityList.talents || [])
                    .map(talent => {
                        const detail = allAbilities[talent.name];
                        let dname = detail?.dname || talent.name.replace('special_bonus_', '').replace(/_/g, ' ');

                        // Replace placeholders with actual values (searches hero abilities too)
                        dname = resolveAttributePlaceholders(dname, detail?.attrib, abilities);

                        // If dname still has placeholders, use first attrib header as fallback
                        if (dname.includes('{s:') && detail?.attrib && detail.attrib.length > 0) {
                            const firstAttrib = detail.attrib[0];
                            if (firstAttrib.header) {
                                dname = firstAttrib.header.replace(':', '').trim();
                            }
                        }

                        return {
                            name: talent.name,
                            dname,
                            level: talent.level,
                        };
                    });

                return { abilities, talents };
            } catch (error) {
                console.error('Error fetching hero abilities:', error);
                return { abilities: [], talents: [] };
            }
        },
        [`hero-abilities-${heroName}`],
        { revalidate: 86400 }
    );
    return cached();
};

// Generate static params for all heroes
export async function generateStaticParams() {
    const allHeroes = await db.select({ id: heroes.id, name: heroes.localizedName }).from(heroes);
    return allHeroes.map((hero: { id: number; name: string }) => ({
        slug: generateHeroSlug(hero.name, hero.id),
    }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const heroId = getHeroIdFromSlug(slug);

    const hero = await getHeroById(heroId);

    if (!hero) {
        return { title: 'Hero Not Found - DotaCodex' };
    }

    const description = `Learn how to play ${hero.localizedName} in Dota 2 - ${hero.primaryAttr} hero with item builds, counters, and tips.`;

    return {
        title: `${hero.localizedName} - Hero Guide`,
        description,
        alternates: {
            // Use the current slug as canonical
            canonical: `/heroes/${slug}`,
        },
        openGraph: {
            title: `${hero.localizedName} | DotaCodex`,
            description,
            type: 'article',
            // images: is automatically handled by opengraph-image.tsx
        },
        twitter: {
            card: 'summary_large_image',
            title: `${hero.localizedName} | DotaCodex`,
            description,
            // images: is automatically handled by twitter-image.tsx
        },
    };
}

export default async function HeroPage({ params }: Props) {
    const { slug } = await params;

    // Check for legacy numeric format
    if (/^\d+$/.test(slug)) {
        const legacyId = parseInt(slug);
        const hero = await getHeroById(legacyId);
        if (hero) {
            // Permanent redirect to new slug format
            permanentRedirect(`/heroes/${generateHeroSlug(hero.localizedName, hero.id)}`);
        }
    }

    const heroId = getHeroIdFromSlug(slug);

    if (!heroId) {
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
        img: hero.img ? hero.img.replace('/sb.png', '_full.png').replace('/vert.jpg', '_full.png') : hero.img,
    };

    // Parallel fetch for other data
    const [matchups, itemBuilds, abilitiesData] = await Promise.all([
        getCachedMatchups(hero.id),
        getCachedItemBuilds(hero.id),
        getCachedHeroAbilities(hero.name),
    ]);



    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <Navbar />

            <Suspense fallback={<div className="h-screen flex items-center justify-center text-white">Loading...</div>}>
                <HeroDetail
                    hero={heroData}
                    allHeroes={allHeroes as any} // TODO: Fix type mismatch between schema and component
                    counters={matchups.counters}
                    goodAgainst={matchups.goodAgainst}
                    itemBuilds={itemBuilds}
                    abilities={abilitiesData.abilities}
                    talents={abilitiesData.talents}
                />
            </Suspense>
        </main>
    );
}
