"use client"

import "@/styles/admin.scss";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes"
import AdminContext from "@/contexts/AdminContaxt";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getToken } from "@/services/Auth";
import Loader from "@/components/admin/Loader";


const outfit = Outfit({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal"],
});

export default function RootLayout({children}:{children: React.ReactNode})
{
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const token = getToken();
            if (!token) {
                router.push(`/admin/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
                setLoading(false);
                return;
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    return (
        <html lang="en" suppressHydrationWarning={true}>
            <AdminContext>
                <body className={`${outfit.className} bg-slate-50`} >
                <ThemeProvider attribute="class" defaultTheme="system">
                    <div className="dark:bg-boxdark-2 dark:text-bodydark">
                    <Toaster position="top-right" reverseOrder={false} />
                    {loading ? <Loader/> : children}
                    </div>
                </ThemeProvider>
                </body>
            </AdminContext>
        </html>
    );
}
