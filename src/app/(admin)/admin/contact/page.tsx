"use client"

import React, {useState, useCallback} from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import AnimatedCheckbox from '@/components/admin/Checkbox/AdnimatedCheckbox';
import { Paginate, LimitPerPage, SearchBar, OrderBy } from '@/components/admin/Paginate/Paginate';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import usePagination from '@/hooks/usePagination';
import { BiTrash } from "react-icons/bi";
import ActionModal from '@/components/admin/Modal/ActionModal';
import useContactStore from '@/store/useContactStore';
import { DeleteButton } from '@/components/admin/ui/ActionButton';

const show = [10, 25, 50, 100];
interface ContactUcType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    source: string;
    status: boolean;
    createdAt: string;
}

const Contact = () => 
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
        handlerOrderBy
    } = usePagination<ContactUcType>({ 
        initialLimit: show[0],
        endpoint: '/admin/contact-us'
    });
    const { deleteData, response } = useContactStore();
    const [progress, setProgress] = useState(false);
    const [id, setId] = useState<number[] | null>(null);
    const [isOpen, setModalOpen] = useState<boolean>(false);
    const [isAction, setAction] = useState<string>("delete");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const isAllSelected = selectedIds.length > 0;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        }else{
            if(data && data.length>0){
                setSelectedIds(data.map((item:ContactUcType) => Number(item.id)));
            }
        }
    };
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };


    const deleteRecord = useCallback(async() => {
        setProgress(true);
        try{
            if (id && id.length > 0) {
                const { status, statusCode, message } = await deleteData(id);
                return { status, statusCode, message };
            }
            return {
                status: false,
                statusCode: 400,
                message: "Invalid id"
            };
        } catch (err) {
            return {
                status: false,
                statusCode: 500,
                message: err instanceof Error ? err.message : "Unknown error"
            }
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
                    </div>
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200/60">
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
                            <div className='flex gap-2'>
                                <OrderBy handlerOrderBy={(e) => handlerOrderBy(e)} />
                                <SearchBar keyword={keyword} handleSearch={(e) => handleSearch(e)} />
                            </div>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3" style={{width:'3%'}}><AnimatedCheckbox checked={isAllSelected} onChange={toggleSelectAll}/></th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>First name</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Last name</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Email</th>
                                <th scope="col" className="px-6 py-3" style={{width:'15%'}}>Source</th>
                                <th scope="col" className="px-6 py-3" style={{width:'37%'}}>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((v:ContactUcType,k:number)=> 
                                <tr key={k}>
                                    <td className="px-6 py-4">
                                        {loading
                                            ? <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            : <AnimatedCheckbox className="select" checked={selectedIds.includes(Number(v.id))} onChange={()=>toggleSelect(Number(v.id))}/>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ? <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            : v.firstName
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ? <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            : v.lastName
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ? <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            : v.email
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ? <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            : v.source
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {loading
                                            ? <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded"></div>
                                            : v.message
                                        }
                                    </td>
                                    <td>
                                    {!loading?
                                        <div className="flex gap-2">
                                            <DeleteButton onClick={() => openModal(Number(v.id))} />                                             
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

export default Contact