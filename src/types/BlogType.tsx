import { useRouter } from "next/navigation";

export interface BlogType {
    id: string;
    image: string;
    title_th: string;
    title_en: string;
    title_jp: string;
    description_th: string;
    description_en: string;
    description_jp: string;
    detail_th: string;
    detail_en: string;
    detail_jp: string;
    status: boolean;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: BlogType[];
}

export interface BlogFormProps {
    id: string;
    title: string;
    contact_sale: string;
    role: string;
    name: string;
    phone: string;
    status: string;
    email: string;
    password?: string;
}

export interface BlogState {
    isLoading: boolean;
    error: string | null;
    token: string | null;
    id: string;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; message: string | null };

    fetchData: () => Promise<void>;
    fetchDataById: (id: string) => Promise<void>;
    createData: (
        newUser: BlogFormProps, 
        router: ReturnType<typeof useRouter>
    ) => Promise<void>;
    updateData: (id: string, data: BlogFormProps, router: ReturnType<typeof useRouter>) => Promise<void>;
    onChangeStatus: (id: string, status: boolean) => Promise<void>;
    deleteData: (id: string) => Promise<void>;

}
