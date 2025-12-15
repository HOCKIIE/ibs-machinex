"use client"
import React,{ useEffect, useState, useCallback, useRef } from 'react';
import { useRouter,usePathname, useSearchParams } from "next/navigation";
import Api from '@/services/Api';
import { Link } from '@/i18n/routing';
import { IoSearchSharp } from "react-icons/io5";
import { CategoryType } from '@/types/CategoryType';
import { BrandType } from '@/types/BrandType';
import { useLocale, useTranslations } from 'next-intl';
import RecommendBlog from './RecommendBlog';

const ProductSection = () => {
    const locale = useLocale();
    const t = useTranslations('sectionHead');
    const [allCategory, setAllCategory] = useState<CategoryType[]>([]);    
    const [category, setCategory] = useState<CategoryType[]>([]);    
    const [keyword, setKeyword] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const didfetchAllCategory = useRef(false);
    const didfetchCategory = useRef<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const queryString = searchParams.toString();

    const getQueryParam = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        Object.keys(params).forEach((key) => {
            const value = params.get(key);
            if (value !== null) {
                params.set(key, value);
            }
        });
        return params;
    }, [searchParams]);

    // const fetchAndSetProducts = useCallback(async () => {
        
    //     const params = getQueryParam();
    //     const path = `/category/brand?${params}`;
    //     const request = await Api.get(path);
    //     return request;
    // }, [getQueryParam]);

    const fetchCategory = useCallback(async() => {
        try {
            const response = await Api.get(`/category/brand`);
            setCategory(response.data);
            ScrollToSearchEl()
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    },[getQueryParam]);

    const fetchAllCategory = useCallback(async() => {
        try {
            const response = await Api.get("/category");
            setAllCategory(response.data);
        }
        catch (error) {
            console.error("Error fetching category:", error);
        }
    }, []);

    const ScrollToSearchEl = () => {
        const queryString = searchParams.toString();
        if (queryString !== '') {
            if (searchRef.current) {
                const y = searchRef.current.getBoundingClientRect().top - 100;
                setTimeout(()=>{
                    window.scrollTo({ top: y, behavior: 'smooth'});
                },800)
            }
        }
    }

    const setMultipleParams = (newParams: Record<string, string>) => 
    {
        const params = new URLSearchParams(searchParams.toString());
        Object.keys(newParams).forEach((key) => {
            params.set(key, newParams[key]);
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setKeyword(e.currentTarget.search.value);
        setMultipleParams({"keyword":e.currentTarget.search.value});
        fetchCategory();
    }

    type ScrollTarget = string | HTMLElement | null;
    const scrollToTarget = (target: ScrollTarget, offset: number = 0) => {
        let element: HTMLElement | null = null;
        if (typeof target === "string") element = document.querySelector<HTMLElement>(target);
        if (target instanceof HTMLElement) element = target;
        if (!element) return;
        const y = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    useEffect(() => {
        if(didfetchAllCategory.current) return;
        didfetchAllCategory.current = true;
        fetchAllCategory();
        const keyword = getQueryParam().get("keyword") || "";
        setKeyword(keyword)
    },[fetchAllCategory, getQueryParam]);
    
    useEffect(() => {

        if(didfetchCategory.current === queryString) return;
        didfetchCategory.current = queryString;
        fetchCategory();
    },[]);

    return (
    <div>
        <div className="relative h-[340px] md:h-[350px] xl:h-[400px]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 bg-gradient-to-b from-[#0052b2] to-[#05a6d9] text-white p-6 h-[350px] xl:h-[500px] w-[100%] max-w-[2300px] rounded-[20px] md:rounded-[80px] xl:rounded-[150px] 2xl:rounded-[230px] 3xl:rounded-[300px] z-1"></div>
            <div className="absolute top-[0.5rem] md:top-[2rem] xl:top-[3rem] left-1/2 -translate-x-1/2 container mt-16 p-2 md:p-0 z-9">
                <div className="p-5 bg-white rounded-3xl shadow-md border border-gray-300 md:w-[80%] m-auto">
                    <div className="flex justify-center"><h2 className="font-bold text-3xl bg-gradient-to-r from-[#00a5cb] to-[#0055d3] text-transparent bg-clip-text">{t('searchBoxTitle').toUpperCase()}</h2></div>
                    <div className="mt-4">
                        <form onSubmit={(e) => handleSearch(e)}>   
                            <div className="flex gap-5">
                                <div className="relative w-full">
                                    <input 
                                        defaultValue={keyword} 
                                        type="search" 
                                        id="search" 
                                        className="block w-full p-4 ps-6 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" 
                                        placeholder={t('searchPlaceholder')} />
                                </div>
                                <button type="submit" className="min-w-[20px] flex items-center justify-center text-white bg-red-800 h-full p-3 rounded-full" title="search"><IoSearchSharp fontSize={30}/></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-8 flex justify-center items-start w-full z-10">
                <div className="w-[80px] h-[80px] rounded-full text-white bg-red-700 flex justify-center items-center text-3xl font-bold">{t('or')}</div>
            </div>
        </div>
        <div className="container space-y-7">
            <h5 className="flex justify-center items-center text-black text-xl">{t('CategoryCaption')}</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
                {Array.isArray(allCategory) && allCategory.map((item: CategoryType) => (
                    <div 
                        key={item.id}
                        onClick={()=>scrollToTarget(`#category-${item.id}`,80)}
                        className="group h-60 px-4 py-5 text-black bg-white/70 backdrop-blur-sm hover:ring-[3px] hover:ring-red-500 rounded-3xl transform transition-all duration-500 ease-in-out cursor-pointer"
                    >
                        <div className="flex flex-col items-center transition-transform duration-300 ease-in-out group-hover:scale-110">
                            <div className="overflow-hidden w-[120px] h-[120px] flex justify-center items-center">
                                <img src={item.image} alt={item[`title_${locale}`]} width={120} height={120} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pb-2"/>
                            </div>
                            <h2 className="text-center line-clamp-3 mt-5 group-hover:text-red-600">{item[`title_${locale}`]}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <hr />
        </div>
        <RecommendBlog />
        <div className="container md:px-0 mt-20">
            <div className="flex justify-center">
                <h2 className="pt-3 bg-gradient-to-r from-[#0055d3] from-2% via-[#007ecf] via-55% to-[#00a5cb] to-1% text-4xl md:text-5xl font-bold text-transparent bg-clip-text">{t('searchBoxTitle').toUpperCase()}</h2>
            </div>
            <div className="flex justify-center mt-2">
                <h3 className="text-black text-xl">{t('subtitle')}</h3>
            </div>
            <div className="mt-20" ref={searchRef}>
                {category && category.map((item: CategoryType) => (
                    <div key={item.id} id={`category-${item.id}`} className="grid grid-cols-12 gap-5 mt-5 group">
                        <div className="col-span-12 xl:col-span-4 p-5 rounded-3xl border border-blue-800 bg-white group-hover:bg-blue-800/90 transition-all duration-300 ease-in-out">
                            <div className="text-blue-800 text-3xl font-bold relative group-hover:text-white">
                                {item[`title_${locale}`]}
                                <div className="absolute h-[5px] bg-red-600 w-[80px] left-0 bottom-[-10px]"/>
                            </div>
                            <div className="text-black text-xl mt-5 group-hover:text-white">{item[`description_${locale}`]}</div>
                        </div>
                        <div className="col-span-12 xl:col-span-8 p-5 rounded-3xl border border-blue-800 bg-white group-hover:bg-blue-800/90 transition-all duration-300 ease-in-out">
                            {Array.from(item.brands ?? []).length > 0 ?<div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-7 gap-3">
                                    {item.brands?.map((brand: BrandType, k:number) => (
                                        <div key={k} className="flex items-center group-hover:text-white">
                                            <Link
                                                href={`/brand/${brand.apiName}`}
                                                className="rounded-full overflow-hidden w-[107px] h-[107px] flex justify-center items-center mb-2 border shadow-md hover:outline hover:outline-offset-[-4px] outline-red-700 hover:outline-[5px] transition-all duration-300 ease-in-out"
                                            >
                                                <img src={brand.image} alt={brand.title_en} className="w-full h-full object-contain"/>
                                            </Link>
                                        </div>)
                                    )}
                                </div>
                                :<div className="flex items-center justify-center text-gray-800 group-hover:text-white h-full"><span>Coming soon</span></div>
                            }
                        </div>
                        <div className="col-span-12 relative my-10">
                            <div className="absolute top-[-5px] w-3 h-3 bg-blue-200 rounded-full "></div>
                            <hr className="border-blue-200 border-[0.12rem] "/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    )
}

export default ProductSection