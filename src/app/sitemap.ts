import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dotacodex.com';

    // Fetch all heroes and items to include in sitemap
    const [heroes, items] = await Promise.all([
        db.query.heroes.findMany(),
        db.query.items.findMany(),
    ]);

    // Static routes
    const routes = [
        '',
        '/heroes',
        '/items',
        '/learn',
        '/auth/login',
        '/auth/register',
        '/privacy',
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Hero routes
    const heroRoutes = heroes.map((hero: any) => ({
        url: `${siteUrl}/heroes/${hero.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Item routes
    const itemRoutes = items.map((item: any) => ({
        url: `${siteUrl}/items/${item.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    return [...routes, ...heroRoutes, ...itemRoutes];
}
