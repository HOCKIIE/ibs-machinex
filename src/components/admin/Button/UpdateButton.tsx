import React from 'react'
interface CreateButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
}
const UpdateButton = ({onClick, children}:CreateButtonProps) => {
  return (
    <button 
        type="submit"
        onClick={onClick ? onClick : undefined}
        className="rounded-lg py-1 px-3 text-gray-50 bg-emerald-400 hover:bg-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
    >{children}</button>
  )
}

export default UpdateButton