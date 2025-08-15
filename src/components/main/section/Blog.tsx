"use client"

import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import Link from 'next/link';
import { Link } from '@/i18n/routing';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/controller';

interface blogsType {
    id:string;
    title:string;
    updated_at:string;
    summary:string;
    featured_image:string;
}

const BlogSection = () => {
    const t = useTranslations('blog');
    const [blogs, setBlogs] = useState<blogsType[] | null>(null);
    const swiperRef = useRef<SwiperType>();
    useEffect(() => {
        const fetchAndSetBlogs = async () => {
            const response = await fectchBlogs();
            setBlogs(response.data);
        };
        fetchAndSetBlogs();
    }, []);
    
    const fectchBlogs = async () => {
        const request = await axios('https://jsonfakery.com/blogs/random/5');
        return request;
    };
    return (
        <div className="md:container px-2 lg:px-0" id="blog">
            <div className="flex justify-center">
                <h2 className="text-[3rem] font-bold bg-gradient-to-r from-[#00a5cb] to-[#0055d3]  bg-clip-text text-transparent [-webkit-background-clip:text]">{t('title')}</h2>
            </div>
            <div className="flex justify-center mb-[4rem]">
                <h3 className="text-black text-lg">{t('subTitle')}</h3>
            </div>
            <div className="relative">
                <div className='px-[45px]'>
                    {blogs && blogs.length > 0
                    ? 
                    <Swiper
                        autoplay={true}
                        modules={[Navigation, Autoplay, A11y]}
                        spaceBetween={50}
                        slidesPerView={3}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {blogs.map((item,k) => 
                            <SwiperSlide key={k} virtualIndex={k} className=''>
                                <div className="bg-white rounded-2xl overflow-hidden">
                                    <div className="max-h-[200px] overflow-hidden">
                                        <img src={item.featured_image} alt={item.title} />
                                    </div>
                                    <div className="min-h-[260px] p-4">
                                        <span className="text-gray-500">{item.updated_at}</span>
                                        <p className="text-black font-bold line-clamp-3 text-xl mt-1">{item.title}</p>
                                        <p className="text-black line-clamp-5 mt-1">{item.summary}</p>
                                    </div>
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