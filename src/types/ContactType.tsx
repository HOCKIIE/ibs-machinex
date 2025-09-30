export interface ContactType {
    id: string;
    title_th: string;
    title_en: string;
    title_ja: string;
    address_th: string;
    address_en: string;
    address_ja: string;
    phone: string;
    mobile: string;
    email: string;
    gmap: string;
}

export interface contactUsType {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    message: string;
    source: string;
    created_at: string;
}

export type ResponseType = {
    status: boolean;
    message: string;
};

export interface ContactUsProps {
    id: string;
    first_name: string;
    last_name: string;
    message: string;
    source: string;
}

export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: ContactType[];
}
export interface ContactState {
    items: ContactType[];
    id: string;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; statusCode: number | null; message: string | null };

    fetchData: (page?: number) => Promise<void>;
    updateData: (data: ContactType) => Promise<void>;
    deleteData: (id: string) => Promise<void>;
}