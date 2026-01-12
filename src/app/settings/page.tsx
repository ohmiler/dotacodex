'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfile {
    id: string;
    email: string | null;
    name: string | null;
    avatar: string | null;
    steamId: string | null;
    steamInfo: {
        personaname: string;
        avatarfull: string;
        profileurl: string;
    } | null;
    hasPassword: boolean;
}

function SettingsContent() {
    const { data: session, status } = useSession();
    const t = useTranslations('settings');
    const router = useRouter();
    const searchParams = useSearchParams();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [unlinking, setUnlinking] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Check for URL messages
    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (success === 'SteamLinked') {
            setMessage({ type: 'success', text: t('steamLinkedSuccess') });
        } else if (error === 'SteamAlreadyLinked') {
            setMessage({ type: 'error', text: t('steamAlreadyLinked') });
        }
    }, [searchParams, t]);

    // Fetch user profile
    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch('/api/user/profile');
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        }

        if (status === 'authenticated') {
            fetchProfile();
        } else if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    const handleConnectSteam = () => {
        window.location.href = '/api/auth/steam?link=true&callbackUrl=/settings';
    };

    const handleUnlinkSteam = async () => {
        if (!confirm(t('confirmUnlink'))) return;

        setUnlinking(true);
        try {
            const response = await fetch('/api/user/unlink-steam', {
                method: 'POST',
            });

            if (response.ok) {
                setMessage({ type: 'success', text: t('steamUnlinkedSuccess') });
                // Refresh profile
                const profileResponse = await fetch('/api/user/profile');
                if (profileResponse.ok) {
                    setProfile(await profileResponse.json());
                }
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || t('unlinkError') });
            }
        } catch (error) {
            console.error('Failed to unlink Steam:', error);
            setMessage({ type: 'error', text: t('unlinkError') });
        } finally {
            setUnlinking(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!session || !profile) {
        return null;
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-white transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('backToHome')}
                    </Link>
                    <h1 className="text-3xl font-bold">{t('title')}</h1>
                </div>

                {/* Messages */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]'
                        : 'bg-[var(--color-secondary-muted)] text-[var(--color-secondary)]'
                        }`}>
                        {message.type === 'success' ? (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {message.text}
                        <button
                            onClick={() => setMessage(null)}
                            className="ml-auto hover:opacity-70"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Profile Section */}
                <div className="card p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">{t('profile')}</h2>

                    <div className="flex items-center gap-4">
                        {profile.avatar ? (
                            <Image
                                src={profile.avatar}
                                alt={profile.name || 'Avatar'}
                                width={64}
                                height={64}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center">
                                <span className="text-2xl font-bold text-[var(--color-text-muted)]">
                                    {profile.name?.[0]?.toUpperCase() || '?'}
                                </span>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-medium">{profile.name || t('anonymous')}</h3>
                            {profile.email && (
                                <p className="text-[var(--color-text-muted)]">{profile.email}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Connected Accounts Section */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">{t('connectedAccounts')}</h2>

                    {/* Steam Connection */}
                    <div className="border border-[var(--color-border)] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Steam Icon */}
                                <div className="w-10 h-10 rounded-lg bg-[#1b2838] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385l4.155-6.69a4.5 4.5 0 1 1 3.24 0l4.155 6.69C22.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="font-medium">Steam</h3>
                                    {profile.steamId ? (
                                        <div className="flex items-center gap-2">
                                            {profile.steamInfo && (
                                                <>
                                                    <Image
                                                        src={profile.steamInfo.avatarfull}
                                                        alt={profile.steamInfo.personaname}
                                                        width={20}
                                                        height={20}
                                                        className="rounded"
                                                    />
                                                    <a
                                                        href={profile.steamInfo.profileurl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[var(--color-primary)] hover:underline"
                                                    >
                                                        {profile.steamInfo.personaname}
                                                    </a>
                                                </>
                                            )}
                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                ({profile.steamId})
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {t('steamNotConnected')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {profile.steamId ? (
                                <button
                                    onClick={handleUnlinkSteam}
                                    disabled={unlinking || (!profile.hasPassword && !profile.email)}
                                    className="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={!profile.hasPassword && !profile.email ? t('cannotUnlink') : ''}
                                >
                                    {unlinking ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            {t('unlinking')}
                                        </span>
                                    ) : t('disconnect')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleConnectSteam}
                                    className="btn btn-primary text-sm"
                                >
                                    {t('connectSteam')}
                                </button>
                            )}
                        </div>

                        {/* Warning if can't unlink */}
                        {profile.steamId && !profile.hasPassword && !profile.email && (
                            <p className="mt-3 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] p-2 rounded">
                                ⚠️ {t('cannotUnlinkWarning')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrap in Suspense because useSearchParams needs it for static rendering
export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
