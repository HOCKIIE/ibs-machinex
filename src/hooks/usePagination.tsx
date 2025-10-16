"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Api from '@/services/Api';
import { toast } from "react-hot-toast";
import { Meta } from "@/types/PaginationType";
import { set } from "lodash";

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
    const [meta, setMeta] = useState<Meta | null>(null);
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
        try {
            const res = await Api.get(`${endpoint}?${queryString}`);
            setData(res.data.data);
            setMeta(res.data.meta);
        } catch {
            console.log('Failed to fetch data.');
        }

    },[queryString]);

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

    const handlePageChange = async(e: React.ChangeEvent<HTMLSelectElement>) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        const value = e.currentTarget.value;
        const queryString = await searchParams.toString();
        const params = new URLSearchParams(queryString);
        if(!isNaN(Number(value))){
            setPage(Number(value))
            params.set('page',value);
            const newUrl = `${pathname}?${params.toString()}`;
            router.push(newUrl);
        }else{
            toast.error("Invalid number.")
            return;
        }

    }

    const handlerPageChangeFromBtn = useCallback((page:number) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(()=>{
            const currentPage = parseInt(searchParams.get('page') || '1', 10);
            console.log('page >> ',page)
            if(!isNaN(Number(page)) && page !== currentPage){
                setPage(Number(page))
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', page.toString());
                router.push(`?${params.toString()}`);
            }else{
                toast.error("Invalid number.")
                return;
            }
        },DEBOUNCE_DELAY);
    },[setPage, searchParams, router, pathname]);

    const handlerOrderBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(()=>{
            const value = (e.target as HTMLSelectElement).value;
            const params = new URLSearchParams(searchParams.toString());
            params.set('orderBy', value);
            params.set('page', '1');
            router.push(`?${params.toString()}`);

        },DEBOUNCE_DELAY);
    }
    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

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
        handlerPageChangeFromBtn,
        handlerOrderBy,
        StatusTab
    };
    
};

export default usePagination;