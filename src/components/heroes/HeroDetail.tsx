'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Hero {
    id: number;
    name: string;
    localizedName: string;
    primaryAttr: string;
    attackType: string;
    roles: string[];
    img: string;
    icon: string;
    baseHealth: number;
    baseMana: number;
    baseArmor: number;
    moveSpeed: number;
    attackRange: number;
    baseStr: number;
    baseAgi: number;
    baseInt: number;
    strGain: number;
    agiGain: number;
    intGain: number;
    difficulty?: number;
    beginnerTips?: string;
    beginnerTipsTh?: string;
}

interface MatchupHero {
    heroId: number;
    gamesPlayed: number;
    wins: number;
    winRate: number;
}

interface Props {
    hero: Hero;
    allHeroes: Hero[];
}

export default function HeroDetail({ hero, allHeroes }: Props) {
    const t = useTranslations();
    const [counters, setCounters] = useState<MatchupHero[]>([]);
    const [goodAgainst, setGoodAgainst] = useState<MatchupHero[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatchups();
    }, [hero.id]);

    const fetchMatchups = async () => {
        try {
            const res = await fetch(`/api/heroes/${hero.id}`);
            if (res.ok) {
                const data = await res.json();
                setCounters(data.counters || []);
                setGoodAgainst(data.goodAgainst || []);
            }
        } catch (error) {
            console.error('Error fetching matchups:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHeroById = (id: number) => allHeroes.find(h => h.id === id);

    const getAttrIcon = (attr: string) => {
        const icons: Record<string, string> = {
            str: '💪',
            agi: '🏃',
            int: '🧠',
            all: '⭐',
        };
        return icons[attr] || '⭐';
    };

    const getAttrClass = (attr: string) => {
        const classes: Record<string, string> = {
            str: 'attr-strength',
            agi: 'attr-agility',
            int: 'attr-intelligence',
            all: 'attr-universal',
        };
        return classes[attr] || '';
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

    const getDifficultyLabel = (difficulty?: number) => {
        if (!difficulty) return { label: t('heroes.medium'), color: 'var(--color-medium)' };
        if (difficulty === 1) return { label: t('heroes.easy'), color: 'var(--color-easy)' };
        if (difficulty === 2) return { label: t('heroes.medium'), color: 'var(--color-medium)' };
        return { label: t('heroes.hard'), color: 'var(--color-hard)' };
    };

    const difficultyInfo = getDifficultyLabel(hero.difficulty);

    // Beginner tips based on hero attributes and roles
    const getDefaultTips = () => {
        const tips = [];

        if (hero.roles?.includes('Carry')) {
            tips.push('Focus on farming in the early game');
            tips.push('Position yourself safely in team fights');
        }
        if (hero.roles?.includes('Support')) {
            tips.push('Buy wards and support items');
            tips.push('Protect your carry in lane');
        }
        if (hero.attackType === 'Ranged') {
            tips.push('Use your range advantage to harass enemies');
        }
        if (hero.attackType === 'Melee') {
            tips.push('Be careful of ranged heroes in lane');
        }
        if (hero.primaryAttr === 'str') {
            tips.push('You are naturally tanky - use it to initiate fights');
        }
        if (hero.primaryAttr === 'agi') {
            tips.push('Your attack speed scales well - focus on damage items');
        }
        if (hero.primaryAttr === 'int') {
            tips.push('Manage your mana carefully in the early game');
        }

        return tips.slice(0, 4);
    };

    const tips = getDefaultTips();

    return (
        <div className="animate-fadeIn">
            {/* Hero Header */}
            <div
                className="relative py-12 px-4 mb-8"
                style={{
                    background: `linear-gradient(to bottom, var(--color-surface), var(--color-background))`,
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Back button */}
                    <Link
                        href="/heroes"
                        className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('common.back')}
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Hero Image */}
                        <div className="relative w-full md:w-80 aspect-[16/9] rounded-xl overflow-hidden border border-[var(--color-border)]">
                            {hero.img && (
                                <Image
                                    src={hero.img}
                                    alt={hero.localizedName}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>

                        {/* Hero Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-3xl md:text-4xl font-bold">{hero.localizedName}</h1>
                                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getAttrClass(hero.primaryAttr)}`}>
                                    {getAttrIcon(hero.primaryAttr)} {getAttrLabel(hero.primaryAttr)}
                                </span>
                            </div>

                            {/* Roles */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {hero.roles?.map((role, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
                                    >
                                        {role}
                                    </span>
                                ))}
                                <span
                                    className="px-3 py-1 rounded-full text-sm font-medium"
                                    style={{
                                        backgroundColor: `${difficultyInfo.color}20`,
                                        color: difficultyInfo.color
                                    }}
                                >
                                    {difficultyInfo.label}
                                </span>
                            </div>

                            {/* Attack Type */}
                            <p className="text-[var(--color-text-muted)] mb-4">
                                {hero.attackType} • Attack Range: {hero.attackRange}
                            </p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <StatBox label="Base STR" value={hero.baseStr} gain={hero.strGain} color="var(--color-strength)" />
                                <StatBox label="Base AGI" value={hero.baseAgi} gain={hero.agiGain} color="var(--color-agility)" />
                                <StatBox label="Base INT" value={hero.baseInt} gain={hero.intGain} color="var(--color-intelligence)" />
                                <StatBox label="Move Speed" value={hero.moveSpeed} color="var(--color-text)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            📊 {t('heroes.stats')}
                        </h2>
                        <div className="space-y-3">
                            <StatRow label="Base Health" value={hero.baseHealth} icon="❤️" />
                            <StatRow label="Base Mana" value={hero.baseMana} icon="💧" />
                            <StatRow label="Base Armor" value={hero.baseArmor?.toFixed(1)} icon="🛡️" />
                            <StatRow label="Move Speed" value={hero.moveSpeed} icon="👟" />
                            <StatRow label="Attack Range" value={hero.attackRange} icon="🎯" />
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            💡 {t('heroes.tips')}
                        </h2>
                        <ul className="space-y-3">
                            {tips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-[var(--color-primary)] mt-1">•</span>
                                    <span className="text-[var(--color-text-muted)]">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Counters Card */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            ⚔️ {t('heroes.counters')}
                        </h2>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
                            </div>
                        ) : counters.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-sm text-[var(--color-text-muted)] mb-3">Heroes that counter {hero.localizedName}:</p>
                                {counters.map((matchup) => {
                                    const counterHero = getHeroById(matchup.heroId);
                                    if (!counterHero) return null;
                                    return (
                                        <Link
                                            key={matchup.heroId}
                                            href={`/heroes/${matchup.heroId}`}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors"
                                        >
                                            <div className="relative w-10 h-6 rounded overflow-hidden">
                                                {counterHero.img && (
                                                    <Image
                                                        src={counterHero.img}
                                                        alt={counterHero.localizedName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="flex-1 text-sm">{counterHero.localizedName}</span>
                                            <span className="text-sm text-[var(--color-secondary)]">
                                                {matchup.winRate.toFixed(1)}%
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-[var(--color-text-muted)] text-sm">No matchup data available</p>
                        )}
                    </div>
                </div>

                {/* Good Against Section */}
                {goodAgainst.length > 0 && (
                    <div className="mt-6">
                        <div className="card p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                ✅ {hero.localizedName} is Good Against
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {goodAgainst.map((matchup) => {
                                    const targetHero = getHeroById(matchup.heroId);
                                    if (!targetHero) return null;
                                    return (
                                        <Link
                                            key={matchup.heroId}
                                            href={`/heroes/${matchup.heroId}`}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-primary-muted)] transition-colors"
                                        >
                                            <div className="relative w-8 h-5 rounded overflow-hidden">
                                                {targetHero.img && (
                                                    <Image
                                                        src={targetHero.img}
                                                        alt={targetHero.localizedName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="text-sm">{targetHero.localizedName}</span>
                                            <span className="text-xs text-[var(--color-primary)]">
                                                {matchup.winRate.toFixed(1)}%
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatBox({ label, value, gain, color }: { label: string; value: number; gain?: number; color: string }) {
    return (
        <div className="p-3 rounded-lg bg-[var(--color-surface)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">{label}</p>
            <p className="text-xl font-bold" style={{ color }}>
                {value}
                {gain !== undefined && (
                    <span className="text-sm font-normal text-[var(--color-text-muted)]"> +{gain}/lvl</span>
                )}
            </p>
        </div>
    );
}

function StatRow({ label, value, icon }: { label: string; value: number | string; icon: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
            <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
                {icon} {label}
            </span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}
