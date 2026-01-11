'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import SearchModal from '../search/SearchModal';

export default function Navbar() {
    const t = useTranslations();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navItems = [
        { href: '/', label: t('nav.home') },
        { href: '/heroes', label: t('nav.heroes') },
        { href: '/items', label: t('nav.items') },
        { href: '/learn', label: t('nav.learn') },
    ];

    return (
        <>
            <nav className="glass fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                                <span className="text-xl font-bold text-[var(--color-background)]">DC</span>
                            </div>
                            <span className="text-xl font-bold text-gradient hidden sm:block">
                                {t('common.appName')}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-medium"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Search & Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] transition-colors text-sm text-[var(--color-text-muted)]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="hidden lg:inline">{t('common.search')}</span>
                                <kbd className="hidden lg:inline px-1.5 py-0.5 text-xs bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
                                    ⌘K
                                </kbd>
                            </button>

                            <LanguageSwitcher />
                            {session ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2"
                                    >
                                        <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs font-bold text-[var(--color-background)]">
                                            {(session.user?.name || session.user?.email || '?').charAt(0).toUpperCase()}
                                        </span>
                                        <span>{session.user?.name || session.user?.email}</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="btn btn-secondary text-sm py-2 px-4"
                                    >
                                        {t('common.logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="btn btn-secondary text-sm py-2 px-4">
                                        {t('common.login')}
                                    </Link>
                                    <Link href="/auth/register" className="btn btn-primary text-sm py-2 px-4">
                                        {t('common.register')}
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile: Search + Menu */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)]"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <button
                                className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)]"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-[var(--color-border)]">
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="px-4 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="flex flex-col gap-2 mt-4 px-4">
                                    {session ? (
                                        <>
                                            <Link
                                                href="/profile"
                                                className="btn btn-primary text-sm py-2 text-center"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                👤 โปรไฟล์
                                            </Link>
                                            <button
                                                onClick={() => signOut()}
                                                className="btn btn-secondary text-sm py-2"
                                            >
                                                {t('common.logout')}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className="btn btn-secondary flex-1 text-sm py-2">
                                                {t('common.login')}
                                            </Link>
                                            <Link href="/auth/register" className="btn btn-primary flex-1 text-sm py-2">
                                                {t('common.register')}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}

function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);

    const switchLocale = (locale: string) => {
        document.cookie = `locale=${locale};path=/;max-age=31536000`;
        window.location.reload();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 glass rounded-lg overflow-hidden">
                    <button
                        onClick={() => switchLocale('th')}
                        className="w-full px-4 py-2 text-left hover:bg-[var(--color-surface-elevated)] transition-colors"
                    >
                        🇹🇭 ไทย
                    </button>
                    <button
                        onClick={() => switchLocale('en')}
                        className="w-full px-4 py-2 text-left hover:bg-[var(--color-surface-elevated)] transition-colors"
                    >
                        🇺🇸 English
                    </button>
                </div>
            )}
        </div>
    );
}
