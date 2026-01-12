'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { LearningTopic } from '@/data/learningTopics';
import ProgressButton from '@/components/learn/ProgressButton';
import { ReactNode } from 'react';

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
    const parseContent = (md: string): ReactNode[] => {
        const lines = md.split('\n');
        const result: ReactNode[] = [];
        let i = 0;
        let keyCounter = 0;

        while (i < lines.length) {
            const line = lines[i];
            const key = keyCounter++;

            // Table detection (line starts with |)
            if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                const tableLines: string[] = [];
                while (i < lines.length && lines[i].trim().startsWith('|')) {
                    tableLines.push(lines[i]);
                    i++;
                }
                result.push(renderTable(tableLines, key));
                continue;
            }

            // Code block detection (inline code with backticks)
            if (line.includes('`')) {
                const parsed = parseInlineCode(line, key);
                if (parsed) {
                    result.push(parsed);
                    i++;
                    continue;
                }
            }

            // Headers
            if (line.startsWith('# ')) {
                result.push(<h1 key={key} className="text-3xl font-bold mb-6 mt-8 first:mt-0">{line.slice(2)}</h1>);
                i++;
                continue;
            }
            if (line.startsWith('## ')) {
                result.push(
                    <h2 key={key} className="text-2xl font-semibold mb-4 mt-8 text-[var(--color-primary)] flex items-center gap-2">
                        <span className="w-1 h-6 bg-[var(--color-primary)] rounded-full"></span>
                        {line.slice(3)}
                    </h2>
                );
                i++;
                continue;
            }
            if (line.startsWith('### ')) {
                result.push(<h3 key={key} className="text-xl font-semibold mb-3 mt-6">{line.slice(4)}</h3>);
                i++;
                continue;
            }

            // Lists with bold definition
            if (line.startsWith('- **')) {
                const match = line.match(/^- \*\*(.+?)\*\*: (.+)$/);
                if (match) {
                    result.push(
                        <li key={key} className="mb-3 ml-4 flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0"></span>
                            <span><strong className="text-[var(--color-accent)]">{match[1]}</strong>: {parseBoldAndCode(match[2])}</span>
                        </li>
                    );
                    i++;
                    continue;
                }
            }

            // Regular lists
            if (line.startsWith('- ')) {
                result.push(
                    <li key={key} className="mb-2 ml-4 flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0"></span>
                        <span>{parseBoldAndCode(line.slice(2))}</span>
                    </li>
                );
                i++;
                continue;
            }

            // Numbered lists
            if (/^\d+\. /.test(line)) {
                const match = line.match(/^(\d+)\. \*\*(.+?)\*\*(.*)$/);
                if (match) {
                    result.push(
                        <li key={key} className="mb-4 ml-4 flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold text-sm flex items-center justify-center flex-shrink-0">
                                {match[1]}
                            </span>
                            <span className="pt-0.5"><strong>{match[2]}</strong>{parseBoldAndCode(match[3])}</span>
                        </li>
                    );
                } else {
                    const numMatch = line.match(/^(\d+)\. (.*)$/);
                    result.push(
                        <li key={key} className="mb-3 ml-4 flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold text-sm flex items-center justify-center flex-shrink-0">
                                {numMatch?.[1]}
                            </span>
                            <span className="pt-0.5">{parseBoldAndCode(numMatch?.[2] || '')}</span>
                        </li>
                    );
                }
                i++;
                continue;
            }

            // Checkmarks (Tips)
            if (line.startsWith('✅ ')) {
                result.push(
                    <div key={key} className="mb-3 p-4 rounded-xl bg-gradient-to-r from-[var(--color-primary-muted)] to-transparent border-l-4 border-[var(--color-primary)] flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">✅</span>
                        <span className="text-[var(--color-text)]">{parseBoldAndCode(line.slice(2))}</span>
                    </div>
                );
                i++;
                continue;
            }

            // X marks (Warnings)
            if (line.startsWith('❌ ')) {
                result.push(
                    <div key={key} className="mb-3 p-4 rounded-xl bg-gradient-to-r from-[var(--color-secondary-muted)] to-transparent border-l-4 border-[var(--color-secondary)] flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">❌</span>
                        <span className="text-[var(--color-text)]">{parseBoldAndCode(line.slice(2))}</span>
                    </div>
                );
                i++;
                continue;
            }

            // Empty lines
            if (line.trim() === '') {
                result.push(<div key={key} className="h-3" />);
                i++;
                continue;
            }

            // Regular paragraphs
            result.push(
                <p key={key} className="mb-4 text-[var(--color-text-muted)] leading-relaxed text-lg">
                    {parseBoldAndCode(line)}
                </p>
            );
            i++;
        }

        return result;
    };

    // Parse inline code and bold text
    const parseBoldAndCode = (text: string): ReactNode => {
        if (!text) return null;

        // Split by code blocks first, then bold
        const parts: ReactNode[] = [];
        let remaining = text;
        let partKey = 0;

        // Handle inline code `code`
        const codeRegex = /`([^`]+)`/g;
        let lastIndex = 0;
        let match;

        while ((match = codeRegex.exec(text)) !== null) {
            // Text before code
            if (match.index > lastIndex) {
                parts.push(parseBold(text.slice(lastIndex, match.index), partKey++));
            }
            // Code block
            parts.push(
                <code key={`code-${partKey++}`} className="px-2 py-1 rounded bg-[var(--color-surface-elevated)] text-[var(--color-accent)] font-mono text-sm mx-1">
                    {match[1]}
                </code>
            );
            lastIndex = match.index + match[0].length;
        }

        // Remaining text
        if (lastIndex < text.length) {
            parts.push(parseBold(text.slice(lastIndex), partKey++));
        }

        return parts.length > 0 ? parts : parseBold(text, 0);
    };

    // Parse bold text
    const parseBold = (text: string, baseKey: number): ReactNode => {
        const parts: ReactNode[] = [];
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let lastIndex = 0;
        let match;
        let partKey = 0;

        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(<span key={`t-${baseKey}-${partKey++}`}>{text.slice(lastIndex, match.index)}</span>);
            }
            parts.push(<strong key={`b-${baseKey}-${partKey++}`} className="text-[var(--color-accent)]">{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push(<span key={`t-${baseKey}-${partKey++}`}>{text.slice(lastIndex)}</span>);
        }

        return parts.length > 0 ? <>{parts}</> : text;
    };

    // Parse inline code line
    const parseInlineCode = (line: string, key: number): ReactNode | null => {
        // If line has inline code, parse it as paragraph
        if (line.includes('`') && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('|')) {
            return (
                <p key={key} className="mb-4 text-[var(--color-text-muted)] leading-relaxed text-lg">
                    {parseBoldAndCode(line)}
                </p>
            );
        }
        return null;
    };

    // Render markdown table
    const renderTable = (tableLines: string[], key: number): ReactNode => {
        if (tableLines.length < 2) return null;

        const parseRow = (row: string): string[] => {
            return row
                .split('|')
                .slice(1, -1) // Remove empty first and last from split
                .map(cell => cell.trim());
        };

        const headers = parseRow(tableLines[0]);
        // Skip separator line (index 1)
        const rows = tableLines.slice(2).map(parseRow);

        return (
            <div key={key} className="my-6 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-surface-elevated)]">
                            {headers.map((header, i) => (
                                <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text)] border-b-2 border-[var(--color-primary)]">
                                    {parseBoldAndCode(header)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                                        {parseBoldAndCode(cell)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
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
