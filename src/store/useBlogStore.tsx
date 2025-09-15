"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { BlogType, BlogState, ApiResponse } from "@/types/BlogType";
import { ProcessToast } from "@/utils/ProcessToast";

const prefix = '/admin/blog';

const useBlogStore = create<BlogState>((set) => ({
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

    fetchDataById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.get<BlogType>(`${prefix}/show/${id}`);
            set((state) => ({
                ...state,
                items: [response.data],
                isLoading: false,
            }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({ error: errorMessage, isLoading: false });
        }
    },
    

    createData: async (newData) => {
        try {
            ProcessToast.show('Saving data...');
            const formData = new FormData();
            Object.entries(newData).forEach(([key, value]) => {
                if (key === "category" && Array.isArray(value)) {
                    value.forEach((val) => formData.append("category[]", val));
                } else if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else {
                    formData.append(key, value as string);
                }
            });
            const response = await Api.post(`${prefix}/store`, formData);
            set((state) => ({
                items: [...state.items, response.data],
                isLoading: false,
            }));
            const { status, message } = response.data as { status: boolean; message: string };
            if (status) { 
                ProcessToast.success(message);
            } else {
                ProcessToast.error(message);
            }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    updateData: async (id, data) => {
        try {
            ProcessToast.show('Saving data...')
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === "category" && Array.isArray(value)) {
                    value.forEach((val) => formData.append("category[]", val));
                } else if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else {
                    formData.append(key, value as string);
                }
            });
            formData.append("_method", "PUT");
            const response = await Api.post(`${prefix}/update/${id}`,formData, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
            });
            set((state) => ({
                items: state.items.map((item) => String(item.id) === String(id) ? response.data.data : item  ),
                isLoading: false
            }));
            const { status, message } = response.data as { status: boolean; message: string };
            if (status) { 
                ProcessToast.success(message);
            } else { 
                ProcessToast.error(message);
            }
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    onChangeStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put<BlogType>(`${prefix}/status/${id}`,{ status });
            set((state) => ({
                items: state.items.map((item) => String(item.id) === String(id) ? response.data : item ),
                isLoading: false,
            }));
            ProcessToast.success('Status has been changed.')
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({ 
                error: errorMessage, 
                isLoading: false,
                response : {
                    status: false,
                    message: errorMessage
                }
            });
            ProcessToast.error(errorMessage)
        }
    },
    
    deleteData: async (id) => {
        ProcessToast.show('Deleting data...');
        set({ isLoading: true, error: null });
        try {
            await Api.delete(`${prefix}/destroy`,{ data: { id:id } });
            set((state) => ({
                items: state.items.filter((item) => item.id !== Number(id)),
                isLoading: false,
                response:{
                    status: true,
                    message: "The user was deleted successfully!"
                }
            }));
            ProcessToast.success('The user was deleted successfully!');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({
                error: errorMessage,
                isLoading: false,
                response : {
                    status: false,
                    message: errorMessage
                }
            });
            ProcessToast.error(errorMessage);
        }
    }

}));

export default useBlogStore;