"use client"

import "@/styles/admin.scss";
import React from "react";
import { ThemeProvider } from "next-themes"
import AdminContext from "@/contexts/AdminContaxt";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes"; 


const outfit = Outfit({
    subsets: ["latin"],
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal"],
});

export default function RootLayout({children}:{children: React.ReactNode})
{
    const { theme } = useTheme(); 
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
                    {children}
                    </div>
                </ThemeProvider>
                </body>
            </AdminContext>
        </html>
    );
}
