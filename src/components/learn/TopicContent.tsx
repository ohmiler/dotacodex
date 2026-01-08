'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { LearningTopic } from '@/data/learningTopics';
import ProgressButton from '@/components/learn/ProgressButton';

interface Props {
    topic: LearningTopic;
    prevTopic: LearningTopic | null;
    nextTopic: LearningTopic | null;
}

export default function TopicContent({ topic, prevTopic, nextTopic }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const content = locale === 'th' ? topic.contentTh : topic.contentEn;
    const title = locale === 'th' ? topic.titleTh : topic.titleEn;

    // Parse markdown-like content to HTML
    const parseContent = (md: string) => {
        return md
            .split('\n')
            .map((line, i) => {
                // Headers
                if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-3xl font-bold mb-6 mt-8 first:mt-0">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-semibold mb-4 mt-8 text-[var(--color-primary)]">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-semibold mb-3 mt-6">{line.slice(4)}</h3>;
                }

                // Lists
                if (line.startsWith('- **')) {
                    const match = line.match(/^- \*\*(.+?)\*\*: (.+)$/);
                    if (match) {
                        return (
                            <li key={i} className="mb-2 ml-4 flex items-start">
                                <span className="text-[var(--color-primary)] mr-2">•</span>
                                <span><strong className="text-[var(--color-accent)]">{match[1]}</strong>: {match[2]}</span>
                            </li>
                        );
                    }
                }
                if (line.startsWith('- ')) {
                    return (
                        <li key={i} className="mb-2 ml-4 flex items-start">
                            <span className="text-[var(--color-primary)] mr-2">•</span>
                            <span>{line.slice(2)}</span>
                        </li>
                    );
                }

                // Numbered lists
                if (/^\d+\. /.test(line)) {
                    const match = line.match(/^(\d+)\. \*\*(.+?)\*\*(.*)$/);
                    if (match) {
                        return (
                            <li key={i} className="mb-3 ml-4 flex items-start">
                                <span className="text-[var(--color-accent)] font-bold mr-3 min-w-[24px]">{match[1]}.</span>
                                <span><strong>{match[2]}</strong>{match[3]}</span>
                            </li>
                        );
                    }
                    return (
                        <li key={i} className="mb-2 ml-4 flex items-start">
                            <span className="text-[var(--color-accent)] font-bold mr-3 min-w-[24px]">{line.match(/^\d+/)?.[0]}.</span>
                            <span>{line.replace(/^\d+\. /, '')}</span>
                        </li>
                    );
                }

                // Checkmarks and X marks
                if (line.startsWith('✅ ') || line.startsWith('❌ ')) {
                    const isCheck = line.startsWith('✅');
                    return (
                        <div
                            key={i}
                            className={`mb-2 p-3 rounded-lg ${isCheck ? 'bg-[var(--color-primary-muted)]' : 'bg-[var(--color-secondary-muted)]'}`}
                        >
                            {line}
                        </div>
                    );
                }

                // Empty lines
                if (line.trim() === '') {
                    return <div key={i} className="h-4" />;
                }

                // Regular paragraphs with bold parsing
                const parsedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--color-accent)]">$1</strong>');
                return <p key={i} className="mb-3 text-[var(--color-text-muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: parsedLine }} />;
            });
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="bg-[var(--color-surface)] py-8 px-4 mb-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/learn"
                        className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('common.back')}
                    </Link>

                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-lg text-sm font-medium bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                            {t(`learn.categories.${topic.category}`)}
                        </span>
                        <span className="text-sm text-[var(--color-text-muted)]">
                            ~{topic.duration} {t('learn.minutes')}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>

                    {/* Progress Button */}
                    <ProgressButton
                        topicSlug={topic.id}
                        topicTitle={title}
                        size="md"
                    />
                </div>
            </div>

            {/* Content */}
            <article className="max-w-4xl mx-auto px-4">
                <div className="prose prose-invert max-w-none">
                    {parseContent(content)}
                </div>
            </article>

            {/* Navigation */}
            <div className="max-w-4xl mx-auto px-4 mt-12">
                <div className="flex justify-between items-center pt-8 border-t border-[var(--color-border)]">
                    {prevTopic ? (
                        <Link
                            href={`/learn/${prevTopic.id}`}
                            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <div className="text-left">
                                <div className="text-xs">{t('common.previous')}</div>
                                <div className="font-medium">{locale === 'th' ? prevTopic.titleTh : prevTopic.titleEn}</div>
                            </div>
                        </Link>
                    ) : <div />}

                    {nextTopic ? (
                        <Link
                            href={`/learn/${nextTopic.id}`}
                            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <div className="text-right">
                                <div className="text-xs">{t('common.next')}</div>
                                <div className="font-medium">{locale === 'th' ? nextTopic.titleTh : nextTopic.titleEn}</div>
                            </div>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ) : (
                        <Link
                            href="/learn"
                            className="btn btn-primary"
                        >
                            {t('learn.completed')} ✓
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
