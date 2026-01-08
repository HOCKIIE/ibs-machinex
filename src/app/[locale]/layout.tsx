import type { Metadata } from "next";
import Head from "next/head";
import { Inter, IBM_Plex_Sans_Thai,Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header, Footer, Sidebar, PlayVDOFor10s } from "@/components/main/layout/Layout";
import PageSettingsContext from "@/contexts/PageSettingsContext";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal", "italic"],
})
const th = IBM_Plex_Sans_Thai({
    subsets: ["latin", "thai"],
    weight: ["200","300","400","500","600","700"],
    style: ["normal"],
    display: "swap",
});

const ja = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal"],
    display: "swap",
});
// 5j_86ouroaNlwm_AAXPDfHMQhljTz7g6ZT4EM6ASyGg
export const metadata : Metadata = {
    title: "IBS Machinex Co.,ltd.",
    description: "IBS Machinex Co.,lt",
    verification: {
        google: "MlNHq5nNc6TG6dlmy4YT3YQXvbVol6Fkc5_UrkfbYlA",
    },
    alternates: {
        canonical: 'https://www.ibsmachinex.com',
    },
};

export default async function RootLayout({children}:{children: React.ReactNode}) {
    const locale = await getLocale();
    const languageClassName  = async() => {
        switch (locale) {
            case 'th':
                return th.className;
            case 'ja':
                return ja.className;
            default:
                return inter.className;
        }
    }

    const languageClass = await languageClassName();
    const messages = await getMessages();
    if (!routing.locales.includes(locale as string)) notFound();

    return (
        <html lang="en">
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageSettingsContext>
                <NextIntlClientProvider messages={messages} >
                    <body className={`scroll-smooth ${languageClass} antialiased bg-gray-100`}>
                        <Sidebar />
                        <PlayVDOFor10s />
                        <main>
                            <Header />
                            {children}
                            <Footer />
                        </main>
                    </body>
                </NextIntlClientProvider>
            </PageSettingsContext>
        </html>
    );
}
