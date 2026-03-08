export interface ResponseDefaultType {
    status: boolean;
    statusCode: number;
    message: string;
}
export type ResponseDataType<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data?: T | null;
}