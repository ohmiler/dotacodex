import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { heroes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Route segment config
export const runtime = 'nodejs';
export const alt = 'Hero Guide - DotaCodex';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Generate image for each hero
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const heroId = parseInt(id);

    // Fetch hero from DB directly for consistency
    const hero = await db.query.heroes.findFirst({
        where: eq(heroes.id, heroId),
    });

    if (!hero) {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0f',
                        color: 'white',
                        fontSize: 48,
                    }}
                >
                    Hero Not Found
                </div>
            ),
            { ...size }
        );
    }

    // Get attribute color
    const primaryAttr = hero.primaryAttr;
    const attrColor = primaryAttr === 'str' ? '#ef4444'
        : primaryAttr === 'agi' ? '#22c55e'
            : primaryAttr === 'int' ? '#3b82f6'
                : '#a855f7';

    const attrName = primaryAttr === 'str' ? 'Strength'
        : primaryAttr === 'agi' ? 'Agility'
            : primaryAttr === 'int' ? 'Intelligence'
                : 'Universal';

    // Use full horizontal portrait if available, otherwise fallback
    // Standard img: /apps/dota2/images/dota_react/heroes/antimage.png
    const heroImgUrl = hero.img
        ? `https://cdn.cloudflare.steamstatic.com${hero.img}`
        : '';

    // Try to construct the render image url which looks better
    // e.g., antimage.png -> antimage.png (but from /renders/ directory)
    // Actually, let's use the one we have but maybe scale it up or use the large horizontal one provided by Steam
    // The 'img' in DB usually looks like: /apps/dota2/images/dota_react/heroes/antimage.png?3
    // We want the 'full' png usually found at: .../antimage.png (high res)

    // Let's use the background image approach

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#0a0a0f',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Image (Blurred/Darkened) */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: heroImgUrl ? `url(${heroImgUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(20px) brightness(0.3)',
                        transform: 'scale(1.1)',
                    }}
                />

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    padding: '60px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>

                    {/* Left Side: Info */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        maxWidth: '600px',
                    }}>
                        {/* Attribute Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '24px',
                        }}>
                            <div style={{
                                backgroundColor: attrColor,
                                color: 'white',
                                padding: '8px 24px',
                                borderRadius: '100px',
                                fontSize: 24,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                boxShadow: `0 4px 20px ${attrColor}40`,
                            }}>
                                {attrName}
                            </div>
                        </div>

                        {/* Name */}
                        <div style={{
                            fontSize: 84,
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1,
                            marginBottom: '32px',
                            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        }}>
                            {hero.localizedName}
                        </div>

                        {/* Roles */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}>
                            {(hero.roles || []).slice(0, 3).map((role) => (
                                <div key={role} style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#e0e0e0',
                                    padding: '8px 20px',
                                    borderRadius: '12px',
                                    fontSize: 20,
                                }}>
                                    {role}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Hero Image */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '450px',
                        height: '450px',
                        position: 'relative',
                    }}>
                        <img
                            src={heroImgUrl}
                            width={450} // Aspect ratio might be different but object-fit helps
                            height={253} // Standard aspect ratio is 16:9 usually
                            style={{
                                width: '100%', // automatic width
                                height: 'auto',
                                borderRadius: '24px',
                                boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 4px ${attrColor}`,
                            }}
                        />
                    </div>
                </div>

                {/* Footer Logo */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '60px',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>DotaCodex</div>
                    <div>Hero Guide</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
