import { GoChevronLeft, GoChevronRight } from "react-icons/go";

interface PaginateProps {
    skip: number | 0;
    to: number;
    totalItems?: number;
    prevPage: () => void;
    nextPage: () => void;
    currentPage?: number;
    handlePageChange?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export const Paginate: React.FC<PaginateProps> = ({skip,to,totalItems,prevPage,currentPage,handlePageChange,nextPage}) => {
    return (
        <div className="flex justify-between px-6 py-2 bg-white dark:bg-gray-800">
            <div className="flex items-center">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{skip+1} - {to}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> Products
                </span>
            </div>
            <div className="flex items-center justify-center gap-1 xl:justify-end">
                <button 
                    type="button" 
                    onClick={prevPage}
                    title="Prvious Page"
                    className="py-1 px-3 h-full inline-flex justify-center items-center text-sm font-semibold rounded-md bg-white text-gray-500 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                >
                    <GoChevronLeft fontSize={20}/> Prev
                </button>
                <input
                    title="Current Page" 
                    type="text" name="page" className="w-[3rem] h-9 dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 rounded-lg border border-gray-300 bg-transparent px-2 py-2 text-sm text-center text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none" 
                    defaultValue={currentPage} 
                    onKeyUp={handlePageChange}
                />
                <button 
                    type="button" 
                    title="Next Page"
                    onClick={nextPage}
                    className="py-1 px-3 h-full inline-flex justify-center items-center text-sm font-semibold rounded-md bg-white text-gray-500 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none">
                    Next <GoChevronRight fontSize={20}/>
                </button>
            </div>

        </div>
    )
}


interface LimitPerPageProps {
    show?: Array<number> | [];
    limit?: number;
    updateLimit?: (limit: number) => void
}
export const LimitPerPage:React.FC<LimitPerPageProps> = ({show,limit,updateLimit}) =>
{
    return <div className="flex items-center gap-3">
        <span className="text-gray-500 dark:text-gray-400"> Show </span>
        <div className="relative">
            <select 
                title="Show entries"
                onChange={(e) => updateLimit && updateLimit(Number(e.target.value))}
                defaultValue={limit}
                className="dark:bg-dark-900 h-9 w-18 appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2 pl-3 pr-8 text-sm text-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
            >
                {Array.from(show).map((v:number,k:number)=><option key={k} value={v} className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">{v}</option>)}
            </select>
            <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg className="stroke-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            </span>
        </div>
        <span className="text-gray-500 dark:text-gray-400"> entries </span>
    </div>
}