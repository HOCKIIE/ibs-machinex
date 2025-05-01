import Api from '@/services/Api';
import React, { useState, useCallback, useEffect } from 'react';
import { useFieldArray, useForm, Controller  } from "react-hook-form";
import { ApiResponse } from '@/types/CategoryType';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { LiaLanguageSolid } from "react-icons/lia";
import { FaCheck, FaMapPin } from 'react-icons/fa6';
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdPricetag, IoMdClose } from "react-icons/io";
import CoverImageUpload from '../Dropzon/CoverImageUpload';
import TextEditor from '../Editor/TextEditor';

const BlogForm = ({
    itemState,
    setItemState: setData,
    handleSubmit,
    type
} : any) => {

    const [category, setCategory] = useState<ApiResponse[]>([]);
    const [status, setStatus] = useState<number>(0)
    const [lng, setLang] = useState<string>('th');
    const activeLng = `bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800`;
    const invalidClass = "border-rose-300 text-rose-600 border-rose-300 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose dark:border-rose-500";
    const validClass = "border-gray-300 text-gray-800 focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/70 dark:placeholder:text-white/20";
    const create = type === "create";
    const edit = type === "edit";
    const tags = [
        {title:"Company",value:"company"},
        {title:"Company",value:"company"}
    ];
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        setValue,
        control,
        watch,
        reset
    } = useForm({
        defaultValues: {
            title_th: itemState.title_th || "",
            title_en: itemState.title_en || "",
            title_ja: itemState.title_ja || "",
            description_th: itemState.description_th || "",
            description_en: itemState.description_en || "",
            description_ja: itemState.description_ja || "",
            detail_th: itemState.detail_th || "",
            detail_en: itemState.detail_en || "",
            detail_ja: itemState.detail_ja || "",
            category: [] as number[],
            status: false,
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "category",
    });

    const statusHandler = () => {

    }
    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(value)
    }

    const fetchCategory = useCallback(async()=>{
        const res = await Api.get('/category');
        setCategory(res.data);
    }, [setCategory]);

    useEffect(()=>{
        fetchCategory();
    }, [fetchCategory]);

    return (
        <div className="p-4">
            <div className="flex gap-4">
                <div className="grid gap-4 settings w-2/12">
                    <div className="border p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b px-1 pb-2 flex items-center"><LiaLanguageSolid className='me-1' /> Languages </div> 
                            <div className="setting-body">
                                <ul className='mt-2'>
                                    <li><a className={`block rounded-lg text-sm overflow-hidden p-2 text-boxdark hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800 ${activeLng}`} href="typescript:" onClick={()=>setLang('th')}>Thai</a></li>
                                    <li><a className="block rounded-lg text-sm overflow-hidden p-2 text-boxdark hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800" href="typescript:" onClick={()=>setLang('en')}>English</a></li>
                                    <li><a className="block rounded-lg text-sm overflow-hidden p-2 text-boxdark hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 dark:hover:bg-indigo-800" href="typescript:" onClick={()=>setLang('ja')}>Japanese</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b px-1 pb-2 flex items-center"><BiSolidCategoryAlt className="me-1"/> Category</div> 
                        </div>
                        <div className="setting-body grid">
                            {category && category?.map((v,k)=>
                                <Controller
                                    key={k}
                                    name="category"
                                    control={control}
                                    render={({field}) => {
                                        const isChecked = Array.isArray(field.value) && field.value.includes(v.id);
                                        return (
                                        <label className="inline-flex items-center gap-2 cursor-pointer space-y-2">
                                            <input
                                                type="checkbox"
                                                className="peer absolute opacity-0 w-0 h-0"
                                                value={v.id}
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    if (checked) {
                                                        field.onChange([...field.value, v.id]);
                                                    } else {
                                                        field.onChange(field.value.filter((id: number) => id !== v.id));
                                                    }
                                                }}
                                                ref={field.ref}
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-500 rounded-md flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors">
                                                <FaCheck fontSize={14} className={`${isChecked?`text-white`:`text-transparent`} font-bold peer-checked:${isChecked?'block':'hidden'}`} />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-400 text-sm">{v.title_en}</span>
                                        </label>)
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b px-1 pb-2 flex items-center"><FaMapPin className='me-1' /> Status</div> 
                        </div>
                        <div className="setting-body mt-2">
                            <div className="flex items-center mb-4">
                                <input id="default-radio-1" 
                                    onChange={statusHandler}
                                    checked={status == 1 ?true:false} type="radio" value="1" name="status" className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 outline-none" />
                                <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
                            </div>
                            <div className="flex items-center">
                                <input id="default-radio-2" 
                                    onChange={statusHandler}
                                    checked={status == 0 ?true:false} type="radio" value="0" name="status" className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 outline-none" />
                                <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Inactive</label>
                            </div>
                        </div>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b px-1 pb-2 flex items-center"><MdRemoveRedEye className="me-1"/> Publish
                            </div> 
                        </div>
                        <div className="setting-body mt-2">
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="1" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Publish: </span>
                            </label>
                            
                        </div>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <div className="setting-content">
                            <div className="setting-header border-b px-1 pb-2 flex items-center"><IoMdPricetag className="me-1"/>Tag</div> 
                        </div>
                        <div className="setting-body mt-2">   
                            <div className="flex gap-1">
                                <input placeholder="tags" onChange={search} className="dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-2 py-0 text-sm placeholder:text-gray-400 focus:ring-2 focus:outline-none"/>
                                <button className="text-sm p-2 bg-indigo-500 hover:bg-indigo-600 text-gray-100 hover:text-white rounded-lg">Add</button>
                            </div>
                            <div className="tags mt-2 flex flex-wrap">
                                <span className="text-sm bg-indigo-500 text-gray-100 ps-2 pe-1 py-[2px] rounded-md flex justify-center">1-CE WIND Co.,Ltd. <button className='bg-transparent' title="Remove"><IoMdClose /></button></span>
                            </div>                    
                        </div>
                    </div>
                </div>
                <div className="w-10/12">
                    <div className="w-full">
                        <div className="tabs">
                            <div className="tab" data-tab="th">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <CoverImageUpload register={register} watch={watch} setValue={setValue}/>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                                            <input 
                                                {...register("title_th", { required: true })}
                                                type="text" 
                                                onChange={setData}
                                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.name_th ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                                placeholder="Title" />
                                                {errors?.title_th?.type === "required" && (
                                                    <p className="text-xs text-rose-600 dark:text-rose-700">
                                                        {create
                                                        ? "This field is required."
                                                        : "Recheck the field."}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-12">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
                                        <textarea 
                                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_th ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                            placeholder="Description"
                                            name="" 
                                            rows={5}
                                            id=""
                                        ></textarea>
                                        {errors?.description_th?.type === "required" && (
                                            <p className="text-xs text-rose-600 dark:text-rose-700">
                                                {create
                                                ? "This field is required."
                                                : "Recheck the field."}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail</label>
                                        <TextEditor />
                                        {/* <textarea 
                                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.description_th ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                            placeholder="Detail"
                                            name="" 
                                            rows={5}
                                            id=""
                                        ></textarea>
                                        {errors?.description_th?.type === "required" && (
                                            <p className="text-xs text-rose-600 dark:text-rose-700">
                                                {create
                                                ? "This field is required."
                                                : "Recheck the field."}
                                            </p>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                            <div className="tab" data-tab="en"></div>
                            <div className="tab" data-tab="ja"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogForm