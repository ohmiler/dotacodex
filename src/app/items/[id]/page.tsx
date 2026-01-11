import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/layout/Navbar';
import ItemDetail from '@/components/items/ItemDetail';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';

// Revalidate every 24 hours
export const revalidate = 86400;

// Cache all items for 24 hours (shared across all pages)
const getAllItems = unstable_cache(
    async () => {
        return await db.select().from(items);
    },
    ['all-items-detail'],
    { revalidate: 86400 }
);

// Cache individual item by ID for 24 hours
const getItemById = async (itemId: number) => {
    const cached = unstable_cache(
        async () => {
            return await db.query.items.findFirst({
                where: eq(items.id, itemId),
            });
        },
        [`item-${itemId}`],
        { revalidate: 86400 }
    );
    return cached();
};

// Generate static params for all items
export async function generateStaticParams() {
    const allItems = await getAllItems();
    return allItems.map((item: { id: number }) => ({
        id: item.id.toString(),
    }));
}

interface Props {
    params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
        return { title: 'Item Not Found - DotaCodex' };
    }

    const item = await getItemById(itemId);

    if (!item) {
        return { title: 'Item Not Found - DotaCodex' };
    }

    const description = `Learn about ${item.localizedName} in Dota 2 - ${item.cost ? `${item.cost} gold` : 'Recipe'} item with components and build information.`;

    return {
        title: `${item.localizedName} - Item Guide`,
        description,
        openGraph: {
            title: `${item.localizedName} | DotaCodex`,
            description,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${item.localizedName} | DotaCodex`,
            description,
        },
    };
}

export default async function ItemPage({ params }: Props) {
    const { id } = await params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
        notFound();
    }

    // Fetch item data
    const [item, allItems] = await Promise.all([
        getItemById(itemId),
        getAllItems(),
    ]);

    if (!item) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                <Suspense fallback={<ItemDetailSkeleton />}>
                    <ItemDetail item={item} allItems={allItems} />
                </Suspense>
            </main>
        </div>
    );
}

function ItemDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
            <div className="h-8 w-48 bg-[var(--color-surface)] rounded mb-4" />
            <div className="h-64 bg-[var(--color-surface)] rounded-xl mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-48 bg-[var(--color-surface)] rounded-xl" />
                <div className="h-48 bg-[var(--color-surface)] rounded-xl" />
            </div>
        </div>
    );
}
