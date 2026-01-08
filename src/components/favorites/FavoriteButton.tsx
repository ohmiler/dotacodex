'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

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
    const [isChecking, setIsChecking] = useState(true);

    // Check if hero is favorited on mount
    useEffect(() => {
        if (status === 'authenticated') {
            checkFavoriteStatus();
        } else if (status === 'unauthenticated') {
            setIsChecking(false);
        }
    }, [status, heroId]);

    const checkFavoriteStatus = async () => {
        setIsChecking(true);
        try {
            const response = await fetch('/api/favorites');
            if (response.ok) {
                const data = await response.json();
                const isFav = data.favorites.some((f: { heroId: number }) => f.heroId === heroId);
                setIsFavorite(isFav);
            }
        } catch (error) {
            console.error('Error checking favorite status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // If not logged in, prompt to login
        if (status !== 'authenticated') {
            signIn();
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

    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl',
    };

    const isDisabled = isLoading || (status === 'loading') || isChecking;

    return (
        <button
            onClick={toggleFavorite}
            disabled={isDisabled}
            type="button"
            className={`
                ${sizeClasses[size]}
                flex items-center justify-center gap-2
                rounded-full
                transition-all duration-200
                ${isFavorite
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${showLabel ? 'w-auto px-4' : ''}
            `}
            title={
                status !== 'authenticated'
                    ? 'Login to add favorites'
                    : isFavorite
                        ? `Remove ${heroName || 'hero'} from favorites`
                        : `Add ${heroName || 'hero'} to favorites`
            }
        >
            <span className={isLoading || isChecking ? 'animate-pulse' : ''}>
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
