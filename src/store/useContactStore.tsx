"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import { ProcessToast } from "@/utils/ProcessToast";
import { ContactState, ApiResponse } from "@/types/ContactType";

const prefix = '/admin/contact';

const useContactStore = create<ContactState>((set) => ({
    items: [],
    
    id: "",
    total: 1,
    lastPage: 1,
    currentPage: 1,
    response: { status: null, statusCode: null, message: null },
    
    fetchData: async (page?: number) => {
        set({ items:[], total:1, lastPage: 1, currentPage: 1 })
        try {
            const response = await Api.get<ApiResponse>(`${prefix}?page=${page}`);
            const { total, lastPage, currentPage, rows } = response.data;
            set({
                items: rows,
                total,
                lastPage,
                currentPage,
            });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    updateData: async (data) => {
        set({ response: { status: null, statusCode: null, message: null } })
        try {
            const response = await Api.put(`${prefix}/update`,data);
            set({
                response: {
                    status : response.data.status,
                    statusCode : response.data.statusCode,
                    message : response.data.message,
                }
            });
            
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    deleteData: async (id) => {
        set({ response: { status: null, statusCode: null, message: null } })
        try {
            const response = await Api.delete(`${prefix}/delete/${id}`);
            set({
                response: {
                    status : response.data.status,
                    statusCode : response.data.statusCode,
                    message : response.data.message,
                }
            });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    }

}));

export default useContactStore;