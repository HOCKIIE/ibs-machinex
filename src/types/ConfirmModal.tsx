export interface ConfirmModalProps {
    isOpen? : boolean;
    action? : string;
    onClose: () => void;
    onAfterClose?: () => void;
    closeModal: () => void;
    toggleModal?: () => void;
    data : {
        confirm?: () => void;
        progress?:  boolean;
        successProgress?: () => void;
        response: { status: boolean | null, message: string | null };
        error?: string | null;
    }
}