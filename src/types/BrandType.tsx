import { CategoryType } from "./CategoryType";
import { ResponseDefaultType, ResponseDataType } from "./ResponseType";

export interface BrandType {
    id: number;
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
    id: number;
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
    categories: Array<{id: number;}> | [];
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
    items: BrandType[];
    id: number;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status?: boolean | null; statusCode?: number | null; message?: string | null };
    
    fetchData: (page: number) => Promise<void>;
    fetchDataById: (id: number) => Promise<void>;
    createData: ( newData: BrandFormProps ) => Promise<ResponseDataType<BrandType>>;
    updateData: (id: number, data: BrandFormProps ) => Promise<ResponseDataType<BrandType>>;
    onChangeStatus: (id: number, changeTo: boolean ) => Promise<ResponseDataType<BrandType>>;
    deleteData: (id: umber[]) => Promise<ResponseDefaultType>;
}