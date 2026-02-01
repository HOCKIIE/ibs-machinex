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
type Props = {
    params: {
        locale: 'th' | 'en' | 'ja';
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const { locale } = params;

    const baseUrl = 'https://www.ibsmachinex.com';

    const titles = {
        th: 'IBS MACHINEX (THAILAND) CO.,LTD.',
        en: 'IBS MACHINEX (THAILAND) CO.,LTD.',
        ja: 'IBS MACHINEX (THAILAND) CO.,LTD.'
    };

    const descriptions = {
        th: 'ผู้ให้บริการเครื่องจักรอุตสาหกรรมคุณภาพสูงในประเทศไทย',
        en: 'A leading provider of industrial machinery and equipment in Thailand.',
        ja: 'タイにおける産業機械および設備の主要プロバイダーです。'
    };

    return {
        title: titles[locale],
        description: descriptions[locale],

        alternates: {
            canonical: `${baseUrl}/${locale}/`,
            languages: {
                th: `${baseUrl}/th/`,
                en: `${baseUrl}/en/`,
                ja: `${baseUrl}/ja/`,
            },
        },

        openGraph: {
            title: titles[locale],
            description: descriptions[locale],
            url: `${baseUrl}/${locale}/`,
            siteName: 'IBS MACHINEX (THAILAND) CO.,LTD.',
            images: [
                {
                    url: `${baseUrl}/og.jpg`,
                    width: 1200,
                    height: 630,
                    alt: 'IBS MACHINEX (THAILAND) CO.,LTD.',
                },
            ],
            locale: locale === 'th' ? 'th_TH' : locale === 'ja' ? 'ja_JP' : 'en_US',
            type: 'website',
        },

        twitter: {
            card: 'summary_large_image',
            title: titles[locale],
            description: descriptions[locale],
            images: [`${baseUrl}/og.jpg`],
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function RootLayout({children}:{children: React.ReactNode}) {

    
    const locale = await getLocale();
    if (!routing.locales.includes(locale as string)) notFound();

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

    return (
        <html lang={locale}>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={`scroll-smooth ${languageClass} antialiased bg-gray-100`}>
                <PageSettingsContext>
                    <NextIntlClientProvider messages={messages} >
                        <Sidebar />
                        <PlayVDOFor10s />
                        <main>
                            <Header />
                            {children}
                            <Footer />
                        </main>
                    </NextIntlClientProvider>
                </PageSettingsContext>
            </body>
        </html>
    );
}
