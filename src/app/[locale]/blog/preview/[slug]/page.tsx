"use client";

import React, { useState, useEffect, useRef } from 'react';
import { H1, H2, H3 } from '@/utils/Title';
import Api from '@/services/Api';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { BlogType, BlogFormProps } from '@/types/BlogType';
import { getImageSrc } from '@/utils/utils';

const BlogPreview = ({ params }:{ params: {slug:string} }) => {
    const locale = useLocale();
    const { slug } = params;
    const [itemState, setData] = useState<BlogFormProps>();
    const [recommend, setRecommend] = useState<BlogType[]>();
    const didFetchData = useRef(false);
    
    const fetchBlog = async () => {
        const request = await Api.get(`/blog/preview/${slug}`);

        setData(request.data.data);
        setRecommend(request.data.recommend)
    }
    useEffect(() => {
        document.title = itemState?.[`title_${locale}`] + ' - IBS Machinex';
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchBlog();
    }); 
    return (
        <div>
            <div className="container py-20 px-2 lg:px-0">
                <div className="pt-15">
                    {itemState &&
                        <>
                            <H1>{itemState?.[`title_${locale}`]}</H1>
                            <p className="text-black">Published on: {itemState?.published_at || '-'}</p>
                            <div className="grid grid-cols-12 mt-10">
                                <div className="col-span-2"></div>
                                <div className="col-span-8">
                                    <img src={getImageSrc(itemState[`image_${locale}`])} 
                                        alt={itemState[`title_${locale}`]} 
                                        height={180} className="object-cover"
                                    />
                                </div>
                                <div className="col-span-2"></div>
                            </div>
                            {itemState && <div dangerouslySetInnerHTML={{ __html: itemState?.[`detail_${locale}`] ?? "" }} />}
                        </>
                    }
                    {recommend && 
                    <>
                        <hr className='py-6'/>
                        <div className="flex">
                            <H2 custom={true} className="font-bold text-3xl bg-gradient-to-r to-[#00a5cb] from-[#0055d3] text-transparent bg-clip-text">
                                Looking for Hight-Quality Industrial Industry?
                            </H2>
                        </div>
                        <div className="grid grid-cols-12 gap-9 px-5 mt-10">
                            {recommend.map((item:BlogType, k:number)=>(
                                <div key={k} className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl overflow-hidden">
                                    <Link href={`/blog/${item.pathName}`}>
                                        <div className="h-[180px] overflow-hidden">
                                            <img src={getImageSrc(item[`image_${locale}`])} alt={item[`title_${locale}`]} height={180} className="object-cover"/>
                                        </div>
                                        <div className="min-h-[260px] p-4">
                                            <span className="text-gray-500">{item.published_at}</span>
                                            <H3 className="text-black font-bold line-clamp-3 text-xl mt-1">{item[`title_${locale}`]}</H3>
                                            <p className="text-black line-clamp-5 mt-1">{item[`description_${locale}`]}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default BlogPreview