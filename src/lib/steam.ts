import { RelyingParty } from 'openid';

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid';

// Create RelyingParty instance for Steam OpenID
export function createSteamRelyingParty(returnUrl: string): RelyingParty {
    return new RelyingParty(
        returnUrl,
        null, // realm - null means use returnUrl domain
        true, // stateless
        false, // strict
        [] // extensions
    );
}

// Get Steam authentication URL
export function getSteamAuthUrl(returnUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const relyingParty = createSteamRelyingParty(returnUrl);

        relyingParty.authenticate(STEAM_OPENID_URL, false, (error, authUrl) => {
            if (error) {
                reject(new Error(`Steam auth error: ${error.message}`));
            } else if (!authUrl) {
                reject(new Error('Failed to get Steam auth URL'));
            } else {
                resolve(authUrl);
            }
        });
    });
}

// Verify Steam OpenID response and extract Steam ID
export function verifySteamLogin(returnUrl: string, query: Record<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
        const relyingParty = createSteamRelyingParty(returnUrl);

        // Reconstruct the full URL with query params for verification
        const url = new URL(returnUrl);
        Object.keys(query).forEach(key => url.searchParams.set(key, query[key]));

        relyingParty.verifyAssertion(url.toString(), (error, result) => {
            if (error) {
                reject(new Error(`Steam verification error: ${error.message}`));
            } else if (!result || !result.authenticated) {
                reject(new Error('Steam authentication failed'));
            } else if (!result.claimedIdentifier) {
                reject(new Error('No Steam ID returned'));
            } else {
                // Extract Steam ID from claimed identifier
                // Format: https://steamcommunity.com/openid/id/76561198xxxxxxxxx
                const steamId = result.claimedIdentifier.replace(
                    'https://steamcommunity.com/openid/id/',
                    ''
                );
                resolve(steamId);
            }
        });
    });
}

// Fetch Steam user info using Steam Web API
export interface SteamUser {
    steamId: string;
    personaname: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    profileurl: string;
}

export async function getSteamUser(steamId: string): Promise<SteamUser | null> {
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
        console.error('STEAM_API_KEY not configured');
        return null;
    }

    try {
        const response = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
        );

        if (!response.ok) {
            console.error('Failed to fetch Steam user:', response.statusText);
            return null;
        }

        const data = await response.json();
        const player = data.response?.players?.[0];

        if (!player) {
            return null;
        }

        return {
            steamId: player.steamid,
            personaname: player.personaname,
            avatar: player.avatar,
            avatarmedium: player.avatarmedium,
            avatarfull: player.avatarfull,
            profileurl: player.profileurl,
        };
    } catch (error) {
        console.error('Error fetching Steam user:', error);
        return null;
    }
}
