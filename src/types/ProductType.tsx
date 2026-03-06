import { CategoryType } from "./CategoryType";

export interface ProductType {
    id: string;
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
    image: File | string | null;
    image_alt: string;
    color: string;
    brand?: Array<number> | [];
    category?: Array<number> | [];
    price: number;
    quantity: number;
    isActive: boolean;
    categories: Array<CategoryType>;
    published_at: string;
    created_at: string;
    updated_at: string | null;
    deleted_at: string;
}
export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: ProductType[];
}

export interface ProductFormProps {
    id: string;
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
    image: File | string | null;
    image_alt: string | null;
    color: string;
    brand?: Array<number> | [];
    category?: Array<number> | [];
    price: number;
    quantity: number;
    isActive: boolean;
    categories: Array<{id: string;}>;
    published_at: string;
    created_at: string;
    updated_at: string | null;
}
export interface ProductState {
    items: ProductType[];
    id: string;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; statusCode: number | null; message: string | null };

    fetchData: (page: number) => Promise<void>;
    fetchDataById: (id: string) => Promise<void>;
    createData: (
        newData: ProductFormProps
    ) => Promise<void>;
    updateData: (id: string, data: ProductFormProps) => Promise<void>;
    onChangeStatus: (id: string, status: boolean) => Promise<void>;
    deleteData: (id: string) => Promise<void>;

}