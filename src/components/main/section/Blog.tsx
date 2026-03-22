"use client"

// import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { BlogType } from '@/types/BlogType';
import { Link } from '@/i18n/routing';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/controller';
import Api from '@/services/Api';
import { getImageSrc } from '@/utils/utils';

const BlogSection = () => 
{
    const recent = 5;
    const t = useTranslations('blog');
    const btn = useTranslations('Button');
    const locale = useLocale();
    const [blogs, setBlogs] = useState<BlogType[] | null>(null);
    const swiperRef = useRef<SwiperType>();
    const didFetchBlogs = useRef(false);
    
    const fetchAndSetBlogs = async () => {
        const response = await fectchBlogs();
        setBlogs(response.data);
    };
    useEffect(() => {
        if(didFetchBlogs.current) return;
        didFetchBlogs.current = true;
        fetchAndSetBlogs();
    });
    
    const fectchBlogs = async () => {
        const request = await Api.get<{data: BlogType[]}>(`/blog/recent/${recent}`);
        return request.data;
    };
    return (
        <div className="container px-2 lg:px-0" id="blog">
            <div className="flex justify-center">
                <h2 className="font-bold bg-gradient-to-r from-[#00a5cb] to-[#0055d3] text-4xl md:text-5xl text-transparent bg-clip-text pb-2">{t('title').toUpperCase()}</h2>
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
                        {blogs.map((item:BlogType, k:number) => 
                            <SwiperSlide key={k} virtualIndex={k}>
                                <div className="bg-white rounded-2xl overflow-hidden">
                                    <Link href={`/blog/${item.pathName}`}>
                                        <div className="h-[260px] overflow-hidden">
                                            <img src={getImageSrc(item[`image_${locale}`])} alt={item[`title_${locale}`]} height={260} className="object-cover"/>
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
                        type="button"
                        title="Previous"                        
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="text-white bg-gray-500 hover:bg-gray-400 rounded-lg py-2 shadow-lg transition pointer-events-auto"
                    >
                        <ChevronLeft className="w-6 h-6 text-bold" />
                    </button>
                    <button
                        type="button"
                        title="Next"  
                        onClick={() => swiperRef.current?.slideNext()}
                        className="text-white bg-gray-500 hover:bg-wgray-400 rounded-lg py-2 shadow-lg transition pointer-events-auto"
                    >
                        <ChevronRight className="w-6 h-6 text-bold" />
                    </button>
                </div>

            </div>
            <div className="flex justify-center mt-10">
                <Link href={'/blog'} className="text-white bg-red-700 px-[50px] py-3 rounded-md">{btn('viewMore')}</Link>
            </div>
            <hr className="my-10" />
        </div>
    )
}

export default BlogSection