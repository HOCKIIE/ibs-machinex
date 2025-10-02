"use client"
import React,{ useEffect,useState,useRef } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import ProductForm from '@/components/admin/Form/ProductForm';
import useProductStore from '@/store/useProductStore';
import { ProductFormProps } from '@/types/ProductType';
import toast from 'react-hot-toast';

export default function Page({ params }: { params: { id: string } }){
    const  { id } = params;
    const router = useRouter();
    const { items, fetchDataById, updateData } = useProductStore();
    const didFetchData = useRef(false);
    const [ itemState, setItemState ] = useState<ProductFormProps>({
        id: "",
        image: "",
        thumbnail: "",
        image_alt: null,
        brand: [],
        categories: [],
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        detail_th: ``,
        detail_en: ``,
        detail_ja: ``,
        color: "",
        price: 0,
        quantity: 0,
        updated_at: "",
        isActive: false,
        published_at: "",
        created_at: ""
    });
    const handleSubmit = async (data: ProductFormProps) => await updateData(id, data, router);
    const fetchData = async() => await fetchDataById(id);
    
    useEffect(() => {
        if(didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    });

    useEffect(() => {
        if (items.length > 0) {
            setItemState({
                id: items[0].id ?? "",
                image: items[0].image ?? null,
                thumbnail: items[0].thumbnail ?? "",
                image_alt: items[0].image_alt ?? "",
                brand: items[0].brand ?? [],
                categories: items[0].categories ?? [],
                title_th: items[0].title_th ?? "",
                title_en: items[0].title_en ?? "",
                title_ja: items[0].title_ja ?? "",
                description_th: items[0].description_th ?? "",
                description_en: items[0].description_en ?? "",
                description_ja: items[0].description_ja ?? "",
                detail_th: items[0].detail_th ?? "",
                detail_en: items[0].detail_en ?? "",
                detail_ja: items[0].detail_ja ?? "",
                color: items[0].color ?? "",
                price: items[0].price ?? 0,
                quantity: items[0].quantity ?? 0,
                updated_at: items[0].updated_at ?? "",
                isActive: typeof items[0].isActive !== "undefined" ? items[0].isActive : false,
                published_at: items[0].published_at ?? "",
                created_at: items[0].created_at ?? ""
            });
        }
        // @ts-ignore
        if(items.status === true) {
        // @ts-ignore
            toast.success(items.message);
        }
        
    }, [items]);

    return <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb current={itemState.title_en}/></div>
                </div>
            </div>
    
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new product</h3>
                </div>
                <hr />
                <ProductForm 
                    itemState={itemState}
                    onSubmit={handleSubmit}
                    type="create"
                />
            </div>
        </div>
    </DefaultLayout>
}