"use client"
import React from 'react';
import { IoClose, IoCheckmarkCircle, IoWarning, IoAlertCircle } from "react-icons/io5";

type AlertType = "success" | "warning" | "error";

interface AlertProps {
    status: AlertType;
    message: string;
}

const alertStyles: Record<AlertType, string> = {
    success: "text-green-800 bg-green-100 border-green-400 dark:text-green-400 dark:bg-green-950 dark:border-green-700",
    warning: "text-yellow-800 bg-yellow-100 border-yellow-400 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-700",
    error: "text-red-600 bg-red-100 border-red-400 dark:text-red-400 dark:bg-red-950 dark:border-red-700",
};

const alertIcons: Record<AlertType, JSX.Element> = {
    success: <IoCheckmarkCircle className="text-green-600 dark:text-green-400" size={24} />,
    warning: <IoWarning className="text-yellow-600 dark:text-yellow-400" size={24} />,
    error: <IoAlertCircle className="text-red-600 dark:text-red-400" size={24} />,
};

const Alert: React.FC<AlertProps> = ({ status, message }) => 
{
    const [isVisible, setIsVisible] = React.useState(true);

    // React.useEffect(() => {
    //   const timer = setTimeout(() => setIsVisible(false), 5000);
    //   return () => clearTimeout(timer);
    // }, []);
  
    if (!isVisible) return null;

    return (
        <div className={`flex items-center justify-between p-4 mb-4 border rounded-lg ${alertStyles[status]}`} role="alert">
            <div className="flex items-center gap-2">
                {alertIcons[status]}
                <span>{message}</span>
            </div>
            <button title="Close" onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                <IoClose size={20} />
            </button>
        </div>
    );
};

export default Alert;