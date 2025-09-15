export interface ContactUsType {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    source: string;
}
export type ResponseType = {
    status: boolean;
    message: string;
    data: ContactUsType
};
export interface ContactUsState {
    createData: (newData: ContactUsType) => Promise<{ status: boolean; message: string } | undefined>;
}