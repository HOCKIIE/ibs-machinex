import AxiosInstance, { setAuthToken } from "@/utils/AxiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

export const storeToken = (token: string) => { localStorage.setItem("token", token); }
export const getToken = (): string | null => { return localStorage.getItem("token"); };
export const removeToken = () => { localStorage.removeItem("token"); }

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await AxiosInstance.put("/login", { email, password });
        if (response.data.status === "success") {
            const token = response.data.authorisation.token;
            storeToken(token);
            setAuthToken(token);
            return response.data.user;
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

export const RefreshToken = async() => 
{
    const token = getToken();
    try {
        const res = await AxiosInstance.put("/refresh", {
            headers: { Authorization: `Bearer ${token}` }
        });
        storeToken(res.data.token)
        return res.data.user;
    } catch {
        return null;
    }
}

export const checkToken = async() => {
    const token = getToken();
    if (!token) return null;
    try{
        const res = await AxiosInstance.get("/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.user;
    }catch{
        return null;
    }
}

export const checkAuth = async () => {

    const token = checkToken();
    const localToken = getToken();
    if (!token && !localToken) {
        return null;
    }
    if (!token && localToken){
        RefreshToken()
    }
    try {
        const checkToken = getToken();
        if(checkToken){
            const res = await AxiosInstance.get("/me", {
                headers: { Authorization: `Bearer ${checkToken}` }
            });
            return res.data.user;
        }
    } catch {
        return null;
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
            localStorage.removeItem("token");
            window.location.href = "/admin/login";
        }
    }, 2000);
};