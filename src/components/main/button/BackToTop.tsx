"use client"
import { useState, useEffect } from "react";
import { FiChevronUp } from "react-icons/fi";
const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => setIsVisible((window.scrollY>200)?true:false);
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return <button 
        onClick={scrollToTop} 
        className={`fixed bottom-5 lg:bottom-25 xl:bottom-70 right-2 md:right-10 lg:right-20 xl:right-50 rounded-full bg-red-600 text-white ${isVisible?"opacity-100 scale-100" : "opacity-0 scale-0"}`}
        title="Back To Top"
    >
        <div className="flex items-center justify-center w-12 h-12 "><FiChevronUp fontSize={24} /></div>
    </button>
}
export default BackToTop