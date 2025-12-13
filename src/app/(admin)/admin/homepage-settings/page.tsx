"use client";

import React,{ useState, useEffect, useRef } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import VideoUpload from '@/components/admin/Videos/VideoUpload';
import Api from '@/services/Api';


const page = () => {

    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const didFetchVideoEffect = useRef(false);
    const fetchVideoEffect = async() => {
        const res = await Api.get('/admin/settings/video-effect',{

        });
        if(res.status === 200){
            setVideoUrl(res.data);
        }
    }
    useEffect(()=>{
        if(didFetchVideoEffect.current) return;
        didFetchVideoEffect.current = true;
        fetchVideoEffect();
    },[])
    return (
    <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>
                    </div>
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200/60">
                    <div className="p-5 text-md font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        <div className="flex justify-between w-full">
                            <div className='flex gap-3'>
                                <VideoUpload defaultVideoUrl={videoUrl}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </DefaultLayout>

    );

}

export default page