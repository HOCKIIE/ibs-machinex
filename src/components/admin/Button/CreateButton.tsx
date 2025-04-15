import React from 'react'
interface CreateButtonProps {
    type?: "submit" | "reset" | "button";
    onClick?: () => void;
    children: React.ReactNode;
}
const CreateButton = ({type, onClick, children}: CreateButtonProps) => {
  return (
    <button 
        type={type?`${type}`:`button`}
        onClick={onClick ? onClick : undefined}
        className="rounded-lg py-1 px-3 text-gray-50 bg-indigo-400 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    >{children}</button>
  )
}

export default CreateButton