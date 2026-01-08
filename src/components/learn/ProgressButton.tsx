'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Helper: Convert topic slug to a numeric ID (same hash as API)
function slugToId(slug: string): number {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        const char = slug.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

interface ProgressButtonProps {
    topicSlug: string;
    topicTitle?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onProgressChange?: (completed: boolean) => void;
}

export default function ProgressButton({
    topicSlug,
    topicTitle,
    showLabel = true,
    size = 'md',
    onProgressChange,
}: ProgressButtonProps) {
    const { data: session, status } = useSession();
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Check if topic is completed on mount
    useEffect(() => {
        if (status === 'authenticated') {
            checkProgressStatus();
        } else if (status === 'unauthenticated') {
            setIsChecking(false);
        }
    }, [status, topicSlug]);

    const checkProgressStatus = async () => {
        setIsChecking(true);
        try {
            const response = await fetch('/api/progress');
            if (response.ok) {
                const data = await response.json();
                const topicId = slugToId(topicSlug);
                const progress = data.progress.find((p: { topicId: number; completed: boolean }) =>
                    p.topicId === topicId && p.completed
                );
                setIsCompleted(!!progress);
            }
        } catch (error) {
            console.error('Error checking progress:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const toggleProgress = async () => {
        if (status !== 'authenticated') {
            return;
        }

        setIsLoading(true);
        const newCompleted = !isCompleted;

        try {
            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topicSlug,
                    completed: newCompleted
                }),
            });

            if (response.ok) {
                setIsCompleted(newCompleted);
                onProgressChange?.(newCompleted);
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show if not logged in
    if (status !== 'authenticated') {
        return null;
    }

    const sizeClasses = {
        sm: 'text-sm py-1.5 px-3',
        md: 'text-base py-2 px-4',
        lg: 'text-lg py-3 px-6',
    };

    const isDisabled = isLoading || isChecking;

    return (
        <button
            onClick={toggleProgress}
            disabled={isDisabled}
            type="button"
            className={`
                ${sizeClasses[size]}
                inline-flex items-center gap-2
                rounded-lg font-medium
                transition-all duration-200
                ${isCompleted
                    ? 'bg-[var(--color-easy)] text-[var(--color-background)] hover:opacity-90'
                    : 'bg-[var(--color-surface-elevated)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-easy)] hover:text-[var(--color-easy)]'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isCompleted ? `Mark "${topicTitle || 'topic'}" as incomplete` : `Mark "${topicTitle || 'topic'}" as complete`}
        >
            <span className={isLoading || isChecking ? 'animate-pulse' : ''}>
                {isCompleted ? '✅' : '⬜'}
            </span>
            {showLabel && (
                <span>
                    {isCompleted ? 'เรียนจบแล้ว' : 'ทำเครื่องหมายว่าเรียนจบ'}
                </span>
            )}
        </button>
    );
}
