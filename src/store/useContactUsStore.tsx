"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { ProcessToast } from "@/utils/ProcessToast";
import { ContactUsState, ResponseType, ContactUsType } from "@/types/ContactUsType";

const prefix = '/contact-us';

const useContactUsStore = create<ContactUsState>(() =>  ({
    createData: async (newData:ContactUsType) => {
        try {
            const formData = new FormData();
            Object.entries(newData).forEach(([key, value]) => formData.append(key, value as string));
            const response = await Api.post(`${prefix}`, formData);
            const { status, message } = response.data as ResponseType;
            return { status: status, message: message }
        } catch (error) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage);
        }
    }
}));
export default useContactUsStore;