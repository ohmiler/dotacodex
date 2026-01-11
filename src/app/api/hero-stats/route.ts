import { NextResponse } from 'next/server';

const OPENDOTA_BASE_URL = 'https://api.opendota.com/api';

interface HeroStat {
    id: number;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    roles: string[];
    img: string;
    icon: string;
    pro_pick?: number;
    pro_win?: number;
    '1_pick'?: number;
    '1_win'?: number;
    '2_pick'?: number;
    '2_win'?: number;
    '3_pick'?: number;
    '3_win'?: number;
    '4_pick'?: number;
    '4_win'?: number;
    '5_pick'?: number;
    '5_win'?: number;
    '6_pick'?: number;
    '6_win'?: number;
    '7_pick'?: number;
    '7_win'?: number;
    '8_pick'?: number;
    '8_win'?: number;
}

// Tier thresholds based on win rate
function getTier(winRate: number): 'S' | 'A' | 'B' | 'C' | 'D' {
    if (winRate >= 54) return 'S';
    if (winRate >= 52) return 'A';
    if (winRate >= 50) return 'B';
    if (winRate >= 48) return 'C';
    return 'D';
}

// Calculate stats for specific rank range
function calculateRankStats(hero: HeroStat, rankStart: number, rankEnd: number) {
    let totalPicks = 0;
    let totalWins = 0;

    for (let i = rankStart; i <= rankEnd; i++) {
        const pickKey = `${i}_pick` as keyof HeroStat;
        const winKey = `${i}_win` as keyof HeroStat;
        totalPicks += (hero[pickKey] as number) || 0;
        totalWins += (hero[winKey] as number) || 0;
    }

    return {
        picks: totalPicks,
        wins: totalWins,
        winRate: totalPicks > 0 ? (totalWins / totalPicks) * 100 : 0,
    };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const rankFilter = searchParams.get('rank') || 'all';

        const res = await fetch(`${OPENDOTA_BASE_URL}/heroStats`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            throw new Error('Failed to fetch hero stats');
        }

        const heroStats: HeroStat[] = await res.json();

        // Define rank ranges
        const rankRanges: Record<string, [number, number]> = {
            'all': [1, 8],
            'herald-guardian': [1, 2],
            'crusader-archon': [3, 4],
            'legend-ancient': [5, 6],
            'divine-immortal': [7, 8],
        };

        const [rankStart, rankEnd] = rankRanges[rankFilter] || rankRanges['all'];

        // Process all heroes with stats
        const allHeroes = heroStats.map(hero => {
            const stats = calculateRankStats(hero, rankStart, rankEnd);
            const winRate = Math.round(stats.winRate * 100) / 100;

            return {
                id: hero.id,
                localizedName: hero.localized_name,
                primaryAttr: hero.primary_attr,
                attackType: hero.attack_type,
                img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
                icon: `https://cdn.cloudflare.steamstatic.com${hero.icon}`,
                roles: hero.roles || [],
                winRate,
                pickRate: stats.picks,
                tier: getTier(winRate),
            };
        }).filter(h => h.pickRate > 1000); // Filter out heroes with too few picks

        // Sort by win rate descending
        allHeroes.sort((a, b) => b.winRate - a.winRate);

        // Group by tier
        const tierGroups = {
            S: allHeroes.filter(h => h.tier === 'S'),
            A: allHeroes.filter(h => h.tier === 'A'),
            B: allHeroes.filter(h => h.tier === 'B'),
            C: allHeroes.filter(h => h.tier === 'C'),
            D: allHeroes.filter(h => h.tier === 'D'),
        };

        // Top 10 for homepage widgets
        const topByWinRate = allHeroes.slice(0, 10);
        const topByPickRate = [...allHeroes]
            .sort((a, b) => b.pickRate - a.pickRate)
            .slice(0, 10);

        return NextResponse.json({
            allHeroes,
            tierGroups,
            topByWinRate,
            topByPickRate,
            rankFilter,
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
        });
    } catch (error) {
        console.error('Error fetching hero stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hero stats' },
            { status: 500 }
        );
    }
}
