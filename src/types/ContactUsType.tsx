export interface ContactUsType {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}
export type ResponseType = {
    status: boolean;
    message: string;
};
export interface ContactUsState {
    createData: (newData: any) => Promise<{ status: boolean; message: string } | undefined>;
}