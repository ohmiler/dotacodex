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

// OpenDota item data interface
interface OpenDotaItemAbility {
    type: string;
    title: string;
    description: string;
}

interface OpenDotaItemAttrib {
    key: string;
    display?: string;
    value: string | string[];
}

interface OpenDotaItemData {
    abilities?: OpenDotaItemAbility[];
    attrib?: OpenDotaItemAttrib[];
    lore?: string;
    notes?: string;
    cd?: number | number[] | false;
    mc?: number | number[] | false;
    behavior?: string | string[];
    dmg_type?: string;
    bkbpierce?: string;
    dispellable?: string;
}

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

// Cache OpenDota item data for 24 hours
const getOpenDotaItems = unstable_cache(
    async (): Promise<Record<string, OpenDotaItemData>> => {
        try {
            const res = await fetch('https://api.opendota.com/api/constants/items', {
                next: { revalidate: 86400 },
            });
            if (!res.ok) return {};
            return await res.json();
        } catch (error) {
            console.error('Error fetching OpenDota items:', error);
            return {};
        }
    },
    ['opendota-items'],
    { revalidate: 86400 }
);

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
    const [item, allItems, openDotaItems] = await Promise.all([
        getItemById(itemId),
        getAllItems(),
        getOpenDotaItems(),
    ]);

    if (!item) {
        notFound();
    }

    // Get item key for OpenDota lookup (remove 'item_' prefix if present)
    const itemKey = item.name.replace('item_', '');
    const openDotaItemData = openDotaItems[itemKey] || null;

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                <Suspense fallback={<ItemDetailSkeleton />}>
                    <ItemDetail
                        item={item}
                        allItems={allItems}
                        openDotaData={openDotaItemData}
                    />
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

