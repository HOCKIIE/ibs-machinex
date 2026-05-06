"use client";

import Api from '@/services/Api';
import React, { useEffect, useState, useRef } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { Controller, UseFormReturn  } from "react-hook-form";
import { CategoryType } from '@/types/CategoryType';
import { BrandFormProps } from '@/types/BrandType';
import { ErrorMessage } from './Validation';
import BannerImageUpload from '../Dropzon/BannerImageUpload';
import CoverImageUpload from '../Dropzon/CoverImageUpload';
import { useRouter } from 'next/navigation';
import { FaMapPin } from 'react-icons/fa6';
import { LiaLanguageSolid } from "react-icons/lia";
import { HiExclamation } from "react-icons/hi";
import TextEditor from '../Editor/TextEditor';
import { IoChevronBack } from "react-icons/io5";
import { serialize } from '@/utils/slateHtmlConverter';
import Checkbox from '../Checkbox/Checkbox';

const BrandForm = ({
    form,
    onSubmit,
    type
} : {
    form: UseFormReturn<BrandFormProps>
    onSubmit: (data: BrandFormProps) => Promise<void>;
    type: string;
}) => {
    const didFetch = useRef(false);
    const [category, setCategory] = useState([]);
    const router = useRouter();
    const [lng, setLang] = useState<string>('th');
    const activeLng = `bg-indigo-100 text-indigo-500 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800`;
    const invalidClass = "border-rose-300 text-rose-600 border-rose-300 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose dark:border-rose-500";
    const validClass = "border-gray-300 text-gray-800 focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/70 dark:placeholder:text-white/20";
    const create = type === "create";
    const edit = type === "edit";
    
    const {
        watch,
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors }
    } = form;
    
    const item = form.getValues();
    const Required = () => <span className="text-rose-500">*</span>;
    const BadgeLang = ({lng}:{lng:string}) => {
        let className = 'bg-emerald-200 text-emerald-600';
        if(lng === 'EN') className = `bg-blue-200 text-indigo-600`;
        if(lng === 'JA') className = `bg-pink-200 text-pink-600`;
        
        return <div className={`${className} rounded-md text-xs flex items-center px-1`}>{lng}</div>
    }
    const Exclamation = () => <HiExclamation className="text-rose-500" fontSize={18}/>;
    const hasThaiErrors = Object.keys(errors).some(key => key.endsWith('_th'));
    const hasEnglishErrors = Object.keys(errors).some(key => key.endsWith('_en'));
    const hasJapaneseErrors = Object.keys(errors).some(key => key.endsWith('_ja'));

    const onCreate = async (data: BrandFormProps) =>  onSubmit({
        ...data,
        detail_th: serialize(data.descendant_th),
        detail_en: serialize(data.descendant_en),
        detail_ja: serialize(data.descendant_ja), 
    });
    const onEdit = async (formData: BrandFormProps) => onSubmit({ 
        ...formData,
        detail_th: serialize(formData.descendant_th),
        detail_en: serialize(formData.descendant_en),
        detail_ja: serialize(formData.descendant_ja), 
    });
    const cancelAction = () => router.back();

    const fetchCategory = async()=>{
        const res = await Api.get('/category');
        setCategory(res.data);
    };
    const submitHandler = type === "create" ? onCreate : onEdit;
    useEffect(()=>{
        if (didFetch.current) return;
        didFetch.current = true;
        fetchCategory();
    },[]);

    const Heading = ({label}:{label:string}) => <h2 className="text-xl font-semibold mt-6">{label}</h2>

