import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found - 404',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                        404
                    </div>
                    <div className="text-6xl mt-4">🗺️</div>
                </div>

                {/* Message */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                    หน้านี้ไม่มีอยู่ / Page Not Found
                </h1>
                <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
                    ดูเหมือนคุณหลงทางแล้ว! หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือลบไปแล้ว
                    <br />
                    <span className="text-sm">
                        Looks like you got lost! The page you're looking for might have been moved or deleted.
                    </span>
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="btn btn-primary inline-flex items-center justify-center gap-2"
                    >
                        <span>🏠</span>
                        <span>กลับหน้าแรก / Home</span>
                    </Link>
                    <Link
                        href="/heroes"
                        className="btn btn-secondary inline-flex items-center justify-center gap-2"
                    >
                        <span>🦸</span>
                        <span>ดูฮีโร่ / Heroes</span>
                    </Link>
                </div>

                {/* Fun tip */}
                <div className="mt-12 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        💡 <strong>Pro Tip:</strong> ใช้ TP Scroll กลับ Fountain ถ้าหลงทาง!
                    </p>
                </div>
            </div>
        </div>
    );
}
