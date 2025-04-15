export interface ConfirmModalProps {
    isOpen? : boolean;
    action? : string;
    onClose: () => void;
    toggleModal : () => void;
    onAfterClose?: () => void;
    data : {
        confirm?: () => void;
        progress?:  boolean;
        successProgress?: () => void;
        response: { status: boolean | null, message: string | null };
        error?: string | null;
    }
}