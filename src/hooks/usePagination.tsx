"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Api from '@/services/Api';
import { toast } from "react-hot-toast";
import { PaginationMeta } from "@/types/PaginationProps";

interface UsePaginationProps {
    initialLimit?: number;
    endpoint: string;
}
const usePagination = ({ initialLimit = 10, endpoint }: UsePaginationProps) => 
{
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(initialLimit);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const currentStatus = searchParams.get("status") || "all";
    const [activeStatus, setActiveStatus] = useState<string>(currentStatus);
    
    const currentKeyword = searchParams.get('keyword') || "";
    // const page = searchParams.get('page') || "";
    const [keyword, setKeyword] = useState<string>(currentKeyword);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const didFetchData = useRef<string | null>(null);
    const queryString = searchParams.toString();

    const classNames = {
        active: "px-2 py-1 text-sm rounded-md bg-white dark:bg-gray-600 text-black-2 dark:text-gray-300",
        default: "px-2 py-1 text-sm rounded-md bg-transparent"
    }
    const DEBOUNCE_DELAY = 800;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const queryString = await searchParams.toString();
            const res = await Api.get(`${endpoint}?${queryString}`);
            setData(res.data.data);
            setMeta(res.data.meta);
        } catch {
            toast.error("Failed to load data.")
        } finally {
            setLoading(false);
        }

    },[endpoint, searchParams]);

    const handleClickPage = useCallback((action:string) => 
    {
        const currentPage = parseInt(searchParams.get('page') || '1', 10);
        let targetPage = currentPage;
        if (action === 'next' && meta && currentPage < meta.last_page) {
            targetPage = currentPage + 1;
            setPage((prev) => prev + 1);
        }

        if (action === 'prev' && meta && currentPage > 1) {
            targetPage = currentPage - 1;
            setPage((prev) => prev - 1);
        }

        if (targetPage !== currentPage) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', targetPage.toString());
            router.push(`?${params.toString()}`);
        }
    },[meta, setPage, searchParams, router]);

    const updateLimit = useCallback((newLimit: number) => 
    {
        setLimit(newLimit);
        setPage(1);
        const params = new URLSearchParams(searchParams.toString());
        params.set('limit', newLimit.toString());
        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    const updateStatus = useCallback((status: string) => 
    {
        const params = new URLSearchParams(searchParams.toString());
        params.set("status", status);
        router.push(`${pathname}?${params.toString()}`);
        setActiveStatus(status);
    }, [searchParams, router, pathname]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => 
    {
        const self = (e.target as HTMLInputElement);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        const value = self.value;
        debounceTimeout.current = setTimeout(()=>
        {
            setKeyword(value)
            const params = new URLSearchParams(searchParams.toString());
            params.set('keyword', value);
            params.set('page', '1');
            router.push(`?${params.toString()}`);

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
    }

    useEffect(() => {
        if (didFetchData.current === queryString) return;
        didFetchData.current = queryString;
        fetchData();
    }, [fetchData, queryString]);

    const StatusTab = ({ status }: { status: Array<{ label: string; value: string }> }) => {
        return (
            <div className="flex rounded-md overflow-hidden bg-gray-200 dark:bg-gray-900 p-[2px]">
                {status.map((v,k) => {
                    return (
                    <button
                        key={k}
                        onClick={() => updateStatus(v.value)}
                        className={activeStatus === v.value ? classNames.active : classNames.default}
                    >
                        {v.label}
                    </button>
                )
                })}
            </div>
        );
    };

    const HandlerOrderBy = (value:string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('orderBy',value)
    }
    const OrderBy = () => {
        const orderBy = [
            {'key':'latest','value' : 'Latest'},
            {'key':'oldest','value' : 'Oldest'},
        ]
        return <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400">Order By</span>
                <select 
                    name="orderBy" 
                    id="orderBy" onChange={(e)=>HandlerOrderBy(e.currentTarget.value)}
                    className="dark:bg-dark-900 h-9 w-34 z-0 appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2 pl-3 pr-8 text-sm text-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                >
                    {orderBy.map((v,k)=><option key={k} value={v.key}>{v.value}</option>)}
                </select>
                <span className="absolute right-2 top-1/2 z-0 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <svg className="stroke-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </span>
        </div>
    }

    return {
        keyword,
        data,
        meta,
        loading,
        limit,
        page,
        setPage,
        setLoading,
        nextPage: () => handleClickPage('next'),
        prevPage: () => handleClickPage('prev'),
        fetchData,
        updateLimit,
        handleSearch, 
        handlePageChange, 
        StatusTab,
        OrderBy
    };
    
};

export default usePagination;