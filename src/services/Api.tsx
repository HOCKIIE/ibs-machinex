"use client"

import { refreshToken } from "./Auth";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
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
        const pathName = usePathname();
        console.log('path pathName',pathName);
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
          // กรณีไม่มี response (network error)
        if (!error.response) {
            console.error("Network Error:", error);
            return Promise.reject(error);
        }
        if (error.response.status === 401) {
            // && !originalRequest._retry
            console.log('debug step 1');
            if (isRefreshing) {
                console.log('debug is refreshing');
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
                failedQueue.forEach((p) => p.resolve(newToken));
                failedQueue = [];

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return Api(originalRequest);
            } catch (refreshError) {
                // isRefreshing = false;
                // const redirectTo = pathName === "/admin/signin" ? "/" : pathName;
                // router.push(redirectTo);
                
                const errorMessage = refreshError instanceof Error ? refreshError.message : String(refreshError);
                failedQueue.forEach((p) => p.reject(errorMessage));
                failedQueue = [];
                return Promise.reject(errorMessage);
            } finally {
                console.log('finally');
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
interface ApiError {
    status: number | null;
    message: string;
}

export const getApiError = (error: unknown): ApiError => {
    if (error instanceof AxiosError) {
        if (error.response) {
        // Server ตอบกลับ
        return {
            status: error.response.status,
            message: error.response.data?.message || error.message,
        };
        } else if (error.request) {
            // ส่ง request ไปแล้วแต่ไม่ได้ response
            return {
                status: 0,
                message: "No response from server",
            };
        } else {
            // Error ในการ setup request
            return {
                status: 0,
                message: error.message,
            };
        }
    } else if (error instanceof Error) {
        // general JS error
        return {
            status: 0,
            message: error.message,
        };
    } else {
        return {
            status: 0,
            message: String(error),
        };
    }
};

export default Api;
