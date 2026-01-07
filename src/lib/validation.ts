// Validation utilities for authentication

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

export function validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
        return { valid: false, errors };
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
        errors.push('Email is required');
    } else if (trimmedEmail.length > 255) {
        errors.push('Email must be less than 255 characters');
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
        errors.push('Please enter a valid email address');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

export function validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
        return { valid: false, errors };
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
        errors.push(`Password must be less than ${PASSWORD_MAX_LENGTH} characters`);
    }

    // Password strength checks
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

export function validateName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || typeof name !== 'string') {
        errors.push('Name is required');
        return { valid: false, errors };
    }

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
        errors.push('Name is required');
    } else if (trimmedName.length < 2) {
        errors.push('Name must be at least 2 characters');
    } else if (trimmedName.length > 100) {
        errors.push('Name must be less than 100 characters');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// Rate limiting for auth endpoints
interface AuthRateLimitEntry {
    attempts: number;
    lockUntil: number | null;
    resetTime: number;
}

const authRateLimitStore = new Map<string, AuthRateLimitEntry>();

// Config
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of authRateLimitStore.entries()) {
            if (entry.resetTime < now && (!entry.lockUntil || entry.lockUntil < now)) {
                authRateLimitStore.delete(key);
            }
        }
    }, 60000);
}

export interface AuthRateLimitResult {
    allowed: boolean;
    remainingAttempts: number;
    lockoutRemaining?: number; // seconds until unlock
    message?: string;
}

export function checkAuthRateLimit(identifier: string): AuthRateLimitResult {
    const now = Date.now();
    let entry = authRateLimitStore.get(identifier);

    // Create new entry if doesn't exist or window expired
    if (!entry || entry.resetTime < now) {
        entry = {
            attempts: 0,
            lockUntil: null,
            resetTime: now + ATTEMPT_WINDOW_MS,
        };
        authRateLimitStore.set(identifier, entry);
    }

    // Check if locked out
    if (entry.lockUntil && entry.lockUntil > now) {
        const lockoutRemaining = Math.ceil((entry.lockUntil - now) / 1000);
        return {
            allowed: false,
            remainingAttempts: 0,
            lockoutRemaining,
            message: `Account temporarily locked. Try again in ${Math.ceil(lockoutRemaining / 60)} minutes.`,
        };
    }

    // Reset lockout if expired
    if (entry.lockUntil && entry.lockUntil <= now) {
        entry.lockUntil = null;
        entry.attempts = 0;
    }

    return {
        allowed: true,
        remainingAttempts: MAX_LOGIN_ATTEMPTS - entry.attempts,
    };
}

export function recordFailedLogin(identifier: string): void {
    const now = Date.now();
    let entry = authRateLimitStore.get(identifier);

    if (!entry) {
        entry = {
            attempts: 0,
            lockUntil: null,
            resetTime: now + ATTEMPT_WINDOW_MS,
        };
        authRateLimitStore.set(identifier, entry);
    }

    entry.attempts++;

    // Lock account after too many failed attempts
    if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
        entry.lockUntil = now + LOCKOUT_DURATION_MS;
    }
}

export function clearFailedLogins(identifier: string): void {
    authRateLimitStore.delete(identifier);
}
