import { BrandType } from "./BrandType";
import { ResponseDefaultType, ResponseDataType } from "./ResponseType";

export interface CategoryType {
    id: number;
    image: string;
    current: string | null;
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
    id: number;
    image: File | string | null;
    current: string | null;
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
    id: number;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status?: boolean | null; statusCode?: number | null; message?: string | null };

    fetchData: (page: number) => Promise<void>;
    fetchDataById: (id: number) => Promise<void>;
    createData: ( newData: CategoryFormProps ) => Promise<ResponseDataType<CategoryType>>;
    updateData: (id: number, data: CategoryFormProps ) => Promise<ResponseDataType<CategoryType>>;
    onChangeStatus: (id: number, changeTo: boolean ) => Promise<ResponseDataType<CategoryType>>;
    deleteData: (id: number[]) => Promise<ResponseDefaultType>;

}