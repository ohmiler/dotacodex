import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
    validateEmail,
    validatePassword,
    validateName,
    checkAuthRateLimit,
    recordFailedLogin,
    clearFailedLogins,
} from '@/lib/validation';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

// Ensure NEXTAUTH_SECRET is set in production
if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET must be set in production');
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const email = credentials.email.trim().toLowerCase();
                const password = credentials.password;

                // Check rate limit before attempting login
                const rateLimitCheck = checkAuthRateLimit(email);
                if (!rateLimitCheck.allowed) {
                    throw new Error(rateLimitCheck.message || 'Too many login attempts. Please try again later.');
                }

                // Validate email format
                const emailValidation = validateEmail(email);
                if (!emailValidation.valid) {
                    recordFailedLogin(email);
                    throw new Error(emailValidation.errors[0]);
                }

                // Find user
                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });

                if (!user || !user.password) {
                    recordFailedLogin(email);
                    // Use generic message to prevent user enumeration
                    throw new Error('Invalid email or password');
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    recordFailedLogin(email);
                    throw new Error('Invalid email or password');
                }

                // Clear failed login attempts on successful login
                clearFailedLogins(email);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.avatar,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Helper function to register new user with validation
export async function registerUser(email: string, password: string, name: string) {
    // Validate all inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        throw new Error(emailValidation.errors[0]);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors[0]);
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
        throw new Error(nameValidation.errors[0]);
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
    });

    if (existingUser) {
        // Use generic message to prevent user enumeration
        throw new Error('Unable to create account. Please try again.');
    }

    // Hash password with strong settings
    const hashedPassword = await bcrypt.hash(password, 12); // Increased from 10 to 12
    const userId = uuidv4();

    await db.insert(users).values({
        id: userId,
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
    });

    return { id: userId, email: normalizedEmail, name: name.trim() };
}
