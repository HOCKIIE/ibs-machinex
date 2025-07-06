"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { useForm  } from "react-hook-form";
import { BrandFormProps } from '@/types/BrandType';
import { ErrorMessage } from './Validation';
import CoverImageUpload from '../Dropzon/CoverImageUpload';
import { useRouter } from 'next/navigation';
import Api from '@/services/Api';

const BrandForm = ({
    itemState,
    onSubmit,
    type
} : any) => {
    const didFetch = useRef(false);
    const [category, setCategory] = useState([]);
    const router = useRouter();
    const invalidClass = "border-rose-300 text-rose-600 border-rose-300 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose dark:border-rose-500";
    const validClass = "border-gray-300 text-gray-800 focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/70 dark:placeholder:text-white/20";
    const create = type === "create";
    const edit = type === "edit";

    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<BrandFormProps>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const onCreate = async (data: any) => {
        // console.log(typeof errors)
        onSubmit(data);
    };

    const onEdit = async (formData: any) => {
        console.log(errors)
        const modifiedData = { ...formData };
        onSubmit(modifiedData);
    }
    const cancelAction = () => {
        router.push('/admin/brand');
    }

 
    // Fetch categories from an API or define them statically
    const fetchCategory = useCallback(async()=>{
        const res = await Api.get('/category');
        setCategory(res.data);
    }, [setCategory]);

    useEffect(()=>{
        if (didFetch.current) return;
        didFetch.current = true;
        fetchCategory();
    }, [fetchCategory]);

    useEffect(() => {
        if (itemState) {
            reset({
                id: itemState.id,
                image: itemState.image,
                title_th: itemState.title_th,
                title_en: itemState.title_en,
                title_ja: itemState.title_ja,
                description_th: itemState.description_th,
                description_en: itemState.description_en,
                description_ja: itemState.description_ja,
                categories: itemState.categories,
                status: itemState.status ?? false,
                published_at: itemState.published_at,
            });
            if (itemState?.categories) {
                const categoryIds = itemState.categories.map((c: any) => String(c.id));
                setValue("category", categoryIds); // set react-hook-form field
            }
        }
    }, [itemState, reset, setValue]);
    

return (
    <div className="p-4">
        <form onSubmit={handleSubmitForm(type === "create" ? onCreate : onEdit)}>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                    <CoverImageUpload<BrandFormProps> register={register} watch={watch} setValue={setValue} defaultValue={itemState.image} errors={errors}/>
                </div>
                <div className="col-span-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Cateogry</label>
                        <select
                            {...register("category", { required: true })}
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.category ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                        >
                            <option value="" hidden>Select Category</option>
                            {category.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.title_en}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                        <input 
                            type="text"
                            {...register("title_th", { required: true })}
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title_th ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder="Title TH" 
                        />
                        {errors?.title_th?.type === "required" && (
                            <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                        )}
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                        <input 
                            type="text"
                            {...register("title_en", { required: true })}
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title_en ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder="Title EN" 
                        />
                        {errors?.title_en?.type === "required" && (
                            <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                        )}
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                        <input 
                            type="text"
                            {...register("title_ja", { required: true })}
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title_ja ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder="Title JA" 
                        />
                        {errors?.title_ja?.type === "required" && (
                            <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                        )}
                    </div>
                </div>
                <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
                        <textarea 
                            {...register("description_th", { required: true })}
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_th ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder="Description TH"
                            rows={5}
                        ></textarea>
                        {errors?.description_th?.type === "required" && (
                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                        )}
                </div>
                <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
                        <textarea 
                            {...register("description_en", { required: true })}
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_en ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder="Description TH"
                            rows={5}
                        ></textarea>
                        {errors?.description_en?.type === "required" && (
                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                        )}
                </div>
                <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
                        <textarea 
                            {...register("description_ja", { required: true })}
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_ja ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder="Description TH"
                            rows={5}
                        ></textarea>
                        {errors?.description_ja?.type === "required" && (
                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                        )}
                </div>
                <div className="col-span-12">
                    <div className="flex gap-4 items-center justify-center">
                        <CancelButton title="Cancel" setEdit={cancelAction}/>
                        <SaveButton type="submit" title={edit?'Save':'Add'}/>
                    </div>
                </div>
            </div>
        </form>
    </div>
)}

export default BrandForm;