'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FavoriteButtonProps {
    heroId: number;
    heroName?: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export default function FavoriteButton({
    heroId,
    heroName,
    size = 'md',
    showLabel = false,
}: FavoriteButtonProps) {
    const { data: session, status } = useSession();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if hero is favorited on mount
    useEffect(() => {
        if (status === 'authenticated') {
            checkFavoriteStatus();
        }
    }, [status, heroId]);

    const checkFavoriteStatus = async () => {
        try {
            const response = await fetch('/api/favorites');
            if (response.ok) {
                const data = await response.json();
                const isFav = data.favorites.some((f: { heroId: number }) => f.heroId === heroId);
                setIsFavorite(isFav);
            }
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const toggleFavorite = async () => {
        if (status !== 'authenticated') {
            // Could redirect to login or show a message
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorite) {
                // Remove from favorites
                const response = await fetch(`/api/favorites?heroId=${heroId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setIsFavorite(false);
                }
            } else {
                // Add to favorites
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ heroId }),
                });
                if (response.ok) {
                    setIsFavorite(true);
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show button if not logged in
    if (status !== 'authenticated') {
        return null;
    }

    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl',
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className={`
                ${sizeClasses[size]}
                flex items-center justify-center gap-2
                rounded-full
                transition-all duration-200
                ${isFavorite
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${showLabel ? 'w-auto px-4' : ''}
            `}
            title={isFavorite ? `Remove ${heroName || 'hero'} from favorites` : `Add ${heroName || 'hero'} to favorites`}
        >
            <span className={isLoading ? 'animate-pulse' : ''}>
                {isFavorite ? '❤️' : '🤍'}
            </span>
            {showLabel && (
                <span className="text-sm font-medium">
                    {isFavorite ? 'Favorited' : 'Favorite'}
                </span>
            )}
        </button>
    );
}
