import axios from "axios";
const API_URL = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PROD;

const AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

// AxiosInstance.interceptors.response.use(res => res,
//     async err => {
//         if (err.response?.status === 401) {
//             try {
//                 await AxiosInstance.post("/refresh");
//                 return AxiosInstance(err.config); // retry request
//             } catch (refreshErr) {
//                 window.location.href = "/admin/signin";
//                 return Promise.reject(refreshErr);
//             }
//         }
//         return Promise.reject(err);
//     }
// );

// export const setAuthToken = (token: string | null) => {
//     if (token) {
//         AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//         delete AxiosInstance.defaults.headers.common["Authorization"];
//     }
// };

export default AxiosInstance;
