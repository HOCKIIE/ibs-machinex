"use client"

import React, { useEffect, useRef, useState,useCallback } from 'react';
import Api from '@/services/Api';
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
            const img = inner?.children[2].querySelector('.overflow-hidden') as HTMLElement;
            const img3 = inner?.children[3].querySelector('.overflow-hidden') as HTMLElement;
            if (screen.orientation.angle === 0 && screen.width <= 430) {
                (inner as HTMLElement).style.height = "580px";
                img.style.width = "280px";
                img.style.height = "280px";
                img3.style.top = "21%";
            }else{
                (inner as HTMLElement)?.removeAttribute('style');
                img?.removeAttribute('style');
                img3?.removeAttribute('style');
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
        <div ref={boxRef} className="container px-2 md:px-0" id="about" dangerouslySetInnerHTML={{ __html: aboutData ? aboutData[`detail_${locale}`] : "" }}/>
    </div>
    )
}

export default AboutMeSection