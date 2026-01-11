import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Use nodejs runtime to avoid Edge Function size limits
export const runtime = 'nodejs';

export const alt = 'DotaCodex Item';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#0d1117',
                        color: '#fff',
                        fontSize: 48,
                    }}
                >
                    Item Not Found
                </div>
            ),
            { ...size }
        );
    }

    const item = await db.query.items.findFirst({
        where: eq(items.id, itemId),
    });

    if (!item) {
        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#0d1117',
                        color: '#fff',
                        fontSize: 48,
                    }}
                >
                    Item Not Found
                </div>
            ),
            { ...size }
        );
    }

    // Get item image URL
    const itemImage = item.img
        ? `https://cdn.cloudflare.steamstatic.com${item.img}`
        : null;

    // Get category color
    const getCategoryColor = () => {
        if (item.secretShop) return '#a855f7'; // Purple for secret shop
        if (item.recipe) return '#f97316'; // Orange for recipe
        switch (item.category) {
            case 'consumables': return '#22c55e';
            case 'attributes': return '#3b82f6';
            case 'equipment': return '#ef4444';
            default: return '#ffd700';
        }
    };

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0d1117',
                    padding: '60px',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Background gradient */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(ellipse at top left, ${getCategoryColor()}22 0%, transparent 50%)`,
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px',
                        flex: 1,
                    }}
                >
                    {/* Item Icon */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '200px',
                            height: '150px',
                            backgroundColor: '#161b22',
                            borderRadius: '24px',
                            border: `4px solid ${getCategoryColor()}`,
                            overflow: 'hidden',
                        }}
                    >
                        {itemImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={itemImage}
                                alt={item.localizedName || item.name}
                                width={160}
                                height={120}
                                style={{ objectFit: 'contain' }}
                            />
                        ) : (
                            <div style={{ fontSize: '80px' }}>⚔️</div>
                        )}
                    </div>

                    {/* Item Info */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                        }}
                    >
                        {/* Item Name */}
                        <div
                            style={{
                                fontSize: '64px',
                                fontWeight: 'bold',
                                color: '#e6edf3',
                                marginBottom: '16px',
                                lineHeight: 1.1,
                            }}
                        >
                            {item.localizedName || item.name}
                        </div>

                        {/* Cost and Tags */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {/* Cost */}
                            {item.cost && item.cost > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        backgroundColor: '#ffd70033',
                                        borderRadius: '50px',
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: '#ffd700',
                                    }}
                                >
                                    💰 {item.cost.toLocaleString()} Gold
                                </div>
                            )}

                            {/* Secret Shop Tag */}
                            {item.secretShop && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        backgroundColor: '#a855f733',
                                        borderRadius: '50px',
                                        fontSize: '24px',
                                        color: '#a855f7',
                                    }}
                                >
                                    🏪 Secret Shop
                                </div>
                            )}

                            {/* Recipe Tag */}
                            {item.recipe && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        backgroundColor: '#f9731633',
                                        borderRadius: '50px',
                                        fontSize: '24px',
                                        color: '#f97316',
                                    }}
                                >
                                    📜 Recipe
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Branding */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #66ff66, #ffd700)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#0d1117',
                            }}
                        >
                            DC
                        </div>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#66ff66' }}>
                            DotaCodex
                        </span>
                    </div>

                    {/* Tagline */}
                    <div style={{ fontSize: '20px', color: '#8b949e' }}>
                        Your Ultimate Dota 2 Companion
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
