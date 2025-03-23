export type AlertType = "success" | "warning" | "error";
export interface AlertProps {
    status: AlertType;
    message: string;
}