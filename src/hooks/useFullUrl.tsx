"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useFullUrl() {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [fullUrl, setFullUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const url =
                `${pathname}` +
                (searchParams.toString() ? `?${searchParams.toString()}` : "");
            setFullUrl(encodeURIComponent(url));
        }
    }, [pathname, searchParams]);

    return fullUrl;
}