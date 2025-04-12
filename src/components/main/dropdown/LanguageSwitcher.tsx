"use client"

import React,{ useEffect,useState,useRef } from 'react';
import { FiChevronDown } from "react-icons/fi";

export default function LanguageSwitcher()
{
    const lng = 'th'
    const languages = process.env.NEXT_PUBLIC_LANGUAGE?.split('|').filter((v)=>v!=lng);
    const [dropdown, setDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const LanguageToggle = (set:string) => {
        // setLanguage(set);
        setDropdown(!dropdown);
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    });
    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={()=>setDropdown(!dropdown)}
                data-dropdown-toggle="dropdown" 
                className="flex items-center gap-1 bg-blue-800 text-white font-light md:text-sm xl:text-base rounded-md ps-2 pe-1 py-[5px] cursor-pointer"
                type="button"
            >
                <span>TH</span><FiChevronDown />
            </button>
            <div id="dropdown" className={`${!dropdown?'hidden ':''}absolute z-20 mt-1 right-0 bg-white divide-y divide-gray-100 border border-gray-100 rounded-lg shadow-md w-20`}>
                <div className="py-2 text-sm text-gray-700">
                    <div>
                        {languages && languages.map((lang) => (
                        <div key={lang}>
                            <button onClick={() => LanguageToggle(lang)} type="button" className="block px-4 py-2 hover:bg-gray-200 w-full">
                                {lang.toUpperCase()}
                            </button>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

