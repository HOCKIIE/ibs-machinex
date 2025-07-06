import { useRouter } from "next/navigation";
import { CategoryType } from "./CategoryType";
export interface BrandType {
    id: string;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    category?: [];
    categories: Array<CategoryType>;
    status: boolean;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface BrandFormProps {
    id: string;
    image: File | null;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    status: boolean;
    brands: BrandType[];
    category?: Array<string>;
    categories: Array<{id: string;}>;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    id: string;
    name: string;
    image: string;
}

export interface BrandState {
    items: BrandType[];
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
        newData: BrandFormProps, 
        router: ReturnType<typeof useRouter>
    ) => Promise<void>;
    updateData: (id: string, data: BrandFormProps, router: ReturnType<typeof useRouter>) => Promise<void>;
    deleteData: (id: string) => Promise<void>;
}