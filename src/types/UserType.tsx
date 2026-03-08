import { ResponseDefaultType,ResponseDataType } from "./ResponseType";

export interface UserType {
    id:number;
    role:string;
    name:string;
    title_th:string;
    title_en:string;
    title_ja:string;
    contact_sale:string;
    email:string;
    phone:string;
    status:boolean;
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
    id: number;
    title_th: string;
    title_en: string;
    title_ja: string;
    contact_sale: string;
    role: string;
    name: string;
    phone: string;
    status: boolean;
    email: string;
    password?: string;
    password_confirmation?: string;
}


export interface UserState {
    users: UserType[];
    id: string;
    role: string;
    user: string;
    total: number;
    lastPage: number;
    currentPage: number;
    response: { status: boolean | null; statusCode:number | null; message: string | null };
    fetchUserById: (id: string) => Promise<void>;
    fetchUsers: () => Promise<void>;
    createUser: ( newUser: UsersFormProps ) => Promise<ResponseDataType<UsersFormProps>>;
    updateUser: (id:string, data: UsersFormProps) => Promise<ResponseDataType<UsersFormProps>>;
    onChangeStatus: (id: string, status: boolean) => Promise<ResponseDefaultType>;
    deleteUser: (id: number[]) => Promise<ResponseDefaultType>;
}