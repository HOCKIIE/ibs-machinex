"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";

interface UsePaginationProps {
  initialLimit?: number;
}
interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
}
interface StatusTabProps {
    status: string[];
}

const usePagination = ({ initialLimit = 10 }: UsePaginationProps) => 
{
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [limit, setLimit] = useState(initialLimit);
    const [skip, setSkip] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [to, setTo] = useState<number>(initialLimit);

    const currentStatus = searchParams.get("status") || "all";
    const [activeStatus, setActiveStatus] = useState<string>(currentStatus);

    const currentKeyword = searchParams.get('keyword') || "";
    const [keyword, setKeyword] = useState<string>(currentKeyword);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const pageRef = useRef<HTMLInputElement | null>(null);


    const classNames = {
        active: "px-2 py-1 text-sm rounded-md bg-white dark:bg-gray-600 text-black-2 dark:text-gray-300",
        default: "px-2 py-1 text-sm rounded-md bg-transparent"
    }
    const DEBOUNCE_DELAY = 800;

    const setMultipleParams = useCallback((newParams: Record<string, string>) => 
    {
        const params = new URLSearchParams(searchParams.toString());
        Object.keys(newParams).forEach((key) => {
            params.set(key, newParams[key]);
        });
        router.push(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const apiPath = (keyword != '') ? 'https://dummyjson.com/products/search' : 'https://dummyjson.com/products';
            const response = await fetch(`${apiPath}?limit=${limit}&skip=${skip}&status=${activeStatus}&q=${keyword}`);
            const result = await response.json();
            setData(result.products || []);
            setTotalItems(result.total || 0);
        } catch {
            toast.error("Failed to load data.")
        } finally {
            setLoading(false);
        }

    }, [limit, skip, activeStatus, keyword]);

    useEffect(() => {  fetchData(); }, [fetchData]);
    
    const totalPages = Math.ceil(totalItems / limit);

    const updateTo = useCallback((to:number)=>
    {
        setTo(to > totalItems ? totalItems : to);
    },[totalItems])

    const setPage = useCallback((page: number) => 
    {
        if (page < 1 || page > totalPages) return;
        const newSkip = (page - 1) * limit;
        setCurrentPage(page);
        setSkip(newSkip);
        updateTo(newSkip + limit);
        setTimeout(() => {
            setMultipleParams({ skip: `${newSkip}`, limit: `${limit}` });
        }, 0);
        
    }, [limit, totalPages, updateTo, setMultipleParams]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) setPage(currentPage + 1); 
    }, [currentPage, totalPages, setPage]);

    const prevPage = useCallback(() =>  {
        if (currentPage > 1) setPage(currentPage - 1);
    }, [currentPage, setPage]);   

    const updateLimit = useCallback((newLimit: number) => 
    {
        setLimit(newLimit);
        setPage(1);
        setMultipleParams({ skip: "0", limit: `${newLimit}`});
    }, [setPage, setMultipleParams]);

    const updateStatus = useCallback((status: string) => 
    {
        const params = new URLSearchParams(searchParams.toString());
        params.set("status", status);
        router.push(`${pathname}?${params.toString()}`);
        setActiveStatus(status);
        setMultipleParams({ status:`${status}` });
    }, [searchParams, router, pathname, setMultipleParams]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => 
    {
        const self = (e.target as HTMLInputElement);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        const value = self.value;
        debounceTimeout.current = setTimeout(()=>{
            setKeyword(value)
            setMultipleParams({ keyword: value });
            setPage(1);
        },DEBOUNCE_DELAY);
        if(searchRef.current) searchRef.current.focus();    
        
    };

    const handlePageChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(()=>{
            const value = (e.target as HTMLInputElement).value;
            if(!isNaN(Number(value))){
                setPage(Number(value))
            }else{
                toast.error("Invalid number.")
                return;
            }
        },DEBOUNCE_DELAY);
        if(pageRef.current){
            pageRef.current.focus();
        }
    }

    const StatusTab: React.FC<StatusTabProps> = ({ status }) => {
        return (
            <div className="flex rounded-md overflow-hidden bg-gray-200 dark:bg-gray-900 p-[2px]">
                {status.map((status: string) => (
                    <button
                        key={status}
                        onClick={() => updateStatus(status)}
                        className={activeStatus === status ? classNames.active : classNames.default}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
        );
    };

    const SearchBar = () => {
        return (
            <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" title="Keyword">
                    <IoSearchOutline fontSize={20}/>
                </button>
                <input type="text" 
                    ref={searchRef}
                    defaultValue={keyword}
                    onKeyUp={handleSearch}
                    x-model="search" placeholder="Search..." 
                    className="pl-12 dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none" 
                />
            </div>
        )
    }

    const Paginate: React.FC = () => {
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
                        ref={pageRef}
                        title="Current Page" 
                        type="text" name="page" className="w-[3rem] dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 rounded-lg border border-gray-300 bg-transparent px-2 py-2 text-sm text-center text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none" 
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

    return { 
        data, loading, skip, to, limit, currentPage, totalPages, totalItems, updateLimit, setMultipleParams,
        keyword, pageRef, setPage, nextPage, prevPage, handlePageChange,
        StatusTab, SearchBar, Paginate
    };
};

export default usePagination;