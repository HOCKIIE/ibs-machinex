"use client";

import Api from "@/services/Api";
import { create } from "zustand";
import { ProcessToast } from "@/utils/ProcessToast";

const apiPrefix = '/admin/settings';

type IntroVideoState = {
    response: { status: null, statusCode: number|null, message: null, path: string|null };
    videoUrl: string | null;   // วิดีโอเดิม
    videoFile: File | null;    // วิดีโอใหม่
    setVideoUrl: (url: string | null) => void;
    setVideoFile: (file: File | null) => void;
    resetToOld: () => void;
    updateData: (video: File) => Promise<void>;
};

export const useIntroVideoStore = create<IntroVideoState>((set) => ({
    response: { status: null , statusCode: null, message: null, path:null },
    videoUrl: null,
    videoFile: null,
    setVideoUrl: (url) => set({ videoUrl: url }),
    setVideoFile: (file) => set({ videoFile: file }),
    resetToOld: () => set({videoFile: null}),

    updateData: async (video : File) => {
        set({ response: { status : null, statusCode:null, message : null, path:null } });
        try {
            ProcessToast.show('Saving data...');
            const formData = new FormData();
            formData.append('_method','PUT')
            formData.append('video', video);
            const response = await Api.post(`${apiPrefix}/video-effect`,formData, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
            });
            const { status, message, path  } = response.data as { status: boolean; message: string; path: string; };
            if (status) { 
                setTimeout(async()=>{
                    set({ videoUrl: path});
                    set({ videoFile: null});
                    await ProcessToast.success(message);
                },500);
            } else {
                await ProcessToast.error(message);
            }
            ProcessToast.success(response.data.message,2000)
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response;
            const errorMessage = response?.data?.message || "An unknown error occurred";
            ProcessToast.error(errorMessage,2000);
        }
    }

}));