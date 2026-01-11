import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { heroes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getHeroIdFromSlug } from '@/lib/utils';

// Route segment config
export const runtime = 'nodejs';
export const alt = 'Hero Guide - DotaCodex';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Generate image for each hero
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const heroId = getHeroIdFromSlug(slug);

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

    const attrName = primaryAttr === 'str' ? 'STRENGTH'
        : primaryAttr === 'agi' ? 'AGILITY'
            : primaryAttr === 'int' ? 'INTELLIGENCE'
                : 'UNIVERSAL';

    // Get full hero image URL
    const heroImgUrl = hero.img
        ? hero.img.replace('/sb.png', '_full.png').replace('/vert.jpg', '_full.png')
        : hero.img;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    position: 'relative',
                    backgroundColor: '#0a0a0f',
                }}
            >
                {/* Background Hero Image with Gradient Overlay */}
                {heroImgUrl && (
                    <img
                        src={heroImgUrl}
                        width={1200}
                        height={630}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            opacity: 0.5,
                        }}
                    />
                )}

                {/* Dark Gradient Overlay (Left to Right) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,0.4) 100%)',
                    }}
                />

                {/* Bottom Gradient for Logo */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '150px',
                        background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 100%)',
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        padding: '60px 80px',
                        position: 'relative',
                    }}
                >
                    {/* Attribute Badge */}
                    <div
                        style={{
                            display: 'flex',
                            marginBottom: '24px',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: attrColor,
                                color: 'white',
                                padding: '10px 28px',
                                borderRadius: '50px',
                                fontSize: 22,
                                fontWeight: 700,
                                letterSpacing: '2px',
                            }}
                        >
                            {attrName}
                        </div>
                    </div>

                    {/* Hero Name */}
                    <div
                        style={{
                            fontSize: 96,
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1,
                            marginBottom: '28px',
                            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        }}
                    >
                        {hero.localizedName}
                    </div>

                    {/* Roles */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {(hero.roles || []).slice(0, 4).map((role: string) => (
                            <div
                                key={role}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: '#ffffff',
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    fontSize: 20,
                                    fontWeight: 500,
                                }}
                            >
                                {role}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Logo */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: attrColor,
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: 22,
                            fontWeight: 800,
                        }}
                    >
                        DC
                    </div>
                    <div
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 22,
                        }}
                    >
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>DotaCodex</span> Hero Guide
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
