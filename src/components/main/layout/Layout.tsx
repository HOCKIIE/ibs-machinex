"use client";

import { useRef, useState, useLayoutEffect } from "react";
import MenuItem from "@/assets/Menu.json"
import { BsTelephoneFill } from "react-icons/bs";
import { HiMiniUserCircle } from "react-icons/hi2";
import { RiCloseLargeFill } from "react-icons/ri";
import MenuToggle from "../button/MenuToggle";
import BackToTop from "../button/BackToTop";
import { useGlobal } from "@/contexts/PageSettingsContext";
import { useEffect } from "react";
import LanguageSwitcher from "../dropdown/LanguageSwitcher";
import { Link } from "@/i18n/routing";
import {useTranslations, useLocale} from 'next-intl';
import { motion, useTransform , useScroll, useMotionValue } from "framer-motion";

export const Header = () => {
    const t = useTranslations('header');
    const {ToggleSidebarHandle} = useGlobal();
    interface ScrollToEvent extends React.MouseEvent<HTMLAnchorElement> {
        currentTarget: HTMLAnchorElement;
    }

    const scrollTo = (el: ScrollToEvent): void => {
        const offset = 80;
        if (el.currentTarget.href.search(/#/) !== -1) {
            el.preventDefault();
            const ref = document.querySelector(el.currentTarget.hash) as HTMLElement | null;
            if (ref) {
                const y = ref.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };
    return <>
        <div className="sticky top-0 w-full bg-white z-20 shadow-sm">
            <div className="container md:px-0 flex justify-between">
                <div className="flex gap-1 items-center text-blue-900 text-sm h-12 lg:h-auto md:text-md xl:text-title-md md:font-semibold">
                    <img src="/images/logo.png" alt="IBS Machinex (Thailand) Company Limited" width={77} height={48}/>
                    <div>IBS Machinex (Thailand) Company Limited</div>
                </div>
                <div className="hidden lg:flex items-center gap-20">
                    <ul className="flex md:text-sm xl:text-base">
                        {MenuItem.map((item, index) => 
                            <li key={index}>
                                <Link className="block py-4 px-4 uppercase font-light text-black hover:bg-red-700 hover:text-white transition-all" href={item.href} onClick={scrollTo}>{t(`${item.key}`)}</Link>
                            </li>
                        )}
                    </ul>
                    <div>
                        <LanguageSwitcher/>
                    </div>
                </div>
                <div className="block lg:hidden">
                    <MenuToggle ToggleSidebarHandle={ToggleSidebarHandle}/>
                </div>
            </div>
        </div>
    </>
}
export const Footer = () => {
    return <>
        <BackToTop />
        <div className="bg-blue-900 text-gray-300">
            <div className="container px-2 xl:px-0">
                <div className="grid grid-cols-12 gap-4 pt-10 pb-3">
                    <div className="col-span-12 md:col-span-7 lg:col-span-6">
                        <h5 className="mb-6">IBS Machinex(Thailand) Co.,Ltd.</h5>
                        <p className="font-light">116/11 4th Floor, Soonthornkosa Road,<br/>
                            Klongtoey, Klongtoey Bangkok 10110<br/>
                            Tax ID: 0105555072251
                        </p>
                    </div>
                    <div className="col-span-12 md:col-span-5 lg:col-span-6">
                        <h5 className="mb-6 mt-5 md:mt-0">Contact us</h5>
                        <div className="flex gap-4 mb-2">
                            <BsTelephoneFill/> <a href="tel:02-312-0078" className="block "> 02-312-0078 (Head office)</a>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <HiMiniUserCircle/> 
                            <div className="font-light">
                                <span> K.Bum (Sales)</span><br/>
                                <a href="mailto:patznun@machinex.co.t"> patznun@machinex.co.th</a><br/>
                                <a href="tel:065-256-2226">065-256-2226</a><br/>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <HiMiniUserCircle/>
                            <div className="font-light">
                                <span> Mr.Fuji (Sales Japanese)</span><br/>
                                <a href="mailto:fujii@machinex.co.t"> fujii@machinex.co.th</a><br/>
                                <a href="tel:099-709-1624"> 099-709-1624</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-500 py-6 font-extralight text-gray-400">
                    &copy; 2025 IBS MACHINEX THAILAND
                </div>
            </div>
        </div>
    </>
}

export const Sidebar = () => {
    const t = useTranslations('header');
    const {SidebarActive,ToggleSidebarHandle} = useGlobal();
    const locale = useLocale();
    const languages = process.env.NEXT_PUBLIC_LANGUAGE?.split('|');
    useEffect(()=>{
        if (SidebarActive) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    },[SidebarActive]);

    return (
    <div className={`fixed z-9999 flex inset-0 transition-opacity duration-300 ${SidebarActive ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className={`bg-black/20 backdrop-blur-md h-full w-full transition-opacity duration-300 ${SidebarActive?` opacity-100`:` opacity-0`}`}></div>
        <aside className={`bg-blue-950 w-[85%] md:w-[35%] h-full fixed top-0 right-0 transform transition-transform duration-300 ${SidebarActive ? "translate-x-0" : "translate-x-full"}`}>
            {/* <div className="backdrop bg-black-2/20 w-full h-full"></div> */}
            <div className="p-1 pe-2">
                <div className="flex justify-end">
                    <button title="Close sidebar" onClick={ToggleSidebarHandle} className="flex items-center justify-center rounded-full w-10 h-10 bg-gray-100 text-gray-500 hover:bg-red-200 hover:text-red-600 focus:bg-red-200 focus:text-red-600 focus:ring ring-red-200/50 transition-all duration-300"><RiCloseLargeFill fontSize={20}/></button>
                </div>
            </div>
            <div className="mt-3 p-2">
                <ul className="text-gray-700">
                    {MenuItem.map((item, index) => 
                        <li key={index}>
                            <a 
                                href={item.href} 
                                title={item.title} 
                                className="block px-4 p-3 uppercase text-white hover:bg-red-600 hover:text-white transition-all duration-500 rounded-xl"
                            >{t(`${item.key}`)}</a>
                        </li> 
                    )}
                </ul>
                <div className="flex gap-3 ps-4 pt-3">
                    {languages && languages.map((lang) => (
                        <Link 
                            key={lang}
                            href="/" 
                            locale={lang}  
                            className={` ${lang== locale ? `text-slate-50 bg-blue-700`:`text-gray-400 bg-blue-900`} px-3 py-2 rounded-md focus:ring ring-blue-300/50 focus:bg-blue-700 hover:bg-blue-700 hover:ring transition-all duration-300`}
                        >
                            {(lang == 'ja')? `JP` : lang.toUpperCase()}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    </div>
    )
}

export const VideoBackground = () => {

    const containerRef = useRef<HTMLElement | null>(null);
    const scrollY = useMotionValue(0);
    const [hideVideo, setHideVideo] = useState(false);
    const [heightLimit, setHeightLimit] = useState<number>(0);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.4],
        ["#1e293b", "#ffffff"] // slate-800 → white
    );

    useLayoutEffect(() => {
        const update = () => {
            const h = containerRef.current?.offsetHeight || window.innerHeight;
            setHeightLimit(h);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    useEffect(() => {
        if (hideVideo) return;
        const onScroll = () => {
            scrollY.set(window.scrollY);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [hideVideo, scrollY]);

    useEffect(() => {
        if (hideVideo) return;
        const unsubscribe = scrollY.on("change", (value) => {
            if (heightLimit > 0 && value >= heightLimit) setHideVideo(true);
        });

        return () => unsubscribe();
    }, [hideVideo, scrollY, heightLimit]);

    const fadeEnd = Math.max(1, heightLimit * 0.4);
    const opacity = useTransform(scrollY, [0, fadeEnd], [1, 0]);
    const scale = useTransform(scrollY, [0, fadeEnd], [1, 1.15]);
    const translateY = useTransform(scrollY, [0, fadeEnd], [0, -80]);
    const zIndex = useTransform(scrollY, [0, fadeEnd], [50, 0]);

    return (
        <motion.section 
            ref={containerRef} 
            style={{backgroundColor}}
            className={`relative ${hideVideo?`h-auto`:`h-[160vh]`} z-50 overflow-hidden`}
        >
            {!hideVideo && (
                <motion.div
                    style={{ opacity, scale, translateY, zIndex }}
                    className="fixed top-0 left-0 w-full h-screen z-50 pointer-events-none overflow-hidden"
                >
                    <iframe
                        className="absolute top-1/2 left-1/2 w-[110vw] h-[110vh] -translate-x-1/2 -translate-y-1/2"
                        src="https://www.youtube.com/embed/wlHwjkYpSr0?autoplay=1&mute=1&controls=0&loop=1&playlist=wlHwjkYpSr0&playsinline=1&modestbranding=1"
                        title="YouTube video player"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                    />
                </motion.div>
            )}
            <div className="absolute bottom-[30vh] w-full text-center p-10">
                <h1 className="text-4xl font-bold text-blue-900">IBS MACHINEX (THAILAND) COMPANY LIMITED</h1>
            </div>
        </motion.section>
    )
}