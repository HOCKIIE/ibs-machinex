"use client"

import React,{ useEffect, useState, useCallback, useRef } from 'react';
import { BiTrash } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import AddButton from '@/components/admin/Button/AddButton';
import usePagination from '@/hooks/usePagination';
import { Paginate, LimitPerPage, SearchBar } from '@/components/admin/Paginate/Paginate';
import AnimatedCheckbox from '@/components/admin/Checkbox/AdnimatedCheckbox';
import useBlogStore from '@/store/useBlogStore';
import ActionModal from '@/components/admin/Modal/ActionModal';
import { BlogType } from '@/types/BlogType';
import { useCurrentUrl } from '@/utils/useCurrentUrl';
import { EditButton, DeleteButton } from '@/components/admin/ui/ActionButton';
import Badge from '@/components/admin/ui/Badge';

const show = [10, 25, 50, 100];
const recordStatus = [
    {value:"all", label:"All"},
    {value:"true", label:"Active"},
    {value:"false", label:"Not Active"}
];

const Blog = () => {

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
        endpoint: '/admin/blog' 
    });

    const { deleteData, response } = useBlogStore();
    const [progress, setProgress] = useState(false);
    const currentUrl = useCurrentUrl();
    const [redirect, setRedirect] = useState<string|null>(null);
    const [isAction, setAction] = useState<string>("delete");
    const [isOpen, setModalOpen] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const didFetchData = useRef(false);
    const [id, setId] = useState<number[] | null>(null);
    const isAllSelected = selectedIds.length > 0;
    
    useEffect(() => { setRedirect(currentUrl) },[currentUrl]);
    useEffect(() => {
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    },[]);

    const toggleSelectAll = useCallback(() => {
        if (isAllSelected) {
            setSelectedIds([]);
        }else{
            setSelectedIds(data.map((item:BlogType) => Number(item.id)));
        }
    }, [data, isAllSelected]);

    const toggleSelect = useCallback((id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    },[]);
    
    const deleteRecord = useCallback(async() => {
        if (!id) return;
        setProgress(true);
        try {
            const ids = id?.join(',');
            if (ids !== null) {
                await deleteData(ids?.split(',') || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProgress(false);
        }
    },[id, deleteData]);

    const openModal = useCallback((id: number) => {
        setId([id]);
        setAction("delete");
        setModalOpen(true);
    }, []);
    
    const closeModal = useCallback(() => {
        setModalOpen(false);
        fetchData();
    }, [fetchData]);
    
    const handleBulkDelete = useCallback(() => {
        if (!selectedIds.length) return;
        //@ts-ignore
        openModal(selectedIds);
    }, [selectedIds, openModal]);


    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>
                        <div className="flex gap-3 right">
                            <StatusTab status={recordStatus}/>
                            <AddButton title="Add Blog" href={`/admin/blog/add?redirect=${redirect}`}/>
                        </div>
                        
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200/60">
                    <div className="p-5 text-md font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                            <div className="flex justify-between w-full">
                                <div className='flex gap-3'>
                                    <LimitPerPage show={show} limit={limit} updateLimit={updateLimit}/>
                                    <button 
                                        disabled={!isAllSelected}
                                        onClick={handleBulkDelete}
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
                                    <th scope="col" className="px-6 py-3"><AnimatedCheckbox checked={isAllSelected} onChange={toggleSelectAll}/></th>
                                    <th scope="col" className="px-6 py-3" style={{width:'65%'}}>
                                        TItle
                                    </th>
                                    <th scope="col" className="px-6 py-3" style={{width:'20%'}}>
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 && data.map((v:BlogType, index) => (
                                    <tr key={index} className="bg-white dark:bg-gray-800">
                                        <td className="px-6 py-4">
                                            {loading
                                                ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                                :<AnimatedCheckbox className="select" checked={selectedIds.includes(Number(v.id))} onChange={()=>toggleSelect(Number(v.id))}/>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <img className="w-10 h-10 rounded-full" 
                                                        src={`${v.image}` || '/storage/fallback-image.jpg'}
                                                    />
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        <Badge variant="success" title={'TH'} className='mr-1'/>
                                                        {v.title_th}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        <Badge variant="primary" title={'EN'} className='mr-1'/>
                                                        {v.title_en}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        <Badge variant="pink" title={'JA'} className='mr-1'/>
                                                        {v.title_ja}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{v.category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                        {!loading?
                                            <div className="flex gap-2">
                                                <DeleteButton onClick={() => openModal(Number(v.id))} />
                                                <EditButton href={`blog/${v.id}?redirect=${redirect}`}/>                                            
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
                                ))}
                                {data.length == 0 && 
                                    <tr>
                                        <td className="px-6 py-3 text-center" colSpan={5}>No item</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <div className="dark:bg-gray-700 rounded-b-md overflow-hidden">
                            <div className="h-8 bg-gray-50 w-full dark:bg-gray-700 dark:text-gray-400"></div>
                            <Paginate meta={meta} prevPage={prevPage} handlePageChange={handlePageChange} nextPage={nextPage} />
                        </div>
                    {/* </div> */}
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
                    progress: progress,
                    successProgress: fetchData,
                    response: {
                        status: typeof response.status == 'boolean' ? response.status : null,
                        statusCode: typeof response.statusCode == 'number' ? response.statusCode : null, 
                        message: typeof response.message == 'string' ? response.message : null 
                    }
                }}
            />
        </DefaultLayout>
    )
}

export default Blog