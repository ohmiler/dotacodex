'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import { generateHeroSlug } from '@/lib/utils';

interface HeroStats {
    id: number;
    localizedName: string;
    primaryAttr: string;
    attackType: string;
    img: string;
    icon: string;
    roles: string[];
    winRate: number;
    pickRate: number;
    tier: 'S' | 'A' | 'B' | 'C' | 'D';
}

interface TierGroups {
    S: HeroStats[];
    A: HeroStats[];
    B: HeroStats[];
    C: HeroStats[];
    D: HeroStats[];
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    S: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50' },
    A: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50' },
    B: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
    C: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
    D: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/50' },
};

const RANK_FILTERS = [
    { value: 'all', label: 'All Ranks' },
    { value: 'herald-guardian', label: 'Herald - Guardian' },
    { value: 'crusader-archon', label: 'Crusader - Archon' },
    { value: 'legend-ancient', label: 'Legend - Ancient' },
    { value: 'divine-immortal', label: 'Divine - Immortal' },
];

const ROLE_FILTERS = ['All', 'Carry', 'Support', 'Nuker', 'Disabler', 'Durable', 'Escape', 'Pusher', 'Initiator'];

export default function TierListPage() {
    const t = useTranslations();
    const [tierGroups, setTierGroups] = useState<TierGroups | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rankFilter, setRankFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('All');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`/api/hero-stats?rank=${rankFilter}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setTierGroups(data.tierGroups);
            } catch {
                setError('Failed to load tier list');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [rankFilter]);

    const filterByRole = (heroes: HeroStats[]) => {
        if (roleFilter === 'All') return heroes;
        return heroes.filter(h => h.roles.includes(roleFilter));
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">🏆 {t('tierList.title') || 'Meta Tier List'}</h1>
                        <p className="text-[var(--color-text-muted)]">
                            {t('tierList.subtitle') || 'Hero rankings based on current patch win rates'}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-8 justify-center">
                        {/* Rank Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-[var(--color-text-muted)]">Rank:</span>
                            <select
                                value={rankFilter}
                                onChange={(e) => setRankFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                            >
                                {RANK_FILTERS.map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div className="flex flex-wrap gap-2">
                            {ROLE_FILTERS.map(role => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${roleFilter === role
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="text-center py-20 text-red-400">{error}</div>
                    )}

                    {/* Tier Groups */}
                    {!loading && !error && tierGroups && (
                        <div className="space-y-8">
                            {(['S', 'A', 'B', 'C', 'D'] as const).map(tier => {
                                const heroes = filterByRole(tierGroups[tier]);
                                if (heroes.length === 0) return null;

                                const colors = TIER_COLORS[tier];

                                return (
                                    <div key={tier} className="card overflow-hidden">
                                        {/* Tier Header */}
                                        <div className={`p-4 ${colors.bg} border-b ${colors.border}`}>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-3xl font-black ${colors.text}`}>{tier}</span>
                                                <span className="text-[var(--color-text-muted)]">
                                                    {tier === 'S' && '≥54% Win Rate'}
                                                    {tier === 'A' && '52-53.99% Win Rate'}
                                                    {tier === 'B' && '50-51.99% Win Rate'}
                                                    {tier === 'C' && '48-49.99% Win Rate'}
                                                    {tier === 'D' && '<48% Win Rate'}
                                                </span>
                                                <span className={`ml-auto ${colors.text}`}>
                                                    {heroes.length} heroes
                                                </span>
                                            </div>
                                        </div>

                                        {/* Heroes Grid */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                                {heroes.map(hero => (
                                                    <Link
                                                        key={hero.id}
                                                        href={`/heroes/${generateHeroSlug(hero.localizedName, hero.id)}`}
                                                        className={`group p-3 rounded-xl bg-[var(--color-surface-elevated)] hover:${colors.bg} border border-transparent hover:${colors.border} transition-all`}
                                                    >
                                                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-2">
                                                            <Image
                                                                src={hero.img}
                                                                alt={hero.localizedName}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-sm font-medium truncate text-center group-hover:text-[var(--color-primary)]">
                                                            {hero.localizedName}
                                                        </p>
                                                        <p className={`text-xs text-center ${colors.text}`}>
                                                            {hero.winRate.toFixed(1)}%
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
