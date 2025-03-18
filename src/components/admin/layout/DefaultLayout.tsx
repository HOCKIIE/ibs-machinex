"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
        <div className="flex h-screen">
            <Sidebar />
            <div className="relative flex flex-1 flex-col overflow-y-auto">
                <Header />
                <div className="p-4 md:p-6 2xl:p-4">{children}</div>
            </div>
        </div>
        </>
    );
}
