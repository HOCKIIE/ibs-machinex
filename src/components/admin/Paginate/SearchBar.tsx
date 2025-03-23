export default function SearchBar(
    {
        keyword, handleSearch
    }:{
        keyword:string, handleSearch:(e: React.KeyboardEvent<HTMLInputElement>) => void
    }
){
    return <input type="text" 
    defaultValue={keyword}
    onKeyUp={handleSearch}
    placeholder="Search..." 
    className="pl-12 dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 h-9 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 z-0 focus:outline-none" 
/>
}