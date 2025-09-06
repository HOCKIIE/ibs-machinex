"use client"
import React,{ useState, useEffect, useCallback,useRef} from 'react';
import { Link } from '@/i18n/routing';
// import axios from 'axios';
import { BlogType } from '@/types/BlogType';
import {H1,H2,H3} from '@/utils/Title';
import { useLocale } from 'next-intl';
import Api from '@/services/Api';
import { usePathname } from 'next/navigation';
import Pagination from '@/components/main/pagination/Pagination';

const Blog = () => 
{
    const recent = 4;
    const locale = useLocale();
    const hasFetched = useRef(false);
    const [blogs, setBlogs] = useState<BlogType[] | null>(null); 
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [screenWidth, setScreenWidth] = useState(window?.innerWidth);
    const windowResized = () => setScreenWidth(window.innerWidth);
    const didFetchData = useRef(``);
    const pathName = usePathname();


    const fetchAndSetBlogs = useCallback(async() => {
        // const request = await axios('https://jsonfakery.com/blogs/random/4');
        const request = await Api.get(`/blog`);
        console.log(request.data);
        setBlogs(request.data.data);
    },[]);
    
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAndSetBlogs();
    }, []);
    useEffect(() => {
        window.addEventListener('resize', windowResized);
    });
    type PaginateResponse = {
    data: BlogType[];
    current_page: number;
    last_page: number;
    };

    useEffect(() => {
        const newPath = `/blogs?page=${page}`;
        if(pathName == newPath) return;
        Api.get<PaginateResponse>(`${newPath}`)
        .then(res => {
            setBlogs(res.data.data);
            setLastPage(res.data.last_page);
        });
    }, [page]);
    return (
        <div className="relative bg-white py-15 lg:py-20" >
            <div className="container px-2 lg:px-0">
                {blogs && blogs.length > 0 &&
                <>
                    <div className="pb-15 pt-10">
                        <H1>Looking for interesting articles? Start reading now!</H1>
                        <H2 
                            className="text-xl text-gray-700"
                            custom={true}
                        >Dive into engaging content, expert insights, and valuable information—all at your fingertips!</H2>

                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-6 xl:col-span-5">
                            <div className="grid gap-5 overflow-hidden">
                                <div className="overflow-hidden rounded-t-2xl max-h-[200px] xl:max-h-[300px]">
                                    <Link href={'/blog/' + blogs[0].pathName}>
                                        <img src={blogs[0].image} title={(blogs[0] as any)[`title_${locale}`]} className="w-full object-cover"/>
                                    </Link>
                                </div>
                                <div className="">
                                    <p className="text-black">{(blogs[0] as any).updated_at}</p>
                                    <Link href={'/blog/' + (blogs[0] as any).pathName}>
                                        <H3 custom={true} className="text-[20px] text-black font-bold hover:text-red-600">{(blogs[0] as any)[`title_${locale}`]}</H3>
                                        <p className="text-gray-700">{(blogs[0] as any)[`description_${locale}`]}</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        { screenWidth > 1280
                            ? <div className="col-span-12 md:col-span-6 xl:col-span-7">
                                <div className="grid grid-cols-1 gap-5 ">
                                    {Array.from(blogs).slice(1).map((item, index) => {
                                        return (
                                            <div key={index} className="grid xl:flex gap-3">
                                                <div className="xl:w-1/2">
                                                    <Link href={'/blog/' + item.pathName} className="block rounded-l-2xl max-h-[200px] overflow-hidden">
                                                        <img src={item.image} title={(blogs[0] as any)[`title_${locale}`]} className="h-full object-cover"/>
                                                    </Link>
                                                </div>
                                                <div className="xl:w-1/2 overflow-hidden">
                                                    <p className="text-black">{item.updated_at}</p>
                                                    <Link href={'/blog/' + item.pathName} >
                                                        <H3 custom={true} className="text-[20px] text-black font-bold hover:text-red-600">{(blogs[0] as any)[`title_${locale}`]}</H3>
                                                        <p className="text-gray-700">{(blogs[0] as any)[`description_${locale}`]}</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            : Array.from(blogs).slice(1).map((item, index) => 
                                <div key={index} className="col-span-12 md:col-span-6 xl:col-span-5">
                                    <div className="grid gap-5 overflow-hidden">
                                        <div className="overflow-hidden rounded-t-2xl max-h-[200px] xl:max-h-[300px]">
                                            <Link href={'/blog/' + item.pathName}>
                                                <img src={item.image} title={(blogs[0] as any)[`title_${locale}`]} className="w-full object-cover"/>
                                            </Link>
                                        </div>
                                        <div className="">
                                            <p className="text-black">{item.updated_at}</p>
                                            <Link href={'/blog/' + item.pathName}>
                                                <H3 custom={true} className="text-[20px] text-black font-bold hover:text-red-600">{(blogs[0] as any)[`title_${locale}`]}</H3>
                                                <p className="text-gray-700">{(blogs[0] as any)[`description_${locale}`]}</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className='border-t-4 border-black my-15'></div>
                    <H2 custom={true} className="text-4xl font-bold text-black pb-15">Looking for High-Quality Industrial Machinery?</H2>
                    <div className="grid grid-cols-12 gap-6">
                        {blogs && blogs.length > 0 &&
                            Array.from(blogs).map((item)=>
                                <div key={item.id} className="col-span-12 md:col-span-6 xl:col-span-4">
                                    <div className="grid gap-6 overflow-hidden">
                                        <div className="ow-full aspect-video overflow-hidden rounded-t-2xl max-h-[300px]">
                                            <Link href={'/blog/' + item.pathName}>
                                                <img src={item.image} title={(blogs[0] as any)[`title_${locale}`]} className="w-full h-full object-cover"/>
                                            </Link>
                                        </div>
                                        <div>
                                            <p className="text-black">{item.updated_at}</p>
                                            <Link href={'/blog/' + item.pathName}>
                                                <H3 className="text-3xl text-black font-bold">{(blogs[0] as any)[`title_${locale}`]}</H3>
                                                <h4 className="text-xl text-gray-700">{(blogs[0] as any)[`description_${locale}`]}</h4>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                        )}
                    </div>
                </>
                }
            </div>
            <Pagination />
        </div>
    )
}

export default Blog