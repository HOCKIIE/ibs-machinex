"use client";

import React,{ useState, useRef } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BlogForm from '@/components/admin/Form/BlogForm';
import { useRouter } from 'next/navigation';
import useBlogStore from '@/store/useBlogStore';
import { BlogFormProps } from '@/types/BlogType';
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { debounce } from 'lodash';


const Page = () => {

    const router = useRouter();
    const { createData } = useBlogStore();
    const [userState, setUserState] = useState<BlogFormProps>({
        id: "",
        image:"",
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        detail_th: "",
        detail_en: "",
        detail_ja: "",
        status: false,
        category: [],
    });

    const debouncedSetValueRef = useRef(
        debounce((
            name: keyof BlogFormProps,
            value: string,
            setValue: UseFormSetValue<BlogFormProps>,
            trigger: UseFormTrigger<BlogFormProps>
        ) => {
            setValue(name, value, { shouldValidate: true });
            trigger(name);
        }, 500)
    );
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setValue: UseFormSetValue<BlogFormProps>,
        trigger: UseFormTrigger<BlogFormProps>
    ) => {
        const { name, value, files } = event.target;
        if (name === "image" && files && files[0]) {
            const fileURL = URL.createObjectURL(files[0]);
            setUserState((prev) => ({ ...prev, image: fileURL }));
            setValue(name, files[0], { shouldValidate: true });
            trigger(name);
        } else {
            setUserState((prev) => ({ ...prev, [name]: value }));
            debouncedSetValueRef.current(name as keyof BlogFormProps, value, setValue, trigger)
        }
    };

    const handleSubmit = async (data: any) => {
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
                    <BlogForm 
                        itemState={userState}
                        setItemState={handleChange}
                        handleSubmit={handleSubmit}
                        type="create"
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page