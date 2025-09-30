"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { ProcessToast } from "@/utils/ProcessToast";
import { CategoryState, ApiResponse } from "@/types/CategoryType";

const prefix = '/admin/category';

const useCategoryStore = create<CategoryState>((set) => ({
    items: [],
    id: "",
    total: 1,
    lastPage: 1,
    currentPage: 1,
    response: { status: null, statusCode: null, message: null },

    fetchData: async (page: number) => {
        set({ items:[], total:1, lastPage: 1, currentPage: 1 })
        try {
            const response = await Api.get<ApiResponse>(`${prefix}?page=${page}`);
            const { total, lastPage, currentPage, rows } = response.data;
            set({items: rows, total:total, lastPage: lastPage, currentPage: currentPage,});
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    fetchDataById: async (id) => {
        set({ response: { status: null, statusCode: null, message: null} })
        try {
            const response = await Api.get(`${prefix}/show/${id}`);
            set({items: response.data});
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },
    

    createData: async (newData, router) => {
        try {
            set({ response: { status: null, statusCode: null, message: null } })
            ProcessToast.show('Creating category...');
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
            set({ items: [response.data] });
            const { status, message } = response.data as { status: boolean; message: string };
            if (status) { 
                await ProcessToast.success(message);
                router.push(`${prefix}`); 
            } else { 
                await ProcessToast.error(message);
            }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    updateData: async (id, data) => {
        try {
            set({ response: { status: null, statusCode: null, message: null } })
            ProcessToast.show('Updating category...');
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else {
                    formData.append(key, value as string);
                }
            });
            formData.append("_method", "PUT");
            const response = await Api.post(`${prefix}/update/${id}`, formData, { headers: {"X-Requested-With": "XMLHttpRequest"} });
            set((state) => ({
                items: state.items.map((item) => String(item.id) === String(id) ? response.data.data : item  )
            }));
            const { status, message } = response.data as { status: boolean; message: string };
            if (status) { 
                await ProcessToast.success(message);
            } else { 
                await ProcessToast.error(message);
            }
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            await ProcessToast.error(errorMessage);
        }
    },

    deleteData: async (id) => {
        set({ items:[], response: { status: null, statusCode: null, message: null } });
        try {
            const callout = await Api.delete(`${prefix}/destroy`,{ data: { id:id } });
            set((state) => ({
                items: state.items.filter((item) => item.id !== String(id)),
                response:{
                    status: true,
                    statusCode: callout.data.statusCode,
                    message: "The user was deleted successfully!"
                }
            }));
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

export default useCategoryStore;