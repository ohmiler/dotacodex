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

// Item groups based on Dota 2 shop categories
const ITEM_GROUPS = {
    consumables: {
        label: 'Consumables',
        icon: '🧪',
        items: ['tango', 'flask', 'clarity', 'faerie_fire', 'smoke_of_deceit', 'dust', 'ward_observer', 'ward_sentry', 'enchanted_mango', 'tome_of_knowledge', 'aghanims_shard', 'refresher_shard', 'cheese', 'bottle'],
    },
    attributes: {
        label: 'Attributes',
        icon: '💪',
        items: ['branches', 'gauntlets', 'slippers', 'mantle', 'circlet', 'belt_of_strength', 'band_of_elvenskin', 'robe', 'crown', 'ogre_axe', 'blade_of_alacrity', 'staff_of_wizardry', 'diadem'],
    },
    equipment: {
        label: 'Equipment',
        icon: '⚔️',
        items: ['quelling_blade', 'stout_shield', 'orb_of_venom', 'blight_stone', 'blades_of_attack', 'chainmail', 'broadsword', 'claymore', 'javelin', 'mithril_hammer', 'quarterstaff'],
    },
    miscellaneous: {
        label: 'Miscellaneous',
        icon: '📦',
        items: ['magic_stick', 'wind_lace', 'ring_of_regen', 'sobi_mask', 'fluffy_hat', 'gloves', 'cloak', 'ring_of_tarrasque', 'ring_of_health', 'void_stone', 'energy_booster', 'vitality_booster', 'point_booster', 'talisman_of_evasion', 'ghost', 'shadow_amulet', 'blink'],
    },
    secretShop: {
        label: 'Secret Shop',
        icon: '🏪',
        items: ['demon_edge', 'eagle', 'reaver', 'mystic_staff', 'sacred_relic', 'hyperstone', 'ultimate_orb', 'talisman_of_evasion', 'platemail'],
    },
    accessories: {
        label: 'Accessories',
        icon: '💍',
        costRange: [0, 1000] as [number, number],
    },
    weapons: {
        label: 'Weapons',
        icon: '🗡️',
        costRange: [1001, 2500] as [number, number],
    },
    armor: {
        label: 'Armor & Protection',
        icon: '🛡️',
        costRange: [2501, 4000] as [number, number],
    },
    artifacts: {
        label: 'Artifacts',
        icon: '✨',
        costRange: [4001, 99999] as [number, number],
    },
};

type GroupKey = keyof typeof ITEM_GROUPS;

