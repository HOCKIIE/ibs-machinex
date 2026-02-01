"use client"
import React,{ useState, useEffect,useRef} from 'react';
import { Link } from '@/i18n/routing';
import { BlogType } from '@/types/BlogType';
import {H1,H2,H3} from '@/utils/Title';
import { useLocale, useTranslations } from 'next-intl';
import Api from '@/services/Api';
import Pagination from '@/components/main/pagination/Pagination';
import usePagination from '@/hooks/usePagination';


const Blog = () => 
{
    const recent = 4;
    const locale = useLocale();
    const t = useTranslations('blog.all')
    const didFetchRecent = useRef(false);
    const [recentBlog, setRecent] = useState<BlogType[] | null>(null);
    const [firstBlog, setFirstBlog] = useState<BlogType | null>(null);
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
    const windowResized = () => {
        setScreenWidth(prev => {
            const current = window.innerWidth;
            return prev !== current ? current : prev;
        });
    };

    const fetchRecent = async () => {
        const request = await Api.get(`/blog/recent/${recent}`);
        setRecent(request.data.data.slice(1, recent));
        setFirstBlog(request.data.data.shift());
    }

    useEffect(()=>{
        if (didFetchRecent.current) return;
        didFetchRecent.current = true;
        fetchRecent();
    },[])

    useEffect(() => {
        window.addEventListener('resize', windowResized);
        return () => window.removeEventListener('resize', windowResized);
    },[]);

    useEffect(()=>{
        setScreenWidth(window.innerWidth);
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
                                className="font-bold text-3xl bg-gradient-to-r to-[#00a5cb] from-[#0055d3] text-transparent bg-clip-text py-2"
                            >
                                {t('title')}
                            </H1>
                        </div>
                        <H3 
                            className="text-xl text-gray-700"
                            custom={true}
                        >
                            {t('subTitle')}
                        </H3>

                    </div>
                    <div className="grid grid-cols-12 gap-6 p-0 md:p-4 xl:px-0">
                        {firstBlog && (
                            <div className="col-span-12 md:col-span-6 xl:col-span-5">
                                <div className="grid gap-5 overflow-hidden bg-white rounded-2xl h-full">
                                    <Link href={'/blog/' + firstBlog.pathName} className="group">
                                        <div className="overflow-hidden rounded-t-2xl max-h-[280px] xl:max-h-[380px]">
                                            <img src={firstBlog.image} title={firstBlog[`title_${locale}`]} alt="" className="w-full object-cover"/>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-black">{firstBlog['updated_at']}</p>
                                            <H3 custom={true} className="text-[20px] text-black font-bold group-hover:text-red-600">{firstBlog[`title_${locale}`]}</H3>
                                            <p className="text-gray-700 text-lg">{firstBlog[`description_${locale}`]}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                        { screenWidth > 1280
                            ? <div className="col-span-12 md:col-span-6 xl:col-span-7">
                                <div className="grid grid-cols-1 gap-5 ">
                                    {recentBlog.map((item: BlogType, index:number) => {
                                        return (
                                            <div key={index} className="grid xl:flex bg-white rounded-2xl group">
                                                <div className="xl:w-1/2">
                                                    <Link href={'/blog/' + item.pathName} className="block rounded-l-2xl max-h-[280px] overflow-hidden group">
                                                        <img src={item.image} alt={item[`title_${locale}`]} className="h-full object-cover"/>
                                                    </Link>
                                                </div>
                                                <div className="xl:w-1/2 p-4 overflow-hidden">
                                                    <p className="text-black">{item.updated_at}</p>
                                                    <Link href={'/blog/' + item.pathName} >
                                                        <H3 custom={true} className="text-[20px] text-black font-bold group-hover:text-red-600">{item[`title_${locale}`]}</H3>
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            : recentBlog.map((item:BlogType, index:number) => 
                                <div key={index} className="col-span-12 md:col-span-6 xl:col-span-5 bg-white rounded-2xl">
                                    <div className="grid gap-5 overflow-hidden">
                                        <Link href={'/blog/' + item.pathName} className="group">
                                            <div className="overflow-hidden rounded-t-2xl max-h-[260px] xl:max-h-[360px]">
                                                <img src={item.image} title={item[`title_${locale}`]} alt={item[`title_${locale}`]} className="w-full object-cover"/>
                                            </div>
                                            <div className="p-4">
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
                    <div className='border border-indigo-300 my-15 relative flex justify-start items-center'>
                        <div className="absolute w-3 h-3 rounded-full bg-indigo-300 left-[-1px]"></div>
                    </div>
                    <div className="flex">
                        <H2 custom={true} className="font-bold text-4xl bg-gradient-to-r to-[#00a5cb] from-[#0055d3] text-transparent bg-clip-text py-2">{t('title2')}</H2>
                    </div>
                    <div className="grid grid-cols-12 gap-6 items-stretch mt-5">
                        {data && data.length > 0 &&
                            Array.from(data).map((item:BlogType)=>
                            <div key={item.id} className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl overflow-hidden h-full">
                                <Link href={'/blog/' + item.pathName} className="group block">
                                    <div className="grid overflow-hidden ">
                                        <div className="h-[280px]">
                                            <img src={item.image} title={item[`title_${locale}`]} alt={item[`title_${locale}`]} className="h-full w-full object-cover"/>
                                        </div>
                                        <div className="px-5 py-6 min-h-[300px]">
                                            <p className="text-black mb-2">{item.updated_at}</p>
                                            <H3 className="text-[20px] text-xl text-black font-bold group-hover:text-red-600 line-clamp-3" custom={true}>{item[`title_${locale}`]}</H3>
                                            <p className="text-gray-700 line-clamp-6">{item[`description_${locale}`]}</p>
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