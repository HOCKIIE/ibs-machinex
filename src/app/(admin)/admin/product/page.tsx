"use client";

import React,{ useState,useEffect } from 'react';
import Link from 'next/link';
import { BiTrash } from "react-icons/bi";
// import { toast } from "react-hot-toast";
import { LuPencil } from "react-icons/lu";
import AnimatedCheckbox from '@/components/admin/Checkbox/AdnimatedCheckbox';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import ConfirmModal from '@/components/admin/Modal/ConfirmModal';
import AddButton from '@/components/admin/Button/AddButton';
import { IoSearchOutline } from "react-icons/io5";
import usePagination from '@/hooks/usePagination';
import Format from '@/utils/Format';
import { Paginate, LimitPerPage } from '@/components/admin/Paginate/Paginate';
import SearchBar from '@/components/admin/Paginate/SearchBar';

const show = [10, 25, 50, 100];

const Product = () => 
{
    const apiPath = ``
    const [mounted, setMounted] = useState(false);
    const [selectDelete, setSelectDelete] = useState<boolean>(true)
    const { 
        data, loading, 
        skip, limit, to, totalItems,  
        prevPage, nextPage, currentPage,
        updateLimit, StatusTab, keyword, handleSearch, handlePageChange
    } = usePagination({ initialLimit: show[0] });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const isAllSelected = selectedIds.length > 0;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
            setSelectDelete(true)
        }else{
            setSelectedIds(data.map((item) => item.id));
            setSelectDelete(false)
        }
    };
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        if(selectedIds.length> 0) setSelectDelete(false);
    };
    interface SelectDeleteProps {
        event: React.MouseEvent<HTMLButtonElement>;
    }

    const SelectDelete: React.FC<SelectDeleteProps> = ({ event }) => {
        useEffect(() => {
            console.log(event.target);
            console.log(selectedIds);
        }, [event]);

        return null;
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent SSR mismatches

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
                    <div className="control-button mb-3">
                        <div className="flex justify-between">
                            <div><Breadcrumb /></div>
                            <div className="flex gap-3 right">
                                <StatusTab status={["all", "active", "draft", "archived"]}/>
                                <AddButton title="Add Product" href="/admin/product/add"/>
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
                                    <th scope="col" className="px-6 py-3" style={{width:'3%'}}><AnimatedCheckbox checked={isAllSelected} onChange={toggleSelectAll}/></th>
                                    <th scope="col" className="px-6 py-3" style={{width:'60%'}}>Product name</th>
                                    <th scope="col" className="px-6 py-3">Brand</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Price</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3" style={{width:'10%'}}>Created</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 && data.map((product,index) => 
                                    <tr key={index} className={`bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-900 transition-all ease-in-out ${loading ? ' animate-pulse' : ''}`}>
                                        <td className="px-6 py-4">
                                            {loading
                                                ?<div className="h-2 bg-gray-300 dark:bg-slate-700 rounded col-span-2"></div>
                                                :<AnimatedCheckbox className="select" checked={selectedIds.includes(product.id)} onChange={()=>toggleSelect(product.id)}/>
                                            }
                                        </td>
                                        <td className="px-6 py-4" width={720}>
                                            {loading?
                                            <div className="flex space-x-4 h-[60px] justify-center items-center">
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
                                            :
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <img className="w-10 h-10 rounded-full" 
                                                        src={product.thumbnail} 
                                                        alt={product.title}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        {product.title}
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 h-[40px] line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {!loading?
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{product.brand}</div>
                                            :
                                            <div className="flex-1 space-y-6 py-1">
                                                <div className="space-y-3">
                                                    <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded mt-0 pt-0"></div>
                                                    <div className="h-2 rounded mt-0 pt-0"></div>
                                                </div>
                                            </div>
                                            }
                                            
                                        </td>
                                        <td className="px-6 py-4">
                                            { !loading ?
                                                <div className="text-sm text-gray-900 dark:text-gray-200">{product.category}</div>
                                            :
                                                <div className="flex-1 space-y-6 py-1">
                                                    <div className="space-y-3">
                                                        <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded mt-0 pt-0"></div>
                                                        <div className="h-2 rounded mt-0 pt-0"></div>
                                                    </div>
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {!loading?
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{Format.number(product.price,2)}</div>
                                            :
                                            <div className="flex-1 space-y-6 py-1">
                                                <div className="space-y-3">
                                                    <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded mt-0 pt-0"></div>
                                                    <div className="h-2 rounded mt-0 pt-0"></div>
                                                </div>
                                            </div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            { !loading ?
                                                <div className="text-sm text-gray-900 dark:text-gray-200">
                                                    <div className="flex items-center">
                                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Online
                                                    </div>
                                                </div>
                                            :
                                                <div className="flex-1 space-y-6 py-1">
                                                    <div className="space-y-3">
                                                        <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded mt-0 pt-0"></div>
                                                        <div className="h-2 rounded mt-0 pt-0"></div>
                                                    </div>
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            { !loading ?
                                                <div className="text-sm text-gray-900 dark:text-gray-200">{Format.date(product.meta.createdAt)}</div>
                                            :
                                                <div className="flex-1 space-y-6 py-1">
                                                    <div className="space-y-3">
                                                        <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded mt-0 pt-0"></div>
                                                        <div className="h-2 rounded mt-0 pt-0"></div>
                                                    </div>
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {!loading?
                                            <div className="flex gap-2">
                                                <button 
                                                    title="Delete"
                                                    onClick={()=>ConfirmModal('delete')}
                                                    className="p-1 rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-500 dark:bg-gray-700 dark:hover:bg-red-700 dark:hover:text-red-200">
                                                    <BiTrash fontSize={24}/>
                                                </button>
                                                <Link 
                                                    type="button"
                                                    href={`product/${product.id}`}
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
                                {data.length == 0 && 
                                    <tr>
                                        <td className="px-6 py-3 text-center" colSpan={5}>No item</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <div className="dark:bg-gray-700 rounded-b-md overflow-hidden">
                            <div className="h-8 bg-gray-50 w-full dark:bg-gray-700 dark:text-gray-400"></div>
                            <Paginate 
                                skip={skip} 
                                to={to} 
                                totalItems={totalItems} 
                                prevPage={prevPage} 
                                currentPage={currentPage}
                                handlePageChange={handlePageChange} 
                                nextPage={nextPage} 
                            />
                        </div>
                        
                    {/* </div> */}
                </div>
            </div>
            {/* <ProductModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} initialData={editingProduct} title={TitleModal} /> */}
        </DefaultLayout>
    )
}

export default Product