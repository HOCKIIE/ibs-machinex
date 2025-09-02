"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { ContactState, ContactType, ApiResponse } from "@/types/ContactType";

const prefix = '/admin/contact';

const useContactStore = create<ContactState>((set) => ({
    items: [],
    isLoading: false,
    error: null,
    token: null,
    
    id: "",
    total: 1,
    lastPage: 1,
    currentPage: 1,
    response: { status: null, message: null },
    
    fetchData: async (page: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.get<ApiResponse>(`${prefix}?page=${page}`);
            const { total, lastPage, currentPage, rows } = response.data;
            set({
                items: rows,
                total,
                lastPage,
                currentPage,
                isLoading: false,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({ error: errorMessage, isLoading: false });
        }
    },

    updateData: async (data) => {
        set({ error: null });
        try {
            const response = await Api.put(`${prefix}/update`,data);
            set({
                response: {
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

    deleteData: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.delete(`${prefix}/delete/${id}`);
            set({
                isLoading: false,
                response: {
                    status : response.data.status,
                    message : response.data.message,
                }
            });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    }

}));

export default useContactStore;