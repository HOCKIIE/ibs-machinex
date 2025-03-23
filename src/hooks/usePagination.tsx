"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
        setSkip(newSkip);
        updateTo(newSkip + limit);
        setCurrentPage(page);
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

    return { 
        data, loading, skip, to, limit, currentPage, totalPages, totalItems, updateLimit, setMultipleParams,
        keyword, handleSearch, pageRef, setPage, nextPage, prevPage, handlePageChange,
        StatusTab
    };
};

export default usePagination;