"use client";

import React,{ useState, useEffect } from 'react';
import Link from 'next/link';
import { BiTrash } from "react-icons/bi";
import { LuPencil } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import usePagination from '@/hooks/usePagination';
import { Paginate, LimitPerPage, SearchBar } from '@/components/admin/Paginate/Paginate';
import useCategoryStore from "@/store/useCategoryStore"
import AddButton from '@/components/admin/Button/AddButton';
import ActionModal from '@/components/admin/Modal/ActionModal';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import AnimatedCheckbox from '@/components/admin/Checkbox/AdnimatedCheckbox';
import { CategoryType } from '@/types/CategoryType';
import { useCurrentUrl } from '@/utils/useCurrentUrl';
// import Image from 'next/image';

interface SelectDeleteProps { event: React.MouseEvent<HTMLButtonElement>; }
const show = [10, 25, 50, 100];
const recordStatus = [
    {value:"all", label:"All"},
    {value:"true", label:"Active"},
    {value:"false", label:"Not Active"}
];

const Category = () =>
{
    const [mounted, setMounted] = useState(false);
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
        endpoint: '/admin/category'
    });
    const currentUrl = useCurrentUrl();
    const { isLoading, error, deleteData, response } = useCategoryStore();
    const [id, setId] = useState<number[] | null>(null);
    const [isOpen, setModalOpen] = useState<boolean>(false);
    const [isAction, setAction] = useState<string>("delete");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectDelete, setSelectDelete] = useState<boolean>(true)
    const isAllSelected = selectedIds.length > 0;
    const [redirect,setRedirect] = useState<string|null>(null)

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
            setSelectDelete(true)
        }else{
            if(data && data.length>0){
                setSelectedIds(data.map((item:CategoryType) => Number(item.id)));
                setSelectDelete(false)
            }
        }
    };
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        if(selectedIds.length> 0) setSelectDelete(false);
    };

    const SelectDelete: React.FC<SelectDeleteProps> = ({ event }) => {
        useEffect(() => {
            console.log(event.target);
            console.log(selectedIds);
        }, [event]);

        return null;
    };

    const deleteRecord = async() => {
        const ids = id?.join(',');
        if (ids !== null) {
            await deleteData(`${ids}`);
            successProgress();
        }
    }
    const successProgress = () => {
        response.status = null;
        response.message = null;
        setModalOpen(!isOpen);
    }

    const closeModal = () => {
        setModalOpen(false);
        successProgress();
    }
    
    useEffect(()=> setRedirect(currentUrl), [currentUrl,setRedirect])
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null; // Prevent SSR mismatches

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>
                        <div className="flex gap-3 right">
                            <StatusTab status={recordStatus}/>
                            <AddButton title="Add Category" href={`/admin/category/add?redirect=${redirect}`}/>
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
                                    onClick={(e) => <SelectDelete event={e} />}
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
                                <th scope="col" className="px-6 py-3" style={{width:"3%"}}><AnimatedCheckbox checked={isAllSelected} onChange={toggleSelectAll}/></th>
                                <th scope="col" className="px-6 py-3" style={{width:"55%"}}>Title</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Created At</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((v:CategoryType,index) => 
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
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <img className="w-10 h-10 rounded-full" 
                                                        src={`${v.image}` || '/storage/fallback-image.jpg'} 
                                                        alt={v.title_en}
                                                    />
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        <span className="p-[3px] bg-green-200 text-blue-600 rounded-md text-[11px] me-1">TH</span>{v.title_th}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        <span className="p-[3px] bg-blue-200 text-blue-600 rounded-md text-[11px] me-1">EN</span>{v.title_en}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        <span className="p-[3px] bg-red-200 text-blue-600 rounded-md text-[11px] me-1">JA</span>{v.title_ja}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </td>
                                    <td className="px-6 py-4">{v.status}</td>
                                    <td className="px-6 py-4">{v.created_at}</td>
                                    <td className="px-6 py-4">
                                        {!loading
                                            ? <div className="flex gap-2">
                                                <button 
                                                    title="Delete"
                                                    onClick={()=>{setModalOpen(!isOpen); setAction("delete"); setId([Number(v.id)])}}
                                                    className="p-1 rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-500 dark:bg-gray-700 dark:hover:bg-red-700 dark:hover:text-red-200">
                                                    <BiTrash fontSize={24}/>
                                                </button>
                                                <Link 
                                                    type="button"
                                                    href={`category/${v.id}?redirect=${redirect}`}
                                                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-500 dark:hover:text-white/90">
                                                    <LuPencil fontSize={20}/>
                                                </Link>                                                
                                            </div>
                                            : <div className="flex-1 space-y-6 py-1">
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
                    progress: isLoading,
                    successProgress: successProgress,
                    response: { 
                        status: typeof response.status === 'boolean' ? response.status : null, 
                        message: response.message 
                    },
                    error: error
                }}
            />
        </DefaultLayout>
    )
}

export default Category