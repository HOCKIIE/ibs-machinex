import React from 'react';
type ColorsType = "primary"|"success"|"danger"|"warning"|"info";
type SizeType = "sm"|"md"|"lg";

const OutlineButton = ({ href, title, onClick, variant }:{
    href?: string;
    title: string;
    onClick?: () => void;
    variant?: ColorsType;
    size?: SizeType;
}) => {
    const color: Record<ColorsType, string> = {
        "primary":"indigo",
        "success":"green",
        "danger":"red",
        "warning":"amber",
        "info":"sky"
    };
    const btnSize: Record<SizeType, string> = {
        "sm":"text-sm",
        "md":"text-md",
        "lg":"text-lg"
    };
    const thisSize = ['sm','md','lg'].includes(variant ?? "") ? (variant as SizeType) : "md";
    const variantType: ColorsType = ["primary","success","danger","warning","info"].includes(variant ?? "") ? (variant as ColorsType) : "primary";
    const className = `flex items-center gap-2 border border-${color[variantType]}-400 ${btnSize[thisSize]} text-${color[variantType]}-400 hover:text-gray-200 hover:bg-${color[variantType]}-500 dark:bg-${color[variantType]}-600 dark:hover:bg-${color[variantType]}-500 dark:text-${color[variantType]}-300 py-1 px-4 rounded-lg transition-all ease-in-out`;
    
    if (href) return <a href={href} className={className} target='_blank' title={title}>{title}</a>;
    
    return <button type="button" title={title} onClick={onClick} className={className}>{title}</button>
    
}

export default OutlineButton