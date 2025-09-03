"use client";

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

import {useTranslations} from 'next-intl';

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
        <div className="fixed w-full bg-white z-20 shadow-sm">
            <div className="container md:px-0 flex justify-between">
                <div className="flex gap-1 items-center text-blue-900 text-sm h-12 lg:h-auto md:text-md xl:text-title-md md:font-semibold">
                    <img src="/images/logo.png" alt="IBS Machinex (Thailand) Company Limited"/>
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
    useEffect(()=>{
        if (SidebarActive) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    },[SidebarActive])
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
                    <button className="bg-blue-900 text-gray-400 px-3 py-2 rounded-md focus:ring ring-blue-300/50 focus:bg-blue-700 hover:bg-blue-700 hover:ring transition-all duration-300">TH</button>
                    <button className="bg-blue-900 text-gray-400 px-3 py-2 rounded-md focus:ring ring-blue-300/50 focus:bg-blue-700 hover:bg-blue-700 hover:ring transition-all duration-300">EN</button>
                </div>
            </div>
        </aside>
    </div>
    )
}