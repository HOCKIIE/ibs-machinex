"use client";

import Api from '@/services/Api';
import React, { useEffect, useState, useRef } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { Controller, UseFormReturn  } from "react-hook-form";
import { CategoryType } from '@/types/CategoryType';
import { BrandFormProps } from '@/types/BrandType';
import { ErrorMessage } from './Validation';
import CoverImageUpload from '../Dropzon/CoverImageUpload';
import { useRouter } from 'next/navigation';
import { FaMapPin } from 'react-icons/fa6';
import { LiaLanguageSolid } from "react-icons/lia";
import { HiExclamation } from "react-icons/hi";
import TextEditor from '../Editor/TextEditor';
import { IoChevronBack } from "react-icons/io5";

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
    const [show, setShow] = useState<boolean>(true);
    const leftWidth = show ? `w-2/12`:`w-0`;
    const rightWidth = show ? `w-10/12`:`w-full`;
    const activeLng = `bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800`;
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

    const onCreate = async (data: BrandFormProps) =>  onSubmit(data);
    const onEdit = async (formData: BrandFormProps) => onSubmit({ ...formData });
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

return (
    <div className="p-4">
        <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex gap-6">
                <div className={`grid-flow-col settings ${leftWidth} duration-300 transition-width`}>
                    <div className='flex justify-end relative'>
                        <button 
                            type="button" 
                            className="absolute w-5 h-10 right-[-24px] border bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center"
                            onClick={()=>setShow(!show)}
                        >
                                <IoChevronBack className={`${!show?` -rotate-90`:``} duration-300 transition-all`}/>
                        </button>
                    </div>
                    <div className={`${!show?`hidden `:``}overflow-hidden`}>
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
                                        defaultValue={!!item?.status}
                                        render={({ field }) => (
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input type="checkbox" value="1" className="sr-only peer" checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)}/>
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Status: </span>
                                            </label>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`ml-1 ${rightWidth}`}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-6">
                                    <CoverImageUpload<BrandFormProps> name="image" control={control} watch={watch} setValue={setValue} defaultValue={item.image ?? null} errors={errors}/>
                                </div>
                                <div className="col-span-6">
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
                                            render={({field}) => <TextEditor name={field.name} value={field.value} type="brand" id={item.id} onChange={field.onChange} /> }
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
                                            render={({field}) => <TextEditor name={field.name} value={field.value} type="brand" id={item.id} onChange={field.onChange} /> }
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
                                            render={({field}) => <TextEditor name={field.name} value={field.value} type="brand" id={item.id} onChange={field.onChange} /> }
                                        />                        
                                        {errors?.descendant_ja?.type === "required" && (
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
)

}

export default BrandForm;