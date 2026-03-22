
import axios, { AxiosError } from "axios";

// interface FailedRequest<T> {
//     resolve: (value: T | PromiseLike<T>) => void;
//     reject: (reason?: string) => void;
// }
interface FailedRequest {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}

let isRefreshing = false;

let failedQueue: FailedRequest[] = [];

const API_URL = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PROD;
const Api = axios.create({baseURL:`${API_URL}/api`, withCredentials: true});
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

const processQueue = () => {
    failedQueue.forEach((p) => p.resolve());
    failedQueue = [];
};

Api.interceptors.request.use((config) => { 
    if (!isPublicRoute(config.url)) {
    } 
    return config; 
},(error) => { 
    return Promise.reject(error); 
});

Api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { status } = error;
        const originalRequest = error.config;
        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                Api(originalRequest);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            await Api.put("/refresh");
            processQueue();
            return Api(originalRequest);
        } catch (err) {
            window.location.href = "/admin/signin";
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
)

interface ApiError {
    status: number | null;
    message: string;
}

export const getApiError = (error: unknown): ApiError => {
    if (error instanceof AxiosError) {
        if (error.response) {
        return {
            status: error.response.status,
            message: error.response.data?.message || error.message,
        };
        } else if (error.request) {
            return {
                status: 0,
                message: "No response from server",
            };
        } else {
            return {
                status: 0,
                message: error.message,
            };
        }
    } else if (error instanceof Error) {
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
