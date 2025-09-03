import { useRouter } from "next/navigation";

export interface OwnerType {
    id: string;
    logo: string;
    email: string;
    title_th: string;
    title_en: string;
    title_ja: string;
    address_th: string;
    address_en: string;
    address_ja: string;
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