import React from 'react';
import { AiOutlinePlusCircle } from "react-icons/ai";

interface AddButtonProps {
  title: string;
  onCreate?: () => void;
}
const AddButton: React.FC<AddButtonProps> = ({title,onCreate}) => {
  return (
    <button 
        type="button" 
        title={title}
        onClick={onCreate}
        className="flex items-center gap-2 bg-indigo-400 text-gray-100 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-gray-300 py-1 px-4 rounded-lg transition-all ease-in-out"
    ><AiOutlinePlusCircle /> {title}
    </button>
  )
}

export default AddButton