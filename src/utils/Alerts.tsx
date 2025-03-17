"use client"
import React from 'react';
import { IoInformationCircleSharp } from "react-icons/io5";
type IconType = 'success'|'error'|'info'|'warning';
interface AlertProps { status:IconType;  message:string }

const Alerts: React.FC<AlertProps> = ({ status, message }) => 
{
    const classes: Record<IconType, string> = {
        success: "text-green-800 bg-green-100 dark:bg-gray-800 dark:text-green-400",
        error: "text-red-800 bg-red-100 dark:bg-gray-800 dark:text-red-400",
        info: "text-blue-800 bg-blue-100 dark:bg-gray-800 dark:text-blue-400",
        warning: "text-yellow-800 bg-yellow-100 dark:bg-gray-800 dark:text-yellow-300",
    };
    return (
        <div
            className={`flex items-center p-4 mb-4 text-sm rounded-lg ${classes[status]}`}
            role="alert"
        >
            <IoInformationCircleSharp className="mr-2" />
            <span className="sr-only">Info</span>
            <div className="ms-3 text-sm font-medium">{message}</div>
        </div>
    )
};

export default Alerts;

