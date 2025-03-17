import React from 'react'


interface CancelButtonProps {
  title: string,
  onClose: () => void
}

const CancelButton: React.FC<CancelButtonProps> = ({ title,onClose }) => {
    return (
        <button 
            type="button" 
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" 
            onClick={onClose}
        >{title}</button>
    )
}

export default CancelButton