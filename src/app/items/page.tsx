import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import ItemGrid from '@/components/items/ItemGrid';

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
