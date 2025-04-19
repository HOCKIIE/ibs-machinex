export interface ContactType {
    id:string;
    title:string;
    address:string;
    phone:string;
    mobile:string;
    email:string;
    gmap:string;
    created_at:string;
    updated_at:string;
}

export interface ApiResponse {
    id:string;
    title:string;
    address:string;
    phone:string;
    mobile:string;
    email:string;
    gmap:string;
}

export interface ContactState {
    contact: ContactType | null;
    isLoading: boolean;
    error: string | null;
    token: string | null;

    id: string;
    role: string;
    response: { status: boolean | null; message: string | null };
    fetchContact: () => void
}