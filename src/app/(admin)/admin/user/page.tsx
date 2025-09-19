"use client"

import React,{ useState, useEffect } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import usePagination from '@/hooks/usePagination';
import { Paginate, LimitPerPage, SearchBar } from '@/components/admin/Paginate/Paginate';
import AnimatedCheckbox from '@/components/admin/Checkbox/AdnimatedCheckbox';
import useUserStore from '@/store/useUserStore';
import ActionModal from '@/components/admin/Modal/ActionModal';
import AddButton from '@/components/admin/Button/AddButton';
import { BiTrash } from "react-icons/bi";
import { LuPencil } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import Link from 'next/link';
import { useCurrentUrl } from '@/utils/useCurrentUrl';
import { UserType } from '@/types/UserType';

const show = [10, 50, 100];
const recordStatus = [
    {value:"all", label:"All"},
    {value:"true", label:"Active"},
    {value:"false", label:"Not Active"}
];

const Users = () =>
{
    const {
        keyword,
        data,
        meta,
        loading,
        limit,
        updateLimit,
        nextPage,
        prevPage,
        fetchData,
        handleSearch, 
        handlePageChange, 
        StatusTab
    } = usePagination({ 
        initialLimit: show[0],
        endpoint: '/admin/user'
    });

    const { isLoading, error, deleteUser, response } = useUserStore();
    const [isOpen, setModalOpen] = useState<boolean>(false);
    const [isAction, setAction] = useState<string>("delete");
    const [id, setId] = useState<number[] | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [redirect, setRedirect] = useState<string|null>(null)
    const isAllSelected = selectedIds.length > 0;
    const currentUrl = useCurrentUrl();

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        }else{
            setSelectedIds(data.map((item:UserType) => Number(item.id)));
        }
    };
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const newSelected = prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id];
            return newSelected;
        });
    };
    
    const setDeleteRecords = async() => {
        if(selectedIds.length > 0){
            setId(selectedIds)
        }
    }

    const deleteRecord = async() => {
        const ids = id?.join(',');
        if (ids !== null) await deleteUser(`${ids}`);
    }
    const successProgress = () => {
        response.status = null;
        response.message = null;
        fetchData();
    }
    const closeModal = () => {
        setModalOpen(false);
        successProgress();
    }
    

    useEffect(() => {
        console.log("🔄 URL changed:", currentUrl);
        setRedirect(currentUrl)
    }, [currentUrl,setRedirect]);
    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>
                        <div className="flex gap-3 right">
                            <StatusTab status={recordStatus}/>
                            <AddButton title="Add User" href={`/admin/user/add?redirect=${redirect}`}/>
                        </div>
                        
                    </div>
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200/60">
                    <div className="p-5 text-md font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        <div className="flex justify-between w-full">
                            <div className='flex gap-3'>
                                <LimitPerPage show={show} limit={limit} updateLimit={updateLimit}/>
                                <button 
                                    disabled={selectedIds.length > 0 ? false : true}
                                    onClick={()=>{setAction("delete"); setDeleteRecords(); setModalOpen(!isOpen)}}
                                    title="Remove from select"
                                    type="button"
                                    className="flex h-10 w-full px-2 max-w-10 items-center justify-center rounded-lg border disabled:border-gray-100 disabled:text-gray-200 disabled:hover:bg-white border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 hover:text-error-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-error-500"
                                ><BiTrash fontSize={24}/></button>
                            </div>
                            <div className='flex'>
                                <div className="relative">
                                    <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" title="Keyword">
                                        <IoSearchOutline fontSize={20}/>
                                    </button>
                                    <SearchBar keyword={keyword} handleSearch={(e) => handleSearch(e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3" style={{width:'3%'}}><AnimatedCheckbox checked={isAllSelected} onChange={toggleSelectAll}/></th>
                                <th scope="col" className="px-6 py-3" style={{width:'23%'}}>Name</th>
                                <th scope="col" className="px-6 py-3" style={{width:'23%'}}>Email</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Role</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Status</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Created</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((v:UserType,k:number)=>
                                <tr key={k}>
                                    <td className="px-6 py-4">
                                        {loading
                                            ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            :<AnimatedCheckbox className="select" checked={selectedIds.includes(Number(v.id))} onChange={()=>toggleSelect(Number(v.id))}/>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            :(v.name)
                                        }</td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            :(v.email)
                                        }</td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            :(v.role)
                                        }</td>
                                    <td className="px-6 py-4">
                                        {loading 
                                            ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            :(v.status == "1" ? 'Active':'Not Active')
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            :(v.created_at.split('T')[0].toString())
                                        }</td>
                                    <td className="px-6 py-4">
                                    {!loading?
                                        <div className="flex gap-2">
                                            <button 
                                                title="Delete"
                                                onClick={()=>{setModalOpen(!isOpen); setAction("delete"); setId([Number(v.id)])}}
                                                className="p-1 rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-500 dark:bg-gray-700 dark:hover:bg-red-700 dark:hover:text-red-200">
                                                <BiTrash fontSize={24}/>
                                            </button>
                                            <Link 
                                                type="button"
                                                href={`user/${v.id}?redirect=${redirect}`}
                                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-500 dark:hover:text-white/90">
                                                <LuPencil fontSize={20}/>
                                            </Link>                                                
                                        </div>
                                        :
                                        <div className="flex-1 space-y-6 py-1">
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                                    <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                                </div>
                                                <div className="h-2 rounded mt-0 pt-0"></div>
                                            </div>
                                        </div>
                                    }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="dark:bg-gray-700 rounded-b-md overflow-hidden">
                        <div className="h-8 bg-gray-50 w-full dark:bg-gray-700 dark:text-gray-400"></div>
                        <Paginate meta={meta} prevPage={prevPage} handlePageChange={handlePageChange} nextPage={nextPage} />
                    </div>
                </div>
            </div>
            <ActionModal 
                isOpen={isOpen} 
                action={isAction}
                onClose={() => setModalOpen(false)}
                onAfterClose={()=>fetchData}
                closeModal={closeModal}
                data={{
                    confirm: deleteRecord,
                    successProgress: closeModal,
                    progress: isLoading,
                    response: { 
                        status: typeof response.status === 'boolean' ? response.status : null, 
                        statusCode: typeof response.statusCode == 'number' ? response.statusCode : null,
                        message: response.message 
                    },
                    error: error
                }}
            />
        </DefaultLayout>
    )
}

export default Users