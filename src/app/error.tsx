'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Error Illustration */}
                <div className="mb-8">
                    <div className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-hard)] to-[var(--color-secondary)]">
                        500
                    </div>
                    <div className="text-6xl mt-4">💥</div>
                </div>

                {/* Message */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                    เกิดข้อผิดพลาด / Something Went Wrong
                </h1>
                <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
                    เหมือนว่าเกมจะ Crash ไปสักครู่ ลองใหม่อีกครั้งนะ!
                    <br />
                    <span className="text-sm">
                        Looks like the game crashed. Try again in a moment!
                    </span>
                </p>

                {/* Error digest for debugging */}
                {error.digest && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-4 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="btn btn-primary inline-flex items-center justify-center gap-2"
                    >
                        <span>🔄</span>
                        <span>ลองใหม่ / Try Again</span>
                    </button>
                    <Link
                        href="/"
                        className="btn btn-secondary inline-flex items-center justify-center gap-2"
                    >
                        <span>🏠</span>
                        <span>กลับหน้าแรก / Home</span>
                    </Link>
                </div>

                {/* Fun tip */}
                <div className="mt-12 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        💡 <strong>Pro Tip:</strong> ถ้า reconnect ไม่ได้ ลอง disconnect แล้วต่อใหม่!
                    </p>
                </div>
            </div>
        </div>
    );
}
