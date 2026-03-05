import { CategoryType } from "./CategoryType";

export interface BlogType {
    id: string;
    draftId?: string;
    userId?: string;
    image: string;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    detail_th: string;
    detail_en: string;
    detail_ja: string;
    status: boolean;
    category?: Array<string>;
    categories: Array<CategoryType>;
    pathName: string;
    recommend: string;
    published_at: string | null;
    created_at: string;
    updated_at: string | null;
    
    [key: `title_${string}`]: string;
    [key: `description_${string}`]: string;
    [key: `detail_${string}`]: string;
}

export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: BlogType[];
}

export interface BlogFormProps {
    id: string;
    draftId?: string;
    userId?: string;
    image: File | string | null;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    detail_th: string;
    detail_en: string;
    detail_ja: string;
    status: boolean;
    category?: Array<string>;
    categories?: Array<{id?: string;}>;
    pathName: string;
    recommend: string;
    published_at: string | null;
    created_at: string;
    updated_at: string | null;

    [key: `title_${string}`]: string;
    [key: `description_${string}`]: string;
    [key: `detail_${string}`]: string;
}

type ResponseData<T> = {
    status: boolean;
    message: string;
    data: T | null;
}


export interface BlogState {
    items: BlogType[];

    id: string;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status?: boolean | null; statusCode?: number | null; message?: string | null };

    fetchData: (page: number) => Promise<void>;
    fetchDataById: (id: string) => Promise<void>;
    createData: ( data: BlogFormProps) => Promise<ResponseData<BlogFormProps>>;
    updateData: (id: string, data: BlogFormProps) => Promise<ResponseData<BlogFormProps>>;
    onChangeStatus: (id: string, status: boolean) => Promise<void>;
    deleteData: (id: string[]) => Promise<void>;

}
