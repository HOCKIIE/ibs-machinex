import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer, Sidebar } from "@/components/main/layout/Layout";
import PageSettingsContext from "@/contexts/PageSettingsContext";

const inter = Inter({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal", "italic"],
})

export const metadata : Metadata = {
    title: "IBS Machinex Co.,ltd.",
    description: "IBS Machinex Co.,lt",
};

export default function RootLayout({children}:{children: React.ReactNode}) {
    return (
        <html lang="en">
            <PageSettingsContext>
                <body className={`${inter.className} antialiased bg-gray-100`}>
                    <Sidebar />
                    <main>
                        <Header />
                        {children}
                        <Footer />
                    </main>
                </body>
            </PageSettingsContext>
        </html>
    );
}
