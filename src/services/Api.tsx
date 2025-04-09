import axios from "axios";
import { getToken } from "./Auth";

const Api = axios.create({baseURL:"http://localhost:8000/api"});

const publicRoutes = [
    "/category/*",
    "/products/*", 
    "/blog/*" ,
    "/about/*",
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
    const token = getToken();
    if (!isPublicRoute(config.url) && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error) => {
    return Promise.reject(error);
});

Api.interceptors.response.use((response) => 
    response,
    async (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("token"); 
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default Api;
