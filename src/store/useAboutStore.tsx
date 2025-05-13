"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { AboutType,AboutState } from "@/types/AboutType";

const apiPrefix = '/admin/about';

const useAboutStore = create<AboutState>((set) => ({
    about: null,
    error: null,
    response:{ status:null,message:null, action:null},
    token: null,
    role: "",
    user: "",
    id: "",
    
    getData: async () => {
        set({ error: null });
        try {
            const response = await Api.get<AboutType>(apiPrefix);
            set({about: response.data});
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    },
    updateData: async (data) => {
        set({ error: null });
        try {
            const response = await Api.put(`${apiPrefix}/update`,data);
            set({
                response: {
                    action: "update",
                    status : response.data.status,
                    message : response.data.message,
                }
            });
            
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    },
}));

export default useAboutStore
