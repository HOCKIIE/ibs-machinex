import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete AxiosInstance.defaults.headers.common["Authorization"];
    }
};

export default AxiosInstance;
