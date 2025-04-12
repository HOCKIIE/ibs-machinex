"use client"
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const ContactSection = () => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [iframeWidth, setIframeWidth] = useState<number>(0);
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
  return (
    <div className='container px-2 xl:px-0' id="contact">
        <hr className="my-14" />
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12"><h3 className="text-black text-4xl font-bold">Contact</h3></div>
            <div className="col-span-12 xl:col-span-6">
                <div className="relative bg-contain h-[488px] overflow-hidden">
                    <Image src="/images/about/central-business-district-singapore 1.png" fill objectFit="fit" className="h-full object-contain" alt="Contact"/>
                </div>
            </div>
            <div className="col-span-12 xl:col-span-6">
                <div className="grid gap-7">
                    <div className="col-span-12 xl:col-span-6">
                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm text-gray-900 dark:text-white">First name</label>
                            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="First name" />
                        </div>
                    </div>
                    <div className="col-span-12 xl:col-span-6">
                        <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm text-gray-900 dark:text-white">Last name</label>
                            <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Last name" />
                        </div>
                    </div>
                    <div className="col-span-12">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm text-gray-900 dark:text-white">Email address</label>
                            <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Email address" />
                        </div>
                    </div>
                    <div className="col-span-12">
                        <div>
                            <label htmlFor="message" className="block mb-2 text-sm text-gray-900 dark:text-white">Your message</label>
                            <textarea
                                rows={8}
                                id="message" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="Your message"
                            ></textarea>
                        </div>
                    </div>
                    <div className="col-span-12">
                        <button className="bg-red-700 text-white block p-3 rounded-md w-full" title="Submit">Submit</button>
                    </div>
                </div>
            </div>
        </div>
        <hr className="my-14" />
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 xl:col-span-4">
                <div className="h-full bg-white text-gray-800 rounded-2xl shadow-[0_0px_1px_2px_rgba(0,0,0,0.05)] p-4">
                    <span className="font-semibold">Office</span>
                    <p className="mt-1">116/102 ถนน ณ ระนอง แขวงคลองเตย<br/>เขตคลองเตย กรุงเทพมหานคร 10110</p>
                    <p>Tax ID: 0105555072251</p>
                </div>
            </div>
            <div className="col-span-12 xl:col-span-4">
                <div className="h-full bg-white text-gray-800 rounded-2xl shadow-[0_0px_1px_2px_rgba(0,0,0,0.05)] p-4">
                    <span className="font-semibold">K.Bum (Sales)</span><br/>
                    <a className="mt-1" href="mailto:patznun@machinex.co.t"> patznun@machinex.co.th</a><br/>
                    <a href="tel:065-256-2226">065-256-2226</a><br/>
                </div>
            </div>
            <div className="col-span-12 xl:col-span-4">
                <div className="h-full bg-white text-gray-800 rounded-2xl shadow-[0_0px_1px_2px_rgba(0,0,0,0.05)] p-4">
                    <span className="font-semibold">Mr.Fujii (Sales Japanese)</span><br/>
                    <a className="mt-1" href="mailto:fujii@machinex.co.t"> fujii@machinex.co.th</a><br/>
                    <a href="tel:099-709-1624"> 099-709-1624</a>     
                </div>
            </div>
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