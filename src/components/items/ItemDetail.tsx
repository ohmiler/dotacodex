'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface Item {
    id: number;
    name: string;
    localizedName: string | null;
    localizedNameTh: string | null;
    cost: number | null;
    secretShop: boolean | null;
    sideShop: boolean | null;
    recipe: boolean | null;
    components: string[] | null;
    description: string | null;
    descriptionTh: string | null;
    notes: string | null;
    category: string | null;
    img: string | null;
}

interface ItemDetailProps {
    item: Item;
    allItems: Item[];
}

export default function ItemDetail({ item, allItems }: ItemDetailProps) {
    const t = useTranslations('items');
    const locale = useLocale();
    const [imageError, setImageError] = useState(false);

    // Get item image URL
    const getItemImage = (img: string | null) => {
        if (!img) return '/icons/items/default.png';
        if (img.startsWith('http')) return img;
        return `https://cdn.cloudflare.steamstatic.com${img}`;
    };

    // Find item by name
    const findItemByName = (name: string) => {
        return allItems.find(i => i.name === name || i.name === `item_${name}`);
    };

    // Get component items
    const componentItems = (item.components || [])
        .map(name => findItemByName(name))
        .filter((i): i is Item => i !== undefined);

    // Calculate total component cost
    const totalComponentCost = componentItems.reduce((sum, i) => sum + (i.cost || 0), 0);
    const recipeCost = (item.cost || 0) - totalComponentCost;

    // Find items that this item builds into
    const buildsInto = allItems.filter(i =>
        i.components?.some(c => c === item.name || c === item.name.replace('item_', ''))
    );

    // Get display name
    const displayName = locale === 'th' && item.localizedNameTh
        ? item.localizedNameTh
        : item.localizedName || item.name;

    // Get display description
    const displayDescription = locale === 'th' && item.descriptionTh
        ? item.descriptionTh
        : item.description;

    // Format gold
    const formatGold = (cost: number) => {
        return cost >= 1000 ? `${(cost / 1000).toFixed(1)}k` : cost.toString();
    };

    // Get category color
    const getCategoryColor = (category: string | null) => {
        switch (category) {
            case 'consumables': return 'var(--color-agility)';
            case 'attributes': return 'var(--color-intelligence)';
            case 'equipment': return 'var(--color-strength)';
            case 'misc': return 'var(--color-universal)';
            case 'secret_shop': return 'var(--color-accent)';
            case 'accessories': return 'var(--color-primary)';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href="/items"
                    className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ← Back to Items
                </Link>
            </div>

            {/* Item Header */}
            <div className="card p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Item Image */}
                    <div className="relative w-32 h-24 md:w-40 md:h-30 flex-shrink-0 bg-[var(--color-surface-elevated)] rounded-xl overflow-hidden border-2 border-[var(--color-border)]">
                        {!imageError && item.img ? (
                            <Image
                                src={getItemImage(item.img)}
                                alt={displayName}
                                fill
                                className="object-contain p-2"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                ⚔️
                            </div>
                        )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gradient">
                            {displayName}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-4">
                            {/* Cost */}
                            {item.cost && item.cost > 0 && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-semibold">
                                    <span>💰</span>
                                    {item.cost.toLocaleString()} Gold
                                </span>
                            )}

                            {/* Secret Shop */}
                            {item.secretShop && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                                    🏪 Secret Shop
                                </span>
                            )}

                            {/* Recipe */}
                            {item.recipe && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-medium">
                                    📜 Recipe
                                </span>
                            )}

                            {/* Category */}
                            {item.category && (
                                <span
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium"
                                    style={{
                                        backgroundColor: `${getCategoryColor(item.category)}20`,
                                        color: getCategoryColor(item.category)
                                    }}
                                >
                                    {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('_', ' ')}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {displayDescription && (
                            <div className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap max-w-3xl">
                                {displayDescription}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Components Section */}
                {componentItems.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            📦 Components
                        </h2>

                        <div className="space-y-4">
                            {/* Component Items */}
                            <div className="flex flex-wrap gap-3">
                                {componentItems.map((comp, index) => (
                                    <Link
                                        key={index}
                                        href={`/items/${comp.id}`}
                                        className="group flex items-center gap-3 p-3 bg-[var(--color-surface-elevated)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:scale-105"
                                    >
                                        <div className="relative w-12 h-9 bg-[var(--color-surface)] rounded overflow-hidden">
                                            {comp.img ? (
                                                <Image
                                                    src={getItemImage(comp.img)}
                                                    alt={comp.localizedName || comp.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg">⚔️</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium group-hover:text-[var(--color-primary)] transition-colors">
                                                {comp.localizedName || comp.name}
                                            </div>
                                            <div className="text-xs text-[var(--color-accent)]">
                                                💰 {comp.cost?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Recipe Cost */}
                            {recipeCost > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                                    <span className="text-2xl">📜</span>
                                    <div>
                                        <div className="text-sm font-medium text-orange-400">Recipe</div>
                                        <div className="text-xs text-[var(--color-accent)]">💰 {recipeCost.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}

                            {/* Total Cost */}
                            <div className="pt-4 border-t border-[var(--color-border)]">
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--color-text-muted)]">Total Cost:</span>
                                    <span className="text-xl font-bold text-[var(--color-accent)]">
                                        💰 {item.cost?.toLocaleString() || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Builds Into Section */}
                {buildsInto.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            🔨 Builds Into
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {buildsInto.slice(0, 8).map((upgrade) => (
                                <Link
                                    key={upgrade.id}
                                    href={`/items/${upgrade.id}`}
                                    className="group flex items-center gap-3 p-3 bg-[var(--color-surface-elevated)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all"
                                >
                                    <div className="relative w-12 h-9 bg-[var(--color-surface)] rounded overflow-hidden flex-shrink-0">
                                        {upgrade.img ? (
                                            <Image
                                                src={getItemImage(upgrade.img)}
                                                alt={upgrade.localizedName || upgrade.name}
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg">⚔️</div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">
                                            {upgrade.localizedName || upgrade.name}
                                        </div>
                                        <div className="text-xs text-[var(--color-accent)]">
                                            💰 {formatGold(upgrade.cost || 0)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {buildsInto.length > 8 && (
                            <div className="mt-3 text-sm text-[var(--color-text-muted)] text-center">
                                +{buildsInto.length - 8} more items
                            </div>
                        )}
                    </div>
                )}

                {/* Notes Section */}
                {item.notes && (
                    <div className="card p-6 lg:col-span-2">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            💡 Notes & Tips
                        </h2>
                        <div className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap">
                            {item.notes}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 card p-6">
                <h2 className="text-xl font-bold mb-4">📊 Quick Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-[var(--color-surface-elevated)] rounded-lg">
                        <div className="text-2xl font-bold text-[var(--color-accent)]">
                            {item.cost?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)]">Gold</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--color-surface-elevated)] rounded-lg">
                        <div className="text-2xl font-bold text-[var(--color-primary)]">
                            {componentItems.length}
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)]">Components</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--color-surface-elevated)] rounded-lg">
                        <div className="text-2xl font-bold text-[var(--color-secondary)]">
                            {buildsInto.length}
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)]">Upgrades</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--color-surface-elevated)] rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">
                            {item.secretShop ? 'Yes' : 'No'}
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)]">Secret Shop</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
