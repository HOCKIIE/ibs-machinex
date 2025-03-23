"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken  } from "@/services/Auth";
import AxiosInstance from "@/utils/AxiosInstance";
import { useRouter } from "next/navigation";
import UserProps from "@/types/UserType";

interface AuthContextType {
    user: UserProps | null;
    loading: boolean;
    menuActive: string;
    setMenuActive: (menu: string) => void;
    userMenu: boolean;
    setUserMenu: (active: boolean) => void;
}

export const AdminContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    menuActive: '',
    setMenuActive: () => {},
    userMenu: false,
    setUserMenu: () => {}
});

export default function AdminContextProvider({ children }: { children: ReactNode })
{
    const router = useRouter();
    const [user, setUser] = useState<UserProps | null>(null);
    const [menuActive, setMenuActive] = useState<string>('');
    const [userMenu, setUserMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await AxiosInstance.get('/me');
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
        <AdminContext.Provider value={{ user, loading, menuActive, setMenuActive, userMenu, setUserMenu }}>
        {children}
        </AdminContext.Provider>
    );
}

export const useAuth = () => useContext(AdminContext);