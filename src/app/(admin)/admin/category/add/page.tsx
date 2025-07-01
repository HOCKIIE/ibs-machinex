"use client";

import React,{ useState, useRef } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import CategoryForm from '@/components/admin/Form/CategoryForm';
import { useRouter } from 'next/navigation';
import useCstegoryStore from '@/store/useBlogStore';
import { CategoryFormProps, CategoryType } from '@/types/CategoryType';
import { UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { debounce } from 'lodash';


const page = () => {
    const router = useRouter();
    const { createData } = useCstegoryStore();
    const [categoryState, setCategoryState] = useState<Omit<CategoryType,"id"|"created_at"|"updated_at">>({
        image: "",
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        status: false
    });

    const { formState: { errors } } = useForm()
    const debouncedSetValueRef = useRef(
        debounce((
            name: keyof CategoryFormProps,
            value: string,
            setValue: UseFormSetValue<CategoryFormProps>,
            trigger: UseFormTrigger<CategoryFormProps>
        ) => {
            setValue(name, value, { shouldValidate: true });
            trigger(name);
        }, 500)
    );
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setValue: UseFormSetValue<CategoryFormProps>,
        trigger: UseFormTrigger<CategoryFormProps>
    ) => {
        const { name, value } = event.target;
        setCategoryState((prev) => ({ ...prev, [name]: value }));
        debouncedSetValueRef.current(name as keyof CategoryFormProps, value, setValue, trigger)
    };

    const handleSubmit = async (data: any) => {
        console.log("errors", errors);
        await createData(data,router);
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
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
                    <CategoryForm 
                        itemState={categoryState}
                        setItemState={handleChange}
                        onSubmit={handleSubmit}
                        type="create"
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default page