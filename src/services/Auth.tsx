import AxiosInstance, { setAuthToken } from "@/utils/AxiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

export const getToken = () => localStorage.getItem('accessToken');
export const setToken = (token: string) => { localStorage.setItem('accessToken', token); }
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const setRefreshToken = (refreshToken: string) => localStorage.setItem('refreshToken', refreshToken);
export const removeToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await AxiosInstance.put("/login", { email, password });
        if (response.data.status === "success") {
            const accessToken = response.data.authorisation.accessToken;
            setToken(accessToken);
            setAuthToken(accessToken);
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
    toast.success("Logged out successfully!", { duration: 2000 });
    setTimeout(async () => {
        try {
            await AxiosInstance.post("/admin/signin");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            removeToken()
            window.location.href = "/admin/signin";
        }
    }, 2000);
};

export const refreshToken = async (): Promise<string | null> => 
{
    const refresh = getRefreshToken();
    if (!refresh) return null;

    // const token = getToken();
    try {
        const res = await AxiosInstance.put("/refresh", {
            headers: { Authorization: `Bearer ${refresh}` }
        });
        setToken(res.data.token)
        return res.data.user;
    } catch {
        removeToken();
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