export default function ItemGrid() {
    const t = useTranslations('items');
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [viewMode, setViewMode] = useState<'grouped' | 'all'>('grouped');

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

    // Filter out recipes (by flag and by name pattern)
    const validItems = items.filter(item =>
        !item.recipe &&
        item.cost > 0 &&
        !item.name.startsWith('recipe_')
    );

    // Apply search
    const filteredItems = validItems.filter(item =>
        item.localizedName.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    // Group items by cost range for quick categorization
    const groupItemsByCost = () => {
        const groups: Record<string, Item[]> = {
            basic: [],      // 0-500
            early: [],      // 501-1500
            mid: [],        // 1501-3000
            core: [],       // 3001-5000
            luxury: [],     // 5001+
        };

        filteredItems.forEach(item => {
            if (item.cost <= 500) groups.basic.push(item);
            else if (item.cost <= 1500) groups.early.push(item);
            else if (item.cost <= 3000) groups.mid.push(item);
            else if (item.cost <= 5000) groups.core.push(item);
            else groups.luxury.push(item);
        });

        return groups;
    };

    const groupedItems = groupItemsByCost();

    const formatGold = (cost: number) => cost.toLocaleString();

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

    const groupConfig = [
        { key: 'basic', label: 'ไอเทมเริ่มต้น', labelEn: 'Starting Items', icon: '🏁', color: 'var(--color-easy)' },
        { key: 'early', label: 'ไอเทมต้นเกม', labelEn: 'Early Game', icon: '🌅', color: 'var(--color-primary)' },
        { key: 'mid', label: 'ไอเทมกลางเกม', labelEn: 'Mid Game', icon: '☀️', color: 'var(--color-accent)' },
        { key: 'core', label: 'ไอเทมหลัก', labelEn: 'Core Items', icon: '⚡', color: 'var(--color-secondary)' },
        { key: 'luxury', label: 'ไอเทมระดับสูง', labelEn: 'Luxury Items', icon: '👑', color: 'var(--color-hard)' },
    ];

    return (
        <div>
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="ค้นหาไอเทม... / Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg"
                    />
                </div>

                {/* View Mode Toggle */}
                <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
                    <button
                        onClick={() => setViewMode('grouped')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'grouped'
                            ? 'bg-[var(--color-accent)] text-[var(--color-background)]'
                            : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                            }`}
                    >
                        📂 Grouped
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'all'
                            ? 'bg-[var(--color-accent)] text-[var(--color-background)]'
                            : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                            }`}
                    >
                        📋 All
                    </button>
                </div>
            </div>

            {/* Item Count */}
            <p className="mb-6 text-[var(--color-text-muted)]">
                พบ {filteredItems.length} ไอเทม / {filteredItems.length} items found
            </p>

            {viewMode === 'grouped' ? (
                /* Grouped View */
                <div className="space-y-8">
                    {groupConfig.map(group => {
                        const groupItems = groupedItems[group.key] || [];
                        if (groupItems.length === 0) return null;

                        return (
                            <div key={group.key} className="card p-4">
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--color-border)]">
                                    <span className="text-2xl">{group.icon}</span>
                                    <div>
                                        <h3 className="font-semibold" style={{ color: group.color }}>
                                            {group.label}
                                        </h3>
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            {groupItems.length} items
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12 gap-2">
                                    {groupItems.sort((a, b) => a.cost - b.cost).map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            onClick={() => setSelectedItem(item)}
                                            formatGold={formatGold}
                                            compact
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* All Items Grid */
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {filteredItems.sort((a, b) => a.cost - b.cost).map(item => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                            formatGold={formatGold}
                        />
                    ))}
                </div>
            )}

            {/* Item Detail Modal */}
            {selectedItem && (
                <ItemModal item={selectedItem} items={items} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
}

function ItemCard({
    item,
    onClick,
    formatGold,
    compact = false
}: {
    item: Item;
    onClick: () => void;
    formatGold: (cost: number) => string;
    compact?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`card ${compact ? 'p-2' : 'p-3'} text-left hover:border-[var(--color-accent)] group`}
            title={`${item.localizedName} - ${formatGold(item.cost)} gold`}
        >
            <div className={`relative ${compact ? 'w-10 h-10 mx-auto' : 'aspect-square'} mb-1 rounded overflow-hidden bg-[var(--color-surface-elevated)] flex items-center justify-center`}>
                {item.img ? (
                    <Image
                        src={item.img}
                        alt={item.localizedName}
                        width={compact ? 36 : 64}
                        height={compact ? 36 : 64}
                        className="object-contain group-hover:scale-110 transition-transform"
                    />
                ) : (
                    <span className={compact ? 'text-lg' : 'text-2xl'}>📦</span>
                )}
            </div>
            {compact ? (
                <p className="text-[10px] text-center text-[var(--color-accent)] font-medium truncate">
                    {formatGold(item.cost)}
                </p>
            ) : (
                <>
                    <h3 className="font-medium text-xs mb-1 truncate group-hover:text-[var(--color-accent)] transition-colors">
                        {item.localizedName}
                    </h3>
                    <p className="text-xs text-[var(--color-accent)] font-semibold">
                        🪙 {formatGold(item.cost)}
                    </p>
                </>
            )}
        </button>
    );
}

function ItemModal({ item, items, onClose }: { item: Item; items: Item[]; onClose: () => void }) {
    const t = useTranslations('items');

    const getItemByName = (name: string) => items.find(i => i.name === name);

    // Find the recipe for this item (recipe_item_name)
    const recipeName = `recipe_${item.name}`;
    const recipeItem = items.find(i => i.name === recipeName);

    const formatGold = (cost: number) => {
        return cost.toLocaleString();
    };

    // Calculate total cost from components
    const componentsCost = item.components?.reduce((total, compName) => {
        const comp = getItemByName(compName);
        return total + (comp?.cost || 0);
    }, 0) || 0;

    const recipeCost = recipeItem?.cost || 0;
    const hasRecipe = recipeCost > 0;

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

                {/* Components with Recipe */}
                {item.components && item.components.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-muted)]">
                            {t('components')}:
                        </h3>
                        <div className="space-y-2">
                            {item.components.map((compName, i) => {
                                const compItem = getItemByName(compName);
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)]"
                                    >
                                        {compItem?.img ? (
                                            <Image
                                                src={compItem.img}
                                                alt={compName}
                                                width={28}
                                                height={28}
                                                className="object-contain"
                                            />
                                        ) : (
                                            <span className="text-lg">📦</span>
                                        )}
                                        <span className="flex-1 text-sm">{compItem?.localizedName || compName}</span>
                                        <span className="text-xs text-[var(--color-accent)] font-medium">
                                            🪙 {formatGold(compItem?.cost || 0)}
                                        </span>
                                    </div>
                                );
                            })}

                            {/* Recipe Row */}
                            {hasRecipe && (
                                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)]">
                                    <span className="text-lg">📜</span>
                                    <span className="flex-1 text-sm">
                                        Recipe
                                    </span>
                                    <span className="text-xs text-[var(--color-accent)] font-medium">
                                        🪙 {formatGold(recipeCost)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Total Cost Breakdown */}
                        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--color-text-muted)]">ราคารวม / Total:</span>
                                <span className="font-bold text-[var(--color-accent)]">
                                    🪙 {formatGold(componentsCost + recipeCost)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
