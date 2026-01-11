'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateHeroSlug } from '@/lib/utils';

interface SearchResult {
    type: 'hero' | 'item';
    id: number;
    name: string;
    localizedName: string;
    img: string | null;
    // Hero specific
    primaryAttr?: string;
    roles?: string[];
    // Item specific
    cost?: number;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const t = useTranslations();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Search debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setSelectedIndex(0);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            e.preventDefault();
            const result = results[selectedIndex];
            const href = result.type === 'hero'
                ? `/heroes/${generateHeroSlug(result.localizedName, result.id)}`
                : `/items/${result.id}`;
            router.push(href);
            onClose();
        } else if (e.key === 'Escape') {
            onClose();
        }
    }, [results, selectedIndex, router, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        const container = resultsRef.current;
        if (container && results.length > 0) {
            const selectedEl = container.children[selectedIndex] as HTMLElement;
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex, results.length]);

    // Get attribute color
    const getAttrColor = (attr?: string) => {
        switch (attr) {
            case 'str': return 'var(--color-strength)';
            case 'agi': return 'var(--color-agility)';
            case 'int': return 'var(--color-intelligence)';
            case 'all': return 'var(--color-universal)';
            default: return 'var(--color-text-muted)';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-4 bg-[var(--color-surface)] rounded-xl shadow-2xl border border-[var(--color-border)] overflow-hidden animate-fadeIn">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)]">
                    <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('common.search') + '...'}
                        className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-[var(--color-text-muted)]"
                    />
                    {loading && (
                        <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    )}
                    <kbd className="hidden sm:block px-2 py-1 text-xs bg-[var(--color-surface-elevated)] rounded text-[var(--color-text-muted)]">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
                    {results.length === 0 && query && !loading && (
                        <div className="p-8 text-center text-[var(--color-text-muted)]">
                            {t('common.search')} "{query}" - ไม่พบผลลัพธ์
                        </div>
                    )}

                    {results.length === 0 && !query && (
                        <div className="p-8 text-center text-[var(--color-text-muted)]">
                            <p className="mb-2">🔍 {t('common.search')} Heroes & Items</p>
                            <p className="text-sm">พิมพ์ชื่อ Hero หรือ Item ที่ต้องการค้นหา</p>
                        </div>
                    )}

                    {results.map((result, index) => (
                        <Link
                            key={`${result.type}-${result.id}`}
                            href={result.type === 'hero'
                                ? `/heroes/${generateHeroSlug(result.localizedName, result.id)}`
                                : `/items/${result.id}`}
                            onClick={onClose}
                            className={`flex items-center gap-4 p-3 transition-colors ${index === selectedIndex
                                ? 'bg-[var(--color-primary)]/20'
                                : 'hover:bg-[var(--color-surface-elevated)]'
                                }`}
                        >
                            {/* Image */}
                            <div className={`relative ${result.type === 'hero' ? 'w-16 h-10' : 'w-12 h-9'} rounded overflow-hidden bg-[var(--color-surface-elevated)] flex-shrink-0`}>
                                {result.img ? (
                                    <img
                                        src={result.img}
                                        alt={result.localizedName}
                                        className={`w-full h-full ${result.type === 'hero' ? 'object-cover' : 'object-contain'}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {result.type === 'hero' ? '🦸' : '⚔️'}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                    {result.localizedName}
                                </div>
                                <div className="text-sm text-[var(--color-text-muted)] truncate">
                                    {result.type === 'hero' ? (
                                        <span style={{ color: getAttrColor(result.primaryAttr) }}>
                                            {result.roles?.slice(0, 2).join(', ')}
                                        </span>
                                    ) : (
                                        <span className="text-[var(--color-accent)]">
                                            💰 {result.cost?.toLocaleString() || 0}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Type Badge */}
                            <span className={`px-2 py-1 text-xs rounded-full ${result.type === 'hero'
                                ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                : 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                                }`}>
                                {result.type === 'hero' ? t('nav.heroes') : t('nav.items')}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-4">
                        <span><kbd className="px-1 bg-[var(--color-surface-elevated)] rounded">↑↓</kbd> เลือก</span>
                        <span><kbd className="px-1 bg-[var(--color-surface-elevated)] rounded">↵</kbd> ไป</span>
                        <span><kbd className="px-1 bg-[var(--color-surface-elevated)] rounded">esc</kbd> ปิด</span>
                    </div>
                    <span>⌘K / Ctrl+K</span>
                </div>
            </div>
        </div>
    );
}
