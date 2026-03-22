import { Descendant } from "slate"
import { CategoryType } from "./CategoryType";
import { ResponseDefaultType, ResponseDataType } from "./ResponseType";

export interface BlogType {
    id: number;
    draftId?: string;
    userId?: string;
    status: boolean;
    category?: string[];
    categories: Array<CategoryType>;
    pathName: string;
    recommend: string;
    published_at: string | null;
    created_at: string;
    updated_at: string | null;

    [key: `image_${string}`]: File | string | null;
    [key: `title_${string}`]: string;
    [key: `detail_${string}`]: string;
    [key: `descendant_${string}`]: Descendant[];
    [key: `description_${string}`]: string;
    
}

export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: BlogType[];
}

type Locale = 'th' | 'en' | 'ja';
export interface BlogFormProps {
    id: number;
    draftId?: string;
    userId?: string;
    [key: `image_${string}`]: File | string | null;
    [key: `title_${string}`]: string;
    [key: `detail_${string}`]: string;
    [key: `descendant_${string}`]: Descendant[];
    [key: `description_${string}`]: string;
    status: boolean;
    category?: Array<string>;
    categories?: Array<CategoryType>;
    pathName: string;
    recommend: string;
    published_at: string | null;
    created_at: string;
    updated_at: string | null;


}

export interface BlogState {
    items: BlogType[];

    id: number;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status?: boolean | null; statusCode?: number | null; message?: string | null };

    fetchData: (page: number) => Promise<void>;
    fetchDataById: (id: number) => Promise<void>;
    createData: ( data: BlogFormProps) => Promise<ResponseDataType<BlogFormProps>>;
    updateData: (id: number, data: BlogFormProps) => Promise<ResponseDataType<BlogFormProps>>;
    onChangeStatus: (id: number, changeTo: boolean) => Promise<ResponseDefaultType>;
    deleteData: (id: number[]) => Promise<ResponseDefaultType>;

}
