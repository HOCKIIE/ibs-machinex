"use client";

import React, {useEffect } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CategoryFormProps } from '@/types/CategoryType';
import { ErrorMessage } from './Validation';
import CoverImageUpload from '../Dropzon/CoverImageUpload';


const CategoryForm = ({
    itemState,
    onSubmit,
    type
} : {
    itemState: CategoryFormProps;
    onSubmit: (data:CategoryFormProps) => Promise<void>;
    type: string
}) => {

    const rounter = useRouter();
    const BadgeLang = ({lng}:{lng:string}) => <div className="bg-blue-200 text-indigo-500 rounded-md text-xs flex items-center px-1">{lng}</div>
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
        watch,
        reset
    } = useForm<CategoryFormProps>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const onCreate = async (data: CategoryFormProps) => onSubmit(data);
    const onEdit = async (formData: CategoryFormProps) => onSubmit({ ...formData });
    const cancelAdd = () => rounter.back();

    useEffect(() => {
            if (itemState) {
            reset({
                id: itemState.id,
                image: itemState.image,
                current: itemState.current,
                title_th: itemState.title_th,
                title_en: itemState.title_en,
                title_ja: itemState.title_ja,
                description_th: itemState.description_th,
                description_en: itemState.description_en,
                description_ja: itemState.description_ja,
                status: itemState.status ?? false,
                published_at: itemState.published_at,
            });
        }
    }, [itemState, reset]);
    

return (
    <div className="p-4">
        <form onSubmit={handleSubmitForm(type === "create" ? onCreate : onEdit)}>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <CoverImageUpload<CategoryFormProps> control={control} watch={watch} current={itemState.current} setValue={setValue} defaultValue={itemState.image} errors={errors}/>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label> <BadgeLang lng={'TH'}/>
                        </div>
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
                        <div className="flex gap-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label> <BadgeLang lng={'EN'}/>
                        </div>
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
                        <div className="flex gap-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label> <BadgeLang lng={'JA'}/>
                        </div>
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
                    <div className="flex gap-2 mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label> <BadgeLang lng={'TH'}/>
                    </div>
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
                    <div className="flex gap-2 mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label> <BadgeLang lng={'EN'}/>
                    </div>
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
                    <div className="flex gap-2 mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label> <BadgeLang lng={'JA'}/>
                    </div>
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