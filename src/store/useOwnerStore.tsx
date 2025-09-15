"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import { OwnerState, ApiResponse } from "@/types/OwnerType";
import { ProcessToast } from "@/utils/ProcessToast";

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
            ProcessToast.error(errorMessage);
        }
    },

    updateData: async (data) => {
        try {
            ProcessToast.show('Saving data...')
            const response = await Api.put(`${prefix}/update`,data);
            set({ item: response.data.data });
            ProcessToast.success(response.data.message,2000);
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage,2000);
        }
    }

}));

export default useOwnerStore;