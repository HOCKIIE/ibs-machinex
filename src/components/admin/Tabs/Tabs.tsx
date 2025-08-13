interface DefaulType {
    active: string;
    toggle: (language: string) => Promise<void>;
}
export const DefaultTab = ({active, toggle}:DefaulType) => {
    const activeClass = `bg-white text-gray-900 shadow-theme-xs dark:bg-white/[0.03] dark:text-white`;
    const defaultClass = `bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`;
    return (
        <nav className="flex overflow-x-auto rounded-t-lg bg-gray-100 p-1 dark:bg-gray-900">
            <button type="button" onClick={()=>toggle('th')}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${active === 'th' ? activeClass : defaultClass}`}>
                Thai
            </button>
            <button type="button" onClick={()=>toggle('en')}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${active === 'en' ? activeClass : defaultClass}`}>
                English
            </button>
            <button type="button" onClick={()=>toggle('ja')}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${active === 'ja' ? activeClass : defaultClass}`}>
                Japanese
            </button>
        </nav>
    )
}