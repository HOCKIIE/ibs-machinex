"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken  } from "@/services/Auth";
import AxiosInstance from "@/utils/AxiosInstance";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/UserType";

interface AuthContextType {
    user: UserType | null;
    loading: boolean;
    menuActive: string;
    setMenuActive: (menu: string) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    userMenu: boolean;
    setUserMenu: (active: boolean) => void;
}

export const AdminContext = createContext<AuthContextType>({
    user: null,
    loading: true,
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

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
        console.log(isSidebarOpen);
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await AxiosInstance.get('/admin/me');
                setUser(res.data.user);
            } catch (error) {
                console.log(error)
                removeToken();
                router.push('/admin/signin');
            } finally {
                setLoading(false);
            }
        };

        if (getToken()) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [router]);


    return (
        <AdminContext.Provider value={{ user, loading, menuActive, setMenuActive, isSidebarOpen, toggleSidebar, userMenu, setUserMenu }}>
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