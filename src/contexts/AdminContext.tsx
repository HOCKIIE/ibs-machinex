"use client";

import { ReactNode, createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/UserType";
import { setAccessToken } from "@/services/Api";
import { getUser } from "@/services/Auth";

interface AuthContextType {
    user: UserType | null;
    loading: boolean;
    toggleLoading: () => void;
    menuActive: string;
    setMenuActive: (menu: string) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    userMenu: boolean;
    setUserMenu: (active: boolean) => void;
}

export const AdminContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    toggleLoading: () => {},
    menuActive: '',
    setMenuActive: () => {},
    isSidebarOpen: false,
    toggleSidebar: () => {},
    userMenu: false,
    setUserMenu: () => {}
});

export default function AdminContextProvider({ children }: { children: ReactNode })
{
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<UserType | null>(null);
    const [menuActive, setMenuActive] = useState<string>('');
    const [userMenu, setUserMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const didFetchUserData = useRef(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const toggleLoading = () => setLoading(!loading)
    const fetchUser = async () => {
        try {
            const res = await getUser();
            setUser(res.user);
            setAccessToken(res.accessToken);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    useEffect(() => {
        if (didFetchUserData.current) return;
        didFetchUserData.current = true;
        fetchUser()
    }, [router]);


    return (
        <AdminContext.Provider value={{ user, loading, toggleLoading, menuActive, setMenuActive, isSidebarOpen, toggleSidebar, userMenu, setUserMenu }}>
        {children}
        </AdminContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useGlobal must be used within a GlobalProvider");
    }
    return context;
}