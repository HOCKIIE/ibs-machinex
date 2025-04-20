import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { AboutState, ApiResponse } from "@/types/AboutType";

const apiPrefix = '/about';
const prefix = '/admin/about';

export const useAboutStore = create<AboutState>((set) => ({
    about: null,
    isLoading: false,
    response:{ status:null,message:null},
    error: null,
    token: null,
    role: "",
    user: "",
    id: "",

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.get<ApiResponse>(apiPrefix);
            set({
                about: { 
                    ...response.data, 
                    created_at: (response.data as { created_at?: string }).created_at || "", 
                    updated_at: (response.data as { updated_at?: string }).updated_at || "" 
                },
                isLoading: false,
            });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    },
    updateData: async (id, data, router) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put<ApiResponse>(`${apiPrefix}/update`, data);
            set({
                about: response.data,
                isLoading: false,
            });
            toast.success("The User was updated successfully!");
            setTimeout(() => {
                router.push(prefix);
            }, 1000);
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    }
});