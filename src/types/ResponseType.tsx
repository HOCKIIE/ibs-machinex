export interface ResponseDefaultType {
    status: boolean;
    statusCode: number;
    message: string;
}
export type ResponseDataType<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    errors?: string[];
    data?: T | null;
}