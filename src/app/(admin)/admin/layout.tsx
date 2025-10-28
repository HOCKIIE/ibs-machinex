"use client"

import "@/styles/admin.scss";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes"
import AdminContext from "@/contexts/AdminContext";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Loader from "@/components/admin/Loader";
import Api from "@/services/Api";


const outfit = Outfit({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal"],
});

export default function RootLayout({children}:{children: React.ReactNode})
{
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

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
