import Api from '@/services/Api';
import React,{ useCallback, useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay, A11y } from 'swiper/modules';
import { BlogType } from '@/types/BlogType';
import { Link } from '@/i18n/routing';

const RecommendBlog = () => {
    const t = useTranslations('blog');
    const limit = process.env.NEXT_PUBLIC_RECOMMEND_BLOG_LIMIT ?? 5;
    const locale = useLocale();
    const [data, setData] = useState([]);
    const swiperRef = useRef<SwiperType>();
    const didFetchData = useRef(false);
    const fetchData = useCallback(async()=>{
        try {
            const response = await Api.get('/blog/recommend/byCustomer/'+limit);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    },[]);
    useEffect(() => {
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    },[]);
    return (
        <div className="container md:px-0 mt-20">
            <div className="flex justify-center">
                <h2 className="pt-3 bg-gradient-to-r from-[#0055d3] from-2% via-[#007ecf] via-55% to-[#00a5cb] to-1% text-4xl md:text-5xl font-bold text-transparent bg-clip-text">{t('recommend')}</h2>
            </div>
            <div className="flex justify-center mt-2 mb-5"><h3 className="text-black text-xl">{t('recommendSubtitle')}</h3></div>
            <div className="relative">
                <div>
                    {data && data.length > 0
                    ? 
                    <Swiper
                        modules={[Navigation, Autoplay, A11y]}
                        autoplay={{ 
                            delay: 0,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={true}
                        speed={6000}
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
                        {data.map((item:BlogType, k:number) => 
                            <SwiperSlide key={k} virtualIndex={k}>
                                <div className="bg-white rounded-2xl overflow-hidden">
                                    <Link href={`/blog/${item.pathName}`}>
                                        <div className="h-[275px] overflow-hidden p-5">
                                            <img src={item.image} alt={item[`title_${locale}`]} className="object-cover rounded-xl"/>
                                        </div>
                                        <div className="min-h-[200px] p-4">
                                            <h3 className="text-black font-bold line-clamp-2 text-xl mt-1">{item[`title_${locale}`]}</h3>
                                            <p className="text-black line-clamp-3 mt-1">{item[`description_${locale}`]}</p>
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                    : ``}
                </div>
            </div>
        </div>
    )
}

export default RecommendBlog