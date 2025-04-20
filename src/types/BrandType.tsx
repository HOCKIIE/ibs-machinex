export interface BrandType {
    id: string;
    name: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    id: string;
    name: string;
    image: string;
}

export interface BrandState {
    brands: BrandType[];
    isLoading: boolean;
    error: string | null;
    token: string | null;
    id: string;
    role: string;
    user: string;
    response: {
        status: number | null;
        message: string | null;
    };
    fetchData: () => Promise<void>;
    createData: (data: BrandType, router: any) => Promise<void>;
    updateData: (id: string, data: BrandType, router: any) => Promise<void>;
    deleteData: (id: string, router: any) => Promise<void>;
}