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

    constructor(apiKey?: string) {
        this.baseUrl = OPENDOTA_BASE_URL;
        this.apiKey = apiKey;
    }

    private async fetch<T>(endpoint: string): Promise<T> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (this.apiKey) {
            url.searchParams.set('api_key', this.apiKey);
        }

        const response = await fetch(url.toString(), {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`OpenDota API error: ${response.status} ${response.statusText}`);
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
}

export const openDota = new OpenDotaClient(process.env.OPENDOTA_API_KEY);
export default openDota;
