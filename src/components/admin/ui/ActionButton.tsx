import { BiTrash } from "react-icons/bi";
import { LuPencil } from 'react-icons/lu';
import Link from "next/link";

export const EditButton = ({ href }: { href: string }) => {
    return <Link 
        title="Edit"
        type="button"
        href={href}
        className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-500 dark:hover:text-white/90">
        <LuPencil fontSize={20}/>
    </Link> 
}
export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
    return <button 
        title="Delete"
        //@ts-ignore
        onClick={onClick}
        className="p-1 rounded-md bg-red-50 text-red-300 hover:bg-red-200 hover:text-red-500 dark:bg-gray-700 dark:hover:bg-red-700 dark:hover:text-red-200">
        <BiTrash fontSize={24}/>
    </button>
}