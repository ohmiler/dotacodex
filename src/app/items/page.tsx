import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import ItemGrid from '@/components/items/ItemGrid';

export const metadata: Metadata = {
    title: 'ไอเทมทั้งหมด - All Items',
    description: 'เรียนรู้ไอเทมทั้งหมดใน Dota 2 แบ่งตามหมวดหมู่ พร้อมราคาและส่วนประกอบ | Learn about all Dota 2 items with costs, components, and build guides.',
    openGraph: {
        title: 'All Items | DotaCodex',
        description: 'เรียนรู้ไอเทมทั้งหมดใน Dota 2 แบ่งตามหมวดหมู่ พร้อมราคาและส่วนประกอบ',
    },
};

export default function ItemsPage() {
    const t = useTranslations('items');

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

                    {/* Item Grid */}
                    <ItemGrid />
                </div>
            </main>
        </div>
    );
}
