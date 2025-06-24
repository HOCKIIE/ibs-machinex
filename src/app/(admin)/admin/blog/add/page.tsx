"use client";

import React,{ useState, useRef } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BlogForm from '@/components/admin/Form/BlogForm';
import { useRouter } from 'next/navigation';
import useBlogStore from '@/store/useBlogStore';
import { BlogFormProps, BlogType } from '@/types/BlogType';
import { UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { debounce } from 'lodash';


export default function Page(){

    const router = useRouter();
    const { createData } = useBlogStore();
    const [blogState, setBlogState] = useState<Omit<BlogType,"id"|"created_at"|"updated_at">>({
        image: "",
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        detail_th: `<div class="grid grid-cols-12 gap-4"><div class="col-span-12 p-2"><p class="mb-3 text-center">Blog Image</p></div><div class="col-span-12"><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></div></div>`,
        detail_en: `<div class="grid grid-cols-12 gap-4"><div class="col-span-12 p-2"><p class="mb-3 text-center">Blog Image</p></div><div class="col-span-12"><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></div></div>`,
        detail_ja: `<div class="grid grid-cols-12 gap-4"><div class="col-span-12 p-2"><p class="mb-3 text-center">Blog Image</p></div><div class="col-span-12"><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></div></div>`,
        status: false,
        category: [],
        categories: [],
        published_at:""
    });

    const { formState: { errors } } = useForm()

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
        const { name, value } = event.target;

        setBlogState((prev) => ({ ...prev, [name]: value }));
        debouncedSetValueRef.current(name as keyof BlogFormProps, value, setValue, trigger)
        
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
                    <BlogForm 
                        itemState={blogState}
                        setItemState={handleChange}
                        onSubmit={handleSubmit}
                        type="create"
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}