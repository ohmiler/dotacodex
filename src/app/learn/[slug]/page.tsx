import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { learningTopics } from '@/data/learningTopics';
import TopicContent from '@/components/learn/TopicContent';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return learningTopics.map((topic) => ({
        slug: topic.id,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const topic = learningTopics.find(t => t.id === slug);

    if (!topic) {
        return { title: 'Topic Not Found - DotaCodex' };
    }

    return {
        title: `${topic.titleEn} - DotaCodex Learn`,
        description: topic.descriptionEn,
    };
}

export default async function TopicPage({ params }: Props) {
    const { slug } = await params;
    const topic = learningTopics.find(t => t.id === slug);

    if (!topic) {
        notFound();
    }

    // Find current index and adjacent topics
    const currentIndex = learningTopics.findIndex(t => t.id === slug);
    const prevTopic = currentIndex > 0 ? learningTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < learningTopics.length - 1 ? learningTopics[currentIndex + 1] : null;

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="pt-20 pb-16">
                <TopicContent
                    topic={topic}
                    prevTopic={prevTopic}
                    nextTopic={nextTopic}
                />
            </main>
        </div>
    );
}
