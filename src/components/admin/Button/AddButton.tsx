import React from 'react';
import { AiOutlinePlusCircle } from "react-icons/ai";

interface AddButtonProps {
  title: string;
  onCreate: () => void;
}
const AddButton: React.FC<AddButtonProps> = ({title,onCreate}) => {
  return (
    <button 
        type="button" 
        title={title}
        onClick={onCreate}
        className="flex items-center gap-2 bg-gray-700 text-gray-100 dark:bg-gray-400 dark:text-gray-800 py-1 px-4 rounded-lg"
    ><AiOutlinePlusCircle /> {title}
    </button>
  )
}

export default AddButton