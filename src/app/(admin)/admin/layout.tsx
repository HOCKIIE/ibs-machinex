"use client"

import "@/styles/admin.scss";
import React, { useEffect,useState } from "react";
import { ThemeProvider } from "next-themes"
import AdminContext from "@/contexts/AdminContaxt";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes"; 
import { checkAuth } from "@/services/Auth";
import { useRouter } from "next/navigation";
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
    const { theme } = useTheme(); 
    useEffect(()=>{
        checkAuth().then((data) => {
            if (!data) {
                router.push("/admin/signin");
                setLoading(false);
                // return;
            }else{
                setLoading(false);
            }
        });
    },[router])
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <AdminContext>
                <body className={`${outfit.className} bg-slate-50`} >
                <ThemeProvider attribute="class" defaultTheme="system">
                    <div className="dark:bg-boxdark-2 dark:text-bodydark">
                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                        toastOptions={{
                            className: "bg-white text-black border bg-red-200 border-red-200 dark:bg-red-950 dark:text-white dark:border-red-800",
                            success: {
                                iconTheme: {
                                    primary: theme == "dark" ? "#4ade80" : "#22c55e",
                                    secondary: "#fff",
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: theme == "dark" ? "#f87171" : "#ef4444",
                                    secondary: "#fff",
                                },
                            },
                        }}
                    />
                    {loading ? <Loader /> : children}
                    </div>
                </ThemeProvider>
                </body>
            </AdminContext>
        </html>
    );
}
