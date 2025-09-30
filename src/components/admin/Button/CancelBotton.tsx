import React from 'react'

interface CancelButtonProps {
    onClick: () => void,
    children: React.ReactNode
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick,children }) => {
    return (
        <button 
            type="button" 
            className="px-4 py-2 rounded-md text-gray-400 bg-gray-100 hover:text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" 
            onClick={onClick}
        >{children}</button>
    )
}

export default CancelButton