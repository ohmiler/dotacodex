'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import Link from 'next/link';

interface Favorite {
    heroId: number;
    createdAt: string;
    hero: {
        id: number;
        name: string;
        localizedName: string;
        primaryAttr: string;
        img: string | null;
        icon: string | null;
    } | null;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [completedLessons, setCompletedLessons] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            redirect('/auth/login');
        }

        if (status === 'authenticated') {
            fetchUserData();
        }
    }, [status]);

    const fetchUserData = async () => {
        try {
            // Fetch favorites
            const favResponse = await fetch('/api/favorites');
            if (favResponse.ok) {
                const favData = await favResponse.json();
                setFavorites(favData.favorites || []);
            }

            // Fetch progress
            const progressResponse = await fetch('/api/progress');
            if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                setCompletedLessons(progressData.completedCount || 0);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAttrColor = (attr: string) => {
        switch (attr) {
            case 'str': return 'var(--color-hard)';
            case 'agi': return 'var(--color-easy)';
            case 'int': return 'var(--color-primary)';
            default: return 'var(--color-text-muted)';
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <main className="pt-24 pb-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="card p-8 mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-[var(--color-surface-elevated)]" />
                                    <div className="flex-1">
                                        <div className="h-6 w-48 bg-[var(--color-surface-elevated)] rounded mb-2" />
                                        <div className="h-4 w-32 bg-[var(--color-surface-elevated)] rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    const user = session.user;

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="card p-8 mb-8">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-3xl font-bold">
                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                            </div>

                            {/* User Info */}
                            <div>
                                <h1 className="text-2xl font-bold mb-1">
                                    {user.name || 'Hero'}
                                </h1>
                                <p className="text-[var(--color-text-muted)]">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="card p-4 text-center">
                            <div className="text-3xl font-bold text-[var(--color-primary)]">
                                {favorites.length}
                            </div>
                            <div className="text-sm text-[var(--color-text-muted)]">
                                ฮีโร่ที่ชื่นชอบ
                            </div>
                        </div>
                        <div className="card p-4 text-center">
                            <div className="text-3xl font-bold text-[var(--color-easy)]">
                                {completedLessons}
                            </div>
                            <div className="text-sm text-[var(--color-text-muted)]">
                                บทเรียนที่เรียนจบ
                            </div>
                        </div>
                        <div className="card p-4 text-center col-span-2 md:col-span-1">
                            <div className="text-3xl font-bold text-[var(--color-accent)]">
                                🎮
                            </div>
                            <div className="text-sm text-[var(--color-text-muted)]">
                                มือใหม่
                            </div>
                        </div>
                    </div>

                    {/* Favorite Heroes */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>❤️</span>
                            <span>ฮีโร่ที่ชื่นชอบ / Favorite Heroes</span>
                            <span className="text-sm font-normal text-[var(--color-text-muted)]">
                                ({favorites.length})
                            </span>
                        </h2>

                        {favorites.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🦸</div>
                                <p className="text-[var(--color-text-muted)] mb-4">
                                    ยังไม่มีฮีโร่ที่ชื่นชอบ
                                </p>
                                <Link
                                    href="/heroes"
                                    className="btn btn-primary inline-flex items-center gap-2"
                                >
                                    <span>ดูฮีโร่ทั้งหมด</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {favorites.map((fav) => (
                                    fav.hero && (
                                        <Link
                                            key={fav.heroId}
                                            href={`/heroes/${fav.heroId}`}
                                            className="group"
                                        >
                                            <div className="card p-3 hover:border-[var(--color-primary)] transition-colors">
                                                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2">
                                                    {fav.hero.img && (
                                                        <Image
                                                            src={fav.hero.img}
                                                            alt={fav.hero.localizedName || ''}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: getAttrColor(fav.hero.primaryAttr || '') }}
                                                    />
                                                    <span className="text-sm font-medium truncate">
                                                        {fav.hero.localizedName}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
