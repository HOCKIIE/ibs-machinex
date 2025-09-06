import React from 'react';
import { useSearchParams } from 'next/navigation';
import { PaginationType } from '@/types/PaginationType';
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const Pagination:React.FC<PaginationType> = ({meta,prevPage,nextPage,totalItems,handlePageChange}) => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);

    return (
        <div className="flex justify-center mt-6 space-x-2">
            <button
                type="button"
                title="Previous Page"
                onClick={prevPage}
                disabled={meta?.current_page === 1} 
                className="flex items-center justify-center w-10 h-10 text-white text-xl shadow-1 bg-red-600 rounded-full disabled:opacity-50"
            >
                <IoChevronBackOutline/>
            </button>
            {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
                <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`flex items-center justify-center w-10 h-10 text-md shadow-1 rounded-full ${num === page ? "bg-red-700 text-white" : "text-gray-100 bg-red-600"
                    }`}
                >
                    {num}
                </button>
            ))}
            <button
                type="button"
                title="Next Page"
                onClick={nextPage}
                disabled={meta?.current_page === meta?.last_page}
                className="flex items-center justify-center w-10 h-10 text-white text-xl shadow-1 bg-red-600 rounded-full disabled:opacity-50"
            >
                <IoChevronForwardOutline/>
            </button>
        </div>
    )
}

export default Pagination