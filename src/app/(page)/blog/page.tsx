"use client"
import React,{ useState, useEffect, useCallback,useRef} from 'react';
import Link from 'next/link';
import axios from 'axios';
import { blogsType } from '@/types/BlogType';
import {H1,H2,H3} from '@/utils/Title';

const Blog = () => 
{
    const hasFetched = useRef(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [blogs, setBlogs] = useState<blogsType[] | null>(null); 
    const [blog2, setBlog2] = useState<blogsType[] | null>(null); 
    const windowResized = () => setScreenWidth(window.innerWidth);

    const fetchBlogSection2 = useCallback(async() => {
        const request = await axios('https://jsonfakery.com/blogs/random/6');
        setBlog2(request.data);
    }, [])
    const fetchAndSetBlogs = useCallback(async() => {
        const request = await axios('https://jsonfakery.com/blogs/random/4');
        console.log(request.data);
        setBlogs(request.data);
    },[]);
    
    useEffect(() => {
        if (hasFetched.current) return;
        fetchAndSetBlogs();
        fetchBlogSection2()
        hasFetched.current = true;
    }, []);
    useEffect(() => {
        window.addEventListener('resize', windowResized);
    });
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
                                    <Link href={'/blog/' + blogs[0].id}>
                                        <img src={blogs[0].featured_image} title={blogs[0].title} className="w-full object-cover"/>
                                    </Link>
                                </div>
                                <div className="">
                                    <p className="text-black">{blogs[0].updated_at}</p>
                                    <Link href={'/blog/' + blogs[0].id}>
                                        <H3 custom={true} className="text-[20px] text-black font-bold hover:text-red-600">{blogs[0].title}</H3>
                                        <p className="text-gray-700">{blogs[0].subtitle}</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        { screenWidth > 1280
                            && <div className="col-span-12 md:col-span-6 xl:col-span-7">
                                <div className="grid grid-cols-1 gap-5 ">
                                    {Array.from(blogs).slice(1).map((item, index) => {
                                        return (
                                            <div key={index} className="grid xl:flex gap-3">
                                                <div className="xl:w-1/2">
                                                    <div className="rounded-l-2xl max-h-[200px] overflow-hidden">
                                                        <Link href={'/blog/' + item.id}>
                                                            <img src={item.featured_image} title={item.title} className="h-full object-cover"/>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="xl:w-1/2 overflow-hidden">
                                                    <p className="text-black">{item.updated_at}</p>
                                                    <Link href={'/blog/' + item.id} >
                                                        <H3 custom={true} className="text-[20px] text-black font-bold hover:text-red-600">{item.title}</H3>
                                                        <p className="text-gray-700">{item.subtitle}</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        { screenWidth <= 1280
                            && Array.from(blogs).slice(1).map((item, index) => 
                                <div key={index} className="col-span-12 md:col-span-6 xl:col-span-5">
                                    <div className="grid gap-5 overflow-hidden">
                                        <div className="overflow-hidden rounded-t-2xl max-h-[200px] xl:max-h-[300px]">
                                            <Link href={'/blog/' + item.id}>
                                                <img src={item.featured_image} title={item.title} className="w-full object-cover"/>
                                            </Link>
                                        </div>
                                        <div className="">
                                            <p className="text-black">{item.updated_at}</p>
                                            <Link href={'/blog/' + item.id}>
                                                <H3 custom={true} className="text-[20px] text-black font-bold hover:text-red-600">{item.title}</H3>
                                                <p className="text-gray-700">{item.subtitle}</p>
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
                        {blog2 && blog2.length > 0 &&
                            blog2.map((item)=>
                                <div key={item.id} className="col-span-12 md:col-span-6 xl:col-span-4">
                                    <div className="grid gap-5 overflow-hidden">
                                        <div className="ow-full aspect-video overflow-hidden rounded-t-2xl max-h-[300px]">
                                            <Link href={'/blog/' + item.id}>
                                                <img src={item.featured_image} title={item.title} className="w-full h-full object-cover"/>
                                            </Link>
                                        </div>
                                        <div>
                                            <p className="text-black">{item.updated_at}</p>
                                            <Link href={'/blog/' + item.id}>
                                                <H3 className="text-3xl text-black font-bold">{item.title}</H3>
                                                <h4 className="text-xl text-gray-700">{item.subtitle}</h4>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        }
                    </div>
                </>
                }
            </div>
        </div>
    )
}

export default Blog