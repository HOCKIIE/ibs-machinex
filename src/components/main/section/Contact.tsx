"use client"

import React, { useEffect, useState, useRef } from 'react';
import ContactUsForm from '@/components/admin/Form/ContactUsForm';
import { ContactType } from '@/types/ContactType';
import { UserType } from '@/types/UserType';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Api from '@/services/Api';

const ContactSection = () => {
    const locale = useLocale();
    const pathName = usePathname();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [iframeWidth, setIframeWidth] = useState<number>(0);
    const [owner, setOwner] = useState<ContactType>();
    const [sales, setSales] = useState<UserType[]>([]);
    const t = useTranslations('ContactUsForm');
    const didFetchData = useRef(false);

    const fetchData = async () => {
        const owner = await Api.get('/owner');
        setOwner(owner.data.data);

        const sales = await Api.get('/sales');
        setSales(Array.isArray(sales.data) ? sales.data : []);
    };

    useEffect(() => {
        const iframe = iframeRef.current;

        const updateIframeWidth = () => {
            if (iframe) setIframeWidth(iframe.clientWidth);
        };

        const handleLoad = () => {
            updateIframeWidth();
        };

        iframe?.addEventListener("load", handleLoad);
        window.addEventListener("resize", updateIframeWidth);

        return () => {
            iframe?.removeEventListener("load", handleLoad);
            window.removeEventListener("resize", updateIframeWidth);
        };
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "iframe-resize") {
            setIframeWidth(event.data.width);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    });
    const address = owner?.[`address_${locale}` as keyof ContactType] || '';
    const keyT = `title_${locale}` as keyof UserType;

    return (
    <div className='md:container px-2 xl:px-4' id="contact">
        <hr className="my-14" />
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <div className="flex items-center"><h3 className="text-black text-4xl font-bold bg-gradient-to-r from-[#00a5cb] to-[#0055d3] text-transparent bg-clip-text">{t('contact').toUpperCase()}</h3></div>
            </div>
            <div className="col-span-12 xl:col-span-6">
                <div className="relative bg-contain h-[488px] overflow-hidden">
                    <img src="/images/about/central-business-district-singapore 1.png" className="h-full object-contain" alt="Contact"/>
                </div>
            </div>

            <div className="col-span-12 xl:col-span-6">
                <ContactUsForm source={pathName}/>
            </div>
        </div>
        <hr className="my-14" />
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 xl:col-span-4">
                <div className="h-full bg-white text-gray-800 rounded-2xl shadow-[0_0px_1px_2px_rgba(0,0,0,0.05)] p-4">
                    <span className="font-semibold">Office</span>
                    <p className="mt-1">
                        {address.split(/\r?\n/).map((line, idx) => (
                            <React.Fragment key={idx}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            </div>
            {sales && sales.map((item:UserType, k:number) => (
            <div key={k} className="col-span-12 xl:col-span-4">
                <div className="h-full bg-white text-gray-800 rounded-2xl shadow-[0_0px_1px_2px_rgba(0,0,0,0.05)] p-4">
                    <span className="font-semibold">{item[keyT]}</span><br/>
                    <a className="mt-1" href={`mailto:${item.email}`}> {item.email}</a><br/>
                    <a href={`tel:${item.phone}`}>{item.phone}</a><br/>
                </div>
            </div>
            ))}
        </div>
        <div className="relative rounded-3xl overflow-hidden py-10">
            <iframe 
                ref={iframeRef} 
                className="w-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.0617695789147!2d100.55523204113399!3d13.714708698203433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29fd4c61f02af%3A0xe0d19e4fc5356b1e!2sSSP%20Tower%202!5e0!3m2!1sth!2sth!4v1742971953317!5m2!1sth!2sth" 
                height="280" 
                width={iframeWidth}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    </div>
    )
}

export default ContactSection