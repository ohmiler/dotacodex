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

class OpenDotaClient {
    private baseUrl: string;
    private apiKey?: string;
    private callCount = 0;

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
        const response = await fetch(url.toString(), {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

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
        return this.fetch(`/heroes/${heroId}/matchups`);
    }

    async getItems(): Promise<Record<string, OpenDotaItem>> {
        return this.fetch<Record<string, OpenDotaItem>>('/constants/items');
    }

    async getAbilities(): Promise<Record<string, unknown>> {
        return this.fetch('/constants/abilities');
    }

    async getHeroItemPopularity(heroId: number): Promise<{
        start_game_items: Record<string, number>;
        early_game_items: Record<string, number>;
        mid_game_items: Record<string, number>;
        late_game_items: Record<string, number>;
    }> {
        return this.fetch(`/heroes/${heroId}/itemPopularity`);
    }

    // Get current session call count
    getCallCount(): number {
        return this.callCount;
    }
}

export const openDota = new OpenDotaClient(process.env.OPENDOTA_API_KEY);
export default openDota;
