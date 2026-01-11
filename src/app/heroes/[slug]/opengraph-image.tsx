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

    // Hero image URL - use original format from DB
    const heroImgUrl = hero.img || '';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#0a0a0f',
                }}
            >
                {/* Left Side: Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '60px',
                        width: '60%',
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
                            }}
                        >
                            {attrName}
                        </div>
                    </div>

                    {/* Hero Name */}
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1.1,
                            marginBottom: '28px',
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
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#ffffff',
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    fontSize: 20,
                                }}
                            >
                                {role}
                            </div>
                        ))}
                    </div>

                    {/* Footer Logo */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '48px',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: attrColor,
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: 20,
                                fontWeight: 800,
                            }}
                        >
                            DC
                        </div>
                        <div
                            style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: 20,
                            }}
                        >
                            DotaCodex Hero Guide
                        </div>
                    </div>
                </div>

                {/* Right Side: Hero Image */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40%',
                        padding: '40px',
                    }}
                >
                    {heroImgUrl && (
                        <img
                            src={heroImgUrl}
                            width={400}
                            height={225}
                            style={{
                                borderRadius: '16px',
                                border: `4px solid ${attrColor}`,
                            }}
                        />
                    )}
                </div>
            </div>
        ),
        { ...size }
    );
}
