"use client";

import Api from '@/services/Api';
import React, { useState, useRef, useEffect } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { Controller, UseFormReturn  } from "react-hook-form";
import { CategoryType } from '@/types/CategoryType';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { LiaLanguageSolid } from "react-icons/lia";
import { FaCheck, FaMapPin } from 'react-icons/fa6';
import { BlogFormProps } from '@/types/BlogType';
import { MdRemoveRedEye } from "react-icons/md";
import CoverImageUpload from '../Dropzon/CoverImageUpload';
import TextEditor from '../Editor/TextEditor';
import { ErrorMessage } from './Validation';
import { useRouter } from 'next/navigation';
import Format from '@/utils/Format';
import { IoMdPricetag } from "react-icons/io";
import { HiExclamation } from "react-icons/hi";

const BlogForm = ({
    form,
    onSubmit,
    type,
    draftId
} : {
    form: UseFormReturn<BlogFormProps>;
    onSubmit: (data: BlogFormProps) => Promise<void>;
    type: string;
    draftId?: string;
}) => {

    const didFetchData = useRef(false);
    const router = useRouter();
    const [category, setCategory] = useState<CategoryType[]>([]);
    const [lng, setLang] = useState<string>('th');
    const BadgeLang = ({lng}:{lng:string}) => <div className="bg-blue-200 text-indigo-500 rounded-md text-xs flex items-center px-1">{lng}</div>
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
    } = form

    const item = form.getValues();
    const Exclamation = () => <HiExclamation className="text-rose-500" fontSize={18}/>;
    const hasThaiErrors = Object.keys(errors).some(key => key.endsWith('_th'));
    const hasEnglishErrors = Object.keys(errors).some(key => key.endsWith('_en'));
    const hasJapaneseErrors = Object.keys(errors).some(key => key.endsWith('_ja'));
    const onCreate = async (data: BlogFormProps) => onSubmit(data);
    const onEdit = async (formData: BlogFormProps) => {
        const modifiedData = { ...formData };
        onSubmit(modifiedData);
    };
    const cancelAdd = () => router.back();
    const fetchCategory = async() => {
        const res = await Api.get('/category');
        setCategory(res.data);
    };
    const submitHandler = type === "create" ? onCreate : onEdit;
    useEffect(()=>{
        if(didFetchData.current) return;
        didFetchData.current = true;
        fetchCategory();
    });

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit(submitHandler)}>
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
                                <BiSolidCategoryAlt className="me-1"/> Category
                            </div> 
                        </div>
                        <div className="setting-body grid">
                            <Controller
                                name="category"
                                control={control}
                                rules={{
                                    validate: (value) => Array.isArray(value) && value.length > 0 || 'Please select at least 1 category.',
                                }}
                                render={({field}) => (
                                    <>
                                    {category?.map((v: CategoryType, k: number) => {
                                        const isChecked = String(field.value)?.includes(String(v.id));
                                        return (
                                            <label key={k} className="inline-flex items-center gap-2 cursor-pointer space-y-2">
                                                <input
                                                    type="checkbox"
                                                    className="peer absolute opacity-0 w-0 h-0"
                                                    value={v.id}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const current = field.value || [];
                                                        if (checked) {
                                                            field.onChange([...current, String(v.id)]);
                                                        } else {
                                                            field.onChange(current.filter((id: string) => id !== String(v.id)));
                                                        }
                                                    }}
                                                />
                                                <div className={`w-5 h-5 border-2 ${errors.category? `border-rose-300 dark:border-rose-500`:`border-gray-300 dark:border-gray-500`} rounded-md flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors`}>
                                                    <FaCheck fontSize={14} className={`${isChecked?`text-white`:`text-transparent`} font-bold peer-checked:${isChecked?'block':'hidden'}`} />
                                                </div>
                                                <span className={`text-gray-700 dark:text-gray-400 text-sm`}>{v.title_en}</span>
                                            </label>  
                                        );
                                    })}
                                    </>
                                )}           
                            />
                        </div>
                        {errors?.category && (
                            <ErrorMessage className="mt-2">{errors?.category.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="border border-gray-300 dark:border-gray-500 p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b border-gray-300 dark:border-gray-500 px-1 pb-2 flex items-center">
                                <FaMapPin className='me-1' /> Status
                            </div> 
                        </div>
                        <div className="setting-body mt-2">
                            <div className="flex items-center mb-4">
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
                    <div className="border border-gray-300 dark:border-gray-500 p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b border-gray-300 dark:border-gray-500 px-1 pb-2 flex items-center">
                                <MdRemoveRedEye className="me-1"/> Publish
                            </div> 
                        </div>
                        <div className="setting-body mt-2">
                            <Controller
                                name="published_at"
                                control={control}
                                defaultValue={item?.published_at ?? null}
                                render={({ field }) => {
                                    const isChecked = !!field.value;
                                    return (
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                field.onChange(checked ? Format.date(new Date()) : null);
                                            }}
                                            disabled={!!item?.published_at}
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Publish:</span>
                                        </label>
                                    );
                                }}
                            />
                            {item?.published_at && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Published at: {new Date(item?.published_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border border-gray-300 dark:border-gray-500 p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b border-gray-300 dark:border-gray-500 px-1 pb-2 flex items-center">
                                <IoMdPricetag className="me-1"/>Recommend
                            </div> 
                        </div>
                        <div className="setting-body mt-2">   
                            <div className="flex gap-1">
                                <Controller
                                    name="recommend"
                                    control={control}
                                    defaultValue={item?.recommend ?? null}
                                    render={({ field }) => {
                                        const isChecked = !!field.value;
                                        return (
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    field.onChange(checked);
                                                }}
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                                            </label>
                                        );
                                    }}
                                />
                            </div>                  
                        </div>
                    </div>
                </div>
                <div className="w-10/12">
                    <div className="w-full">
                        {type=="create" && 
                            <div className="col-span-12 mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Draft ID</label>
                                <input type='text' readOnly {...register('draftId')} className="w-full bg-gray-100 border rounded-md p-2"/>
                            </div>
                        }
                        <div className="grid grid-cols-12">
                            <div className="col-span-12">
                                <CoverImageUpload<BlogFormProps> control={control}  watch={watch} setValue={setValue} defaultValue={item.image} errors={errors}/>
                            </div>
                            <div className="col-span-12 mt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Path Name </label> 
                                        <div className="text-sm">eg.: /th/blog/<strong className="m-0 p-0">your-path-name</strong></div>
                                    </div>
                                    <input 
                                        type="text" 
                                        {...register('pathName', {required: true})}
                                        className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.pathName ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                    />
                                    {errors?.pathName?.type === "required" && (
                                        <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="tabs mt-3">
                            <div className={`tab ease-in-out duration-300 ${lng=='th'?``:` hidden`}`} data-tab="th">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title </label> <BadgeLang lng="TH"/>
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
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description </label> <BadgeLang lng="TH"/>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
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
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail </label> <BadgeLang lng="TH"/>
                                            </div>
                                        </div>
                                        <Controller
                                            name="detail_th"
                                            control={control}
                                            defaultValue={item.detail_th}
                                            render={({field}) => <TextEditor name={field.name} value={field.value} type="blog" action={type} id={item.id} draftId={draftId} onChange={field.onChange} /> }
                                        />                        
                                        {errors?.detail_th?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )} 
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={`tab ease-in-out duration-300 ${lng=='en'?``:` hidden`}`} data-tab="en">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title </label> <BadgeLang lng="EN"/>
                                            </div>
                                            <input 
                                                type="text" 
                                                {...register("title_en", { required: true })}
                                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title_en ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                                placeholder="Title EN" />
                                                {errors?.title_en?.type === "required" && (
                                                    <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                                )}
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label> <BadgeLang lng="EN"/>
                                            </div>
                                        </div>
                                        <textarea 
                                            {...register("description_en", { required: true })}
                                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_en ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                            placeholder="Description EN"
                                            rows={5}
                                        ></textarea>
                                        {errors?.description_en?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail </label> <BadgeLang lng="EN"/>
                                            </div>
                                        </div>
                                        <Controller
                                            name="detail_en"
                                            control={control}
                                            defaultValue={item.detail_en}
                                            render={({field}) => <TextEditor name={field.name} value={field.value} type="blog" action={type} id={item.id} draftId={draftId} onChange={field.onChange} /> }
                                        />                        
                                        {errors?.detail_en?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )} 
                                    </div>
                                </div>
                            </div>
                            <div className={`tab ease-in-out duration-300 ${lng=='ja'?``:` hidden`}`} data-tab="ja">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title </label> <BadgeLang lng="JA"/>
                                            </div>
                                            <input 
                                                type="text" 
                                                {...register("title_ja", { required: true })}
                                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title_ja ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                                placeholder="Title JA" />
                                                {errors?.title_ja?.type === "required" && (
                                                    <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                                                )}
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description </label> <BadgeLang lng="JA"/>
                                            </div>
                                        </div>
                                        <textarea 
                                            {...register("description_ja", { required: true })}
                                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_ja ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                            placeholder="Description JA"
                                            rows={5}
                                        ></textarea>
                                        {errors?.description_ja?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail </label> <BadgeLang lng="JA"/>
                                            </div>
                                        </div>
                                        <Controller
                                            name="detail_ja"
                                            control={control}
                                            defaultValue={item.detail_ja}
                                            render={({field}) => <TextEditor name={field.name} value={field.value} type="blog" action={type} id={item.id} draftId={draftId} onChange={field.onChange} /> }
                                        />                        
                                        {errors?.detail_ja?.type === "required" && (
                                            <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                        )} 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 mt-4">
                            <div className="col-span-12">
                                <div className="flex gap-4 items-center justify-center">
                                    <CancelButton title="Cancel" setEdit={cancelAdd}/>
                                    <SaveButton type="submit" title={edit?'Save':'Add'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </form>
        </div>
    )
}

export default BlogForm