import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSteamUser } from '@/lib/steam';

// GET: Fetch current user profile with Steam info
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
        );
    }

    // Fetch Steam user info if linked
    let steamInfo = null;
    if (user.steamId) {
        steamInfo = await getSteamUser(user.steamId);
    }

    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        steamId: user.steamId,
        steamInfo,
        hasPassword: !!user.password,
        locale: user.locale,
    });
}
