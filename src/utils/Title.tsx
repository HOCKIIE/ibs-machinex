import React from 'react';

export const H1 = ({
    className,custom,children
} : {
    className?: string;
    custom?: boolean;
    children: React.ReactNode;
}) => {
    return custom
    ? <h1 className={className}>{children}</h1>
    : <h1 className={`text-4xl text-black font-bold${className?`${ className}`:``}`}>{children}</h1>   
}

export const H2 = ({
    className,custom,children
} : {
    className?: string;
    custom?: boolean;
    children: React.ReactNode;
}) => {
    return custom
    ? <h2 className={className}>{children}</h2>
    : <h2 className={`text-3xl text-black font-bold${className?`${ className}`:``}`}>{children}</h2>   
}

export const H3 = ({
    className,custom,children
} : {
    className?: string;
    custom?: boolean;
    children: React.ReactNode;
}) => {
    return custom
    ? <h3 className={className}>{children}</h3>
    :<h3 className={`text-2xl text-black font-bold${className?`${ className}`:``}`}>{children}</h3>   
}