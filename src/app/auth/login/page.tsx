'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const t = useTranslations('auth');
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/og-image.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117]/95 via-[#0d1117]/85 to-[#0d1117]/95" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-[#0d1117]/80" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                        <span className="text-2xl font-bold text-[var(--color-background)]">DC</span>
                    </div>
                </Link>

                <div className="card p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">{t('loginTitle')}</h1>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-[var(--color-secondary-muted)] text-[var(--color-secondary)] text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">{t('email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">{t('password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 disabled:opacity-50"
                        >
                            {loading ? '...' : t('loginButton')}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 border-t border-[var(--color-border)]" />
                        <span className="text-[var(--color-text-muted)] text-sm">{t('orContinueWith')}</span>
                        <div className="flex-1 border-t border-[var(--color-border)]" />
                    </div>

                    {/* Steam Login */}
                    <button
                        onClick={() => signIn('steam')}
                        className="w-full btn btn-secondary py-3 gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385l4.155-6.69a4.5 4.5 0 1 1 3.24 0l4.155 6.69C22.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        {t('steam')}
                    </button>

                    <p className="mt-6 text-center text-[var(--color-text-muted)]">
                        {t('noAccount')}{' '}
                        <Link href="/auth/register" className="text-[var(--color-primary)] hover:underline">
                            {t('signUp')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
