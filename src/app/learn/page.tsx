import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { learningTopics, TopicCategory } from '@/data/learningTopics';

export default function LearnPage() {
    const t = useTranslations('learn');
    const locale = useLocale();

    const categories: TopicCategory[] = ['basics', 'mechanics', 'heroes', 'items'];

    const getTopicsByCategory = (category: TopicCategory) => {
        return learningTopics.filter(topic => topic.category === category);
    };

    const getDifficultyLabel = (difficulty: number) => {
        if (difficulty === 1) return { label: t('categories.basics'), color: 'var(--color-easy)' };
        if (difficulty === 2) return { label: 'Intermediate', color: 'var(--color-medium)' };
        return { label: 'Advanced', color: 'var(--color-hard)' };
    };

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

                    {/* Categories */}
                    {categories.map((category) => {
                        const topics = getTopicsByCategory(category);
                        if (topics.length === 0) return null;

                        return (
                            <section key={category} className="mb-12">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    {getCategoryIcon(category)} {t(`categories.${category}`)}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {topics.map((topic) => {
                                        const difficulty = getDifficultyLabel(topic.difficulty);
                                        return (
                                            <Link
                                                key={topic.id}
                                                href={`/learn/${topic.id}`}
                                                className="card p-5 group"
                                            >
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
                                                    {t('startTopic')}
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
