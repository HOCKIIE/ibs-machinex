import { CategoryType } from "./CategoryType";
export interface BrandType {
    id: string;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    detail_th: string;
    detail_en: string;
    detail_ja: string;
    website: string;
    apiName: string;
    category?: [];
    categories: Array<CategoryType>;
    status: boolean;
    image: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
}

export interface BrandFormProps {
    id: string;
    image: File | string| null;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    detail_th: string;
    detail_en: string;
    detail_ja: string;
    website: string;
    apiName: string;
    status: boolean;
    brands?: BrandType[] | [];
    category?: Array<string> | [];
    categories: Array<{id: string;}> | [];
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    items: BrandType[];
}

export interface BrandState {
    items: BrandType[] | null;
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
    createData: (newData: BrandFormProps) => Promise<void>;
    updateData: (id: string, data: BrandFormProps) => Promise<void>;
    deleteData: (id: string) => Promise<void>;
}