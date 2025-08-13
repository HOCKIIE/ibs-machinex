"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface blogsType {
    id:string;
    title:string;
    updated_at:string;
    summary:string;
    featured_image:string;
}

const BlogSection = () => {
    const [blogs, setBlogs] = useState<blogsType[] | null>(null);
    useEffect(() => {
        const fetchAndSetBlogs = async () => {
            const response = await fectchBlogs();
            setBlogs(response.data);
        };
        fetchAndSetBlogs();
    }, []);
    
    const fectchBlogs = async () => {
        const request = await axios('https://jsonfakery.com/blogs/random/3');
        return request;
    };
    return (
        <div className="container px-2 lg:px-0" id="blog">
            <div className="flex justify-center">
                <h2 className="text-[3rem] font-bold bg-gradient-to-r from-[#00a5cb] to-[#0055d3]  bg-clip-text text-transparent [-webkit-background-clip:text]">Blog</h2>
            </div>
            <div className="flex justify-center mb-[4rem]">
                <h3 className="text-black text-lg">Find the best solutions here!</h3>
            </div>
            <div className="grid grid-cols-12 gap-5">
                {blogs && blogs.length > 0
                ? blogs.map((item,k) => 
                    <div key={k} className="col-span-12 md:col-span-4 rounded-2xl overflow-hidden">
                        <div className="max-h-[200px] overflow-hidden">
                            <img src={item.featured_image} alt={item.title} />
                        </div>
                        <div className="min-h-20">
                            <span className="text-black">{item.updated_at}</span>
                            <p className="text-black font-bold line-clamp-2">{item.title}</p>
                            <p className="text-black line-clamp-4">{item.summary}</p>
                        </div>
                    </div>
                )
                : ``}
            </div>
            <div className="flex justify-center mt-10">
                <Link href={'/blog'} className="text-white bg-red-700 px-[50px] py-3 rounded-md">View More</Link>
            </div>
            <hr className="my-10" />
        </div>
    )
}

export default BlogSection