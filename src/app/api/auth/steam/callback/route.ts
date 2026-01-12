import { NextRequest, NextResponse } from 'next/server';
import { verifySteamLogin, getSteamUser } from '@/lib/steam';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const linkMode = searchParams.get('link') === 'true';

    const baseUrl = process.env.NEXTAUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Convert search params to object for verification
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        query[key] = value;
    });

    // Build the return URL that was used for authentication
    const returnUrl = new URL('/api/auth/steam/callback', baseUrl);
    returnUrl.searchParams.set('callbackUrl', callbackUrl);
    if (linkMode) {
        returnUrl.searchParams.set('link', 'true');
    }

    try {
        // Verify Steam login and get Steam ID
        const steamId = await verifySteamLogin(returnUrl.toString(), query);

        // Fetch Steam user info
        const steamUser = await getSteamUser(steamId);

        if (!steamUser) {
            return NextResponse.redirect(new URL('/auth/login?error=SteamUserFetchFailed', baseUrl));
        }

        // Check if this Steam ID is already linked to a user
        const existingUserWithSteam = await db.query.users.findFirst({
            where: eq(users.steamId, steamId),
        });

        // LINK MODE: Add Steam to existing account
        if (linkMode) {
            const session = await getServerSession(authOptions);

            if (!session?.user?.id) {
                return NextResponse.redirect(new URL('/auth/login?error=NotAuthenticated', baseUrl));
            }

            // Check if Steam ID is already used by another account
            if (existingUserWithSteam && existingUserWithSteam.id !== session.user.id) {
                return NextResponse.redirect(
                    new URL('/settings?error=SteamAlreadyLinked', baseUrl)
                );
            }

            // Link Steam to current user
            await db
                .update(users)
                .set({
                    steamId: steamId,
                    avatar: steamUser.avatarfull,
                })
                .where(eq(users.id, session.user.id));

            return NextResponse.redirect(new URL('/settings?success=SteamLinked', baseUrl));
        }

        // LOGIN MODE: Sign in with Steam
        if (existingUserWithSteam) {
            // User exists - create session and redirect
            const sessionToken = uuidv4();
            const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            await db.insert(sessions).values({
                sessionToken,
                userId: existingUserWithSteam.id,
                expires,
            });

            // Set session cookie and redirect
            const response = NextResponse.redirect(new URL(callbackUrl, baseUrl));
            response.cookies.set('next-auth.session-token', sessionToken, {
                expires,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });

            return response;
        }

        // New user - create account
        const userId = uuidv4();

        await db.insert(users).values({
            id: userId,
            name: steamUser.personaname,
            avatar: steamUser.avatarfull,
            steamId: steamId,
            // No email or password for Steam-only users
        });

        // Create session
        const sessionToken = uuidv4();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await db.insert(sessions).values({
            sessionToken,
            userId,
            expires,
        });

        const response = NextResponse.redirect(new URL(callbackUrl, baseUrl));
        response.cookies.set('next-auth.session-token', sessionToken, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Steam callback error:', error);
        return NextResponse.redirect(
            new URL('/auth/login?error=SteamCallbackFailed', baseUrl)
        );
    }
}
