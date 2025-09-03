"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { OwnerState, ApiResponse } from "@/types/OwnerType";

const prefix = '/admin/owner';

const useOwnerStore = create<OwnerState>((set) => ({
    item: {
        id: "",
        logo: "",
        email: "",
        title_th: "",
        title_en: "",
        title_ja: "",
        address_th: "",
        address_en: "",
        address_ja: "",
        phone: "",
        mobile: "",
        gmap: ""
    },
    fetchData: async () => {
        try {
            const response = await Api.get<ApiResponse>(`${prefix}`);
            set({ item: response.data.data });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errorMessage);
        }
    },

    updateData: async (data) => {
        try {
            const response = await Api.put(`${prefix}/update`,data);
            set({ item: response.data.data });
            
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    }

}));

export default useOwnerStore;