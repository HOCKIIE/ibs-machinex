import React from 'react';
import { AiOutlinePlusCircle } from "react-icons/ai";
import Link from 'next/link';

interface AddButtonProps {
  title: string;
  href: string;
  onCreate?: () => void;
}
const AddButton: React.FC<AddButtonProps> = ({title,href,onCreate}) => {
  return (
    <Link 
        href={href} 
        title={title}
        onClick={onCreate}
        className="flex items-center gap-2 bg-indigo-400 text-gray-100 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-gray-300 py-1 px-4 rounded-lg transition-all ease-in-out"
    ><AiOutlinePlusCircle /> {title}
    </Link>
  )
}

export default AddButton