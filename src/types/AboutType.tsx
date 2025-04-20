export interface AboutType {
    id:string;
    detail_th:string;
    detail_en:string;
    detail_jp:string;

    created_at:string;
    updated_at:string;
}

export interface ApiResponse {
    id:string;
    detail_th:string;
    detail_en:string;
    detail_jp:string;
}

export interface AboutState {

    about: AboutType[];
    isLoading: boolean;
    error: string | null;
    token: string | null;
    id: string;
    role: string;

    fetchData: () => Promise<void>;
    updateData : (id: string, data: AboutType, router: any) => Promise<void>;

}