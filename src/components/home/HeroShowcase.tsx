'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { generateHeroSlug } from '@/lib/utils';

interface Hero {
    id: number;
    name: string;
    localizedName: string;
    primaryAttr: string;
    attackType: string;
    roles: string[];
    img: string;
    icon: string;
}

export default function HeroShowcase() {
    const t = useTranslations();
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        fetchHeroes();
    }, []);

    // Auto-rotation
    useEffect(() => {
        if (heroes.length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroes.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [heroes.length, isPaused]);

    const fetchHeroes = async () => {
        try {
            const res = await fetch('/api/heroes');
            if (res.ok) {
                const data: Hero[] = await res.json();
                // Pick 8 random heroes for the showcase
                const shuffled = data.sort(() => 0.5 - Math.random());
                setHeroes(shuffled.slice(0, 8));
            }
        } catch (error) {
            console.error('Error fetching heroes:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % heroes.length);
    }, [heroes.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
    }, [heroes.length]);

    const getAttrColor = (attr: string) => {
        const colors: Record<string, string> = {
            str: 'from-red-600/50 to-red-900/80',
            agi: 'from-green-600/50 to-green-900/80',
            int: 'from-blue-600/50 to-blue-900/80',
            all: 'from-purple-600/50 to-purple-900/80',
        };
        return colors[attr] || 'from-gray-600/50 to-gray-900/80';
    };

    const getAttrLabel = (attr: string) => {
        const labels: Record<string, string> = {
            str: t('heroes.strength'),
            agi: t('heroes.agility'),
            int: t('heroes.intelligence'),
            all: t('heroes.universal'),
        };
        return labels[attr] || attr;
    };

    const getAttrBadgeColor = (attr: string) => {
        const colors: Record<string, string> = {
            str: 'bg-red-500',
            agi: 'bg-green-500',
            int: 'bg-blue-500',
            all: 'bg-purple-500',
        };
        return colors[attr] || 'bg-gray-500';
    };

    if (loading) {
        return (
            <div className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[400px] bg-[var(--color-surface)] animate-pulse">
                <div className="absolute bottom-6 left-6 space-y-2">
                    <div className="h-6 w-24 bg-[var(--color-surface-elevated)] rounded" />
                    <div className="h-10 w-48 bg-[var(--color-surface-elevated)] rounded" />
                    <div className="h-4 w-32 bg-[var(--color-surface-elevated)] rounded" />
                </div>
            </div>
        );
    }

    if (heroes.length === 0) return null;

    const currentHero = heroes[currentIndex];

    return (
        <div
            className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[400px] group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Image */}
            <div className="absolute inset-0 transition-all duration-700">
                {currentHero.img && (
                    <Image
                        src={currentHero.img.replace('/sb.png', '_full.png').replace('/vert.jpg', '_full.png')}
                        alt={currentHero.localizedName}
                        fill
                        className="object-cover object-top"
                        priority
                    />
                )}
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${getAttrColor(currentHero.primaryAttr)}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                <div className="max-w-xl">
                    {/* Attribute Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${getAttrBadgeColor(currentHero.primaryAttr)} mb-3`}>
                        {getAttrLabel(currentHero.primaryAttr)}
                    </div>

                    {/* Hero Name */}
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                        {currentHero.localizedName}
                    </h2>

                    {/* Roles */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(currentHero.roles || []).slice(0, 3).map(role => (
                            <span
                                key={role}
                                className="px-2 py-1 rounded text-xs bg-white/10 text-white/80 backdrop-blur-sm"
                            >
                                {role}
                            </span>
                        ))}
                        <span className="px-2 py-1 rounded text-xs bg-white/10 text-white/80 backdrop-blur-sm">
                            {currentHero.attackType === 'Melee' ? '⚔️ Melee' : '🏹 Ranged'}
                        </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/heroes/${generateHeroSlug(currentHero.localizedName, currentHero.id)}`}
                        className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${currentHero.primaryAttr === 'str' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500' :
                                currentHero.primaryAttr === 'agi' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500' :
                                    currentHero.primaryAttr === 'int' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500' :
                                        'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500'
                            }`}
                    >
                        View Hero Guide
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Previous hero"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Next hero"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {heroes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                            ? 'w-6 bg-white'
                            : 'bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to hero ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                <div
                    className={`h-full bg-white transition-all ${isPaused ? '' : 'animate-progress'}`}
                    style={{
                        animationDuration: '5s',
                        animationIterationCount: 'infinite',
                    }}
                />
            </div>
        </div>
    );
}
