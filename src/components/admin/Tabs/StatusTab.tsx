"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'



const StatusTab = () => 
{
    const searchParams = useSearchParams();
    const classNames = {
        active: "px-2 py-1 rounded-md bg-white dark:bg-gray-600 text-black-2 dark:text-gray-300",
        default: "px-2 py-1 rounded-md bg-transparent"
    }
    function updateStatus (
        e: React.MouseEvent<HTMLButtonElement>,
        statustOrder: string
    ){
        const params = new URLSearchParams(searchParams.toString())
        params.set('status', statustOrder)
        window.history.pushState(null, '', `?${params.toString()}`);
        SetActive(e)
    }

    function SetActive(e: React.MouseEvent<HTMLButtonElement>): void {
        const thisElement = (e.target as HTMLButtonElement);
        thisElement.setAttribute('class', classNames.active);
        thisElement.closest('.flex')?.querySelectorAll('button').forEach((item: HTMLButtonElement) => {
            item.setAttribute('class', (item == thisElement) ? classNames.active : classNames.default );
        })
        const params = new URLSearchParams(searchParams.toString());
        console.log('params', params.get('status'));
    }
    return (
        <div className="flex rounded-md overflow-hidden bg-gray-200 dark:bg-gray-900 p-[2px]">
            <button onClick={(e)=>updateStatus(e,'all')} className="px-2 py-1 rounded-md bg-white dark:bg-gray-600 text-black-2 dark:text-gray-300">All</button>
            <button onClick={(e)=>updateStatus(e,'active')} className="px-2 py-1 rounded-md">Active</button>
            <button onClick={(e)=>updateStatus(e,'draft')} className="px-2 py-1 rounded-md">Draft</button>
            <button onClick={(e)=>updateStatus(e,'archived')} className="px-2 py-1 rounded-md">Archived</button>
        </div>
    )
}

export default StatusTab