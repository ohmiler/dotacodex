'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { generateHeroSlug } from '@/lib/utils';

interface HeroStat {
    id: number;
    localizedName: string;
    primaryAttr: string;
    img: string;
    icon: string;
    roles: string[];
    winRate: number;
    pickRate: number;
}

interface HeroStatsResponse {
    topByWinRate: HeroStat[];
    topByPickRate: HeroStat[];
}

type TabType = 'winRate' | 'pickRate';

export default function PopularHeroes() {
    const [stats, setStats] = useState<HeroStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('winRate');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/hero-stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching hero stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAttrColor = (attr: string) => {
        const colors: Record<string, string> = {
            str: 'text-red-400',
            agi: 'text-green-400',
            int: 'text-blue-400',
            all: 'text-purple-400',
        };
        return colors[attr] || 'text-gray-400';
    };

    const getAttrBgColor = (attr: string) => {
        const colors: Record<string, string> = {
            str: 'bg-red-500',
            agi: 'bg-green-500',
            int: 'bg-blue-500',
            all: 'bg-purple-500',
        };
        return colors[attr] || 'bg-gray-500';
    };

    if (loading) {
        return (
            <div className="card p-6">
                <div className="h-6 bg-[var(--color-surface-elevated)] rounded w-1/3 mb-4 animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-[16/9] bg-[var(--color-surface-elevated)] rounded-lg mb-2" />
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const heroes = activeTab === 'winRate' ? stats.topByWinRate : stats.topByPickRate;

    return (
        <div className="card p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    <h3 className="text-lg font-semibold">Popular Heroes</h3>
                    <span className="text-xs text-[var(--color-text-muted)]">(This Week)</span>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-[var(--color-surface-elevated)] rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('winRate')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'winRate'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'text-[var(--color-text-muted)] hover:text-white'
                            }`}
                    >
                        🏆 Win Rate
                    </button>
                    <button
                        onClick={() => setActiveTab('pickRate')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pickRate'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'text-[var(--color-text-muted)] hover:text-white'
                            }`}
                    >
                        🔥 Most Picked
                    </button>
                </div>
            </div>

            {/* Hero Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {heroes.slice(0, 5).map((hero, index) => (
                    <Link
                        key={hero.id}
                        href={`/heroes/${generateHeroSlug(hero.localizedName, hero.id)}`}
                        className="group relative"
                    >
                        {/* Rank Badge */}
                        <div className={`absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                index === 1 ? 'bg-gray-400' :
                                    index === 2 ? 'bg-amber-700' : 'bg-[var(--color-surface-elevated)]'
                            }`}>
                            {index + 1}
                        </div>

                        {/* Hero Image */}
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors mb-2">
                            <Image
                                src={hero.img}
                                alt={hero.localizedName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                            />
                            {/* Attribute indicator */}
                            <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${getAttrBgColor(hero.primaryAttr)}`} />
                        </div>

                        {/* Hero Info */}
                        <div>
                            <div className={`text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors ${getAttrColor(hero.primaryAttr)}`}>
                                {hero.localizedName}
                            </div>
                            <div className="text-xs text-[var(--color-text-muted)]">
                                {activeTab === 'winRate'
                                    ? `${hero.winRate.toFixed(1)}% WR`
                                    : `${(hero.pickRate / 1000).toFixed(0)}K picks`
                                }
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* View All Link */}
            <div className="mt-6 text-center">
                <Link
                    href="/heroes"
                    className="text-[var(--color-primary)] hover:underline text-sm font-medium"
                >
                    View All Heroes →
                </Link>
            </div>
        </div>
    );
}
