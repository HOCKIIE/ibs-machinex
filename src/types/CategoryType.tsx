export interface CategoryType {
    id: number;
    image: string;
    title_th: string;
    title_en: string;
    title_jp: string;
    description_th: string;
    description_en: string;
    description_jp: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ApiResponse {
    id: number;
    image: string;
    title_th: string;
    title_en: string;
    title_jp: string;
    description_th: string;
    description_en: string;
    description_jp: string;
}