"use client"
import React, { useEffect, useState } from 'react'

const Badge = ({
    title,
    type,
    className,
    custom
}:{
    title: string;
    type?: string;
    className?: string;
    custom?: boolean
}) => {
    const defaultClass: string = 'p-[3px] rounded-md bg-indigo-400 text-white text-[11px]';
    const [badge, setBadge] = useState<string|''>('');
    useEffect(()=> {
        switch (type) {
            case 'primary': setBadge(defaultClass); break;
            case 'success': setBadge(defaultClass.replace('bg-indigo-400','bg-emerald-300')); break;
            case 'danger': setBadge(defaultClass.replace('bg-indigo-400','bg-red-300')); break;
            case 'warning': setBadge(defaultClass.replace('bg-indigo-400','bg-amber-300')); break;
            case 'blue': setBadge(defaultClass.replace('bg-indigo-400','bg-emerald-300')); break;
            case 'sky': setBadge(defaultClass.replace('bg-indigo-400','bg-sky-300')); break;
            case 'cyan': setBadge(defaultClass.replace('bg-indigo-400','bg-cyan-300')); break;
            case 'pink': setBadge(defaultClass.replace('bg-indigo-400','bg-pink-300')); break;
            default: setBadge(defaultClass); break;
        }
    },[]);
    useEffect(()=>{
        if(custom === true){
            setBadge(className ?? defaultClass)
        }
    },[])
    return <span className={badge}>{title}</span>;
}

export default Badge