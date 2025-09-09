import React from 'react';
import { useSearchParams } from 'next/navigation';
import { PaginationType,Meta } from '@/types/PaginationType';
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const Pagination:React.FC<PaginationType> = ({meta,prevPage,nextPage,handlerPageChangeFromBtn}) => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const defaultClass = `flex items-center justify-center w-10 h-10 text-white text-xl shadow-1 border border-red-600 bg-red-600 hover:bg-white hover:text-black hover:border-black transition-colors duration-300 ease-linear rounded-full disabled:opacity-50`;
    return (
        <div className="flex justify-center mt-6 space-x-2">
            <button
                type="button"
                title="Previous Page"
                onClick={prevPage}
                disabled={meta?.current_page === 1} 
                className={defaultClass}
            >
                <IoChevronBackOutline/>
            </button>
            {meta && (Array.from({ length: meta.last_page}, (_, i) => i + 1).map(num => (
                <button
                    key={num}
                    onClick={() => handlerPageChangeFromBtn && handlerPageChangeFromBtn(num)}
                    value={num}
                    className={`flex items-center justify-center w-10 h-10 text-md shadow-1 rounded-full border border-red-600 hover:bg-white hover:text-black hover:border-black transition-colors duration-300 ease-linear ${num === page ? "bg-red-700 text-white" : "text-gray-100 bg-red-600"}`}
                >
                    {num}
                </button>
            )))}
            <button
                type="button"
                title="Next Page"
                onClick={nextPage}
                disabled={meta?.current_page === meta?.last_page}
                className={defaultClass}
            >
                <IoChevronForwardOutline/>
            </button>
        </div>
    )
}

export default Pagination