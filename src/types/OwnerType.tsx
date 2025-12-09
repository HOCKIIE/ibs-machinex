export interface OwnerType {
    id: string;
    logo: string;
    email: string;
    title_th: string | null;
    title_en: string | null;
    title_ja: string | null;
    address_th: string | null;
    address_en: string | null;
    address_ja: string | null;
    phone: string;
    mobile: string;
    gmap: string;
}


export type ApiResponse = {
    status: boolean;
    message: string;
    data: OwnerType;
};

export interface OwnerState {
    item: OwnerType;
    fetchData: () => Promise<void>;
    updateData: (data: OwnerType) => Promise<void>;
}