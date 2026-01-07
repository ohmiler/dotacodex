'use client';

import { Inter, Noto_Sans_Thai } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const notoSansThai = Noto_Sans_Thai({
    subsets: ['thai'],
    variable: '--font-noto-thai',
    weight: ['400', '600', '700'],
});

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${notoSansThai.variable}`}>
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        backgroundColor: '#1a1a2e',
                        color: '#e4e4e7',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    }}
                >
                    <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                        {/* Error Icon */}
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>

                        {/* Title */}
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            เกิดข้อผิดพลาดร้ายแรง
                            <br />
                            <span style={{ fontSize: '1rem', opacity: 0.7 }}>Critical Error</span>
                        </h1>

                        {/* Message */}
                        <p style={{ opacity: 0.7, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            ระบบเกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
                        </p>

                        {/* Error ID */}
                        {error.digest && (
                            <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '1rem', fontFamily: 'monospace' }}>
                                Error ID: {error.digest}
                            </p>
                        )}

                        {/* Retry Button */}
                        <button
                            onClick={() => reset()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#fca311',
                                color: '#1a1a2e',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            🔄 ลองใหม่ / Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
