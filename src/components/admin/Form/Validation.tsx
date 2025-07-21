type ErrorMessageProps = {
    children: React.ReactNode;
    className?: string;
}
export const ErrorMessage:React.FC<ErrorMessageProps> = ({children, className}) => {
    return (<p className={`mt-[3px] text-xs text-rose-500 dark:text-rose-600${className != undefined ? ` ${className}`:``}`}>{children}</p>);
}