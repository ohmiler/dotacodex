'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { generateHeroSlug } from '@/lib/utils';

interface Hero {
    id: number;
    name: string;
    localizedName: string;
    primaryAttr: string;
    attackType: string;
    roles: string[];
    img: string;
    icon: string;
    baseStr?: number;
    baseAgi?: number;
    baseInt?: number;
    moveSpeed?: number;
}

export default function HeroOfTheDay() {
    const t = useTranslations();
    const [hero, setHero] = useState<Hero | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeroOfTheDay();
    }, []);

    const fetchHeroOfTheDay = async () => {
        try {
            const res = await fetch('/api/heroes');
            if (res.ok) {
                const heroes: Hero[] = await res.json();
                if (heroes.length > 0) {
                    // Pick hero based on current date (same hero all day)
                    const today = new Date();
                    const dayOfYear = Math.floor(
                        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
                    );
                    const heroIndex = dayOfYear % heroes.length;
                    setHero(heroes[heroIndex]);
                }
            }
        } catch (error) {
            console.error('Error fetching hero of the day:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAttrColor = (attr: string) => {
        const colors: Record<string, string> = {
            str: 'bg-red-500',
            agi: 'bg-green-500',
            int: 'bg-blue-500',
            all: 'bg-purple-500',
        };
        return colors[attr] || 'bg-gray-500';
    };

    const getAttrLabel = (attr: string) => {
        const labels: Record<string, string> = {
            str: t('heroes.strength'),
            agi: t('heroes.agility'),
            int: t('heroes.intelligence'),
            all: t('heroes.universal'),
        };
        return labels[attr] || attr;
    };

    if (loading) {
        return (
            <div className="card p-6 animate-pulse">
                <div className="flex gap-6">
                    <div className="w-48 h-28 bg-[var(--color-surface-elevated)] rounded-lg" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-[var(--color-surface-elevated)] rounded w-1/3" />
                        <div className="h-4 bg-[var(--color-surface-elevated)] rounded w-1/2" />
                        <div className="h-4 bg-[var(--color-surface-elevated)] rounded w-1/4" />
                    </div>
                </div>
            </div>
        );
    }

    if (!hero) return null;

    return (
        <div className="card p-6 overflow-hidden relative group">
            {/* Background Glow Effect */}
            <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${getAttrColor(hero.primaryAttr)}`}
            />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🌟</span>
                    <h3 className="text-lg font-semibold">Hero of the Day</h3>
                </div>

                {/* Hero Content */}
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Hero Image */}
                    <Link
                        href={`/heroes/${generateHeroSlug(hero.localizedName, hero.id)}`}
                        className="relative w-full sm:w-48 aspect-[16/9] rounded-lg overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors"
                    >
                        {hero.img && (
                            <Image
                                src={hero.img}
                                alt={hero.localizedName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        )}
                    </Link>

                    {/* Hero Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href={`/heroes/${generateHeroSlug(hero.localizedName, hero.id)}`}
                                className="text-2xl font-bold hover:text-[var(--color-primary)] transition-colors"
                            >
                                {hero.localizedName}
                            </Link>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getAttrColor(hero.primaryAttr)}`}>
                                {getAttrLabel(hero.primaryAttr)}
                            </span>
                        </div>

                        {/* Roles */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(hero.roles || []).slice(0, 4).map(role => (
                                <span
                                    key={role}
                                    className="px-2 py-1 rounded text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-4 gap-3 text-center">
                            <div className="bg-[var(--color-surface-elevated)] rounded-lg p-2">
                                <div className="text-red-400 text-lg font-bold">{hero.baseStr || '—'}</div>
                                <div className="text-xs text-[var(--color-text-muted)]">STR</div>
                            </div>
                            <div className="bg-[var(--color-surface-elevated)] rounded-lg p-2">
                                <div className="text-green-400 text-lg font-bold">{hero.baseAgi || '—'}</div>
                                <div className="text-xs text-[var(--color-text-muted)]">AGI</div>
                            </div>
                            <div className="bg-[var(--color-surface-elevated)] rounded-lg p-2">
                                <div className="text-blue-400 text-lg font-bold">{hero.baseInt || '—'}</div>
                                <div className="text-xs text-[var(--color-text-muted)]">INT</div>
                            </div>
                            <div className="bg-[var(--color-surface-elevated)] rounded-lg p-2">
                                <div className="text-yellow-400 text-lg font-bold">{hero.moveSpeed || '—'}</div>
                                <div className="text-xs text-[var(--color-text-muted)]">MS</div>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link
                            href={`/heroes/${generateHeroSlug(hero.localizedName, hero.id)}`}
                            className="mt-4 btn btn-primary w-full sm:w-auto inline-flex justify-center"
                        >
                            View Full Guide →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
