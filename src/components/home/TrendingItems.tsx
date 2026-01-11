'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface Item {
    id: number;
    name: string;
    localizedName: string;
    cost: number;
    img: string;
    category?: string;
}

type GamePhase = 'starting' | 'early' | 'mid' | 'late';

// Curated popular items for each game phase (commonly used in pub games)
const POPULAR_ITEMS: Record<GamePhase, string[]> = {
    starting: ['tango', 'healing_salve', 'branches', 'quelling_blade', 'magic_stick', 'ward_observer', 'ward_sentry', 'clarity'],
    early: ['boots', 'magic_wand', 'bracer', 'wraith_band', 'null_talisman', 'power_treads', 'phase_boots', 'falcon_blade'],
    mid: ['blink', 'black_king_bar', 'manta', 'sange_and_yasha', 'aghanims_shard', 'force_staff', 'glimmer_cape', 'mekansm'],
    late: ['greater_crit', 'satanic', 'butterfly', 'heart', 'assault', 'refresher', 'sheepstick', 'travel_boots_2'],
};

export default function TrendingItems() {
    const t = useTranslations();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePhase, setActivePhase] = useState<GamePhase>('early');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/items');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPhaseItems = (phase: GamePhase): Item[] => {
        const itemNames = POPULAR_ITEMS[phase];
        return itemNames
            .map(name => items.find(item => item.name === `item_${name}` || item.name === name))
            .filter((item): item is Item => item !== undefined)
            .slice(0, 6);
    };

    const phases: { key: GamePhase; label: string; icon: string; color: string }[] = [
        { key: 'starting', label: t('heroes.startingItems'), icon: '🎮', color: 'text-gray-400' },
        { key: 'early', label: t('heroes.earlyGame'), icon: '🌅', color: 'text-yellow-400' },
        { key: 'mid', label: t('heroes.midGame'), icon: '⚔️', color: 'text-orange-400' },
        { key: 'late', label: t('heroes.lateGame'), icon: '🏆', color: 'text-red-400' },
    ];

    if (loading) {
        return (
            <div className="card p-6">
                <div className="h-6 bg-[var(--color-surface-elevated)] rounded w-1/3 mb-4 animate-pulse" />
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-10 w-24 bg-[var(--color-surface-elevated)] rounded-lg animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-[var(--color-surface-elevated)] rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const phaseItems = getPhaseItems(activePhase);

    return (
        <div className="card p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔥</span>
                <h3 className="text-lg font-semibold">Trending Items</h3>
            </div>

            {/* Phase Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {phases.map(phase => (
                    <button
                        key={phase.key}
                        onClick={() => setActivePhase(phase.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activePhase === phase.key
                                ? 'bg-[var(--color-primary)] text-black'
                                : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-white'
                            }`}
                    >
                        <span>{phase.icon}</span>
                        <span className="hidden sm:inline">{phase.label}</span>
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {phaseItems.map((item, index) => (
                    <Link
                        key={item.id}
                        href={`/items/${item.id}`}
                        className="group relative"
                    >
                        {/* Rank Badge for top 3 */}
                        {index < 3 && (
                            <div className={`absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                    index === 1 ? 'bg-gray-400' :
                                        'bg-amber-700'
                                }`}>
                                {index + 1}
                            </div>
                        )}

                        {/* Item Image */}
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors bg-[var(--color-surface-elevated)]">
                            {item.img && (
                                <Image
                                    src={item.img}
                                    alt={item.localizedName || item.name}
                                    fill
                                    className="object-contain p-2 group-hover:scale-110 transition-transform"
                                />
                            )}
                        </div>

                        {/* Item Info */}
                        <div className="mt-2 text-center">
                            <div className="text-xs font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">
                                {item.localizedName || item.name.replace('item_', '').replace(/_/g, ' ')}
                            </div>
                            {item.cost > 0 && (
                                <div className="text-xs text-[var(--color-accent)] flex items-center justify-center gap-1">
                                    <span>💰</span>
                                    {item.cost}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* View All Link */}
            <div className="mt-6 text-center">
                <Link
                    href="/items"
                    className="text-[var(--color-primary)] hover:underline text-sm font-medium"
                >
                    View All Items →
                </Link>
            </div>
        </div>
    );
}
