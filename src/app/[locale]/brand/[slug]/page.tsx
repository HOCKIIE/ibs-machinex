"use client";

import React,{ useEffect, useRef, useState, use } from 'react';
import ContactUsForm from '@/components/admin/Form/ContactUsForm';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { BrandType } from '@/types/BrandType';
import Image from 'next/image';
import Api from '@/services/Api';

const Brand = ({ params }:{ params: Promise<{slug:string}> }) => {
    const { slug } = use(params);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("alert");
    const [itemState, setItemState] = useState<BrandType>();
    const didFetchData = useRef(false);

    const fetchData = async () => {
        const response = await Api.get(`/brand/${slug}`);
        setItemState(response.data.data);
    };

    useEffect(() => {
        if(didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    });

    return (
        <div className='md:container px-2 pt-20 xl:px-4' id="contact">
            {!itemState?.website && <div dangerouslySetInnerHTML={{ __html: itemState?.[`detail_${locale}` as keyof BrandType] ?? "" }} />}
            {itemState?.website && 
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-300 p-3">
                        <span className="text-gray-800">{t('iframe')} &gt;&gt;</span> <a href={itemState?.website} target="_blank" className="text-blue-700">{itemState?.website}</a>
                    </div>
                    <iframe 
                        className="w-full"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/proxy/${itemState.apiName}`} 
                        height="1080" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            }
            <hr className="my-14" />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 xl:col-span-6">
                    <div className="relative bg-contain h-[488px] overflow-hidden">
                        <Image src="/images/about/central-business-district-singapore 1.png" fill objectFit="fit" className="h-full object-contain" alt="Contact"/>
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-6">
                    <ContactUsForm source={`${pathname}`}/>
                </div>
            </div>
        </div>
    )
}

export default Brand