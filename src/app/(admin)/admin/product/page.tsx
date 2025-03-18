"use client";
// import Image from 'next/image';
import React,{ useState,useEffect } from 'react';
import { BiTrash } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { LuPencil } from "react-icons/lu";
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import usePagination from '@/hooks/usePagination';
import AddButton from '@/components/admin/Button/AddButton';
import Format from '@/utils/Format';
import ProductModal from '@/components/admin/Modal/ProductModal';
import ConfirmModal from '@/components/admin/Modal/ConfirmModal';
import { ProductProps } from '@/types/ProductProps';

const show = [10, 50, 100];

const Product = () => 
{
    const [mounted, setMounted] = useState(false);
    const { data, loading, skip,  limit, updateLimit, StatusTab, SearchBar, Paginate
    } = usePagination({ initialLimit: show[0] });
    const [TitleModal, setTitleModal] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null);

    const openCreateModal = () => {
        setEditingProduct(null); // Clear any previous product
        setIsModalOpen(true);
        setTitleModal('Create Product')
    };
    
    const openEditModal = (product: ProductProps) => {
        setEditingProduct(product);
        setIsModalOpen(true);
        setTitleModal('Edit Product')
    };

    const handleSave = (product: ProductProps) => {
        if (product.id) {
          // Update existing product
          setProducts((data) => data.map((p) => (p.id === product.id ? product : p)));
          toast.success("Product updated!");
        } else {
          // Create new product
          const newProduct = { ...product, id: Date.now() };
          setProducts((data) => [...data, newProduct]);
          toast.success("Product created!");
        }
      };
    
    const closeModal = () => {
        setIsModalOpen(false);
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
                            <div className="left">
                                <StatusTab status={["all", "active", "draft", "archived"]}/>
                            </div>
                            <div className="right">
                                <AddButton title="Add Product" onCreate={openCreateModal}/>
                            </div>
                        </div>
                    </div>
                    <div className="shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <caption className="p-5 text-md font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                <div className="flex justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 dark:text-gray-400"> Show </span>
                                        <div className="relative bg-transparent">
                                            <select 
                                                title="Show entries"
                                                onChange={(e) => updateLimit(Number(e.target.value))}
                                                defaultValue={limit}
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
                                    <SearchBar/>
                                </div>
                            </caption>
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3" style={{width:'3%'}}>No.</th>
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
                                            {loading?<div className="h-2 bg-slate-700 rounded col-span-2"></div>:(skip>=10)?(skip+(index+1)):(index+1)}
                                        </td>
                                        <td className="px-6 py-4" width={720}>
                                            {loading?
                                                <div className="flex space-x-4">
                                                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                                                <div className="flex-1 space-y-6 py-1">
                                                    <div className="space-y-3">
                                                        <div className="h-2 bg-slate-700 rounded w-full"></div>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div className="h-2 bg-slate-700 rounded w-full"></div>
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
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {product.description}
                                                    </div>
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
                                                    <div className="h-2 bg-slate-700 rounded mt-0 pt-0"></div>
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
                                                        <div className="h-2 bg-slate-700 rounded mt-0 pt-0"></div>
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
                                                    <div className="h-2 bg-slate-700 rounded mt-0 pt-0"></div>
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
                                                        <div className="h-2 bg-slate-700 rounded mt-0 pt-0"></div>
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
                                                        <div className="h-2 bg-slate-700 rounded mt-0 pt-0"></div>
                                                        <div className="h-2 rounded mt-0 pt-0"></div>
                                                    </div>
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {!loading?
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={()=>ConfirmModal('delete')}
                                                    className="p-1 rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-500 dark:bg-gray-700 dark:hover:bg-red-700 dark:hover:text-red-200">
                                                    <BiTrash fontSize={24}/>
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={()=>openEditModal(product)}
                                                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-500 dark:hover:text-white/90">
                                                    <LuPencil fontSize={20}/>
                                                </button>                                                
                                            </div>
                                            :
                                            <div className="flex-1 space-y-6 py-1">
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="h-2 bg-slate-700 rounded"></div>
                                                        <div className="h-2 bg-slate-700 rounded"></div>
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
                            <Paginate />
                        </div>
                        
                    {/* </div> */}
                </div>
            </div>
            <ProductModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} initialData={editingProduct} title={TitleModal} />
        </DefaultLayout>
    )
}

export default Product