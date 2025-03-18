import axios from "axios";
import { getToken } from "./Auth";

const Api = axios.create({baseURL:"http://localhost:8000/api"});

Api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
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
