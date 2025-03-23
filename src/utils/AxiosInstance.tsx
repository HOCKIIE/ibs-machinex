import axios from "axios";
import { getToken, setToken, refreshToken, removeToken,  } from "@/services/Auth";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

AxiosInstance.interceptors.request.use(async (config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshToken();
                const res = await axios.put(`${API_URL}/refresh`, { newToken });
                const newAccessToken = res.data.accessToken;
                setToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return AxiosInstance(originalRequest);
            } catch (err) {
                removeToken();
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string | null) => {
    if (token) {
        AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete AxiosInstance.defaults.headers.common["Authorization"];
    }
};

export default AxiosInstance;
