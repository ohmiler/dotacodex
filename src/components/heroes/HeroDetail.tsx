'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import FavoriteButton from '@/components/favorites/FavoriteButton';

interface Hero {
    id: number;
    name: string;
    localizedName: string;
    primaryAttr: string;
    attackType: string;
    roles: string[];
    img: string | null;
    icon: string | null;
    baseHealth: number | null;
    baseMana: number | null;
    baseArmor: number | null;
    moveSpeed: number | null;
    attackRange: number | null;
    baseStr: number | null;
    baseAgi: number | null;
    baseInt: number | null;
    strGain: number | null;
    agiGain: number | null;
    intGain: number | null;
    difficulty?: number | null;
    beginnerTips?: string | null;
    beginnerTipsTh?: string | null;
}

interface MatchupHero {
    heroId: number;
    gamesPlayed: number;
    wins: number;
    winRate: number;
}

interface ItemBuild {
    itemId: number;
    count: number;
}

interface ItemBuilds {
    startGame: ItemBuild[];
    earlyGame: ItemBuild[];
    midGame: ItemBuild[];
    lateGame: ItemBuild[];
}

interface Item {
    id: number;
    name: string;
    localizedName: string | null;
    cost: number | null;
    img: string | null;
}

interface HeroAbility {
    name: string;
    dname: string;
    desc: string;
    behavior?: string | string[];
    dmg_type?: string;
    mc?: string | string[];
    cd?: string | string[];
    img?: string;
    is_innate?: boolean;
    attrib?: Array<{
        key: string;
        header: string;
        value: string | string[];
    }>;
}

interface HeroTalent {
    name: string;
    dname: string;
    level: number; // 1=Lvl10, 2=Lvl15, 3=Lvl20, 4=Lvl25
}

interface Props {
    hero: Hero;
    allHeroes: Hero[];
    allItems?: Item[];
    counters?: MatchupHero[];
    goodAgainst?: MatchupHero[];
    itemBuilds?: ItemBuilds | null;
    abilities?: HeroAbility[];
    talents?: HeroTalent[];
}

