"use client";

import React from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BrandForm from '@/components/admin/Form/BrandForm';
import { useRouter } from 'next/navigation';
import useBrandStore from '@/store/useBrandStore';
import { BrandFormProps } from '@/types/BrandType';

const Page = () => {

    const router = useRouter();
    const { createData } = useBrandStore();
    const categoryState: BrandFormProps = {
        id: "",
        image:null,
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
        status: false,
        brands: [],
        category: [],
        categories: [],
        published_at: "",
        created_at: "",
        updated_at: ""
    };

    const handleSubmit = async (data: BrandFormProps) => await createData(data,router);

    return (
    <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb /></div>
                </div>
            </div>
    
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new brand</h3>
                </div>
                <hr />
                <BrandForm 
                    itemState={categoryState}
                    onSubmit={handleSubmit}
                    type="create"
                />
            </div>
        </div>
    </DefaultLayout>
    )
}

export default Page