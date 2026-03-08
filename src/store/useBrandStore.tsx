"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { BrandState, BrandType, ApiResponse } from "@/types/BrandType";
import { ProcessToast } from "@/utils/ProcessToast";

const prefix = '/admin/brand';

const useBrandStore = create<BrandState>((set) => ({
    items: [],
    id: 0,
    total: 1,
    lastPage: 1,
    currentPage: 1,
    response: { status: null, statusCode: null, message: null },

    fetchData: async (page: number) => {
        try {
            const response = await Api.get<ApiResponse>(`${prefix}?page=${page}`);
            const { total, lastPage, currentPage, items } = response.data;
            set({ items: items, total, lastPage, currentPage });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },

    fetchDataById: async (id) => {
        try {
            const response = await Api.get<BrandType[]>(`${prefix}/show/${id}`);
            set({items: response.data});
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },
    

    createData : async (newData) => {
        try {
            ProcessToast.show('Saving data...');
            const formData = new FormData();
            Object.entries(newData).forEach(([key, value]) => {
                if (key === "category" && Array.isArray(value)) {
                    value.forEach((val) => formData.append("category[]", val));
                } else if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else if(key === 'status'){
                    formData.append("status", value == 'true' ? '1' : '0');
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
            await ProcessToast.error(errorMessage); 
            return { status: false, statusCode: 500, message: errorMessage, data: null }
        }
    },

    updateData: async (id, brandData) => {
        try {
            ProcessToast.show('Updating category...');
            const formData = new FormData();
            Object.entries(brandData).forEach(([key, value]) => {
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
            await ProcessToast.error(errorMessage,2000);
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
            if (status === true && statusCode === 200) ProcessToast.success(message);
            else ProcessToast.error(message);
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
export default useBrandStore;
