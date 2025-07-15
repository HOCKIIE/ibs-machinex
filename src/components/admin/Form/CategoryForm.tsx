"use client";

import Api from '@/services/Api';
import React, { useState, useCallback, useEffect } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { useForm, Controller  } from "react-hook-form";
import { LiaLanguageSolid } from "react-icons/lia";
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/types/CategoryType';
import { CategoryFormProps } from '@/types/CategoryType';
import { HiExclamation } from "react-icons/hi";
import { ErrorMessage } from './Validation';
import CoverImageUpload from '../Dropzon/CoverImageUpload';

const CategoryForm = ({
    itemState,
    setItemState: setData,
    onSubmit,
    type
} : any) => {

    const rounter = useRouter();
    const [category, setCategory] = useState<ApiResponse[]>([]);
    const [lng, setLang] = useState<string>('th');
    const activeLng = `bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800`;
    const invalidClass = "border-rose-300 text-rose-600 border-rose-300 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose dark:border-rose-500";
    const validClass = "border-gray-300 text-gray-800 focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/70 dark:placeholder:text-white/20";
    const create = type === "create";
    const edit = type === "edit";

    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        setValue,
        control,
        trigger,
        watch,
        reset
    } = useForm<CategoryFormProps>({
        mode: 'onChange',
        criteriaMode: 'all'
    });
    const Exclamation = () => <HiExclamation className="text-rose-500" fontSize={18}/>;
    const hasThaiErrors = Object.keys(errors).some(key => key.endsWith('_th'));
    const hasEnglishErrors = Object.keys(errors).some(key => key.endsWith('_en'));
    const hasJapaneseErrors = Object.keys(errors).some(key => key.endsWith('_ja'));

    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(value)
    }

    const onCreate = async (data: any) => {
        // console.log(typeof errors)
        onSubmit(data);
    };

    const onEdit = async (formData: any) => {
        console.log(errors)
        const modifiedData = { ...formData };
        onSubmit(modifiedData);
    };

    const cancelAdd = () => rounter.back();

    const formatDate = (date: Date): string => {
        const now = new Date();
        const bangkokTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
        }).format(now);

        const [datePart, timePart] = bangkokTime.split(', ');
        const [day, month, year] = datePart.split('/');
        return `${year}-${month}-${day} ${timePart}`;
    };

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
                detail_th: itemState.detail_th,
                detail_en: itemState.detail_en,
                detail_ja: itemState.detail_ja,
                status: itemState.status ?? false,
                published_at: itemState.published_at,
            });
        }
    }, [itemState, reset, setValue]);
    

return (
    <div className="p-4">
        <form onSubmit={handleSubmitForm(type === "create" ? onCreate : onEdit)}>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <CoverImageUpload<CategoryFormProps> register={register} watch={watch} setValue={setValue} defaultValue={itemState.image} errors={errors}/>
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
                        <CancelButton title="Cancel" setEdit={cancelAdd}/>
                        <SaveButton type="submit" title={edit?'Save':'Add'}/>
                    </div>
                </div>
            </div>
        </form>
    </div>
)
}

export default CategoryForm