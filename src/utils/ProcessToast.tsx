import toast from "react-hot-toast";

export const ProcessToast = {
    show: (message: string = "กำลังดำเนินการ...") => {
        toast.loading(message, {
            id: "process-toast",
            position:'top-center',
            style: {
                color: "#3730a3",
                borderRadius: "8px",
                padding: "10px 16px",
                background: "#e0e7ff",
                border:"1px solid #a5b4fc"
            },
        });
    },
    success: (message: string = "สำเร็จ!", delay: number = 1500) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                toast.success(message, {
                    id: "process-toast",
                    position: 'top-center',
                    style: {
                        color: "#047857", // emerald-700
                        borderRadius: "8px",
                        padding: "10px 16px",
                        background: "#d1fae5", // emerald-100
                        border: "1px solid #6ee7b7" // emerald-300
                    },
                });
                resolve();
            }, delay);
        });
    },
    error: (message: string = "เกิดข้อผิดพลาด", delay: number = 1500) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                toast.error(message, {
                    id: "process-toast",
                    position:'top-center',
                    style: {
                        color: "#991b1b",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        background: "#fecaca",
                        border:"1px solid #fca5a5"
                    },
                });
                resolve();
            },delay);
        });
    },
};
