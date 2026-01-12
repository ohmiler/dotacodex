import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

    // Get user from database
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
        );
    }

    // Check if user has Steam linked
    if (!user.steamId) {
        return NextResponse.json(
            { error: 'No Steam account linked' },
            { status: 400 }
        );
    }

    // Prevent unlinking if user has no password (would be locked out)
    if (!user.password && !user.email) {
        return NextResponse.json(
            { error: 'Cannot unlink Steam - you need to set an email and password first' },
            { status: 400 }
        );
    }

    // Unlink Steam
    await db
        .update(users)
        .set({ steamId: null })
        .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
}
