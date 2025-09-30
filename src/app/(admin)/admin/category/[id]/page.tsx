"use client";

import React,{ useEffect,useState,useRef } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import CategoryForm from '@/components/admin/Form/CategoryForm';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import useCategoryStore from '@/store/useCategoryStore';
import { useRouter } from 'next/navigation';
import { CategoryFormProps } from '@/types/CategoryType';

const EditCategory = ({ params }: { params: { id: string } }) => {

    const  { id } = params;
    const router = useRouter();
    const didFetchData = useRef(false);
    const { items, fetchDataById, updateData } = useCategoryStore();
    const [ itemState, setItemState ] = useState<CategoryFormProps>({
        id: id,
        image: null,
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        status: false,
        brands: [],
        created_at: "",
        updated_at: "",
        published_at:""
    });
    const handleSubmit = async (data: CategoryFormProps) => {
        await updateData(id, data, router);
    };

    const fetchData = async () => await fetchDataById(id);

    useEffect(() => {
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    });
    useEffect(() => {
        if (items) {
            setItemState({
                id: id,
                image: items[0]?.image ?? "",
                title_th: items[0]?.title_th ?? "",
                title_en: items[0]?.title_en ?? "",
                title_ja: items[0]?.title_ja ?? "",
                description_th: items[0]?.description_th ?? "",
                description_en: items[0]?.description_en ?? "",
                description_ja: items[0]?.description_ja ?? "",
                status: Boolean(items[0]?.status) || false,
                brands: items[0]?.brands ?? [],
                created_at: items[0]?.created_at ?? "",
                updated_at: items[0]?.updated_at ?? "",
                published_at: items[0]?.published_at ?? ""
            });
        }        
    }, [items,id]);

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
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Edit category</h3>
                    </div>
                    <hr />
                    <CategoryForm itemState={itemState} onSubmit={handleSubmit} type="edit" />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default EditCategory