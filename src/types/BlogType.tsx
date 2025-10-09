import { CategoryType } from "./CategoryType";
import { useRouter } from "next/navigation";

export interface BlogType {
    id: string;
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
    category?: [];
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
    categories: Array<{id: string;}>;
    pathName: string;
    recommend: string;
    published_at: string | null;
    created_at: string;
    updated_at: string | null;

    [key: `title_${string}`]: string;
    [key: `description_${string}`]: string;
    [key: `detail_${string}`]: string;
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
    createData: (newUser: BlogFormProps, router: ReturnType<typeof useRouter>) => Promise<void>;
    updateData: (id: string, data: BlogFormProps) => Promise<void>;
    onChangeStatus: (id: string, status: boolean) => Promise<void>;
    deleteData: (id: string[]) => Promise<void>;

}
