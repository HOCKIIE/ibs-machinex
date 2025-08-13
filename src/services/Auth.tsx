import AxiosInstance from "@/utils/AxiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { useAuth } from "@/contexts/AdminContext";

export const getToken = () => getCookie('accessToken');
export const setToken = (token: string) =>  setCookie('accessToken', token, { expires: 1 });
export const getRefreshToken = () => getCookie("refreshToken");
export const setRefreshToken = (refreshToken: string) => setCookie('accessToken', refreshToken, { expires: 1 });
export const removeToken = () => { removeCookie('accessToken'); removeCookie('refreshToken'); };
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await AxiosInstance.put("/login",{ email, password });
        if (response.data.status === "success") {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Login failed");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
export const logout = () => {
    toast.success("Logged out successfully!", { duration: 1000 });
    setTimeout(async () => {
        try {
            await AxiosInstance.put("/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            window.location.href = "/admin/signin";
        }
    }, 1000);
};

export const refreshToken = async (): Promise<string | null> => 
{
    try {
        const res = await AxiosInstance.put(`/refresh`);
        if (res.data?.accessToken) {
            setToken(res.data.accessToken);
            return res.data.accessToken;
        }
        return null;
    } catch {
        return null;
    }
}

export const getUser = async () => {
    // const router = useRouter();
    try {
        const res = await AxiosInstance.get('/me');
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error?.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
                try {
                    const res = await AxiosInstance.get('/me');
                    return res.data.user;
                } catch (err) {
                    console.log("Failed to fetch user after token refresh", err);
                    return null;
                }
            } else {
                console.log("No refresh token available or refresh failed");
                return null;
            }
        }
        console.error("Error fetching user", error);
        return null;
    }
}


// export const checkToken = async() => {
//     const token = GetToken();
//     if (!token) return null;
//     try{
//         const res = await AxiosInstance.get("/me", {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         return res.data.user;
//     }catch{
//         return null;
//     }
// }

// export const checkAuth = async () => {

//     const token = checkToken();
//     const localToken = GetToken();
//     if (!token && !localToken) {
//         return null;
//     }
//     if (!token && localToken){
//         RefreshToken()
//     }
//     try {
//         const checkToken = GetToken();
//         if(checkToken){
//             const res = await AxiosInstance.get("/me", {
//                 headers: { Authorization: `Bearer ${checkToken}` }
//             });
//             return res.data.user;
//         }
//     } catch {
//         return null;
//     }
// };