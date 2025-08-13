"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { useForm  } from "react-hook-form";
import { BrandFormProps } from '@/types/BrandType';
import { ErrorMessage } from './Validation';
import CoverImageUpload from '../Dropzon/CoverImageUpload';
import { useRouter } from 'next/navigation';
import Api from '@/services/Api';
import { Controller } from 'react-hook-form';

import { IoChevronForwardSharp } from "react-icons/io5";
import { FaCheck, FaMapPin } from 'react-icons/fa6';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { LiaLanguageSolid } from "react-icons/lia";
import { HiExclamation } from "react-icons/hi";
import TextEditor from '../Editor/TextEditor';

const BrandForm = ({
    itemState,
    onSubmit,
    type
} : any) => {
    const didFetch = useRef(false);
    const [category, setCategory] = useState([]);
    const router = useRouter();
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
        watch,
        reset
    } = useForm<BrandFormProps>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const BadgeLang = ({lng}:{lng:string}) => <div className="bg-blue-200 text-indigo-500 rounded-md text-xs flex items-center px-1">{lng}</div>
    const Exclamation = () => <HiExclamation className="text-rose-500" fontSize={18}/>;
    const hasThaiErrors = Object.keys(errors).some(key => key.endsWith('_th'));
    const hasEnglishErrors = Object.keys(errors).some(key => key.endsWith('_en'));
    const hasJapaneseErrors = Object.keys(errors).some(key => key.endsWith('_ja'));

    const onCreate = async (data: any) => {
        // console.log(typeof errors)
        onSubmit(data);
    };

    const onEdit = async (formData: any) => {
        console.log(errors)
        const modifiedData = { ...formData };
        onSubmit(modifiedData);
    }
    const cancelAction = () => router.back();

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
                detail_th: itemState.detail_th,
                detail_en: itemState.detail_en,
                detail_ja: itemState.detail_ja,
                website: itemState.website,
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
            <div className="flex gap-4">
                <div className="grid-flow-col space-y-4 settings w-2/12">
                    <div className="border border-gray-300 dark:border-gray-500 p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b border-gray-300 dark:border-gray-500 px-1 pb-2 flex items-center">
                                <LiaLanguageSolid className='me-1' /> Languages 
                            </div> 
                            <div className="setting-body">
                                <ul className='mt-2'>
                                    <li>
                                        <a className={`flex justify-between items-center rounded-lg text-sm overflow-hidden p-2 text-boxdark hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800 ease-in-out duration-300 cursor-pointer ${lng=='th' && activeLng}`} onClick={()=>setLang('th')}>
                                            Thai {hasThaiErrors && <Exclamation/>}
                                        </a>
                                    </li>
                                    <li>
                                        <a className={`flex justify-between items-center rounded-lg text-sm overflow-hidden p-2 text-boxdark hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800 ease-in-out duration-300 cursor-pointer ${lng=='en' && activeLng}`} onClick={()=>setLang('en')}>
                                            English {hasEnglishErrors && <Exclamation/>}
                                        </a>
                                    </li>
                                    <li>
                                        <a className={`flex justify-between items-center rounded-lg text-sm overflow-hidden p-2 text-boxdark hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800 ease-in-out duration-300 cursor-pointer ${lng=='ja' && activeLng}`} onClick={()=>setLang('ja')}>
                                            Japanese  {hasJapaneseErrors && <Exclamation/>}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray-300 dark:border-gray-500 p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b border-gray-300 dark:border-gray-500 px-1 pb-2 flex items-center">
                                <FaMapPin className='me-1' /> Status 
                            </div> 
                            <div className="py-2 flex">
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue={!!itemState?.status}
                                    render={({ field }) => (
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" value="1" className="sr-only peer" checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} title="Status"/>
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                                        </label>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-10/12">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
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
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Website</label>
                                        </div>
                                        <textarea 
                                            {...register("website")}
                                            rows={5}
                                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.website ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                            placeholder="Website" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tabs mt-3">
                        <div className={`tab ease-in-out duration-300 ${lng=='th'?``:` hidden`}`} data-tab="th">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Title</label> <BadgeLang lng="TH"/>
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
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Description</label> <BadgeLang lng="TH"/>
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
                                </div>
                                <div className="col-span-12">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Detail</label> <BadgeLang lng="TH"/>
                                        </div>
                                        <Controller
                                            name="detail_th"
                                            control={control}
                                            defaultValue={itemState.detail_th}
                                            render={({field}) => (<TextEditor name={field.name} value={field.value} onChange={field.onChange} />) }
                                        />                        
                                        {errors?.detail_th?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )} 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`tab ease-in-out duration-300 ${lng=='en'?``:` hidden`}`} data-tab="en">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Title</label> <BadgeLang lng="EN"/>
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
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Description</label> <BadgeLang lng="EN"/>
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
                                </div>
                                <div className="col-span-12">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Detail</label> <BadgeLang lng="EN"/>
                                        </div>
                                        <Controller
                                            name="detail_en"
                                            control={control}
                                            defaultValue={itemState.detail_en}
                                            render={({field}) => (<TextEditor name={field.name} value={field.value} onChange={field.onChange} />) }
                                        />                        
                                        {errors?.detail_en?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )} 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`tab ease-in-out duration-300 ${lng=='ja'?``:` hidden`}`} data-tab="ja">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Title</label> <BadgeLang lng="JA"/>
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
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Description</label> <BadgeLang lng="JA"/>
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
                                </div>
                                <div className="col-span-12">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-400">Detail</label> <BadgeLang lng="JA"/>
                                        </div>
                                        <Controller
                                            name="detail_ja"
                                            control={control}
                                            defaultValue={itemState.detail_ja}
                                            render={({field}) => (<TextEditor name={field.name} value={field.value} onChange={field.onChange} />) }
                                        />                        
                                        {errors?.detail_ja?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )} 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12">
                        <div className="col-span-12">
                            <div className="flex gap-4 items-center justify-center">
                                <CancelButton title="Cancel" setEdit={cancelAction}/>
                                <SaveButton type="submit" title={edit?'Save':'Add'}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
)}

export default BrandForm;