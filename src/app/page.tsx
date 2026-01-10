import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  const t = useTranslations();

  const features = [
    {
      icon: '🦸',
      title: t('nav.heroes'),
      description: 'ค้นพบฮีโร่กว่า 120 ตัว พร้อมคำแนะนำสำหรับผู้เล่นใหม่',
      href: '/heroes',
      color: 'var(--color-primary)',
    },
    {
      icon: '⚔️',
      title: t('nav.items'),
      description: 'เรียนรู้ไอเทมทั้งหมดและวิธีการ Build ที่เหมาะสม',
      href: '/items',
      color: 'var(--color-accent)',
    },
    {
      icon: '📚',
      title: t('nav.learn'),
      description: 'บทเรียนแบบ Step-by-step สำหรับผู้เริ่มต้น',
      href: '/learn',
      color: 'var(--color-secondary)',
    },
  ];

  const beginnerTopics = [
    { title: 'Dota 2 คืออะไร?', category: 'basics', minutes: 5 },
    { title: 'การควบคุมฮีโร่เบื้องต้น', category: 'basics', minutes: 10 },
    { title: 'Last Hit และ Deny', category: 'mechanics', minutes: 15 },
    { title: 'ฮีโร่แนะนำสำหรับมือใหม่', category: 'heroes', minutes: 10 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[80vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.png"
            alt="Dota 2 Background"
            fill
            priority
            className="object-cover object-center animate-slow-zoom"
            quality={90}
          />
          {/* Multi-layer overlay for depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/90 via-[#0d1117]/40 to-[#0d1117]/90 z-10" />
          <div className="absolute inset-0 bg-[#0d1117]/30 backdrop-blur-[1px] z-10" />
        </div>

        <div className="max-w-7xl mx-auto relative z-20 w-full">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fadeIn">
              <span className="text-gradient drop-shadow-2xl">{t('home.welcome')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeIn [animation-delay:200ms] drop-shadow-lg font-light tracking-wide">
              {t('home.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-6 animate-fadeIn [animation-delay:400ms]">
              <Link href="/learn" className="btn btn-primary text-xl px-10 py-4 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow">
                {t('home.startLearning')}
              </Link>
              <Link href="/heroes" className="btn btn-secondary text-xl px-10 py-4 backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10">
                {t('home.browseHeroes')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="card p-6 group"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beginner Topics Section */}
      <section className="py-16 px-4 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {t('home.featuredTopics')}
              </h2>
              <p className="text-[var(--color-text-muted)]">
                {t('home.beginnerFriendly')}
              </p>
            </div>
            <Link href="/learn" className="btn btn-secondary hidden sm:flex">
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {beginnerTopics.map((topic, index) => (
              <div key={index} className="card p-4 cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-medium attr-agility">
                    {t(`learn.categories.${topic.category}`)}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{topic.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  ~{topic.minutes} {t('learn.minutes')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            พร้อมเริ่มต้นการเดินทางใน Dota 2 แล้วหรือยัง?
          </h2>
          <p className="text-[var(--color-text-muted)] text-lg mb-8">
            สมัครสมาชิกฟรีเพื่อติดตามความก้าวหน้า บันทึกโน้ต และอื่นๆ อีกมากมาย
          </p>
          <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-3">
            สมัครสมาชิกฟรี
          </Link>
        </div>
      </section>

      {/* Footer would go here */}
      <footer className="border-t border-[var(--color-border)] py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-[var(--color-text-muted)] text-sm">
          <p>© {new Date().getFullYear()} DotaCodex. Not affiliated with Valve Corporation.</p>
          <p className="mt-1">Dota 2 is a registered trademark of Valve Corporation.</p>
        </div>
      </footer>
    </div>
  );
}
