"use client"
import React from 'react'

const Badge = ({
    title,
    variant,
    className,
    custom,
    href
}:{
    title: string;
    variant?: string;
    className?: string;
    custom?: boolean;
    href?: string
}) => {
    const defaultClass: string = 'p-[3px] rounded-md bg-indigo-400 text-white text-[11px]';
    const linkClass:string = `px-2 py-1 rounded-md bg-indigo-400 text-white text-[11px] hover:bg-indigo-500 ease-in-out duration-500`
    const variantClasses: Record<string, string> = {
        primary: "bg-indigo-400",
        success: "bg-emerald-300",
        danger: "bg-red-300",
        warning: "bg-amber-300",
        blue: "bg-blue-300",
        sky: "bg-sky-300",
        cyan: "bg-cyan-300",
        pink: "bg-pink-300",
    };
    if (custom)  return <span className={className || defaultClass}>{title}</span>;
    
    const colorClass = variant ? variantClasses[variant] || variantClasses["primary"] : "bg-indigo-400";
    const finalClass = `${defaultClass.replace("bg-indigo-400",colorClass)}${className ? " " + className : ""}`;
    return href 
        ? <a className={linkClass} href={href} target="_blank"> {title}</a> 
        : <span className={finalClass}>{title}</span>;
}

export default Badge