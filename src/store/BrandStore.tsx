"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { BrandState, ApiResponse } from "@/types/BrandType";

const apiPrefix = '/contact';
const prefix = '/admin/contact';

export const useBrandStore = create<BrandState>((set) => ({
    brands: null,
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
                brands: { 
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

    createData: async (data, router) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.post<ApiResponse>(`${apiPrefix}/create`, data);
            set({
                brands: response.data,
                isLoading: false,
            });
            toast.success("The User was created successfully!");
            setTimeout(() => {
                router.push(prefix);
            }, 1000);
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
                brands: response.data,
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
    },

}));