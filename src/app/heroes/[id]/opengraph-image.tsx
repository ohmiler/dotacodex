import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const alt = 'Hero Guide - DotaCodex';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Hero data from dotaconstants (static import for edge runtime)
import { heroes as dotaHeroes } from 'dotaconstants';

// Generate image for each hero
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const heroId = parseInt(id);

    // Find hero from dotaconstants
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heroData = (dotaHeroes as any)[heroId];

    if (!heroData) {
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
    const primaryAttr = heroData.primary_attr;
    const attrColor = primaryAttr === 'str' ? '#ef4444'
        : primaryAttr === 'agi' ? '#22c55e'
            : primaryAttr === 'int' ? '#3b82f6'
                : '#a855f7';

    const attrName = primaryAttr === 'str' ? 'Strength'
        : primaryAttr === 'agi' ? 'Agility'
            : primaryAttr === 'int' ? 'Intelligence'
                : 'Universal';

    const heroName = heroData.localized_name;
    const heroImg = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroData.name.replace('npc_dota_hero_', '')}.png`;
    const roles: string[] = heroData.roles || [];

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0f',
                    backgroundImage: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
                    padding: 60,
                }}
            >
                {/* Hero Icon */}
                <img
                    src={heroImg}
                    width={180}
                    height={100}
                    style={{
                        borderRadius: 12,
                        border: `4px solid ${attrColor}`,
                        marginBottom: 30,
                    }}
                />

                {/* Hero Name */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: 16,
                        textAlign: 'center',
                    }}
                >
                    {heroName}
                </div>

                {/* Attribute Badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: attrColor,
                            color: 'white',
                            padding: '8px 24px',
                            borderRadius: 20,
                            fontSize: 28,
                            fontWeight: 600,
                        }}
                    >
                        {attrName}
                    </div>
                </div>

                {/* Roles */}
                <div
                    style={{
                        display: 'flex',
                        gap: 12,
                        marginBottom: 40,
                    }}
                >
                    {roles.slice(0, 3).map((role: string) => (
                        <div
                            key={role}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: '#a0a0a0',
                                padding: '6px 16px',
                                borderRadius: 12,
                                fontSize: 22,
                            }}
                        >
                            {role}
                        </div>
                    ))}
                </div>

                {/* Branding */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        position: 'absolute',
                        bottom: 40,
                    }}
                >
                    <div
                        style={{
                            fontSize: 32,
                            color: '#22c55e',
                            fontWeight: 'bold',
                        }}
                    >
                        DotaCodex
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
