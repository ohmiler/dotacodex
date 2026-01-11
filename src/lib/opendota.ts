const OPENDOTA_BASE_URL = 'https://api.opendota.com/api';

export interface OpenDotaHero {
    id: number;
    name: string;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    roles: string[];
    img: string;
    icon: string;
    base_health: number;
    base_mana: number;
    base_armor: number;
    move_speed: number;
    attack_range: number;
    base_str: number;
    base_agi: number;
    base_int: number;
    str_gain: number;
    agi_gain: number;
    int_gain: number;
}

export interface OpenDotaItem {
    id: number;
    name: string;
    cost: number;
    secret_shop: boolean;
    side_shop: boolean;
    recipe: boolean;
    components: string[] | null;
    hint: string[];
    img: string;
}

export interface AbilityDetail {
    dname?: string;
    desc?: string;
    behavior?: string | string[];
    dmg_type?: string;
    bkbpierce?: string;
    dispellable?: string;
    target_team?: string;
    target_type?: string | string[];
    mc?: string | string[];  // mana cost
    cd?: string | string[];  // cooldown
    img?: string;
    attrib?: Array<{
        key: string;
        header: string;
        value: string | string[];
    }>;
    lore?: string;
    is_innate?: boolean;
}

export interface HeroAbilities {
    abilities: string[];
    talents: Array<{
        name: string;
        level: number;
    }>;
    facets?: Array<{
        name: string;
        icon: string;
        color: string;
        title: string;
        description: string;
    }>;
}

class OpenDotaClient {
    private baseUrl: string;
    private apiKey?: string;
    private callCount = 0;
    private timeout = 15000; // 15 second timeout (OpenDota can be slow)

    constructor(apiKey?: string) {
        this.baseUrl = OPENDOTA_BASE_URL;
        this.apiKey = apiKey;
    }

    private async fetch<T>(endpoint: string): Promise<T> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (this.apiKey) {
            url.searchParams.set('api_key', this.apiKey);
        }

        const startTime = Date.now();

        // Add timeout using AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url.toString(), {
                next: { revalidate: 86400 }, // Cache for 24 hours
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            const duration = Date.now() - startTime;
            this.callCount++;

            // Log API usage with rate limit info from headers
            const remainingMinute = response.headers.get('X-Rate-Limit-Remaining-Minute');
            const remainingDay = response.headers.get('X-Rate-Limit-Remaining-Day');

            console.log(`[OpenDota API] ${endpoint} | ${response.status} | ${duration}ms | Remaining: ${remainingMinute}/min, ${remainingDay}/day | Session calls: ${this.callCount}`);

            if (!response.ok) {
                const errorMsg = `OpenDota API error: ${response.status} ${response.statusText}`;
                console.error(`[OpenDota API] ERROR: ${errorMsg}`);
                throw new Error(errorMsg);
            }

            return response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                console.error(`[OpenDota API] TIMEOUT: ${endpoint} took longer than ${this.timeout}ms`);
                // Return null/empty instead of throwing - let caller handle gracefully
                return [] as T;
            }
            // For other errors, also return empty to prevent page crash
            console.error(`[OpenDota API] Error fetching ${endpoint}:`, error);
            return [] as T;
        }
    }

    async getHeroes(): Promise<OpenDotaHero[]> {
        return this.fetch<OpenDotaHero[]>('/heroStats');
    }

    async getHero(heroId: number): Promise<OpenDotaHero | undefined> {
        const heroes = await this.getHeroes();
        return heroes.find(h => h.id === heroId);
    }

    async getHeroMatchups(heroId: number): Promise<Array<{
        hero_id: number;
        games_played: number;
        wins: number;
    }>> {
        try {
            return await this.fetch(`/heroes/${heroId}/matchups`);
        } catch {
            return [];
        }
    }

    async getItems(): Promise<Record<string, OpenDotaItem>> {
        return this.fetch<Record<string, OpenDotaItem>>('/constants/items');
    }

    async getAbilities(): Promise<Record<string, AbilityDetail>> {
        return this.fetch<Record<string, AbilityDetail>>('/constants/abilities');
    }

    async getHeroAbilitiesMapping(): Promise<Record<string, HeroAbilities>> {
        return this.fetch<Record<string, HeroAbilities>>('/constants/hero_abilities');
    }

    async getHeroItemPopularity(heroId: number): Promise<{
        start_game_items: Record<string, number>;
        early_game_items: Record<string, number>;
        mid_game_items: Record<string, number>;
        late_game_items: Record<string, number>;
    }> {
        try {
            return await this.fetch(`/heroes/${heroId}/itemPopularity`);
        } catch {
            return {
                start_game_items: {},
                early_game_items: {},
                mid_game_items: {},
                late_game_items: {},
            };
        }
    }

    // Get current session call count
    getCallCount(): number {
        return this.callCount;
    }
}

export const openDota = new OpenDotaClient(process.env.OPENDOTA_API_KEY);
export default openDota;
