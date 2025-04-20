export interface ContactType {
    title:string;
    address:string;
    phone:string;
    mobile:string;
    email:string;
    gmap:string;
}

export type ResponseType = {
    status: boolean;
    message: string;
};
export interface ContactState {
    contact: ContactType | null;
    isLoading: boolean;
    error: string | null;
    token: string | null;

    id: string;
    role: string;
    response: { status: boolean | null; message: string | null; action:string | null; } | null;
    getData: () => void
    updateData: (data:ContactType) => void
}