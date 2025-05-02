import React from 'react'

interface ButtonProps {
    title?:string;
    setEdit: () => void;
}
interface SaveButtonProps {
    title?:string;
    saveChange: () => void;
}

export const EditButton = ({title,setEdit}: ButtonProps) => {
    return <button 
        onClick={setEdit} 
        className="rounded-md px-5 py-2 min-w-30 max-w-35 dark:text-black bg-amber-200 border border-amber-300 hover:bg-amber-300 focus:ring focus:ring-amber-500/20"
    >{title?`${title}`:`Edit`}</button>;
};

export const CancelButton = ({title,setEdit}: ButtonProps) => {
    return <button 
        onClick={setEdit}
        className="rounded-md px-5 py-2 min-w-30 max-w-35 dark:text-gray-400 bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring focus:ring-gray-500/20"
    >{title?`${title}`:`Cancel`}</button>
}

export const SaveButton = ({title,saveChange}: SaveButtonProps) => {
    return <button 
        onClick={saveChange}
        className="rounded-md px-5 py-2 dark:text-black min-w-30 max-w-35 bg-emerald-300 border border-emerald-400 hover:bg-emerald-400 focus:ring focus:ring-green-500/20"
    >{title?`${title}`:`Save`}</button>;
}

interface DeleteButtonProps {
    type?:string;
}
export const DeleteButton = ({type}:DeleteButtonProps) => {
    if(type === 'ios'){
        return <button 
            type="button" 
            title="Delete"
            className="w-5 h-5 overflow-hidden rounded-full bg-red-500 border border-red-400 hover:bg-red-600 focus:ring focus:ring-red-500/20"
        >
            <span className="hidden">Delete</span>
        </button>;
    }
}