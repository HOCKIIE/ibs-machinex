"use client"

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import ContactUsForm from '@/components/admin/Form/ContactUsForm';
import { ContactType, ContactState } from '@/types/ContactType';
import useContactStore from '@/store/useContactStore';
import { useTranslations, useLocale } from 'next-intl';
import Api from '@/services/Api';

const ContactSection = () => {
    const locale = useLocale();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [iframeWidth, setIframeWidth] = useState<number>(0);
    const [owner, setOwner] = useState<ContactType>();
    const [sales, setSales] = useState<ContactType>();
    const t = useTranslations('ContactUsForm');
    const { getData } = useContactStore();
    const didFetchData = useRef(false);

    const fetchData = async () => {
        // Fetch any necessary data here if needed
        const owner = await Api.get('/owner');
        setOwner(owner.data);

        const sales = await Api.get('/sales');
        setSales(sales.data);
    };

    useEffect(() => {
        const updateIframeWidth = () => {
            if (iframeRef.current) {
                setIframeWidth(iframeRef.current.clientWidth);
            }
        };
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.onload = () => {
                updateIframeWidth();
                iframe.contentWindow?.addEventListener("resize", updateIframeWidth);
                iframe.contentWindow?.addEventListener("orientationchange", updateIframeWidth);
            };
        }
        return () => {
            iframe?.contentWindow?.removeEventListener("resize", updateIframeWidth);
            iframe?.contentWindow?.removeEventListener("orientationchange", updateIframeWidth);
        };
    }, []);
    useEffect(() => {
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    }, []);
    const address = owner?.[`address_${locale}` as keyof ContactType] || ''
    return (
    <div className='md:container px-2 xl:px-4' id="contact">
        <hr className="my-14" />
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <div className="flex items-center"><h3 className="text-black text-4xl font-bold bg-gradient-to-r from-[#00a5cb] to-[#0055d3] text-transparent bg-clip-text">{t('contact')}</h3></div>
            </div>
            <div className="col-span-12 xl:col-span-6">
                <div className="relative bg-contain h-[488px] overflow-hidden">
                    <Image src="/images/about/central-business-district-singapore 1.png" fill objectFit="fit" className="h-full object-contain" alt="Contact"/>
                </div>
            </div>

            <div className="col-span-12 xl:col-span-6">
                <ContactUsForm />
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
            { sales && sales.map((item:any, index:number) => (
            <div key={index} className="col-span-12 xl:col-span-4">
                <div className="h-full bg-white text-gray-800 rounded-2xl shadow-[0_0px_1px_2px_rgba(0,0,0,0.05)] p-4">
                    <span className="font-semibold">{item.name}</span><br/>
                    <a className="mt-1" href={`mailto:${item.email}`}> {item.email}</a><br/>
                    <a href="tel:{item.phone}">{item.phone}</a><br/>
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
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    </div>
    )
}

export default ContactSection