"use client";

import React,{ useState,useEffect } from 'react';
import Link from 'next/link';
import { BiTrash } from "react-icons/bi";
import { LuPencil } from "react-icons/lu";
import AnimatedCheckbox from '@/components/admin/Checkbox/AdnimatedCheckbox';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import AddButton from '@/components/admin/Button/AddButton';
import { IoSearchOutline } from "react-icons/io5";
import useProductStore from '@/store/useProductStore';
import usePagination from '@/hooks/usePagination';
import Format from '@/utils/Format';
import { Paginate, LimitPerPage, SearchBar } from '@/components/admin/Paginate/Paginate';
import ActionModal from '@/components/admin/Modal/ActionModal';
import { BrandType } from '@/types/BrandType';
import { useCurrentUrl } from '@/utils/useCurrentUrl';

const show = [10, 25, 50, 100];
const recordStatus = [
    {value:"all", label:"All"},
    {value:"true", label:"Active"},
    {value:"false", label:"Not Active"}
];

const Brand = () => 
{
    const { 
        keyword,
        data,
        meta,
        loading,
        limit,
        prevPage, 
        nextPage,
        updateLimit,
        StatusTab, 
        fetchData,
        handleSearch, 
        handlePageChange
    } = usePagination({ 
        initialLimit: show[0],
        endpoint: '/admin/brand'
    });
    const { deleteData, response } = useProductStore();
    const [id, setId] = useState<number[] | null>(null);
    const [isOpen, setModalOpen] = useState<boolean>(false);
    const [progress, setProgress] = useState(false);
    const [isAction, setAction] = useState<string>("delete");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectDelete, setSelectDelete] = useState<boolean>(true)
    const isAllSelected = selectedIds.length > 0;
    const currentUrl = useCurrentUrl();
    const [redirect ,setRedirect] = useState<string|null>(null);

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
            setSelectDelete(true)
        }else{
            if(data && data.length>0){
                setSelectedIds(data.map((item:BrandType) => Number(item.id)));
                setSelectDelete(false)
            }
        }
    };
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id];
            setSelectDelete(updated.length === 0);
            return updated;
        });
    };

    const deleteRecord = async() => {
        setProgress(true);
        try{
            const ids = id?.join(',');
            if (ids !== null) {
                await deleteData(`${ids}`);
                successProgress();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProgress(false);
        }
    }
    const successProgress = () => {
        useProductStore.setState({ 
            response: { status: null, message: null, statusCode: null }
        });
        setModalOpen(!isOpen);
    }

    const closeModal = () => {
        setModalOpen(false);
        useProductStore.setState({ 
            response: { status: null, message: null, statusCode: null }
        });
        successProgress();
    }
    useEffect(()=>{
        setRedirect(currentUrl);
    },[currentUrl])

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>
                        <div className="flex gap-3 right">
                            <StatusTab status={recordStatus}/>
                            <AddButton title="Add Brand" href={`/admin/brand/add?redirect=${redirect}`}/>
                        </div>
                        
                    </div>
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200/60">
                    <div className="p-5 text-md font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        <div className="flex justify-between w-full">
                            <div className='flex gap-3'>
                                <LimitPerPage show={show} limit={limit} updateLimit={updateLimit}/>
                                <button 
                                    disabled={selectDelete}
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
                                <th scope="col" className="px-6 py-3" style={{width:'70%'}}>Title</th>
                                <th scope="col" className="px-6 py-3" style={{width:'10%'}}>Status</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Created</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((v:BrandType,index:number)=>
                            <tr key={index} className={`bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-900 transition-all ease-in-out ${loading ? ' animate-pulse' : ''}`}>
                                <td className="px-6 py-4">
                                    {loading
                                        ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded col-span-2"></div>
                                        :<AnimatedCheckbox className="select" checked={selectedIds.includes(Number(v.id))} onChange={()=>toggleSelect(Number(v.id))}/>
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    {loading
                                        ? <div className="flex space-x-4 h-[60px] justify-center items-center">
                                            <div className="rounded-full bg-gray-300 dark:bg-slate-700 h-10 w-10"></div>
                                            <div className="flex-1 space-y-6 py-1">
                                                <div className="space-y-3 h-[40px]">
                                                    <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded w-[50%]"></div>
                                                    <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded w-[85%]"></div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded w-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : <div className="flex items-center">
                                            <div className="flex-shrink-0 w-20 h-20">
                                                <img className="w-20 h-20 rounded-full" 
                                                    src={`${v.image}` || '/storage/fallback-image.jpg'} 
                                                    alt={v.title_en}
                                                />
                                            </div>
                                            <div className="ml-4 space-y-1">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                    <span className="p-1 bg-green-200 text-blue-600 rounded-lg text-xs me-1">TH</span>{v.title_th}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                    <span className="p-1 bg-blue-200 text-blue-600 rounded-lg text-xs me-1">EN</span>{v.title_en}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                    <span className="p-1 bg-rose-200 text-blue-600 rounded-lg text-xs me-1">JA</span>{v.title_ja}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </td>
                                <td className='px-6 py-4'>{v.status === true ? `On`:`Off`}</td>
                                <td className="px-6 py-4">
                                    { !loading ?
                                        <div className="text-sm text-gray-900 dark:text-gray-200">{Format.date(new Date(v.created_at))}</div>
                                    :
                                        <div className="flex-1 space-y-6 py-1">
                                            <div className="space-y-3">
                                                <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded mt-0 pt-0"></div>
                                                <div className="h-2 rounded mt-0 pt-0"></div>
                                            </div>
                                        </div>
                                    }
                                </td>
                                <td>
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
                                            href={`brand/${v.id}?redirect=${redirect}`}
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
                onAfterClose={fetchData}
                closeModal={closeModal}
                data={{
                    confirm: deleteRecord,
                    successProgress:successProgress,
                    progress: progress,
                    response: { 
                        status: typeof response.status === 'boolean' ? response.status : null, 
                        statusCode: typeof response.statusCode == 'number' ? response.statusCode : null,
                        message: response.message 
                    }
                }}
            />
        </DefaultLayout>
    )
}

export default Brand