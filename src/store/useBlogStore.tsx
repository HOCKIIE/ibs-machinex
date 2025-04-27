"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { BlogType, BlogState, ApiResponse } from "@/types/BlogType";

const apiPrefix = '/blog';
const prefix = '/admin/blog';

const useBlogStore = create<BlogState>((set) => ({
    data: [],
    response: { status:null,message:null},
    error: null,

    fetchData: async (page: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await Api.get<ApiResponse>(`${apiPrefix}?page=${page}`);
    
          const { total, lastPage, currentPage, rows } = response.data;
    
          let filteredRows = rows;
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          if (userData?.role != "super") {
                filteredRows = rows.filter((item) => item?.role !== "super");
          } else if (userData?.role === "user") {
                filteredRows = [];
          }
          set({
                users: filteredRows,
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
            const response = await Api.get<BlogType>(`${apiPrefix}/show/${id}`);
    
            set((state) => ({
                ...state,
                users: [response.data],
                isLoading: false,
            }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({ error: errorMessage, isLoading: false });
        }
    },
    

    createUser: async (newData, router) => {
        try {
            const response = await Api.post(`${apiPrefix}/store`, newData);
            set((state) => ({
                users: [...state.users, response.data],
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

    updateUser: async (id, data, router) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put<UserType>(`${apiPrefix}/update/${id}`,data);
            set((state) => ({
                users: state.users.map((item) => item.id === Number(id) ? response.data : item  ),
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
            const response = await Api.put<UserType>(`${apiPrefix}/status/${id}`,{ status });
            set((state) => ({
                banners: state.users.map((item) => item.id === Number(id) ? response.data : item ),
                isLoading: false,
            }));
            toast.success("The User status change successfully!");
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
    
    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await Api.delete(`${apiPrefix}/destroy`,{ data: { id:id } });
            set((state) => ({
                users: state.users.filter((item) => item.id !== Number(id)),
                isLoading: false,
                response:{
                    status: true,
                    message: "The user was deleted successfully!"
                }
            }));
            // toast.success("The user was deleted successfully!");
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