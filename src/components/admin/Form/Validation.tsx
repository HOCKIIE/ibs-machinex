type ErrorMessageProps = {
    children: React.ReactNode;
    className?: string;
}
export const ErrorMessage:React.FC<ErrorMessageProps> = ({children, className}) => {
    return (<p className={`text-xs text-rose-500 dark:text-rose-600${className && ` ${className}`}`}>{children}</p>);
}