import { ResponseDataType, ResponseDefaultType } from "./ResponseType";
export interface ContactType {
    id: number;
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
    [key: `title_${string}`]: string;
    [key: `address_${string}`]: string;
}

export interface contactUsType {
    id: number;
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
    id: number;
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
    id: number;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; statusCode: number | null; message: string | null };

    fetchData: (page?: number) => Promise<void>;
    updateData: (id:number, data: ContactType) => Promise<ResponseDataType<ContactType>>;
    deleteData: (id: number[] ) => Promise<ResponseDefaultType>;
}