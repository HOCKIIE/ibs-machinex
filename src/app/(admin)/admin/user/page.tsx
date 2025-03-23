"use client"

import React,{ useState,useEffect, useCallback } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import AddButton from '@/components/admin/Button/AddButton';
import toast from 'react-hot-toast';
import UserProps from '@/types/UserType';
// import AxiosInstance from '@/utils/AxiosInstance';
import Api from '@/services/Api';

const show = [10, 50, 100];

const Users = () =>
{
    const [mounted, setMounted] = useState(false);
    const [user,setUser] = useState<UserProps[]>([])

    const fetchData = useCallback(async () => {
        try {
            const res = await Api.get('/user');
            setUser(res.data || []);
        } catch {
            toast.error("Failed to load data.")
        } finally {
            console.log("Sucess!")
        }
        console.log(user)
    }, []);

    useEffect(() => {
        fetchData();
        setMounted(true);
    }, [fetchData]);

    if (!mounted) return null; // Prevent SSR mismatches

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div className="left">
                        </div>
                        <div className="right">
                            <AddButton title="Add User" />
                        </div>
                    </div>
                </div>
                <div className="shadow-md sm:rounded-lg">
                    <div>Users</div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <caption className="p-5 text-md font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                            <div className="flex justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 dark:text-gray-400"> Show </span>
                                    <div className="relative bg-transparent">
                                        <select 
                                            title="Show entries"
                                            className="dark:bg-dark-900 h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2 pl-3 pr-8 text-sm text-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                                        >
                                            {Array.from(show).map((v:number,k:number)=><option key={k} value={v} className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">{v}</option>)}
                                        </select>
                                        <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <svg className="stroke-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400"> entries </span>
                                </div>
                            </div>
                        </caption>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3" style={{width:'3%'}}>No.</th>
                                <th scope="col" className="px-6 py-3" style={{width:'23%'}}>Name</th>
                                <th scope="col" className="px-6 py-3" style={{width:'23%'}}>Email</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Role</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Status</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Created</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user && user.map((v,k)=>
                                <tr key={k}>
                                    <td className="px-6 py-4">{k+1}</td>
                                    <td className="px-6 py-4">{v.name}</td>
                                    <td className="px-6 py-4">{v.email}</td>
                                    <td className="px-6 py-4">{v.role}</td>
                                    <td className="px-6 py-4">status</td>
                                    <td className="px-6 py-4">{v.created_at}</td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-white w-full">
                            <div className="flex justify-between w-full">
                                <div className="p-4">showing</div>
                                <div></div>
                            </div>
                        </tfoot>
                    </table>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Users