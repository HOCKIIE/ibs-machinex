"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import { ProcessToast } from "@/utils/ProcessToast";
import { ContactState, ApiResponse } from "@/types/ContactType";

const prefix = '/admin/contact';

const useContactStore = create<ContactState>((set) => ({
    items: [],
    
    id: 0,
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

    updateData: async (id, ContactData) => {
        try {
            const formData = new FormData();
            Object.entries(ContactData).forEach(([key, value]) => {
                if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else 
                if(key === 'status'){
                    formData.append("status", value == 'true' ? '1' : '0');
                }else{
                    formData.append(key, value as string);
                }
            });
            formData.append("_method", "PUT");
            const response = await Api.post(`${prefix}/update/${id}`,formData, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            const { status, statusCode, message, data } = response.data;
            if (status) ProcessToast.success(message); 
            else ProcessToast.error(message);
            return { status, statusCode, message, data };
            
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return { status: false, statusCode: 500, message: errorMessage, data: null };
        }
    },

    deleteData: async (id) => {
        try {
            const req = await Api.delete(`${prefix}/destroy/${id}`,{ data: { id:id } });
            const {status, statusCode, message} = req.data
            return { status, statusCode, message};
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { status: false, statusCode: 500, message: errorMessage };
        }
    }

}));

export default useContactStore;