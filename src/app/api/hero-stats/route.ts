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

export async function GET() {
    try {
        const res = await fetch(`${OPENDOTA_BASE_URL}/heroStats`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            throw new Error('Failed to fetch hero stats');
        }

        const heroStats: HeroStat[] = await res.json();

        // Calculate total picks and wins across all ranks
        const processedStats = heroStats.map(hero => {
            let totalPicks = 0;
            let totalWins = 0;

            // Sum up picks/wins from all ranks (1-8)
            for (let i = 1; i <= 8; i++) {
                const pickKey = `${i}_pick` as keyof HeroStat;
                const winKey = `${i}_win` as keyof HeroStat;
                totalPicks += (hero[pickKey] as number) || 0;
                totalWins += (hero[winKey] as number) || 0;
            }

            const winRate = totalPicks > 0 ? (totalWins / totalPicks) * 100 : 0;
            const pickRate = totalPicks;

            return {
                id: hero.id,
                localizedName: hero.localized_name,
                primaryAttr: hero.primary_attr,
                img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
                icon: `https://cdn.cloudflare.steamstatic.com${hero.icon}`,
                roles: hero.roles || [],
                winRate: Math.round(winRate * 100) / 100,
                pickRate: pickRate,
            };
        });

        // Sort by win rate (descending) and take top 10
        const topByWinRate = [...processedStats]
            .filter(h => h.pickRate > 10000) // Minimum picks to avoid outliers
            .sort((a, b) => b.winRate - a.winRate)
            .slice(0, 10);

        // Sort by pick rate (descending) and take top 10
        const topByPickRate = [...processedStats]
            .sort((a, b) => b.pickRate - a.pickRate)
            .slice(0, 10);

        return NextResponse.json({
            topByWinRate,
            topByPickRate,
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
