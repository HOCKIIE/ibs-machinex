"use client";
import { ReactNode, createContext, useState } from "react";
export const AdminContext = createContext({});

export default function AdminContextProvider({ children }: { children: ReactNode })
{
    const [menuActive, setMenuActive] = useState<string>('');
    const [userMenu, setUserMenu] = useState<boolean>(false);
    return (
        <AdminContext.Provider value={{ menuActive, setMenuActive, userMenu, setUserMenu }}>
        {children}
        </AdminContext.Provider>
    );
}
