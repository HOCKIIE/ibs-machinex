import { useRouter } from "next/navigation";
import { BrandType } from "./BrandType";

export interface CategoryType {
    id: string;
    image: string;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    brands?: [];
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface CategoryFormProps {
    id: string;
    image: File | null;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_jp: string;
    status: boolean;
    brands: BrandType[];
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: CategoryType[];
}

export interface CategoryState {
    items: CategoryType[];
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
        newData: CategoryFormProps, 
        router: ReturnType<typeof useRouter>
    ) => Promise<void>;
    updateData: (id: string, data: CategoryFormProps, router: ReturnType<typeof useRouter>) => Promise<void>;
    deleteData: (id: string) => Promise<void>;

}