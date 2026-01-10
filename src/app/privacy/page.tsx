import { locales } from '@/i18n';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
    return {
        title: 'Privacy Policy | DotaCodex',
        description: 'Privacy policy for DotaCodex - how we handle your data.',
    };
}

export default async function PrivacyPage() {
    const t = await getTranslations('Privacy');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                        <p>
                            Welcome to <strong>DotaCodex</strong>. We value your privacy and are committed to protecting your personal data.
                            This policy explains how we collect and use information when you visit our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Data Collection</h2>
                        <p>
                            We do not collect personal information unless you explicitly provide it (e.g., through registration).
                            We use standard analytics tools to improve user experience, which may collect non-identifiable data such as browser type and pages visited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Cookies</h2>
                        <p>
                            We use cookies to remember your preferences (such as language settings) and to analyze site traffic.
                            You can disable cookies in your browser settings if you wish.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Services</h2>
                        <p>
                            We may use third-party services like Google AdSense to serve advertisements. These services may use cookies to serve ads based on your visits to this and other websites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@dotacodex.com.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 italic">
                    Last updated: January 10, 2026
                </div>
            </div>
        </div>
    );
}
