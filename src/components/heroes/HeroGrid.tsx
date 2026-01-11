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
    difficulty?: number;
}

const ROLES = ['Carry', 'Support', 'Nuker', 'Disabler', 'Initiator', 'Durable', 'Escape', 'Pusher'];
const ATTRIBUTES = ['str', 'agi', 'int', 'all'];

export default function HeroGrid() {
    const t = useTranslations('heroes');
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedAttr, setSelectedAttr] = useState('');

    useEffect(() => {
        fetchHeroes();
    }, []);

    const fetchHeroes = async () => {
        try {
            const res = await fetch('/api/heroes');
            if (res.ok) {
                const data = await res.json();
                setHeroes(data);
            }
        } catch (error) {
            console.error('Error fetching heroes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHeroes = heroes.filter(hero => {
        const matchesSearch = hero.localizedName.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !selectedRole || (hero.roles && hero.roles.includes(selectedRole));
        const matchesAttr = !selectedAttr || hero.primaryAttr === selectedAttr;
        return matchesSearch && matchesRole && matchesAttr;
    });

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
            str: t('strength'),
            agi: t('agility'),
            int: t('intelligence'),
            all: t('universal'),
        };
        return labels[attr] || attr;
    };

    if (loading) {
        return (
            <div>
                {/* Skeleton Filters */}
                <div className="mb-6 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px] h-10 bg-[var(--color-surface)] rounded-lg animate-pulse" />
                        <div className="w-32 h-10 bg-[var(--color-surface)] rounded-lg animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-20 h-10 bg-[var(--color-surface)] rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
                {/* Skeleton Hero Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="card overflow-hidden">
                            <div className="aspect-[16/9] bg-[var(--color-surface-elevated)] animate-pulse" />
                            <div className="p-3 space-y-2">
                                <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-3/4" />
                                <div className="h-3 bg-[var(--color-surface-elevated)] rounded animate-pulse w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (heroes.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-[var(--color-text-muted)] mb-4">No heroes found. Please sync data first.</p>
                <button
                    onClick={async () => {
                        setLoading(true);
                        await fetch('/api/sync', { method: 'POST' });
                        await fetchHeroes();
                    }}
                    className="btn btn-primary"
                >
                    Sync from OpenDota
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4">
                {/* Search & Role Filter Row */}
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder={t('title') + '...'}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none"
                    >
                        <option value="">{t('allRoles')}</option>
                        {ROLES.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                {/* Attribute Filter - Icon Buttons */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedAttr('')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedAttr === ''
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]'
                            }`}
                    >
                        {t('all')}
                    </button>
                    <button
                        onClick={() => setSelectedAttr('str')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedAttr === 'str'
                            ? 'bg-red-500 text-white'
                            : 'bg-[var(--color-surface)] text-red-400 hover:bg-red-500/20'
                            }`}
                    >
                        <span className="text-lg">💪</span>
                        <span className="hidden sm:inline">{t('strength')}</span>
                    </button>
                    <button
                        onClick={() => setSelectedAttr('agi')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedAttr === 'agi'
                            ? 'bg-green-500 text-white'
                            : 'bg-[var(--color-surface)] text-green-400 hover:bg-green-500/20'
                            }`}
                    >
                        <span className="text-lg">🏃</span>
                        <span className="hidden sm:inline">{t('agility')}</span>
                    </button>
                    <button
                        onClick={() => setSelectedAttr('int')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedAttr === 'int'
                            ? 'bg-blue-500 text-white'
                            : 'bg-[var(--color-surface)] text-blue-400 hover:bg-blue-500/20'
                            }`}
                    >
                        <span className="text-lg">🧠</span>
                        <span className="hidden sm:inline">{t('intelligence')}</span>
                    </button>
                    <button
                        onClick={() => setSelectedAttr('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedAttr === 'all'
                            ? 'bg-purple-500 text-white'
                            : 'bg-[var(--color-surface)] text-purple-400 hover:bg-purple-500/20'
                            }`}
                    >
                        <span className="text-lg">✨</span>
                        <span className="hidden sm:inline">{t('universal')}</span>
                    </button>
                </div>
            </div>

            {/* Hero Count */}
            <p className="mb-4 text-[var(--color-text-muted)]">
                {filteredHeroes.length} heroes found
            </p>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredHeroes.map(hero => (
                    <Link
                        key={hero.id}
                        href={`/heroes/${generateHeroSlug(hero.localizedName, hero.id)}`}
                        className="card p-3 group"
                    >
                        <div className="relative aspect-[16/9] mb-2 rounded-lg overflow-hidden bg-[var(--color-surface-elevated)]">
                            {hero.img && (
                                <Image
                                    src={hero.img}
                                    alt={hero.localizedName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                />
                            )}
                        </div>
                        <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-[var(--color-primary)] transition-colors">
                            {hero.localizedName}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getAttrClass(hero.primaryAttr)}`}>
                                {hero.primaryAttr.toUpperCase()}
                            </span>
                            <span className="text-xs text-[var(--color-text-muted)]">
                                {hero.attackType}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
