import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, userBookmarks, heroes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'โปรไฟล์ - Profile',
    description: 'Your DotaCodex profile and favorite heroes',
};

async function getUserData(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    const favorites = await db
        .select({
            heroId: userBookmarks.heroId,
            createdAt: userBookmarks.createdAt,
            hero: {
                id: heroes.id,
                name: heroes.name,
                localizedName: heroes.localizedName,
                primaryAttr: heroes.primaryAttr,
                img: heroes.img,
                icon: heroes.icon,
            },
        })
        .from(userBookmarks)
        .leftJoin(heroes, eq(userBookmarks.heroId, heroes.id))
        .where(eq(userBookmarks.userId, userId));

    return {
        user,
        favorites: favorites.filter((f: typeof favorites[number]) => f.heroId !== null),
    };
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/auth/login');
    }

    const { user, favorites } = await getUserData(session.user.id);

    if (!user) {
        redirect('/auth/login');
    }

    const getAttrColor = (attr: string) => {
        switch (attr) {
            case 'str': return 'var(--color-hard)';
            case 'agi': return 'var(--color-easy)';
            case 'int': return 'var(--color-primary)';
            default: return 'var(--color-text-muted)';
        }
    };

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
                                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                    เข้าร่วมเมื่อ {user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }) : 'ไม่ทราบ'}
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
                            <div className="text-3xl font-bold text-[var(--color-secondary)]">
                                0
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
                                {favorites.map((fav: typeof favorites[number]) => (
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
