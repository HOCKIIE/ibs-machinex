import { useRouter } from "next/navigation";
export interface UserType {
    id:number;
    role:string;
    name:string;
    title:string;
    contact_sale:string;
    email:string;
    phone:string;
    status:string;
    created_at:string;
    updated_at:string;
}
export interface ApiResponse {
    total: number;
    lastPage: number;
    currentPage: number;
    rows: UserType[];
}
export interface UsersFormProps {
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


export interface UserState {
    users: UserType[];
    isLoading: boolean;
    error: string | null;
    token: string | null;

    id: string;
    role: string;
    user: string;

    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; message: string | null };

    // initializeAuth: () => Promise<boolean>;
    // login: (email: string, password: string) => Promise<boolean>;
    // logout: () => Promise<void>;
    fetchUserById: (id: string) => Promise<void>;
    fetchUsers: () => Promise<void>;
    createUser: (
        newUser: UsersFormProps, 
        router: ReturnType<typeof useRouter>
    ) => Promise<void>;
    updateUser: (id: string, data: UsersFormProps, router: ReturnType<typeof useRouter>) => Promise<void>;
    onChangeStatus: (id: string, status: boolean) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;

}