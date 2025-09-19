"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import { UserType, UserState, ApiResponse } from "@/types/UserType";
import { ProcessToast } from "@/utils/ProcessToast";

const prefix = '/admin/user';

const useUserStore = create<UserState>((set) => ({
    users: [],
    isLoading: false,
    response:{ status:null, statusCode: null, message:null},
    error: null,
    token: null,
    role: "",
    user: "",
    id: "",

    total: 0,
    lastPage: 0,
    currentPage: 1,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.get<ApiResponse>(`${prefix}`);
        
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
    
    fetchUserById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.get<UserType>(`${prefix}/show/${id}`);
    
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
    
    createUser: async (newUser) => {
        try {
            ProcessToast.show('Creating data...')
            const response = await Api.post(`${prefix}/store`, newUser);
            set((state) => ({
                users: [...state.users, response.data],
                isLoading: false,
            }));
            const { status, message } = response.data as { status: boolean; message: string };
            if (status) { 
                ProcessToast.success(message,2000);
            } else { 
                ProcessToast.error(message,2000);
            }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage,2000);
        }
    },
    
    updateUser: async (id, data) => {
        ProcessToast.show('Saving data...')
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put(`${prefix}/update/${id}`,data);
            set((state) => ({
                users: state.users.map((item) => item.id === Number(id) ? response.data : item  ),
                isLoading: false,
            }));
            ProcessToast.success(response.data.message,2000)
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage,2000);
        }
    },

    onChangeStatus: async (id, status) => {
        ProcessToast.show('Saving data...');
        set({ isLoading: true, error: null });
        try {
            const response = await Api.put(`${prefix}/status/${id}`,{ status });
            set((state) => ({
                banners: state.users.map((item) => item.id === Number(id) ? response.data : item ),
                isLoading: false
            }));
            ProcessToast.success("The User status change successfully!",2000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            set({ 
                error: errorMessage, 
                isLoading: false,
                response : {
                    status: false,
                    statusCode: 500,
                    message: errorMessage
                }
            });
        }
    },
    
    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const callout = await Api.delete(`${prefix}/destroy`,{ data: { id:id } });
            set((state) => ({
                users: state.users.filter((item) => item.id !== Number(id)),
                isLoading: false,
                response:{
                    status: true,
                    statusCode: callout.data.statusCode,
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
                    statusCode: 500,
                    message: errorMessage
                }
            });
        }
    }

}));

export default useUserStore;