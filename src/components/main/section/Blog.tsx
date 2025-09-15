"use client"

// import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
// import Link from 'next/link';
import { Link } from '@/i18n/routing';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/controller';
import Api from '@/services/Api';

interface blogsType {
    id:string;
    image: string;
    title_th: string;
    title_en: string;
    title_ja: string;
    description_th: string;
    description_en: string;
    description_ja: string;
    pathName: string;
    published_at: string;
    created_at: string;
    updated_at: string;
}

const BlogSection = () => {
    const t = useTranslations('blog');
    const locale = useLocale();
    const [blogs, setBlogs] = useState<blogsType[] | null>(null);
    const swiperRef = useRef<SwiperType>();
    
    useEffect(() => {
        const fetchAndSetBlogs = async () => {
            const response = await fectchBlogs();
            console.log(response.data);
            setBlogs(response.data);
        };
        fetchAndSetBlogs();
    }, []);
    
    const fectchBlogs = async () => {
        // const request = await axios('https://jsonfakery.com/blogs/random/5');
        const request = await Api.get<{data: blogsType[]}>('/blog/recent');
        return request.data;
    };
    return (
        <div className="container px-2 lg:px-0" id="blog">
            <div className="flex justify-center">
                <h2 className="text-4xl md:text-[3rem] font-bold bg-gradient-to-r from-[#00a5cb] to-[#0055d3]  bg-clip-text text-transparent [-webkit-background-clip:text]">{t('title')}</h2>
            </div>
            <div className="flex justify-center mb-[4rem]">
                <h3 className="text-black text-lg">{t('subTitle')}</h3>
            </div>
            <div className="relative">
                <div className='px-[45px]'>
                    {blogs && blogs.length > 0
                    ? 
                    <Swiper
                        modules={[Navigation, Autoplay, A11y]}
                        autoplay={true}
                        spaceBetween={50}
                        slidesPerView={3}
                        effect='fade'
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {blogs.map((item:blogsType,k:number) => 
                            <SwiperSlide key={k} virtualIndex={k}>
                                <div className="bg-white rounded-2xl overflow-hidden">
                                    <Link href={`/blog/${item.pathName}`}>
                                        <div className="h-[180px] overflow-hidden">
                                            <img src={item.image} alt={item[`title_${locale}`]} height={180} className="object-cover"/>
                                        </div>
                                        <div className="min-h-[260px] p-4">
                                            <span className="text-gray-500">{item.published_at}</span>
                                            <h3 className="text-black font-bold line-clamp-3 text-xl mt-1">{item[`title_${locale}`]}</h3>
                                            <p className="text-black line-clamp-5 mt-1">{item[`description_${locale}`]}</p>
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                    : ``}
                </div>
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="text-white bg-gray-500 hover:bg-gray-400 rounded-lg py-2 shadow-lg transition pointer-events-auto"
                    >
                        <ChevronLeft className="w-6 h-6 text-bold" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="text-white bg-gray-500 hover:bg-wgray-400 rounded-lg py-2 shadow-lg transition pointer-events-auto"
                    >
                        <ChevronRight className="w-6 h-6 text-bold" />
                    </button>
                </div>

            </div>
            <div className="flex justify-center mt-10">
                <Link href={'/blog'} className="text-white bg-red-700 px-[50px] py-3 rounded-md">View More</Link>
            </div>
            <hr className="my-10" />
        </div>
    )
}

export default BlogSection