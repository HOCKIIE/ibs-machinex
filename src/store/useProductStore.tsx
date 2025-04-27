import Api from "@/services/Api";
import { create } from "zustand";
import toast from "react-hot-toast";
import { ProductState } from "@/types/ProductType";

const useProductStore = create<ProductState>((set) => {
    let errorMessage = "Something went wrong.";
    return {
        items: [],
        isLoading: false,
        error: null,
        total: 0,
        lastPage: 0,
        currPage: 1,

        fetchData: async() => {
            try{
                const response = await Api.get('/product');
                set((state) => ({
                    ...state,
                    items: [response.data],
                    isLoading: false,
                }));
            } catch(error: unknown) {
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === "string") {
                    errorMessage = error;
                }
                set({ error: errorMessage, isLoading: false });
                toast.error(`${errorMessage}`, { duration: 2000 });
            }
        },

        fetchItemById: async (id) => {
            set({ isLoading: true, error: null });
            try {
                const response = await Api.get(`produc/${id}`);
                set((state) => ({
                    ...state,
                    items: [response.data],
                    isLoading: false,
                }));
            } catch (error: unknown) {
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === "string") {
                    errorMessage = error;
                }
                set({ error: errorMessage, isLoading: false });
                toast.error(`${errorMessage}`, { duration: 2000 });
            }
          },

        createData: async (data) => {
            const formData = new FormData();
            formData.append("title", data.title_en);
            formData.append("link", data.link);
            if (data.image) {
                formData.append("image", data.image);
            }
            formData.append("image_alt", data.image_alt);
            set({ isLoading: true, error: null });
    
            try {
                const response = await Api.post('/product', formData);
                set((state) => ({
                    items: [...state.items, response.data], isLoading: false,
                }));
                toast.error(`Success, The product was created successfully!`, { duration: 2000 });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === "string") {
                    errorMessage = error;
                }
                set({ error: errorMessage, isLoading: false });
                toast.error(`${errorMessage}`, { duration: 2000 });
            }
        },
    

        updateData: async (id, data) => {
            set({ isLoading: true, error: null });
            try {
                const response = await Api.put(`/product/${id}`,data);
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? response.data : item
                    ),
                    isLoading: false,
                }));
                toast.success(`Success, The User was updated successfully!`, { duration: 2000 });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === "string") {
                    errorMessage = error;
                }
                set({ error: errorMessage, isLoading: false });
                toast.success(`Fail, ${errorMessage}`, { duration: 2000 });
            }
        },

        deleteData: async (id) => {
            set({ isLoading: true, error: null });
            try {
                await Api.delete(`/product/${id}`);
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                    isLoading: false,
                }));
                toast.success(`Success, The product was deleted successfully!`, { duration: 2000 });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === "string") {
                    errorMessage = error;
                }
                set({ error: errorMessage, isLoading: false });
                toast.error(`${errorMessage}`, { duration: 2000 });
            }
        }
    }
});
export default useProductStore;