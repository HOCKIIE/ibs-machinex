"use client"
import React,{ useState, useEffect,useRef} from 'react';
import { Link } from '@/i18n/routing';
import { BlogType } from '@/types/BlogType';
import {H1,H2,H3} from '@/utils/Title';
import { useLocale } from 'next-intl';
import Api from '@/services/Api';
import Pagination from '@/components/main/pagination/Pagination';
import usePagination from '@/hooks/usePagination';
import Image from 'next/image';

const Blog = () => 
{
    const recent = 4;
    const locale = useLocale();
    const [recentBlog, setRecent] = useState<BlogType[] | null>(null);
    const { 
        data,
        meta,
        prevPage, 
        nextPage,
        handlerPageChangeFromBtn
    } = usePagination({ 
        initialLimit: 6, 
        endpoint: '/blog' 
    });
    const [screenWidth, setScreenWidth] = useState(0);
    const windowResized = () => setScreenWidth(window.innerWidth);
    const didFetchRecent = useRef(false);

    const fetchRecent = async () => {
        const request = await Api.get(`/blog/recent/${recent}`);
        setRecent(request.data)
    }

    useEffect(()=>{
        if (didFetchRecent.current) return;
        didFetchRecent.current = true;
        fetchRecent();
    },[])

    useEffect(() => {
        window.addEventListener('resize', windowResized);
    });

    useEffect(()=>{
        if(window?.innerWidth){
            setScreenWidth(window.innerWidth)
        }
    },[setScreenWidth])

    return (
        <div className="relative bg-fixed bg-center bg-cover" 
        style={{ 
            backgroundImage: "url('/images/bg-2.svg')",
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center top",
            backgroundSize: "100%", 
        }}
    >

        <div className="relative py-15 lg:py-20" >
            <div className="container px-2 lg:px-0">
                {recentBlog && recentBlog.length > 0 &&
                <>
                    <div className="pb-15 pt-10">
                        <div className="flex">
                            <H1 
                                custom={true} 
                                className="font-bold text-3xl bg-gradient-to-r to-[#00a5cb] from-[#0055d3] text-transparent bg-clip-text"
                            >
                                Looking for interesting articles? Start reading now!
                            </H1>
                        </div>
                        <H3 
                            className="text-xl text-gray-700"
                            custom={true}
                        >
                            Dive into engaging content, expert insights, and valuable information—all at your fingertips!
                        </H3>

                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-6 xl:col-span-5">
                            <div className="grid gap-5 overflow-hidden bg-white rounded-2xl">
                                <Link href={'/blog/' + recentBlog[0].pathName} className="group">
                                    <div className="overflow-hidden rounded-t-2xl max-h-[200px] xl:max-h-[300px]">
                                        <img src={recentBlog[0].image} title={data[0][`title_${locale}`]} alt="" className="w-full object-cover"/>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-black">{data[0]['updated_at']}</p>
                                        <H3 custom={true} className="text-[20px] text-black font-bold group-hover:text-red-600">{data[0][`title_${locale}`]}</H3>
                                        <p className="text-gray-700">{data[0][`description_${locale}`]}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        { screenWidth > 1280
                            ? <div className="col-span-12 md:col-span-6 xl:col-span-7">
                                <div className="grid grid-cols-1 gap-5 ">
                                    {Array.from(recentBlog).slice(1).map((item: BlogType, index:number) => {
                                        return (
                                            <div key={index} className="grid xl:flex bg-white rounded-2xl group">
                                                <div className="xl:w-1/2">
                                                    <Link href={'/blog/' + item.pathName} className="block rounded-l-2xl max-h-[200px] overflow-hidden group">
                                                        <img src={item.image} title={item[`title_${locale}`]} alt="" className="h-full object-cover"/>
                                                    </Link>
                                                </div>
                                                <div className="xl:w-1/2 p-4 overflow-hidden">
                                                    <p className="text-black">{item.updated_at}</p>
                                                    <Link href={'/blog/' + item.pathName} >
                                                        <H3 custom={true} className="text-[20px] text-black font-bold group-hover:text-red-600">{item[`title_${locale}`]}</H3>
                                                        {/* <p className="text-gray-700">{(item as any)[`description_${locale}`]}</p> */}
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            : Array.from(recentBlog).slice(1).map((item:BlogType, index:number) => 
                                <div key={index} className="col-span-12 md:col-span-6 xl:col-span-5 bg-white rounded-2xl">
                                    <div className="grid gap-5 overflow-hidden">
                                        <Link href={'/blog/' + item.pathName} className="group">
                                            <div className="overflow-hidden rounded-t-2xl max-h-[200px] xl:max-h-[300px]">
                                                <img src={item.image} title={item[`title_${locale}`]} alt={item[`title_${locale}`]} className="w-full object-cover"/>
                                            </div>
                                            <div className="">
                                                <p className="text-black">{item.updated_at}</p>
                                                <H3 custom={true} className="text-[20px] text-black font-bold group-hover:text-red-600">{item[`title_${locale}`]}</H3>
                                                <p className="text-gray-700">{item[`description_${locale}`]}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className='border-t-4 border-black my-15'></div>
                    <H2 custom={true} className="text-4xl font-bold text-black pb-15">Looking for High-Quality Industrial Machinery?</H2>
                    <div className="grid grid-cols-12 gap-6 items-stretch">
                        {data && data.length > 0 &&
                            Array.from(data).map((item:BlogType)=>
                                <div key={item.id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl h-full">
                                    <Link href={'/blog/' + item.pathName} className="group block">
                                        <div className="grid overflow-hidden ">
                                            <div className="ow-full aspect-video overflow-hidden rounded-t-2xl max-h-[300px]">
                                                <img src={item.image} title={item[`title_${locale}`]} alt={item[`title_${locale}`]} className="w-full h-full object-cover"/>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-black mb-2">{item.updated_at}</p>
                                                <H3 className="text-[20px] text-xl text-black font-bold group-hover:text-red-600 line-clamp-3" custom={true}>{item[`title_${locale}`]}</H3>
                                                <p className="text-gray-700 line-clamp-5">{item[`description_${locale}`]}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                        )}
                    </div>
                </>
                }
            </div>
            <Pagination meta={meta} prevPage={prevPage} nextPage={nextPage} handlerPageChangeFromBtn={handlerPageChangeFromBtn}/>
        </div>
    </div>
    )
}

export default Blog