import React from 'react'

export const Button = ({
    variant,
    onClick,
    children
}:{
    variant?: string;
    onClick?: () => void;
    children:string
}) => {
    const className =  variant == 'success' ? 'px-4 py-2 rounded-lg bg-green-300 text-gray-800 hover:bg-green-400'
    : variant == 'danger' ? 'px-4 py-2 rounded-lg bg-red-300 text-white hover:bg-red-400'
    : 'px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-300';
    return <button type="button" onClick={onClick} className={className}>{children}</button>;
}