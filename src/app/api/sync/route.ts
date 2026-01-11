import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroes, items } from '@/lib/db/schema';
import openDota from '@/lib/opendota';

// Sync heroes and items from OpenDota API
// This endpoint should be called periodically or manually to update the cache
// Protected by API key - set SYNC_API_KEY in environment variables
export async function POST(request: Request) {
    try {
        // Validate API key
        const apiKey = request.headers.get('x-api-key');
        const expectedKey = process.env.SYNC_API_KEY;

        // If SYNC_API_KEY is not set, deny all requests for security
        if (!expectedKey) {
            console.error('SYNC_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Validate API key
        if (apiKey !== expectedKey) {
            return NextResponse.json(
                { error: 'Unauthorized. Invalid or missing API key.' },
                { status: 401 }
            );
        }

        // Sync Heroes
        const openDotaHeroes = await openDota.getHeroes();

        for (const hero of openDotaHeroes) {
            await db.insert(heroes).values({
                id: hero.id,
                name: hero.name,
                localizedName: hero.localized_name,
                primaryAttr: hero.primary_attr,
                attackType: hero.attack_type,
                roles: hero.roles,
                img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
                icon: `https://cdn.cloudflare.steamstatic.com${hero.icon}`,
                baseHealth: hero.base_health,
                baseMana: hero.base_mana,
                baseArmor: hero.base_armor,
                moveSpeed: hero.move_speed,
                attackRange: hero.attack_range,
                baseStr: hero.base_str,
                baseAgi: hero.base_agi,
                baseInt: hero.base_int,
                strGain: hero.str_gain,
                agiGain: hero.agi_gain,
                intGain: hero.int_gain,
                lastSyncedAt: new Date(),
            }).onConflictDoUpdate({
                target: heroes.id,
                set: {
                    localizedName: hero.localized_name,
                    primaryAttr: hero.primary_attr,
                    attackType: hero.attack_type,
                    roles: hero.roles,
                    img: `https://cdn.cloudflare.steamstatic.com${hero.img}`,
                    icon: `https://cdn.cloudflare.steamstatic.com${hero.icon}`,
                    baseHealth: hero.base_health,
                    baseMana: hero.base_mana,
                    baseArmor: hero.base_armor,
                    moveSpeed: hero.move_speed,
                    attackRange: hero.attack_range,
                    baseStr: hero.base_str,
                    baseAgi: hero.base_agi,
                    baseInt: hero.base_int,
                    strGain: hero.str_gain,
                    agiGain: hero.agi_gain,
                    intGain: hero.int_gain,
                    lastSyncedAt: new Date(),
                },
            });
        }

        // Sync Items
        const openDotaItems = await openDota.getItems();

        for (const [key, item] of Object.entries(openDotaItems)) {
            if (!item.id) continue;

            await db.insert(items).values({
                id: item.id,
                name: key,
                localizedName: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                cost: item.cost,
                secretShop: item.secret_shop,
                sideShop: item.side_shop,
                recipe: item.recipe,
                components: item.components,
                description: item.hint?.join(' ') || null,
                img: item.img ? `https://cdn.cloudflare.steamstatic.com${item.img}` : null,
                lastSyncedAt: new Date(),
            }).onConflictDoUpdate({
                target: items.id,
                set: {
                    cost: item.cost,
                    secretShop: item.secret_shop,
                    sideShop: item.side_shop,
                    recipe: item.recipe,
                    components: item.components,
                    description: item.hint?.join(' ') || null,
                    img: item.img ? `https://cdn.cloudflare.steamstatic.com${item.img}` : null,
                    lastSyncedAt: new Date(),
                },
            });
        }

        return NextResponse.json({
            success: true,
            heroesCount: openDotaHeroes.length,
            itemsCount: Object.keys(openDotaItems).length,
        });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: 'Failed to sync data from OpenDota' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST to sync data from OpenDota API',
        endpoints: {
            sync: 'POST /api/sync',
        },
    });
}
