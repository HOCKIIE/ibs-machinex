import Api from "./Api";
import toast from "react-hot-toast";

interface Blog {
    id: number;
    title_th: string;
    title_en: string;
    description_th: string;
    description_en: string;
    detail_th: string;
    detail_en: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    // Add other fields as necessary
}

export const getBlog = async({keyword, skip, limit}: { keyword: string; skip: number; limit:number }) => {
    try{
        const request = await Api.get(`/blog?limit=${limit}&skip=${skip}&keyword=${keyword}`);
        const response = request.data;
        return response;
    } catch(error) {
        toast.error(`${error}`, { duration: 2000 });
    }
}

export const getBlogId = async(id: number): Promise<Blog | undefined> => {
    try{
        const request = await Api.get(`/blog/${id}`);
        const response: Blog = request.data;
        return response;
    } catch(error: unknown) {
        toast.error(`${error}`, { duration: 2000 });
    }
}

export const storeBlog = async() => {
    try{
        const request = await Api.post(`/blog/store`);
        const response: Blog = request.data;
        return response;
    } catch(error) {
        toast.error(`${error}`, { duration: 2000 });
    }

}

export const deleteBlog = async() => {
    try{

    } catch(error) {
        toast.error(`${error}`, { duration: 2000 });
    }
}