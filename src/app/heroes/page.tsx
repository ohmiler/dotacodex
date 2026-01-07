import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import HeroGrid from '@/components/heroes/HeroGrid';

export const metadata: Metadata = {
    title: 'ฮีโร่ทั้งหมด - All Heroes',
    description: 'ค้นพบฮีโร่กว่า 120 ตัวใน Dota 2 พร้อมสถิติ สกิล และคำแนะนำสำหรับผู้เล่นใหม่ | Discover all 120+ Dota 2 heroes with stats, abilities, and beginner tips.',
    openGraph: {
        title: 'All Heroes | DotaCodex',
        description: 'ค้นพบฮีโร่กว่า 120 ตัวใน Dota 2 พร้อมสถิติ สกิล และคำแนะนำ',
    },
};

export default function HeroesPage() {
    const t = useTranslations('heroes');

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
                        <p className="text-[var(--color-text-muted)]">{t('subtitle')}</p>
                    </div>

                    {/* Hero Grid */}
                    <HeroGrid />
                </div>
            </main>
        </div>
    );
}
