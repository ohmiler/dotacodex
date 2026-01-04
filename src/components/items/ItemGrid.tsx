'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Item {
    id: number;
    name: string;
    localizedName: string;
    cost: number;
    secretShop: boolean;
    sideShop: boolean;
    recipe: boolean;
    components: string[] | null;
    description: string | null;
    img: string | null;
}

type ItemCategory = 'all' | 'basic' | 'upgrade' | 'neutral';

const ITEM_CATEGORIES: { key: ItemCategory; costRange: [number, number] | null }[] = [
    { key: 'all', costRange: null },
    { key: 'basic', costRange: [0, 1400] },
    { key: 'upgrade', costRange: [1401, 99999] },
];

export default function ItemGrid() {
    const t = useTranslations('items');
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<ItemCategory>('all');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

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

    const filteredItems = items.filter(item => {
        // Filter out recipes and items without cost
        if (item.recipe || !item.cost) return false;

        const matchesSearch = item.localizedName.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (category === 'all') return true;

        const catConfig = ITEM_CATEGORIES.find(c => c.key === category);
        if (!catConfig?.costRange) return true;

        return item.cost >= catConfig.costRange[0] && item.cost <= catConfig.costRange[1];
    });

    // Sort by cost
    const sortedItems = [...filteredItems].sort((a, b) => a.cost - b.cost);

    const formatGold = (cost: number) => {
        return cost.toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-[var(--color-text-muted)] mb-4">No items found. Please sync data first.</p>
                <button
                    onClick={async () => {
                        setLoading(true);
                        await fetch('/api/sync', { method: 'POST' });
                        await fetchItems();
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
            <div className="mb-6 flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg"
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
                    {ITEM_CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setCategory(cat.key)}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${category === cat.key
                                    ? 'bg-[var(--color-accent)] text-[var(--color-background)]'
                                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            {cat.key === 'all' ? 'All' : t(cat.key)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Item Count */}
            <p className="mb-4 text-[var(--color-text-muted)]">
                {sortedItems.length} items found
            </p>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {sortedItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="card p-3 text-left hover:border-[var(--color-accent)] group"
                    >
                        <div className="relative aspect-square mb-2 rounded-lg overflow-hidden bg-[var(--color-surface-elevated)] flex items-center justify-center">
                            {item.img ? (
                                <Image
                                    src={item.img}
                                    alt={item.localizedName}
                                    width={64}
                                    height={64}
                                    className="object-contain group-hover:scale-110 transition-transform"
                                />
                            ) : (
                                <span className="text-2xl">📦</span>
                            )}
                        </div>
                        <h3 className="font-medium text-xs mb-1 truncate group-hover:text-[var(--color-accent)] transition-colors">
                            {item.localizedName}
                        </h3>
                        <p className="text-xs text-[var(--color-accent)] font-semibold">
                            🪙 {formatGold(item.cost)}
                        </p>
                    </button>
                ))}
            </div>

            {/* Item Detail Modal */}
            {selectedItem && (
                <ItemModal item={selectedItem} items={items} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
}

function ItemModal({ item, items, onClose }: { item: Item; items: Item[]; onClose: () => void }) {
    const t = useTranslations('items');

    const getItemByName = (name: string) => items.find(i => i.name === name);

    const formatGold = (cost: number) => {
        return cost.toLocaleString();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={onClose}
        >
            <div
                className="card p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center">
                        {item.img ? (
                            <Image
                                src={item.img}
                                alt={item.localizedName}
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        ) : (
                            <span className="text-3xl">📦</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{item.localizedName}</h2>
                        <p className="text-lg text-[var(--color-accent)] font-semibold">
                            🪙 {formatGold(item.cost)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Description */}
                {item.description && (
                    <div className="mb-4">
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {item.secretShop && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                            Secret Shop
                        </span>
                    )}
                    {item.sideShop && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                            Side Shop
                        </span>
                    )}
                </div>

                {/* Components */}
                {item.components && item.components.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-[var(--color-text-muted)]">
                            {t('components')}:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {item.components.map((compName, i) => {
                                const compItem = getItemByName(compName);
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[var(--color-surface-elevated)]"
                                    >
                                        {compItem?.img ? (
                                            <Image
                                                src={compItem.img}
                                                alt={compName}
                                                width={24}
                                                height={24}
                                                className="object-contain"
                                            />
                                        ) : (
                                            <span className="text-sm">📦</span>
                                        )}
                                        <span className="text-xs">{compItem?.localizedName || compName}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
