"use client"

import React, { useEffect, useRef, useState,useCallback } from 'react';
import Api from '@/services/Api';
import Image from 'next/image';
import { GoDotFill } from "react-icons/go";
import { useLocale } from 'next-intl';

const AboutMeSection = () => {

    const boxRef = useRef<HTMLDivElement>(null);
    const locale = useLocale()
    const didFetchData = useRef<boolean>(false);
    const [aboutData, setAboutData ] = useState();

    const fetchData = useCallback(async () => {
        const request = await Api.get('/about-us');
        setAboutData(request.data);
    }, []);

    const handleResise = () => {
        if (boxRef.current) {
            const inner = boxRef.current.querySelector(".about-media");
            console.log(inner?.children[3]);
            const img = inner?.children[2].querySelector('.overflow-hidden') as HTMLElement;
            const img3 = inner?.children[3].querySelector('.overflow-hidden') as HTMLElement;
            if (screen.orientation.angle === 0 && screen.width <= 430) {
                (inner as HTMLElement).style.height = "580px";
                img.style.width = "280px";
                img.style.height = "280px";
                img3.style.top = "21%";
            }else{
                (inner as HTMLElement).style.height = "unset";
                img.removeAttribute('style');
                img3.removeAttribute('style');
            }
        }
    }

    useEffect(()=>{
        if(didFetchData.current === true) return;
        didFetchData.current = true;
        fetchData();
    })
    useEffect(() => {
        const timer = setTimeout(() => {
            handleResise()
        }, 0);

        return () => clearTimeout(timer);
    }, [aboutData, locale]);

    useEffect(() => {
        const handleOrientationChange = () => {
            if(screen.orientation.angle === 0 || screen.orientation.angle === 180) {
                handleResise()
            }
        };
        screen.orientation.addEventListener('change', handleOrientationChange);

        return () => {
            screen.orientation.removeEventListener('change', handleOrientationChange);
        };
    }, []);

    return (
    <div >
        <div ref={boxRef} className="container px-2 md:px-0" id="about" dangerouslySetInnerHTML={{ __html: aboutData?.[`detail_${locale}`] ?? "" }}/>
        {/* <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 xl:mb-5">
                <div className="text-black font-bold text-xl xl:text-[36px]">IBS Machinex (Thailand) Company Limited</div>
            </div>
            <div className="col-span-12 md:col-span-6">
                <div className="p-5 border rounded-2xl bg-white/60">
                    <p className="text-gray-700 font-light">IBS Machinex (thailand) Co.,Ltd. imports and distributes industrial machinery, tools. and equipment, providing complete solution from product to warehouse management. We specialize in packaging equipment and shelving systems, sourcing high-quality products from top manufacturers. Out expert team offers consultation, technical support, and efficient product sourcing to meet driverse industry needs.</p>
                </div>
                <div className="p-5 border rounded-2xl bg-white/60 mt-5 shadow-1 xl:mt-10">
                    <h5 className="py-1 px-2 bg-blue-800 text-white rounded-md mb-2">Information</h5>
                    <div className="text-gray-700 text-sm">
                        <div className="grid grid-cols-12 gap-4 space-y-3">
                            <div className="col-span-5"><span className="font-semibold">Company name: </span></div>
                            <div className="col-span-7">IBS Machinex (Thailand) Co.,Ltd.</div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 space-y-3">
                            <div className="col-span-5"><span className="font-semibold">Address:</span></div>
                            <div className="col-span-7"><p>116/102 4th Floor, Na Ranong Road, Klongtoey, Klongtoey Bangkok 10110 Thailand.</p></div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 space-y-3">
                            <div className="col-span-5"><span className="font-semibold">Capital:</span></div>
                            <div className="col-span-7"><p>5,000,000 THB</p></div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 space-y-3">
                            <div className="col-span-5"><span className="font-semibold">Number of persons:</span></div>
                            <div className="col-span-7"><p>16 persons</p></div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 space-y-3">
                            <div className="col-span-5"><span className="font-semibold">Set up:</span></div>
                            <div className="col-span-7"><p>May, 2012</p></div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 space-y-3">
                            <div className="col-span-5"><span className="font-semibold">About company:</span></div>
                            <div className="col-span-7"><p>Sell machine tools and flow control equipment.</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-12 md:col-span-6 relative">
                <div className="absolute top-0 left-0 bg-blue-800 rounded-2xl p-5 text-white">
                    <div className="flex gap-3 font-bold text-4xl">
                        <div>10</div>
                        <div>Years</div>
                    </div>
                    <p className='text-2xl font-bold text-center'>Experience</p>
                </div>
                <div className="absolute top-0 right-[20%] w-[119px] h-[116px] rounded-2xl overflow-hidden">
                    <img src="/images/about/image (1).png" alt="experience" className="h-[120%] object-cover"/>
                </div>
                <div className="absolute top-[40%] left-5">
                    <div className=" w-[119px] h-[116px] rounded-2xl overflow-hidden">
                        <img src="/images/about/image.png" alt="experience" className="w-full h-full object-cover !important"/>
                    </div>
                </div>
                <div className="absolute top-[25%] right-[28%]">
                    <div className="w-[334px] h-[328px] rounded-2xl overflow-hidden">
                        <img src="/images/about/image (3).png" alt="experience" className="w-full h-full object-cover !important"/>
                    </div>
                </div>
                <div className="absolute bottom-0 right-[10%] border-[7px] border-white rounded-2xl overflow-hidden">
                    <div className="w-[197px] h-[193px]">
                        <img src="/images/about/image (2).png" alt="experience" className="w-full h-full object-cover !important"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-12 gap-5 mt-10">
            <div className="col-span-6 md:col-span-4 xl:col-span-3">
                <div className="p-5 border rounded-2xl bg-white/60">
                    <div><Image alt="Material Support" width={69} height={69} src="/images/about/game-icons_materials-science.png"/></div>
                    <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Material Support</div>
                    <div className="text-gray-700"><p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p></div>
                </div>
            </div>
            <div className="col-span-6 md:col-span-4 xl:col-span-3">
                <div className="p-5 border rounded-2xl bg-white/60">
                    <div><Image alt="Production Support" width={69} height={69} src="/images/about/game-icons_materials-science (2).png"/></div>
                    <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Production Support</div>
                    <div className="text-gray-700"><p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p></div>
                </div>
            </div>
            <div className="col-span-6 md:col-span-4 xl:col-span-3">
                <div className="p-5 border rounded-2xl bg-white/60">
                    <div><Image alt="Warehouse & Stock Support" width={69} height={69} src="/images/about/Group 48.png"/></div>
                    <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Warehouse & Stock Support</div>
                    <div className="text-gray-700"><p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p></div>
                </div>
            </div>
            <div className="col-span-6 md:col-span-4 xl:col-span-3">
                <div className="p-5 border rounded-2xl bg-white/60">
                    <div><Image alt="Sale & Marketing Support" width={69} height={69} src="/images/about/game-icons_materials-science (1).png"/></div>
                    <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Sale & Marketing Support</div>
                    <div className="text-gray-700"><p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p></div>
                </div>
            </div>
        </div>
        <hr className="my-14" />
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <h3 className="text-blue-900 text-4xl font-bold">Network</h3>
                <p className="text-gray-800 text-sm md:text-base">Discover great opportunities, get expert career advice, and land your dream job fastrer!</p>
            </div>
            <div className="col-span-12 md:col-span-4 xl:col-span-4">
                <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden">
                    <Image 
                        src="/images/network-image.png" 
                        fill
                        className="object-cover"
                        alt="Network illustration"
                    />
                </div>
            </div>
            <div className="col-span-12 md:col-span-8 xl:col-span-8">
                <ul className="text-black">
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>IBS Inc. Tokyo branch, Chubu branch, Osaka branch, Kyusu Office</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>Shanhai IBS Trading CO,.LTD.</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>Hong Kong IBS Export &Import CO,.LTD.</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>IBS Machinex (Thailand) Co,.Ltd.</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>IBS AMERICA INC.</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>IBS MANUFACTURING VIETNAM CO.,LTD.</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>KUMKHO F.A (Agency)</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>SCH EQUIPMENT CO.,LTD. (Agency)</div></div>
                    <div className="flex space-y-2"><div className="mt-[3px]"><GoDotFill fontSize={20} className="text-red-700 w-6"/></div><div>PT IKEUCHI INDONESIA (Agency)</div></div>
                </ul>
            </div>
        </div> */}

    </div>
    )
}

export default AboutMeSection