"use client";

import { ReactNode, createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
// import { UserType } from "@/types/UserType";
import { setAccessToken } from "@/services/Api";
import { getUser } from "@/services/Auth";

interface UserType {
    id: number;
    role: string;
    name: string;
    email: string;
    status: number;
}
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
    refreshUser: () => void
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
    setUserMenu: () => {},
    refreshUser: () => {}
});

export default function AdminContextProvider({ children }: { children: ReactNode })
{
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<UserType|null>(null);
    const [menuActive, setMenuActive] = useState<string>('');
    const [userMenu, setUserMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const didFetchUserData = useRef(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const toggleLoading = () => setLoading(!loading)
    const fetchUser = async (): Promise<void> => {
        try {
            const res = await getUser();
            setUser({
                id: res.user.id,
                role: res.user.role,
                name: res.user.name,
                email: res.user.email,
                status: res.user.status,
            });
            setAccessToken(res.accessToken);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    const refreshUser = async (): Promise<void> => {
        setLoading(true);
        return fetchUser();
    };
    useEffect(() => {
        if (didFetchUserData.current) return;
        didFetchUserData.current = true;
        fetchUser()
    }, []);
    useEffect(() => {
        const isAdminPath = pathname.startsWith("/admin");
        const isSigninPage = pathname === "/admin/signin";
        if (!loading && isAdminPath && !isSigninPage && !user) {
            router.replace(`/admin/signin?redirect=${pathname}`);
        }
    }, [loading, pathname, user, router]);

    return (
        <AdminContext.Provider value={{ user, loading, toggleLoading, menuActive, setMenuActive, isSidebarOpen, toggleSidebar, userMenu, setUserMenu, refreshUser }}>
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