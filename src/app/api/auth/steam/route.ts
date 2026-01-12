import { NextRequest, NextResponse } from 'next/server';
import { getSteamAuthUrl } from '@/lib/steam';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const linkMode = searchParams.get('link') === 'true';

    // Get the base URL
    const baseUrl = process.env.NEXTAUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Build return URL with state
    const returnUrl = new URL('/api/auth/steam/callback', baseUrl);
    returnUrl.searchParams.set('callbackUrl', callbackUrl);
    if (linkMode) {
        returnUrl.searchParams.set('link', 'true');
    }

    try {
        const authUrl = await getSteamAuthUrl(returnUrl.toString());
        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Steam auth error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=SteamAuthFailed', baseUrl));
    }
}
