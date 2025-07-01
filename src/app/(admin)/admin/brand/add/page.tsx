"use client";

import React,{ useState, useRef } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BrandForm from '@/components/admin/Form/BrandForm';
import { useRouter } from 'next/navigation';
import useBrandStore from '@/store/useBrandStore';
import { BrandFormProps, BrandType } from '@/types/BrandType';
import { UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { debounce } from 'lodash';

const page = () => {

    const router = useRouter();
    const { createData } = useBrandStore();
    const [categoryState, setCategoryState] = useState<Omit<BrandType,"id"|"created_at"|"updated_at">>({
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
            name: keyof BrandFormProps,
            value: string,
            setValue: UseFormSetValue<BrandFormProps>,
            trigger: UseFormTrigger<BrandFormProps>
        ) => {
            setValue(name, value, { shouldValidate: true });
            trigger(name);
        }, 500)
    );
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setValue: UseFormSetValue<BrandFormProps>,
        trigger: UseFormTrigger<BrandFormProps>
    ) => {
        const { name, value } = event.target;
        setCategoryState((prev) => ({ ...prev, [name]: value }));
        debouncedSetValueRef.current(name as keyof BrandFormProps, value, setValue, trigger)
    };

    const handleSubmit = async (data: any) => {
        console.log("errors", errors);
        await createData(data,router);
    };

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