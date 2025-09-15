"use client"

import "@/styles/admin.scss";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes"
import AdminContext from "@/contexts/AdminContext";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Loader from "@/components/admin/Loader";


const outfit = Outfit({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal"],
});

export default function RootLayout({children}:{children: React.ReactNode})
{
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            // setLoading(true);
            // const user = await getUser();

            // if (!user) {
            //     if(pathname.includes('/signin')) router.push('/admin/signin')
            //     else router.push(`/admin/signin?redirect=${encodeURIComponent(pathname)}`);
            //     setLoading(false);
            //     return;
            // }
            setLoading(false);
        };
        checkAuth();
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
