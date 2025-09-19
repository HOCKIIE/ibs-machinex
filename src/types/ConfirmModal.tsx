export interface ConfirmModalProps {
    isOpen? : boolean;
    action? : string;
    onClose?: () => void;
    onAfterClose?: () => void;
    closeModal: () => void;
    toggleModal?: () => void;
    data : {
        confirm: () => Promise<void>;
        progress?:  boolean;
        successProgress?: () => void;
        response: { status: boolean | null, statusCode: number | null, message: string | null };
        error?: string | null;
    }
}