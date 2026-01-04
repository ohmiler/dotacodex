import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'th';

// Import messages statically
import enMessages from '@/messages/en.json';
import thMessages from '@/messages/th.json';

const messages = {
    en: enMessages,
    th: thMessages,
};

export default getRequestConfig(async () => {
    // Get locale from cookie or use default
    let locale: Locale = defaultLocale;

    try {
        const cookieStore = await cookies();
        const cookieLocale = cookieStore.get('locale')?.value;
        if (cookieLocale && locales.includes(cookieLocale as Locale)) {
            locale = cookieLocale as Locale;
        }
    } catch {
        // Use default locale if cookies are not available
    }

    return {
        locale,
        messages: messages[locale],
    };
});
