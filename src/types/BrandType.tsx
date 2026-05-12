import { Descendant } from "slate"
import { CategoryType } from "./CategoryType";
import { ResponseDefaultType, ResponseDataType } from "./ResponseType";

export interface BrandType {
    id: number;
    draftId: string;
    userId?: string;
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
    banner: string;
    is_iframe: boolean;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    [key: `title_${string}`]: string;
    [key: `detail_${string}`]: string;
    [key: `descendant_${string}`]: Descendant[];
    [key: `description_${string}`]: string;
}

export interface BrandFormProps {
    id: number;
    draftId: string;
    userId?: string;
    image: File | string| null;
    current: string | null;
    banner: File | string| null;
    currentBanner: string | null;
    [key: `title_${string}`]: string;
    [key: `detail_${string}`]: string;
    [key: `descendant_${string}`]: Descendant[];
    [key: `description_${string}`]: string;
    website: string;
    apiName: string;
    status: boolean;
    brands?: BrandType[] | [];
    category?: Array<string> | [];
    categories: Array<{id: number;}> | [];
    is_iframe: boolean;
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
    onChangeStatus: (id: number, changeTo: boolean ) => Promise<ResponseDefaultType>;
    deleteData: (id: number[]) => Promise<ResponseDefaultType>;
}