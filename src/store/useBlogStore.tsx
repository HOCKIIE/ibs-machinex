"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { BlogType, BlogState, BlogFormProps, ApiResponse } from "@/types/BlogType";
import { ProcessToast } from "@/utils/ProcessToast";

const prefix = '/admin/blog';

const useBlogStore = create<BlogState>((set) => ({
    items: [],
    
    id: 0,
    total: 1,
    lastPage: 1,
    currentPage: 1,
    response: { status: null, statusCode: null, message: null, errors: null },

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
                } else if (key === "image_th" || key === "image_en" || key === "image_ja" && value instanceof File) {
                    formData.append(key, value);
                } else if(key === "descendant_th" || key === "descendant_en" || key === "descendant_ja"){
                    formData.append(key, JSON.stringify(value));
                }  else {
                    formData.append(key, value as string);
                }
            });
            const response = await Api.post(`${prefix}/store`, formData);
            const { status, statusCode, message, data, errors } = response.data;
            if (status) { 
                await ProcessToast.success(message);
            } else {
                await ProcessToast.error(message);
            }
            if (data) return { status, statusCode, message, data};
            return { status, statusCode, message, errors};
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return { status: false, statusCode: 500, message: errorMessage, data: null };
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
                } else if(key === "descendant_th" || key === "descendant_en" || key === "descendant_ja"){
                    formData.append(key, JSON.stringify(value));
                } else if (key === "image_th" || key === "image_en" || key === "image_ja" && value instanceof File) {
                    formData.append(key, value);
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
            const { status, statusCode, message, data } = response.data;
            if (status) ProcessToast.success(message);
            else  ProcessToast.error(message);
            return { status, statusCode, message, data }
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return { status: false, statusCode: 500, message: errorMessage, data: null };
        }
    },

    onChangeStatus: async (id, changeTo) => {
        try {
            const req  = await Api.put(`${prefix}/status/${id}`,{ changeTo });
            const { status, statusCode, message, data } = req.data;
            set((state) => ({
                items: state.items.map((item) => String(item.id) === String(id) ? data : item )
            }));
            ProcessToast.success('Status has been changed.',500)
            return { status, statusCode, message, data}
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return { status: false, statusCode: 500, message: errorMessage, data: null}
        }
    },
    
    deleteData: async (id) => {
        try {
            const req = await Api.delete(`${prefix}/destroy`,{ data: { id:id } });
            const {status, statusCode, message} = req.data
            return { status, statusCode, message};
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { status: false, statusCode: 500, message: errorMessage };
        }
    }

}));

export default useBlogStore;