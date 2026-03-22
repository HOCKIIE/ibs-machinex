import AxiosInstance from "@/utils/AxiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

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
export const logout = (pathName?:string) => {
    toast.success("Logged out successfully!", { duration: 1000 });
    const queryString = pathName ? `?redirect=${encodeURIComponent(pathName)}` : '';
    setTimeout(async () => {
        try {
            await AxiosInstance.put(`/logout${queryString}`);
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            window.location.href = `/admin/signin${queryString}`;
        }
    }, 1000);
};

export const getUser = async () => {
    try {
        const res = await AxiosInstance.get('/me');
        return res.data;
    } catch (error) {
        return null;
    }
}