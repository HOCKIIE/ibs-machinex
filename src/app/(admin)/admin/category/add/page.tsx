"use client";

import React from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import CategoryForm from '@/components/admin/Form/CategoryForm';
import useCategoryStore from '@/store/useCategoryStore';
import { CategoryFormProps } from '@/types/CategoryType';


const Page = () => {

    const { createData } = useCategoryStore();
    const categoryState : CategoryFormProps = {
        id: 0,
        image:null,
        current: null,
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
        published_at: null
    };
    const handleSubmit = async (data: CategoryFormProps) => {
        const req = await createData(data);
    }

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
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new blog</h3>
                    </div>
                    <hr />
                    <CategoryForm itemState={categoryState} onSubmit={handleSubmit} type="create"/>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page