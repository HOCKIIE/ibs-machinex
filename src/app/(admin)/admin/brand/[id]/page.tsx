"use client";

import React,{ useEffect, useState, useRef, use } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import BrandForm from '@/components/admin/Form/BrandForm';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import { BrandFormProps } from '@/types/BrandType';
import useBrandStore from '@/store/useBrandStore';

const Page = ({ params }:{ params: Promise<{id:string}> }) => {
    const { id } = use(params);
    const { items, fetchDataById, updateData } = useBrandStore();
    const didFetchData = useRef(false);
    const [ itemState, setItemState ] = useState<BrandFormProps>({
        id: "",
        image: null,
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        detail_th: "",
        detail_en: "",
        detail_ja: "",
        website: "",
        apiName: "",
        brands: [],
        categories: [],
        status: false,
        created_at: "", 
        updated_at: "",
        published_at: null
    });
    const handleSubmit = async (data: BrandFormProps) => await updateData(id, data);
    const fetchData = async () => await fetchDataById(id);
    useEffect(() => {
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    });
    
    useEffect(() => {
        if (items) {
            setItemState({
                id: items[0].id ?? "",
                image: items[0].image ?? "",
                title_th: items[0].title_th ?? "",
                title_en: items[0].title_en ?? "",
                title_ja: items[0].title_ja ?? "",
                description_th: items[0].description_th ?? "",
                description_en: items[0].description_en ?? "",
                description_ja: items[0].description_ja ?? "",
                detail_th: items[0].detail_th ?? "",
                detail_en: items[0].detail_en ?? "",
                detail_ja: items[0].detail_ja ?? "",
                website: items[0].website ?? "",
                apiName: items[0].apiName ?? "",
                categories: items[0].categories ?? [],
                status: Boolean(items[0]?.status) ?? false,
                updated_at: items[0].updated_at ?? null,
                created_at: items[0].created_at ?? null,
                published_at: items[0].published_at ?? null
            });
        }
    }, [items]);

    return (
    <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb current={itemState.title_en}/></div>
                </div>
            </div>
    
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Edit Brand</h3>
                </div>
                <hr />
                <BrandForm itemState={itemState} onSubmit={handleSubmit} type="edit" />
            </div>
        </div>
    </DefaultLayout>
    )
}

export default Page