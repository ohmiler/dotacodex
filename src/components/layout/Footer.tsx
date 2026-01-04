import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
    const t = useTranslations();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                                <span className="text-xl font-bold text-[var(--color-background)]">DC</span>
                            </div>
                            <span className="text-xl font-bold text-gradient">
                                {t('common.appName')}
                            </span>
                        </Link>
                        <p className="text-[var(--color-text-muted)] max-w-md">
                            {t('home.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-[var(--color-text)]">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/heroes" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    {t('nav.heroes')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/items" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    {t('nav.items')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/learn" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    {t('nav.learn')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold mb-4 text-[var(--color-text)]">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://www.dota2.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                >
                                    Official Dota 2
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.opendota.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                >
                                    OpenDota
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-[var(--color-border)] text-center text-[var(--color-text-muted)] text-sm">
                    <p>© {currentYear} DotaCodex. Not affiliated with Valve Corporation.</p>
                    <p className="mt-1">Dota 2 is a registered trademark of Valve Corporation.</p>
                </div>
            </div>
        </footer>
    );
}
