import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { SessionProvider } from '@/components/providers/SessionProvider';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DotaCodex - Learn Dota 2",
  description: "Your ultimate companion for learning Dota 2. Master the game from zero to hero with our comprehensive guides, hero database, and learning paths.",
  keywords: ["Dota 2", "MOBA", "gaming", "guide", "heroes", "items", "learning"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${notoSansThai.variable} antialiased`}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
