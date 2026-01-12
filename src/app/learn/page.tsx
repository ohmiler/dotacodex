'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { learningTopics, TopicCategory } from '@/data/learningTopics';

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

interface ProgressItem {
    topicId: number;
    completed: boolean;
}

export default function LearnPage() {
    const t = useTranslations('learn');
    const locale = useLocale();
    const { data: session, status } = useSession();
    const [progress, setProgress] = useState<ProgressItem[]>([]);
    const [loadingProgress, setLoadingProgress] = useState(true);

    const categories: TopicCategory[] = ['basics', 'mechanics', 'heroes', 'items'];

    // Fetch user progress
    useEffect(() => {
        if (status === 'authenticated') {
            fetchProgress();
        } else if (status === 'unauthenticated') {
            setLoadingProgress(false);
        }
    }, [status]);

    const fetchProgress = async () => {
        try {
            const response = await fetch('/api/progress');
            if (response.ok) {
                const data = await response.json();
                setProgress(data.progress || []);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoadingProgress(false);
        }
    };

    const isTopicCompleted = (topicId: string): boolean => {
        const numericId = slugToId(topicId);
        return progress.some(p => p.topicId === numericId && p.completed);
    };

    const getTopicsByCategory = (category: TopicCategory) => {
        return learningTopics.filter(topic => topic.category === category);
    };

    const getCategoryProgress = (category: TopicCategory) => {
        const topics = getTopicsByCategory(category);
        if (topics.length === 0) return { completed: 0, total: 0, percentage: 0 };

        const completed = topics.filter(topic => isTopicCompleted(topic.id)).length;
        return {
            completed,
            total: topics.length,
            percentage: Math.round((completed / topics.length) * 100)
        };
    };

    const getOverallProgress = () => {
        const completed = learningTopics.filter(topic => isTopicCompleted(topic.id)).length;
        return {
            completed,
            total: learningTopics.length,
            percentage: Math.round((completed / learningTopics.length) * 100)
        };
    };

    const getDifficultyLabel = (difficulty: number) => {
        if (difficulty === 1) return { label: t('categories.basics'), color: 'var(--color-easy)' };
        if (difficulty === 2) return { label: 'Intermediate', color: 'var(--color-medium)' };
        return { label: 'Advanced', color: 'var(--color-hard)' };
    };

    const overall = getOverallProgress();

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('title')}</h1>
                        <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>

                    {/* Overall Progress (for logged in users) */}
                    {status === 'authenticated' && !loadingProgress && (
                        <div className="card p-6 mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    📊 {t('progress')}
                                </h2>
                                <span className="text-2xl font-bold text-[var(--color-primary)]">
                                    {overall.percentage}%
                                </span>
                            </div>
                            <div className="w-full bg-[var(--color-surface-elevated)] rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${overall.percentage}%` }}
                                />
                            </div>
                            <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                {overall.completed} / {overall.total} {t('completed')}
                            </p>
                        </div>
                    )}

                    {/* Categories */}
                    {categories.map((category) => {
                        const topics = getTopicsByCategory(category);
                        if (topics.length === 0) return null;

                        const categoryProgress = getCategoryProgress(category);

                        return (
                            <section key={category} className="mb-12">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        {getCategoryIcon(category)} {t(`categories.${category}`)}
                                    </h2>
                                    {status === 'authenticated' && !loadingProgress && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-[var(--color-surface-elevated)] rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-[var(--color-primary)] h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${categoryProgress.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-[var(--color-text-muted)]">
                                                {categoryProgress.completed}/{categoryProgress.total}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {topics.map((topic) => {
                                        const difficulty = getDifficultyLabel(topic.difficulty);
                                        const completed = isTopicCompleted(topic.id);

                                        return (
                                            <Link
                                                key={topic.id}
                                                href={`/learn/${topic.id}`}
                                                className={`card p-5 group relative ${completed ? 'border-[var(--color-easy)]' : ''}`}
                                            >
                                                {/* Completion badge */}
                                                {completed && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--color-easy)] flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-[var(--color-background)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <div className="flex items-start justify-between mb-3">
                                                    <span
                                                        className="px-2 py-1 rounded text-xs font-medium"
                                                        style={{
                                                            backgroundColor: `${difficulty.color}20`,
                                                            color: difficulty.color
                                                        }}
                                                    >
                                                        {difficulty.label}
                                                    </span>
                                                    <span className="text-sm text-[var(--color-text-muted)]">
                                                        ~{topic.duration} {t('minutes')}
                                                    </span>
                                                </div>

                                                <h3 className="font-semibold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                                    {locale === 'th' ? topic.titleTh : topic.titleEn}
                                                </h3>

                                                <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                                                    {locale === 'th' ? topic.descriptionTh : topic.descriptionEn}
                                                </p>

                                                <div className="mt-4 flex items-center text-sm text-[var(--color-primary)] font-medium">
                                                    {completed ? t('reviewTopic') : t('startTopic')}
                                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

function getCategoryIcon(category: TopicCategory): string {
    const icons: Record<TopicCategory, string> = {
        basics: '📚',
        mechanics: '⚙️',
        heroes: '🦸',
        items: '⚔️',
        advanced: '🎯',
    };
    return icons[category] || '📖';
}
