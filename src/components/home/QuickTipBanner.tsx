'use client';

import { useState, useEffect } from 'react';

const TIPS = [
    {
        icon: '🎯',
        tip: 'Last Hit ให้ได้มากที่สุด! ทองจาก Creep สำคัญกว่าการ Kill ในช่วงต้นเกม',
        category: 'basics',
    },
    {
        icon: '🛡️',
        tip: 'ซื้อ TP Scroll ติดตัวเสมอ ราคา 100 ทองช่วยชีวิตและช่วย Gank ได้',
        category: 'items',
    },
    {
        icon: '👁️',
        tip: 'วาง Observer Ward ที่จุดสำคัญ Vision คือข้อได้เปรียบที่ยิ่งใหญ่',
        category: 'support',
    },
    {
        icon: '⚔️',
        tip: 'อย่า Dive Tower ถ้าไม่มั่นใจ! Tower ในช่วงต้นเกมแรงมาก',
        category: 'basics',
    },
    {
        icon: '🗺️',
        tip: 'ดู Minimap บ่อยๆ ถ้าศัตรูหายไปจากเลน ให้ระวังตัว',
        category: 'awareness',
    },
    {
        icon: '💰',
        tip: 'ถ้าคุณตายบ่อย อย่าลืมว่าคุณให้ทองศัตรูมากขึ้นเรื่อยๆ เล่นปลอดภัยกว่า',
        category: 'basics',
    },
    {
        icon: '🎮',
        tip: 'ฝึก Last Hit ใน Demo Mode ก่อนเล่น Ranked จะช่วยให้ Farm ได้ดีขึ้น',
        category: 'practice',
    },
    {
        icon: '🏃',
        tip: 'ใช้ Shift+Click เพื่อ Queue คำสั่ง เช่น เดินไปหลายจุดติดต่อกัน',
        category: 'mechanics',
    },
    {
        icon: '🔄',
        tip: 'Pull Creep เพื่อดึง Lane กลับ ช่วยให้ Carry Farm ใกล้ Tower ปลอดภัยขึ้น',
        category: 'support',
    },
    {
        icon: '💡',
        tip: 'High Ground Advantage! ศัตรูมี 25% Miss Chance เมื่อโจมตีขึ้น High Ground',
        category: 'mechanics',
    },
];

export default function QuickTipBanner() {
    const [tipIndex, setTipIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Pick random tip on mount
        setTipIndex(Math.floor(Math.random() * TIPS.length));
    }, []);

    const nextTip = () => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
    };

    const currentTip = TIPS[tipIndex];

    if (!visible) return null;

    return (
        <div className="relative bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)]/10 to-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 rounded-xl p-4 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-20 h-20 border border-white/20 rounded-full -translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border border-white/20 rounded-full translate-x-16 translate-y-16" />
            </div>

            <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">
                    {currentTip.icon}
                </div>

                {/* Tip Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            💡 Quick Tip
                        </span>
                    </div>
                    <p className="text-white font-medium">
                        {currentTip.tip}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={nextTip}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--color-text-muted)] hover:text-white"
                        title="Next tip"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setVisible(false)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--color-text-muted)] hover:text-white"
                        title="Dismiss"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
