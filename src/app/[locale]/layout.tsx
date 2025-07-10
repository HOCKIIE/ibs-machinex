import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer, Sidebar } from "@/components/main/layout/Layout";
import PageSettingsContext from "@/contexts/PageSettingsContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import { notFound } from "next/navigation";
// import { routing } from "@/i18n/routing";

const inter = Inter({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal", "italic"],
})

export const metadata : Metadata = {
    title: "IBS Machinex Co.,ltd.",
    description: "IBS Machinex Co.,lt",
};

export default async function RootLayout({children}:{children: React.ReactNode}) {
    // const locale = await getLocale();
    const messages = await getMessages();
    // if (!routing.locales.includes(locale as string)) notFound();

    return (
        <html lang="en">
            <PageSettingsContext>
                <NextIntlClientProvider messages={messages} >
                    <body className={`scroll-smooth ${inter.className} antialiased bg-gray-100`}>
                        <Sidebar />
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
