"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { ContactState, ApiResponse } from "@/types/ContactType";

const apiPrefix = '/contact';
const prefix = '/admin/contact';


export const useContactStore = create<ContactState>((set) => ({
    contact: null,
    isLoading: false,
    response:{ status:null,message:null},
    error: null,
    token: null,
    role: "",
    user: "",
    id: "",
    
    fetchContact: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.get<ApiResponse>(apiPrefix);
            set({
                contact: { 
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
    updateContact: async (id, data, router) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put<ApiResponse>(`${apiPrefix}/update/${id}`,data);
            set({
                contact: response.data,
                isLoading: false,
            });
            toast.success("The User was updated successfully!");
            setTimeout(()=>{
                router.push(prefix); 
            },1000)
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    },

}));