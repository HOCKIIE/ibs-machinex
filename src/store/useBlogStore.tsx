"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { BlogType, BlogState, ApiResponse } from "@/types/BlogType";

const prefix = '/admin/blog';

const useBlogStore = create<BlogState>((set) => ({
    data: [] as BlogType[],
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
                data: rows,
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
            console.log(response.data)
            set((state) => ({
                ...state,
                data: [response.data],
                isLoading: false,
            }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({ error: errorMessage, isLoading: false });
        }
    },
    

    createData: async (newData, router) => {
        try {
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
            const response = await Api.post(`${prefix}/store`, formData, {
                headers: { "Content-Type": "multipart/form-data"}
            });
            set((state) => ({
                data: [...state.data, response.data],
                isLoading: false,
            }));
            const { status, message } = response.data as { status: boolean; message: string };
            if (status) { 
                toast.success(message);
                setTimeout(() => { 
                    router.push(`${prefix}`); 
                }, 1000);
            } else { 
                toast.error(message);
            }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    },

    updateData: async (id, data, router) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put<BlogType>(`${prefix}/update/${id}`,data);
            set((state) => ({
                users: state.data.map((item) => item.id === Number(id) ? response.data : item  ),
                isLoading: false,
            }));
            setTimeout(()=>{
                router.push(prefix); 
            },1000)
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    },

    onChangeStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put<BlogType>(`${prefix}/status/${id}`,{ status });
            set((state) => ({
                banners: state.data.map((item) => item.id === Number(id) ? response.data : item ),
                isLoading: false,
            }));
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
        }
    },
    
    deleteData: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await Api.delete(`${prefix}/destroy`,{ data: { id:id } });
            set((state) => ({
                users: state.data.filter((item) => item.id !== Number(id)),
                isLoading: false,
                response:{
                    status: true,
                    message: "The user was deleted successfully!"
                }
            }));
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
        }
    }

}));

export default useBlogStore;