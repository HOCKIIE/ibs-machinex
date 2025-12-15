"use client";

import React,{ useState, useEffect, useRef } from 'react';
import Api from '@/services/Api';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import VideoUpload from '@/components/admin/Videos/VideoUpload';
import { useIntroVideoStore } from "@/store/useIntroVideoStore";
import { VideoIntroProps } from "@/types/SettingType";

const page = () => {
    const {
        videoUrl,
        videoFile,
        setVideoUrl,
        setVideoFile,
        resetToOld,
        updateData
    } = useIntroVideoStore();

    const didFetchVideoEffect = useRef(false);
    
    const fetchVideoEffect = async() => {
        const res = await Api.get('/admin/settings/video-effect');
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
                    <div className="border-b">
                        <h2 className="text-bold text-xl">Homepage:</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-4 my-6">
                        <div className="col-span-12">
                            <h2>Video Effect</h2>
                            <div className="flex justify-between w-full mt-4">
                                <div className='flex gap-3'>
                                    <VideoUpload defaultVideoUrl={videoUrl} />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>

    );

}

export default page