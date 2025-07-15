import Api from "@/services/Api";
import React, { useState, useCallback, useEffect, Children } from 'react';
import { CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { PropductFormProps } from "@/types/ProductType";
import { useForm, Controller  } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MdRemoveRedEye } from "react-icons/md";
import { ApiResponse as CategoryApiResponse } from '@/types/CategoryType';
import { BrandType } from '@/types/BrandType'
import CoverImageUpload from '../Dropzon/CoverImageUpload';
import TextEditor from '../Editor/TextEditor';
import { ErrorMessage } from './Validation';
import SearchableCombobox from "../Combobox/SearchableCombobox";

import { IoChevronForwardSharp } from "react-icons/io5";
import { FaCheck, FaMapPin } from 'react-icons/fa6';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { LiaLanguageSolid } from "react-icons/lia";
import { HiExclamation } from "react-icons/hi";

const ProductForm = ({
    itemState,
    setItemState: setData,
    onSubmit,
    type
}:any) => {

    const router = useRouter();
    const [category, setCategory] = useState<CategoryApiResponse[]>([]);
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
    } = useForm<PropductFormProps>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const Exclamation = () => <HiExclamation className="text-rose-500" fontSize={18}/>;
    const hasThaiErrors = Object.keys(errors).some(key => key.endsWith('_th'));
    const hasEnglishErrors = Object.keys(errors).some(key => key.endsWith('_en'));
    const hasJapaneseErrors = Object.keys(errors).some(key => key.endsWith('_ja'));

    const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);

    const collapsed = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const el = e.currentTarget;
        el.querySelector('.chevron')?.classList.toggle('rotate-90')
        el.nextElementSibling?.classList.toggle('h-0');
    }

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

    const cancelAction = () => router.back();

    const fetchCategory = useCallback(async()=>{
        const res = await Api.get('/category/product');
        console.log('category >>> ',res.data)
        setCategory(res.data);
    }, [setCategory]);

    useEffect(()=>{
        fetchCategory();
    }, [fetchCategory]);

    useEffect(() => {
        if (itemState) {
            reset({
                id: itemState.id,
                image: itemState.image,
                categories: itemState.categories,
                brand: itemState.brand,
                title_th: itemState.title_th,
                title_en: itemState.title_en,
                title_ja: itemState.title_ja,
                description_th: itemState.description_th,
                description_en: itemState.description_en,
                description_ja: itemState.description_ja,
                detail_th: itemState.detail_th,
                detail_en: itemState.detail_en,
                detail_ja: itemState.detail_ja,
                isActive: itemState.isActive ?? false,
                published_at: itemState.published_at,
            });
            if (itemState?.categories) {
                const categoryIds = itemState.categories.map((c: any) => String(c.id));
                setValue("category", categoryIds); // set react-hook-form field
            }
            if(itemState?.brand) {
                const brandId = itemState.brand.map((v:any) => String(v.id));
                setValue('brand',brandId);
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
                                    <BiSolidCategoryAlt className="me-1"/> Brand
                                </div> 
                            </div>
                            <div className="setting-body">
                                <ul>
                                {category?.map((v, k) => (
                                    <li key={k} className="py-1">
                                        <a className="flex items-center text-left cursor-default" onClick={collapsed}>
                                            <IoChevronForwardSharp className="chevron transition-all duration-200 ease-in-out"/>
                                            <span className="truncate overflow-x-hidden whitespace-nowrap w-full">{v.title_en}</span>
                                        </a>
                                        <div className="pt-1 border-l ps-3 ms-2 transition-all duration-200 ease-in-out h-0 overflow-hidden">
                                            {v.brand?.map((item:BrandType, i) =>
                                                <div key={i} className="py-1">
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                            value={item.id}
                                                            {...register("brand", {
                                                                validate: (value, allValues) =>
                                                                allValues.brand?.length > 0 || "Please select at least 1 brand.",
                                                            })}
                                                        /> {item.title_en}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            {errors?.brand && (
                                <ErrorMessage className="mt-2">{errors?.brand.message}</ErrorMessage>
                            )}
                        </div>
                    </div>
                    <div className="w-10/12">
                        <div className="w-full">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-6">
                                    <CoverImageUpload<PropductFormProps> register={register} watch={watch} setValue={setValue} defaultValue={itemState.image} errors={errors}/>
                                </div>
                                <div className="col-span-6">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Price</label>
                                        <input 
                                            type="text"
                                            {...register("price", { required: true })}
                                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.price ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                            placeholder="Price" 
                                        />
                                        {errors?.price?.type === "required" && (
                                            <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                                        )}
                                    </div>
                                    <div className="space-y-3 mt-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Quantiy</label>
                                        <input 
                                            type="text"
                                            {...register("quantity")}
                                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.quantity ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                            placeholder="quantity" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-12 gap-4 mt-3">
                                        <div className="col-span-6">
                                            <div className="border border-gray-300 dark:border-gray-500 p-2 rounded-lg">
                                                <div className="setting-content">
                                                    <div className="setting-header border-b border-gray-300 dark:border-gray-500 px-1 pb-2 flex items-center">
                                                        <FaMapPin className='me-1' /> Active
                                                    </div> 
                                                </div>
                                                <div className="setting-body mt-2">
                                                    <div className="flex items-center">
                                                        <Controller
                                                            name="isActive"
                                                            control={control}
                                                            defaultValue={!!itemState?.isActive}
                                                            render={({ field }) => (
                                                                <label className="inline-flex items-center cursor-pointer">
                                                                    <input type="checkbox" value="1" className="sr-only peer" checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)}/>
                                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                                                                </label>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6">
                                            <div className="border border-gray-300 dark:border-gray-500 p-2 rounded-lg">
                                                <div className="setting-content">
                                                    <div className="setting-header border-b border-gray-300 dark:border-gray-500 px-1 pb-2 flex items-center">
                                                        <MdRemoveRedEye className="me-1"/> Publish
                                                    </div> 
                                                </div>
                                                <div className="setting-body mt-2">
                                                    <div className="flex items-center">
                                                        <Controller
                                                            name="published_at"
                                                            control={control}
                                                            defaultValue={itemState?.published_at ?? null}
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
                                                                        field.onChange(checked ? formatDate(new Date()) : null);
                                                                    }}
                                                                    disabled={!!itemState?.published_at}
                                                                    />
                                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                                                                </label>
                                                                );
                                                            }}
                                                        />
                                                        {itemState?.published_at && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 ms-2">
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(itemState?.published_at).toLocaleDateString('en-US', {
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
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail</label>
                                            <Controller
                                                name="detail_th"
                                                control={control}
                                                defaultValue={itemState.detail_th}
                                                render={({field}) => (<TextEditor name={field.name} value={field.value} onChange={field.onChange} />) }
                                            />                        
                                            {errors?.detail_en?.type === "required" && (
                                                <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                            )} 
                                        </div>
                                    </div>
                                </div>
                                <div className={`tab ease-in-out duration-300 ${lng=='en'?``:` hidden`}`} data-tab="en">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-12">
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                                                <input 
                                                    type="text"
                                                    {...register("title_en", { required: true })}
                                                    className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title_en ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                                    placeholder="Title EN" 
                                                />
                                                {errors?.title_th?.type === "required" && (
                                                    <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-12">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
                                                <textarea 
                                                    {...register("description_en", { required: true })}
                                                    className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_en ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                                    placeholder="Description EN"
                                                    rows={5}
                                                ></textarea>
                                                {errors?.description_th?.type === "required" && (
                                                    <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                                )}
                                        </div>
                                        <div className="col-span-12">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail</label>
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
                                <div className={`tab ease-in-out duration-300 ${lng=='ja'?``:` hidden`}`} data-tab="ja">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-12">
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                                                <input 
                                                    type="text"
                                                    {...register("title_ja", { required: true })}
                                                    className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title_ja ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                                    placeholder="Title JA" 
                                                />
                                                {errors?.title_th?.type === "required" && (
                                                    <ErrorMessage>{create? "This field is required.": "Recheck the field."}</ErrorMessage>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-12">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
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
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail</label>
                                            <Controller
                                                name="detail_ja"
                                                control={control}
                                                defaultValue={itemState.detail_ja}
                                                render={({field}) => (<TextEditor name={field.name} value={field.value} onChange={field.onChange} />) }
                                            />                        
                                            {errors?.detail_en?.type === "required" && (
                                                <ErrorMessage>{create ? "This field is required." : "Recheck the field."}</ErrorMessage>
                                            )} 
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
                    </div>
                </div>
            </form>
        </div>
    )

}
export default ProductForm