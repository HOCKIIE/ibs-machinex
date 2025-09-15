"use client"

import { refreshToken } from "./Auth";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter, usePathname } from "next/navigation";

interface FailedRequest<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: string) => void;
}
let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: FailedRequest<string>[] = [];


export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";
const Api = axios.create({baseURL:`${API_URL}/api`});

const publicRoutes = [
    "/categories/*",
    "/products/*", 
    "/blogs/*"
];
const isPublicRoute = (url: string | undefined): boolean => {
    if (!url) return false;

    return publicRoutes.some(route => {
        if (route.endsWith("/*")) {
            const base = route.replace("/*", "");
            return url.startsWith(base);
        }
        return url === route;
    });
};

Api.interceptors.request.use((config) => {
    if (!isPublicRoute(config.url) && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},(error) => {
    return Promise.reject(error);
});

Api.interceptors.response.use((response) => 
    response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
          // กรณีไม่มี response (network error)
        if (!error.response) {
            console.error("Network Error:", error);
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            // window.location.href = "/admin/signin";
            console.log('debug step 1');
            if (isRefreshing) {
                console.log('debug is refreshing');
                // รอให้ token ใหม่เสร็จก่อนค่อยส่ง request เดิม
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return Api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {

                const newToken = await refreshToken();
                const pathName = usePathname();
                const router = useRouter();
                console.log('debug refreshToken',newToken);
                if (newToken === null) {
                    const redirectTo = pathName === "/admin/signin" ? "/" : pathName;
                    router.push(redirectTo);
                    return;
                }
                setAccessToken(newToken);

                // ปลุก request ที่รออยู่
                failedQueue.forEach((p) => p.resolve(newToken));
                failedQueue = [];

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return Api(originalRequest);
            } catch (refreshError) {
                failedQueue.forEach((p) => p.reject(refreshError));
                failedQueue = [];
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default Api;
