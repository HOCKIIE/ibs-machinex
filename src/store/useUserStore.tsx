"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import { UserType, UserState, ApiResponse } from "@/types/UserType";
import { ProcessToast } from "@/utils/ProcessToast";

const prefix = '/admin/user';

const useUserStore = create<UserState>((set) => ({
    users: [],
    response:{ status:null, statusCode: null, message:null},
    role: "",
    user: "",
    id: "",

    total: 0,
    lastPage: 0,
    currentPage: 1,

    fetchUsers: async () => {
        set({ users:[], total:1, lastPage: 1, currentPage: 1 })
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
                total: total,
                lastPage: lastPage,
                currentPage: currentPage
            });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },
    
    fetchUserById: async (id) => {
        set({ users: [] });
        try {
            const response = await Api.get<UserType>(`${prefix}/show/${id}`);
            set({  users: [response.data] });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    },
    
    createUser: async (newUser) => {
        set({ users: [] });
        try {
            ProcessToast.show('Creating data...')
            const req = await Api.post(`${prefix}/store`, newUser);
            set({ users: [req.data] });
            const { status, statusCode, message, data } = req.data;
            if (status) await ProcessToast.success(message);
            else await ProcessToast.error(message);
            return { status, statusCode, message, data }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage,2000);
            return { status: false, statusCode: 500, message: errorMessage, data: null }
        }
    },
    
    updateUser: async (id, newData) => {
        set({ users: [] });
        ProcessToast.show('Saving data...')
        try {
            const response = await Api.put(`${prefix}/update/${id}`,newData);
            set((state) => ({
                users: state.users.map((item) => item.id === Number(id) ? response.data : item  ),
            }));
            const { status, statusCode, message, data } = response.data;
            if (status) ProcessToast.success(message); 
            else ProcessToast.error(message);
            return { status, statusCode, message, data };
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
            return { status: false, statusCode: 500, message: errorMessage, data: null }
        }
    },

    onChangeStatus: async (id, changeTo) => {
        try{
            const req = await Api.put(`${prefix}/status/${id}`,{ changeTo });
            const {status, statusCode, message, data} = req.data;
            set((state) => ({
                users: state.users.map((item) => String(item.id) === String(id) ? data : item )
            }));
            if (status === true && statusCode === 200) ProcessToast.success(message);
            else ProcessToast.error(message);
            return { status, statusCode, message, data }
        } catch(error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { status: true, statusCode: 500, message: errorMessage, data: null }
        }
    },
    
    deleteUser: async (id) => {
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

export default useUserStore;