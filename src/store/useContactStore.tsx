"use client";
import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { ContactState, ContactType } from "@/types/ContactType";

const apiPrefix = '/contact';
const prefix = '/admin/contact';

const useContactStore = create<ContactState>((set) => ({
    contact: null,
    isLoading: false,
    response:{ status: null, message: null, action:null},
    error: null,
    token: null,
    role: "",
    user: "",
    id: "",
    
    getData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.get<ContactType>(apiPrefix);
            set({
                contact: response.data,
                isLoading: false,
            });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    },
    deleteData: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await Api.delete(`${apiPrefix}/delete/${id}`);
            set({
                isLoading: false,
                response: {
                    action: "delete",
                    status : response.data.status,
                    message : response.data.message,
                }
            });
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            toast.error(errorMessage);
        }
    }

}));

export default useContactStore;