import { useRouter } from "next/navigation";
import { CategoryType } from "./CategoryType";

export interface ProductType {
    id: number;
    title_th: string;
    title_en: string;
    title_ja: string;
    thumbnail: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    detail_th: string,
    detail_en: string,
    detail_ja: string,
    image: string;
    image_alt: string;
    color: string;
    brand: string;
    category: string;
    price: number;
    isActive: boolean;
    categories: Array<CategoryType>;
    published_at: string;
    created_at: string;
    updated_at: string;
}
export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: ProductType[];
}

export interface propductFormProps {
    id: number;
    title_th: string;
    title_en: string;
    title_ja: string;
    thumbnail: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    detail_th: string,
    detail_en: string,
    detail_ja: string,
    image: string;
    image_alt: string;
    color: string;
    brand: string;
    category: string;
    price: number;
    isActive: boolean;
    categories: Array<{id: string;}>;
    published_at: string;
    created_at: string;
    updated_at: string;
}
export interface ProductState {
    items: ProductType[];
    isLoading: boolean;
    error: string | null;
    token: string | null;

    id: string;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; message: string | null };

    fetchData: (page: number) => Promise<void>;
    fetchDataById: (id: string) => Promise<void>;
    createData: (
        newUser: propductFormProps, 
        router: ReturnType<typeof useRouter>
    ) => Promise<void>;
    updateData: (id: string, data: propductFormProps, router: ReturnType<typeof useRouter>) => Promise<void>;
    onChangeStatus: (id: string, status: boolean) => Promise<void>;
    deleteData: (id: string) => Promise<void>;

  
}