return (
    <div className="p-4">
        <form onSubmit={handleSubmit(submitHandler)}>
            <div className="grid cols-12 gap-4">
                <div className="col-span-12">
                    <Heading label="General" />
                </div>
                <div className="col-span-12">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Cateogry <Required/></label>
                        <Controller
                            name="category"
                            control={control}
                            rules={{
                                required: "Please select a category"
                            }}
                            render={({ field }) => {
                                const current = field.value || [];
                                return <select
                                    {...field}
                                    defaultValue={current}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value ? Number(value) : "");
                                    }}
                                    className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.category ? invalidClass : validClass} focus:outline-none`}
                                >
                                    <option value="" hidden>Select Category</option>
                                    {category.map((cat: CategoryType) => <option key={cat.id} value={cat.id}>{cat.title_en}</option>)}
                                </select>
                            }}
                        />
                        {errors?.category?.type === "required" && (
                            <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                        )}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-400">Path Name <Required/></label>
                        </div>
                        <input 
                            {...register("apiName", { required: true })} 
                            type="text"
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.website ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                        />
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-400">Website URL</label>
                        </div>
                        <div className="flex rounded-lg">
                            <span className="px-4 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-layer-line bg-muted text-sm text-foreground text-muted-foreground-1">
                                <Checkbox name="is_iframe" control={control} label="Use as an iframe profile" />
                            </span>
                            <input 
                                {...register("website")}
                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-r-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.website ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                placeholder="Website URL" 
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <Heading label="Profile"/>
                </div>
                <div className="flex">
                    <div className="setting-content">
                        
                        <div className="setting-body">
                            <ul className='mt-2 flex gap-2'>
                                <li className='min-w-30'>
                                    <a className={`flex justify-between items-center rounded-lg overflow-hidden p-2 text-boxdark hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800 ease-in-out duration-300 cursor-pointer ${lng=='th' ? activeLng: `bg-slate-50`}`} onClick={()=>setLang('th')}>
                                        <div><LiaLanguageSolid className='me-1' size={25} /> Thai</div> {hasThaiErrors && <Exclamation/>}
                                    </a>
                                </li>
                                <li className='min-w-30'>
                                    <a className={`flex justify-between items-center rounded-lg overflow-hidden p-2 text-boxdark hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800 ease-in-out duration-300 cursor-pointer ${lng=='en' ? activeLng: `bg-slate-50`}`} onClick={()=>setLang('en')}>
                                        <div><LiaLanguageSolid className='me-1' size={25} /> English</div> {hasEnglishErrors && <Exclamation/>}
                                    </a>
                                </li>
                                <li className='min-w-30'>
                                    <a className={`flex justify-between items-center rounded-lg overflow-hidden p-2 text-boxdark hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800 ease-in-out duration-300 cursor-pointer ${lng=='ja' ? activeLng: `bg-slate-50`}`} onClick={()=>setLang('ja')}>
                                        <div><LiaLanguageSolid className='me-1' size={25} /> Japanese</div> {hasJapaneseErrors && <Exclamation/>}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="relative">
                        <BannerImageUpload 
                            name="banner" 
                            control={control} 
                            watch={watch} 
                            current={item.currentBanner ?? null}
                            setValue={setValue} 
                            defaultValue={item.banner ?? null} 
                            errors={errors} 
                            width="1320px" 
                            height='263px'
                        />
                        <div className="absolute -bottom-34 left-25">
                            <CoverImageUpload<BrandFormProps> 
                                name="image" 
                                control={control} 
                                watch={watch} 
                                current={item.current ?? null}
                                setValue={setValue} 
                                defaultValue={item.image ?? null} 
                                errors={errors}
                                width="200px"
                                height="200px"
                            />
                        </div>
                    </div>
                    <div className="tabs">
                        <div className={`tab ease-in-out duration-300 ${lng=='th'?``:` hidden`}`} data-tab="th">
                            <div className="space-y-3 ml-80 mt-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-400">Title <Required/></label> <BadgeLang lng="TH"/>
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
                        <div className={`tab ease-in-out duration-300 ${lng=='en'?``:` hidden`}`} data-tab="en">
                            <div className="space-y-3 ml-80 mt-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-400">Title <Required/></label> <BadgeLang lng="EN"/>
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
                        <div className={`tab ease-in-out duration-300 ${lng=='ja'?``:` hidden`}`} data-tab="ja">
                            <div className="space-y-3 ml-80 mt-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-400">Title <Required/></label> <BadgeLang lng="JA"/>
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
                    </div>
                </div>
            </div>
            <div className="mt-17">
                <div className="tabs">
                    <div className={`tab ease-in-out duration-300 ${lng=='th'?``:` hidden`}`} data-tab="th">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-700 dark:text-gray-400">Description <Required/></label> <BadgeLang lng="TH"/>
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
                                        <label className="text-sm text-gray-700 dark:text-gray-400">Detail </label> <BadgeLang lng="TH"/>
                                    </div>
                                    <Controller
                                        name="descendant_th"
                                        control={control}
                                        render={({field}) => <TextEditor name={field.name} value={field.value} type="brand" action={type} id={item.id} onChange={field.onChange} /> }
                                    />                        
                                    {errors?.descendant_th?.type === "required" && (
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
                                        <label className="text-sm text-gray-700 dark:text-gray-400">Description <Required/></label> <BadgeLang lng="EN"/>
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
                                        <label className="text-sm text-gray-700 dark:text-gray-400">Detail </label> <BadgeLang lng="EN"/>
                                    </div>
                                    <Controller
                                        name="descendant_en"
                                        control={control}
                                        render={({field}) => <TextEditor name={field.name} value={field.value} type="brand" action={type} id={item.id} onChange={field.onChange} /> }
                                    />                        
                                    {errors?.descendant_en?.type === "required" && (
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
                                        <label className="text-sm text-gray-700 dark:text-gray-400">Description <Required/></label> <BadgeLang lng="JA"/>
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
                                        <label className="text-sm text-gray-700 dark:text-gray-400">Detail </label> <BadgeLang lng="JA"/>
                                    </div>
                                    <Controller
                                        name="descendant_ja"
                                        control={control}
                                        render={({field}) => <TextEditor name={field.name} value={field.value} type="brand" action={type} id={item.id} onChange={field.onChange} /> }
                                    />                        
                                    {errors?.descendant_ja?.type === "required" && (
                                        <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                    )} 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-12">
                        <div className="flex gap-4 items-center justify-center">
                            <CancelButton title="Cancel" setEdit={cancelAction}/>
                            <SaveButton type="submit" title={edit?'Save':'Add'}/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
)

}

export default BrandForm;