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
    brands?: Array<BrandType>;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    published_at: string | null;
    [key: `title_${string}`]: string;
    [key: `description_${string}`]: string;
}

export interface CategoryFormProps {
    id: string;
    image: File | string | null;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    status: boolean;
    brands: BrandType[];
    created_at: string;
    updated_at: string;
    published_at: string | null;
    [key: `title_${string}`]: string;
    [key: `description_${string}`]: string;
}

export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: CategoryType[];
}

export interface CategoryState {
    items: CategoryType[];
    id: string;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; statusCode: number | null; message: string | null };

    fetchData: (page: number) => Promise<void>;
    fetchDataById: (id: string) => Promise<void>;
    createData: ( newData: CategoryFormProps ) => Promise<void>;
    updateData: (id: string, data: CategoryFormProps ) => Promise<void>;
    deleteData: (id: Array<number>) => Promise<void>;

}