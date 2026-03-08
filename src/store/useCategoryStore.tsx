"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { ProcessToast } from "@/utils/ProcessToast";
import { CategoryState, ApiResponse } from "@/types/CategoryType";

const prefix = '/admin/category';

const useCategoryStore = create<CategoryState>((set) => ({
    items: [],
    id: 0,
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
        try {
            const response = await Api.get(`${prefix}/show/${id}`);
            set({items: response.data});
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },
    

    createData: async (newData) => {
        try {
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
            const req = await Api.post(`${prefix}/store`, formData);
            const { status, statusCode, message, data } = req.data;
            if (status) await ProcessToast.success(message);
            else await ProcessToast.error(message);
            return { status, statusCode, message, data }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return {
                status: false,
                statusCode: 500,
                message: errorMessage,
                data: null
            }
        }
    },

    updateData: async (id, categoryData) => {
        try {
            ProcessToast.show('Updating category...');
            const formData = new FormData();
            Object.entries(categoryData).forEach(([key, value]) => {
                if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else {
                    formData.append(key, value as string);
                }
            });
            formData.append("_method", "PUT");
            const response = await Api.post(`${prefix}/update/${id}`, formData, { 
                headers: {"X-Requested-With": "XMLHttpRequest"} 
            });
            const { status, statusCode, message, data } = response.data;
            if (status) ProcessToast.success(message); 
            else ProcessToast.error(message);
            return { status, statusCode, message, data };
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            await ProcessToast.error(errorMessage);
            return { status: false, statusCode: 500, message: errorMessage, data: null };
        }
    },

    onChangeStatus: async (id, changeTo) => {
        try{
            const req = await Api.put(`${prefix}/status/${id}`,{ changeTo });
            const {status, statusCode, message, data} = req.data;
            set((state) => ({
                items: state.items.map((item) => String(item.id) === String(id) ? data : item )
            }));
            if (status === true && statusCode === 200) {
                ProcessToast.success(message);
            } else {
                ProcessToast.error(message)
            }
            return { status, statusCode, message, data }
        } catch(error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { status: true, statusCode: 500, message: errorMessage, data: null }
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

export default useCategoryStore;