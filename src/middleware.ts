import { NextResponse, type NextRequest } from 'next/server';

// Simple in-memory rate limit store (resets on serverless cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
    api: {
        maxRequests: 100,      // 100 requests
        windowMs: 60 * 1000,   // per 1 minute
    },
    sync: {
        maxRequests: 5,        // 5 requests
        windowMs: 60 * 1000,   // per 1 minute
    },
};

function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(
    key: string,
    config: { maxRequests: number; windowMs: number }
): { success: boolean; remaining: number } {
    const now = Date.now();
    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
        entry = { count: 0, resetTime: now + config.windowMs };
        rateLimitStore.set(key, entry);
    }

    entry.count++;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    return {
        success: entry.count <= config.maxRequests,
        remaining,
    };
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply rate limiting to API routes
    if (!pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const ip = getClientIP(request);

    // Use stricter rate limit for sync endpoint
    const config = pathname.startsWith('/api/sync')
        ? RATE_LIMIT_CONFIG.sync
        : RATE_LIMIT_CONFIG.api;

    const rateLimitKey = `${ip}:${pathname.startsWith('/api/sync') ? 'sync' : 'api'}`;
    const { success, remaining } = checkRateLimit(rateLimitKey, config);

    if (!success) {
        return NextResponse.json(
            {
                error: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil(config.windowMs / 1000),
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil(config.windowMs / 1000)),
                    'X-RateLimit-Remaining': '0',
                },
            }
        );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Limit', String(config.maxRequests));

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
