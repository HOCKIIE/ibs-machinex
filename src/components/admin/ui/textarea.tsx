import React from 'react'

export const Textarea = ({
    value,onChange, className
}:{
    value:string; onChange: (e:React.ChangeEvent<HTMLTextAreaElement>) => void; className: string
}) => {
    return (
        <div className="flex">
            <textarea className={className} defaultValue={value} onChange={onChange}></textarea>
        </div>
    )
}
