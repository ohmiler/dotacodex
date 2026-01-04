import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const user = await registerUser(email, password, name);

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof Error && error.message === 'User already exists') {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}
