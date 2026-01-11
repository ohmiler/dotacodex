'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';

interface AbilityNote {
    indent_level: number;
    note: string;
    info?: string;
}

interface AbilityChange {
    ability_id: number;
    ability_notes?: AbilityNote[];
    postfix_lines?: number;
}

interface Subsection {
    title: string;
    style: string;
    facet?: string;
    facet_icon?: string;
    facet_color?: string;
    abilities?: AbilityChange[];
    general_notes?: AbilityNote[];
}

interface HeroChange {
    hero_id: number;
    hero_notes?: AbilityNote[];
    talent_notes?: AbilityNote[];
    abilities?: AbilityChange[];
    subsections?: Subsection[];
}

interface ItemChange {
    ability_id: number;
    postfix_lines?: number;
    ability_notes?: AbilityNote[];
}

interface PatchNotesData {
    patch_number: string;
    patch_name: string;
    patch_timestamp: number;
    heroes: HeroChange[];
    items: ItemChange[];
    success: boolean;
}

interface HeroInfo {
    id: number;
    localized_name: string;
    icon: string;
}

const STEAM_CDN = 'https://cdn.cloudflare.steamstatic.com';

export default function PatchNotesPage() {
    const t = useTranslations();
    const [patchData, setPatchData] = useState<PatchNotesData | null>(null);
    const [heroes, setHeroes] = useState<Map<number, HeroInfo>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch patch notes and hero data in parallel
                const [patchRes, heroRes] = await Promise.all([
                    fetch('/api/patch-notes'),
                    fetch('https://api.opendota.com/api/heroStats')
                ]);

                if (!patchRes.ok) throw new Error('Failed to fetch patch notes');
                if (!heroRes.ok) throw new Error('Failed to fetch hero data');

                const patchJson = await patchRes.json();
                const heroJson: HeroInfo[] = await heroRes.json();

                setPatchData(patchJson);

                // Create hero map for quick lookup
                const heroMap = new Map<number, HeroInfo>();
                heroJson.forEach(hero => {
                    heroMap.set(hero.id, {
                        id: hero.id,
                        localized_name: hero.localized_name,
                        icon: hero.icon
                    });
                });
                setHeroes(heroMap);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderNote = (note: AbilityNote, key: string) => (
        <div
            key={key}
            className="flex items-start gap-2 text-[var(--color-text-muted)]"
            style={{ paddingLeft: `${(note.indent_level - 1) * 16}px` }}
        >
            <span className="text-[var(--color-primary)] mt-1.5">•</span>
            <span>
                {note.note}
                {note.info && (
                    <span className="text-[var(--color-text-dim)] ml-2 text-sm">
                        ({note.info})
                    </span>
                )}
            </span>
        </div>
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-20 pb-12">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error || !patchData) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-20 pb-12">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="text-center py-20">
                            <p className="text-red-400">{error || 'Failed to load patch notes'}</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-20 pb-12">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                            {t('patchNotes.title')}
                        </h1>
                        <p className="text-[var(--color-text-muted)] text-lg mb-2">
                            {t('patchNotes.subtitle')}
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <span className="px-4 py-2 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold text-lg">
                                Patch {patchData.patch_name}
                            </span>
                            <span className="text-[var(--color-text-muted)]">
                                {formatDate(patchData.patch_timestamp)}
                            </span>
                        </div>
                    </div>

                    {/* Items Section */}
                    {patchData.items && patchData.items.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                {t('patchNotes.items')}
                            </h2>
                            <div className="space-y-4">
                                {patchData.items.map((item, idx) => (
                                    <div key={idx} className="glass rounded-xl p-4">
                                        <div className="text-sm font-medium text-[var(--color-text)] mb-2">
                                            Ability ID: {item.ability_id}
                                        </div>
                                        {item.ability_notes && (
                                            <div className="space-y-1">
                                                {item.ability_notes.map((note, nIdx) =>
                                                    renderNote(note, `item-${idx}-note-${nIdx}`)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Heroes Section */}
                    {patchData.heroes && patchData.heroes.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                {t('patchNotes.heroes')}
                            </h2>
                            <div className="space-y-6">
                                {patchData.heroes.map((hero, idx) => {
                                    const heroInfo = heroes.get(hero.hero_id);
                                    return (
                                        <div key={idx} className="glass rounded-xl p-6">
                                            {/* Hero Header */}
                                            <div className="flex items-center gap-4 mb-4">
                                                {heroInfo && (
                                                    <Image
                                                        src={`${STEAM_CDN}${heroInfo.icon}`}
                                                        alt={heroInfo.localized_name}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-lg"
                                                    />
                                                )}
                                                <h3 className="text-xl font-bold text-[var(--color-text)]">
                                                    {heroInfo?.localized_name || `Hero ${hero.hero_id}`}
                                                </h3>
                                            </div>

                                            {/* General Hero Notes */}
                                            {hero.hero_notes && hero.hero_notes.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2">
                                                        {t('patchNotes.generalChanges')}
                                                    </h4>
                                                    <div className="space-y-1">
                                                        {hero.hero_notes.map((note, nIdx) =>
                                                            renderNote(note, `hero-${idx}-hnote-${nIdx}`)
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Talent Notes */}
                                            {hero.talent_notes && hero.talent_notes.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-semibold text-purple-400 mb-2">
                                                        {t('patchNotes.talents')}
                                                    </h4>
                                                    <div className="space-y-1">
                                                        {hero.talent_notes.map((note, nIdx) =>
                                                            renderNote(note, `hero-${idx}-tnote-${nIdx}`)
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ability Notes */}
                                            {hero.abilities && hero.abilities.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                                                        {t('patchNotes.abilities')}
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {hero.abilities.map((ability, aIdx) => (
                                                            <div key={aIdx}>
                                                                {ability.ability_notes?.map((note, nIdx) =>
                                                                    renderNote(note, `hero-${idx}-ability-${aIdx}-note-${nIdx}`)
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Facet/Subsection Notes */}
                                            {hero.subsections && hero.subsections.length > 0 && (
                                                <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
                                                    {hero.subsections.map((sub, sIdx) => (
                                                        <div key={sIdx}>
                                                            <h4 className="text-sm font-semibold text-amber-400 mb-2">
                                                                ⚡ {sub.title}
                                                            </h4>
                                                            {sub.general_notes?.map((note, nIdx) =>
                                                                renderNote(note, `hero-${idx}-sub-${sIdx}-gnote-${nIdx}`)
                                                            )}
                                                            {sub.abilities?.map((ability, aIdx) => (
                                                                <div key={aIdx} className="mt-2">
                                                                    {ability.ability_notes?.map((note, nIdx) =>
                                                                        renderNote(note, `hero-${idx}-sub-${sIdx}-ability-${aIdx}-note-${nIdx}`)
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </>
    );
}
