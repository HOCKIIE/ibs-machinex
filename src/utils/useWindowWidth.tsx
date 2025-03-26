"use client";
import { useState, useEffect } from "react";

const useWindowWidth = () => {
    const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 450);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, []);

    return width;
};

export default useWindowWidth;
