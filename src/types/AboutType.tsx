export interface AboutType {
    detail_th:string;
    detail_en:string;
    detail_ja:string;
}

export interface AboutState {
    
    about: AboutType | null;
    error: string | null;
    token: string | null;
    id: string;
    role: string;

    response: { status: boolean | null; message: string | null; action:string | null; } | null;
    getData: () => Promise<void>;
    updateData: ( data: AboutType ) => Promise<void>;
}