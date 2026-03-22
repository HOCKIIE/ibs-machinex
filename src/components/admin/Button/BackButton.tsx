"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoChevronBackOutline } from "react-icons/io5";

export const BackButton = () => {
    const router = useRouter();
    const searchParam = useSearchParams();
    const Backward = () => {
        const redirect = searchParam.get('redirect');
        if(redirect) router.push(redirect);
    }
    return (
        <button type="button" className="flex items-center hover:bg-slate-100 text-black rounded-md ps-3 pe-4 py-1" onClick={Backward}><IoChevronBackOutline className="mr-2"/>Back</button>
    )
}