export default function HeroDetail({
    hero,
    allHeroes,
    allItems = [],
    counters = [],
    goodAgainst = [],
    itemBuilds = null,
    abilities = [],
    talents = []
}: Props) {
    const t = useTranslations();

    const getHeroById = (id: number) => allHeroes.find(h => h.id === id);
    const getItemById = (id: number) => allItems.find(i => i.id === id);

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

    const getDifficultyLabel = (difficulty?: number | null) => {
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
                                <FavoriteButton heroId={hero.id} heroName={hero.localizedName} size="md" />
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

            {/* Abilities Section */}
            {abilities.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        🎯 สกิล (Abilities)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {abilities.map((ability) => (
                            <div
                                key={ability.name}
                                className="card p-4 flex gap-4 hover:border-[var(--color-primary)] transition-colors"
                            >
                                {/* Ability Icon */}
                                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--color-surface-elevated)]">
                                    {ability.is_innate ? (
                                        <Image
                                            src="/icons/innate.png"
                                            alt={ability.dname}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : ability.img ? (
                                        <Image
                                            src={`https://cdn.cloudflare.steamstatic.com${ability.img}`}
                                            alt={ability.dname}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : null}
                                </div>

                                {/* Ability Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">{ability.dname}</h3>
                                        {ability.dmg_type && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ability.dmg_type === 'Magical' ? 'bg-blue-500/20 text-blue-400' :
                                                ability.dmg_type === 'Physical' ? 'bg-red-500/20 text-red-400' :
                                                    ability.dmg_type === 'Pure' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {ability.dmg_type}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-[var(--color-text-muted)] mb-2 line-clamp-2">
                                        {ability.desc}
                                    </p>

                                    {/* Mana & Cooldown */}
                                    <div className="flex items-center gap-4 text-sm">
                                        {ability.mc && (
                                            <span className="flex items-center gap-1 text-blue-400">
                                                💧 {Array.isArray(ability.mc) ? ability.mc.join('/') : ability.mc}
                                            </span>
                                        )}
                                        {ability.cd && (
                                            <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                                                ⏱️ {Array.isArray(ability.cd) ? ability.cd.join('/') : ability.cd}s
                                            </span>
                                        )}
                                        {!ability.cd && !ability.mc && (
                                            <span className="text-[var(--color-text-muted)]">Passive</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Talent Tree Section */}
            {talents.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        🌳 Talent Tree
                    </h2>
                    <div className="card p-6">
                        <div className="flex flex-col gap-4">
                            {/* Level 25 */}
                            {(() => {
                                const level4Talents = talents.filter(t => t.level === 4);
                                return level4Talents.length >= 2 ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex-1 text-right p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 25</span>
                                            <p className="font-medium">{level4Talents[0].dname}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-400">
                                            25
                                        </div>
                                        <div className="flex-1 p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 25</span>
                                            <p className="font-medium">{level4Talents[1].dname}</p>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            {/* Connecting Line */}
                            <div className="flex justify-center">
                                <div className="w-0.5 h-4 bg-[var(--color-border)]"></div>
                            </div>

                            {/* Level 20 */}
                            {(() => {
                                const level3Talents = talents.filter(t => t.level === 3);
                                return level3Talents.length >= 2 ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex-1 text-right p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 20</span>
                                            <p className="font-medium">{level3Talents[0].dname}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center font-bold text-purple-400">
                                            20
                                        </div>
                                        <div className="flex-1 p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 20</span>
                                            <p className="font-medium">{level3Talents[1].dname}</p>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            {/* Connecting Line */}
                            <div className="flex justify-center">
                                <div className="w-0.5 h-4 bg-[var(--color-border)]"></div>
                            </div>

                            {/* Level 15 */}
                            {(() => {
                                const level2Talents = talents.filter(t => t.level === 2);
                                return level2Talents.length >= 2 ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex-1 text-right p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 15</span>
                                            <p className="font-medium">{level2Talents[0].dname}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center font-bold text-blue-400">
                                            15
                                        </div>
                                        <div className="flex-1 p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 15</span>
                                            <p className="font-medium">{level2Talents[1].dname}</p>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            {/* Connecting Line */}
                            <div className="flex justify-center">
                                <div className="w-0.5 h-4 bg-[var(--color-border)]"></div>
                            </div>

                            {/* Level 10 */}
                            {(() => {
                                const level1Talents = talents.filter(t => t.level === 1);
                                return level1Talents.length >= 2 ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex-1 text-right p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 10</span>
                                            <p className="font-medium">{level1Talents[0].dname}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center font-bold text-green-400">
                                            10
                                        </div>
                                        <div className="flex-1 p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-primary)] transition-colors">
                                            <span className="text-sm text-[var(--color-text-muted)]">Lvl 10</span>
                                            <p className="font-medium">{level1Talents[1].dname}</p>
                                        </div>
                                    </div>
                                ) : null;
                            })()}
                        </div>
                    </div>
                </div>
            )}

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
                        {counters.length > 0 ? (
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

                {/* Item Build Guide Section */}
                {itemBuilds && (
                    <div className="mt-6">
                        <div className="card p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                ⚔️ {t('heroes.itemBuild') || 'Recommended Item Build'}
                            </h2>

                            <div className="space-y-6">
                                {/* Starting Items */}
                                {itemBuilds.startGame.length > 0 && (
                                    <ItemBuildSection
                                        title="🏁 Starting Items"
                                        items={itemBuilds.startGame}
                                        allItems={allItems}
                                        getItemById={getItemById}
                                    />
                                )}

                                {/* Early Game */}
                                {itemBuilds.earlyGame.length > 0 && (
                                    <ItemBuildSection
                                        title="🌅 Early Game"
                                        items={itemBuilds.earlyGame}
                                        allItems={allItems}
                                        getItemById={getItemById}
                                    />
                                )}

                                {/* Mid Game */}
                                {itemBuilds.midGame.length > 0 && (
                                    <ItemBuildSection
                                        title="☀️ Mid Game"
                                        items={itemBuilds.midGame}
                                        allItems={allItems}
                                        getItemById={getItemById}
                                    />
                                )}

                                {/* Late Game */}
                                {itemBuilds.lateGame.length > 0 && (
                                    <ItemBuildSection
                                        title="🌙 Late Game"
                                        items={itemBuilds.lateGame}
                                        allItems={allItems}
                                        getItemById={getItemById}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatBox({ label, value, gain, color }: { label: string; value: number | null; gain?: number | null; color: string }) {
    return (
        <div className="p-3 rounded-lg bg-[var(--color-surface)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">{label}</p>
            <p className="text-xl font-bold" style={{ color }}>
                {value ?? '-'}
                {gain != null && (
                    <span className="text-sm font-normal text-[var(--color-text-muted)]"> +{gain}/lvl</span>
                )}
            </p>
        </div>
    );
}

function StatRow({ label, value, icon }: { label: string; value: number | string | null | undefined; icon: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
            <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
                {icon} {label}
            </span>
            <span className="font-semibold">{value ?? '-'}</span>
        </div>
    );
}

interface ItemBuildSectionProps {
    title: string;
    items: { itemId: number; count: number }[];
    allItems: Item[];
    getItemById: (id: number) => Item | undefined;
}

function ItemBuildSection({ title, items, getItemById }: ItemBuildSectionProps) {
    return (
        <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                    const itemData = getItemById(item.itemId);
                    if (!itemData) return null;
                    const displayName = itemData.localizedName || itemData.name;
                    const displayCost = itemData.cost ?? 0;
                    return (
                        <Link
                            key={item.itemId}
                            href={`/items/${item.itemId}`}
                            className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-accent-muted)] hover:scale-105 transition-all border border-transparent hover:border-[var(--color-primary)]"
                            title={`${displayName} - ${displayCost} gold`}
                        >
                            {itemData.img ? (
                                <img
                                    src={itemData.img}
                                    alt={displayName}
                                    className="w-8 h-8 object-contain"
                                />
                            ) : (
                                <span className="w-8 h-8 flex items-center justify-center text-lg">📦</span>
                            )}
                            <div className="hidden sm:block">
                                <p className="text-xs font-medium group-hover:text-[var(--color-primary)] transition-colors">{displayName}</p>
                                <p className="text-xs text-[var(--color-accent)]">
                                    🪙 {displayCost.toLocaleString()}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
