"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { BlogType, BlogState, BlogFormProps, ApiResponse } from "@/types/BlogType";
import { ProcessToast } from "@/utils/ProcessToast";

const prefix = '/admin/blog';

const useBlogStore = create<BlogState>((set) => ({
    items: [],
    
    id: "",
    total: 1,
    lastPage: 1,
    currentPage: 1,
    response: { status: null, statusCode: null, message: null },

    fetchData: async (page: number) => {
        set({ items:[], total:1, lastPage: 1, currentPage: 1});
        try {
            const response = await Api.get<ApiResponse>(`${prefix}?page=${page}`);
            const { total, lastPage, currentPage, rows } = response.data;
            set({items: rows,total: total,lastPage: lastPage,currentPage: currentPage});
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    fetchDataById: async (id) => {
        set({ items:[] });
        try {
            const response = await Api.get<BlogType>(`${prefix}/show/${id}`);
            set({ items: [response.data]});
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },
    

    createData: async (blogData) => {
        try {
            ProcessToast.show('Saving data...');
            const formData = new FormData();
            Object.entries(blogData).forEach(([key, value]) => {
                if (key === "category" && Array.isArray(value)) {
                    value.forEach((val) => formData.append("category[]", val));
                } else if (key === "image" && value instanceof File) {
                    console.log("Appending image file:", value);
                    formData.append("image", value);
                } else {
                    formData.append(key, value as string);
                }
            });
            const response = await Api.post(`${prefix}/store`, formData);
            const { status, message, data } = response.data as { status: boolean; message: string, data:BlogFormProps };
            if (status) { 
                await ProcessToast.success(message);
                return { status, message, data };
            } else {
                await ProcessToast.error(message);
                return { status: false, message: message, data:null };
            }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return { status: false, message: errorMessage, data: null  };
        }
    },

    updateData: async (id, blogData) => {
        set({ items:[] })
        try {
            ProcessToast.show('Saving data...')
            const formData = new FormData();
            Object.entries(blogData).forEach(([key, value]) => {
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
            set((state) => ({ items: state.items.map((item) => String(item.id) === String(id) ? response.data.data : item  ) }));
            const { status, message, data } = response.data as { status: boolean; message: string, data:BlogFormProps };
            if (status) { 
                ProcessToast.success(message);
                return {status, message, data}
            } else { 
                ProcessToast.error(message);
                return { status, message, data:null }
            }
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return { status: false, message: errorMessage, data:null };
        }
    },

    onChangeStatus: async (id, status) => {
        set({  items: [] });
        try {
            const response = await Api.put<BlogType>(`${prefix}/status/${id}`,{ status });
            set((state) => ({
                items: state.items.map((item) => String(item.id) === String(id) ? response.data : item )
            }));
            ProcessToast.success('Status has been changed.')
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },
    
    deleteData: async (id) => {
        set({ response : { status: null, statusCode: null, message: null} });
        try {
            const request = await Api.delete(`${prefix}/destroy`,{ data: { id:id } });
            set({
                response:{
                    status: request.data.status,
                    statusCode: request.data.statusCode,
                    message: request.data.message
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({
                response : {
                    status: false,
                    statusCode: 500,
                    message: errorMessage
                }
            });
        }
    }

}));

export default useBlogStore;