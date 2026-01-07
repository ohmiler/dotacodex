import type { Metadata } from 'next';

// Base URL for the site
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dotacodex.vercel.app';

// Default SEO values
export const defaultSEO: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'DotaCodex - เรียนรู้ Dota 2 | Learn Dota 2',
        template: '%s | DotaCodex',
    },
    description: 'คู่มือเรียนรู้ Dota 2 ที่ดีที่สุด ครบทุกฮีโร่ ไอเทม และกลยุทธ์ | Your ultimate companion for learning Dota 2 with comprehensive hero guides, item builds, and strategies.',
    keywords: [
        'Dota 2',
        'MOBA',
        'gaming',
        'เกม',
        'ฮีโร่',
        'Heroes',
        'Items',
        'ไอเทม',
        'Guide',
        'คู่มือ',
        'Tutorial',
        'Beginner',
        'มือใหม่',
        'สอนเล่น',
    ],
    authors: [{ name: 'DotaCodex Team' }],
    creator: 'DotaCodex',
    publisher: 'DotaCodex',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'th_TH',
        alternateLocale: 'en_US',
        url: SITE_URL,
        siteName: 'DotaCodex',
        title: 'DotaCodex - เรียนรู้ Dota 2 | Learn Dota 2',
        description: 'คู่มือเรียนรู้ Dota 2 ที่ดีที่สุด ครบทุกฮีโร่ ไอเทม และกลยุทธ์',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'DotaCodex - Learn Dota 2',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DotaCodex - เรียนรู้ Dota 2 | Learn Dota 2',
        description: 'คู่มือเรียนรู้ Dota 2 ที่ดีที่สุด ครบทุกฮีโร่ ไอเทม และกลยุทธ์',
        images: ['/og-image.png'],
    },
    verification: {
        // Add your verification codes here
        // google: 'your-google-verification-code',
        // yandex: 'your-yandex-verification-code',
    },
    alternates: {
        canonical: SITE_URL,
    },
};

// Generate metadata for hero pages
export function generateHeroMetadata(hero: {
    localizedName: string;
    name: string;
    primaryAttr: string;
    roles: string[];
    img?: string | null;
}): Metadata {
    const title = `${hero.localizedName} - Hero Guide`;
    const description = `เรียนรู้วิธีเล่น ${hero.localizedName} ใน Dota 2 - ${hero.primaryAttr} hero | Learn how to play ${hero.localizedName} - a ${hero.primaryAttr} ${hero.roles.join(', ')} hero with item builds, counters, and tips.`;

    return {
        title,
        description,
        openGraph: {
            title: `${hero.localizedName} | DotaCodex`,
            description,
            images: hero.img ? [{ url: hero.img, width: 256, height: 144, alt: hero.localizedName }] : undefined,
        },
        twitter: {
            card: 'summary',
            title: `${hero.localizedName} | DotaCodex`,
            description,
            images: hero.img ? [hero.img] : undefined,
        },
    };
}

// Generate metadata for item pages
export function generateItemMetadata(item: {
    localizedName: string;
    name: string;
    cost: number;
    description?: string | null;
    img?: string | null;
}): Metadata {
    const title = `${item.localizedName} - Item Guide`;
    const description = item.description || `เรียนรู้เกี่ยวกับ ${item.localizedName} ใน Dota 2 - ราคา ${item.cost} gold | Learn about ${item.localizedName} in Dota 2 - costs ${item.cost} gold.`;

    return {
        title,
        description,
        openGraph: {
            title: `${item.localizedName} | DotaCodex`,
            description,
            images: item.img ? [{ url: item.img, width: 88, height: 64, alt: item.localizedName }] : undefined,
        },
    };
}

// Generate metadata for learning pages
export function generateLearnMetadata(topic: {
    title: string;
    description: string;
}): Metadata {
    return {
        title: topic.title,
        description: topic.description,
        openGraph: {
            title: `${topic.title} | DotaCodex`,
            description: topic.description,
        },
    };
}
