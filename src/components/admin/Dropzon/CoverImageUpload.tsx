import React, { useEffect,useState,useRef } from 'react';
import {LiaCheckSolid, LiaTimesSolid } from "react-icons/lia";
import { UseFormSetValue, UseFormStateReturn, UseFormWatch, Controller, Path, FieldValues,UseFormReturn } from 'react-hook-form';
import { ErrorMessage } from '@/components/admin/Form/Validation';
import { LangBadge } from '../ui/LangBadge';

interface CoverImageUploadFormValues {
    image: File | string | null;
}

interface CoverImageUploadProps<T extends FieldValues> {
    name?:string;
    control: UseFormReturn<T>["control"];
    watch: UseFormWatch<T>;
    current: string | null;
    setValue: UseFormSetValue<T>;
    defaultValue: CoverImageUploadFormValues["image"];
    errors: UseFormStateReturn<T>["errors"];
    lang?: string;
    width?: string;
    height?: string;
    label?: string;
}

const CoverImageUpload =  <T extends FieldValues>({ name, control, current, setValue, defaultValue, errors, lang, width, height, label }: CoverImageUploadProps<T>) => {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [elWidth, setElWidth] = useState<string>(`200px`);
    const [maxHeight, setMaxHeight] = useState<string>("max-h-[300px]");
    const [minHeight, setMinHeight] = useState<string>("min-h-[300px]");
    const [showBtn, setShowBtn] = useState(false);
    const [processing, setProcessing] = useState(false);
    const thisRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try{
            const file = event.target.files?.[0];
            if (!file) return;
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            if (file instanceof File) {
                setValue(name as Path<T>, file as unknown as T[keyof T], {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                });
            }
        } catch(err) {
            console.log(err)
        }
        
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(file));
            setValue(name as Path<T>,  file as unknown as T[keyof T] , { shouldValidate: true });
        }
    };

    const handleResetImage = () => {
        setValue(name as Path<T>, "" as unknown as T[keyof T]);
        setPreviewUrl(null);
        processImage()
    };
    const SetCurrentHandler = async() => {
        setProcessing(false);
        setShowBtn(false);
        if(current as string) {
            setValue(name as Path<T>, current as unknown as T[keyof T]);
            setPreviewUrl(current);
            fileInputRef.current!.value = "";
        }
    }
    const processImage = async () => {
        setProcessing(true);
        setShowBtn(false);
    }
    const setNewCover = async () => {
        setProcessing(false);
        setShowBtn(true);
    }
    useEffect(() => {
        let objectUrl: string | null = null;
        if (defaultValue == null) {
            setPreviewUrl(null);
            return;
        }
        if (typeof defaultValue === "string") {
            setPreviewUrl(defaultValue);
            return;
        }
        if (defaultValue instanceof File) {
            objectUrl = URL.createObjectURL(defaultValue);
            setPreviewUrl(objectUrl);
        }
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [defaultValue]);

    useEffect(() => {
        setMinHeight(height?`min-h-[${height}]`:minHeight);
        setMaxHeight(height?`max-h-[${height}]`:maxHeight);
        setElWidth(width?`${width}`:elWidth);
    }, [height, width, elWidth]);

    if(!elWidth) return;

    return (
        <Controller
            name={name as Path<T>}
            control={control}   // 👈 ต้องรับ control มาจาก props ด้วย
            rules={{
                required: "This field is required.",
                validate: {
                    fileType: (value: any) => {
                        if (!value || typeof value === "string") return true;
                        if (value instanceof File) return value.type.startsWith("image/") || "Only image files allowed";
                        return true;
                    },
                    fileSize: (value: any) => {
                        if (!value || typeof value === "string") return true;
                        if (value instanceof File) return value.size <= 2 * 1024 * 1024 || "Max 2MB";
                        return true;
                    }
                },
            }}
            render={({ field }) => (
                <div id={name} ref={thisRef}>
                    {label &&
                        <div className='flex mb-3'>
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-400 h-full">{label} </label>{lang && <LangBadge lang={lang} />}
                        </div>
                    }
                    <div 
                        style={{ width: elWidth }}
                        className={`bg-white ${minHeight} flex justify-center items-center rounded-lg border border-dashed ${name && errors[name] ? `border-red-400 dark:border-red-800` : `dark:border-gray-600 border-gray-900/25`} ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} overflow-hidden`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                                { previewUrl &&
                                    <div className="relative" onMouseEnter={()=>setShowBtn(true)} onMouseLeave={()=>setShowBtn(false)}>
                                        <img src={previewUrl} alt="Preview" className={`h-auto ${minHeight} ${maxHeight} w-auto max-w-full rounded-md shadow`} />
                                        {processing && 
                                            <div className="action-button flex absolute top-2 right-2 gap-1">
                                                <button 
                                                    title="Cancel" 
                                                    type="button" 
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border-slate-300 border hover:bg-slate-200 text-slate-400 dark:text-slate-200 dark:bg-slate-400 dark:hover px-2 py-1 text-xs"
                                                    onClick={SetCurrentHandler}
                                                ><LiaTimesSolid /></button>
                                                <button 
                                                    title="Save" 
                                                    type="button" 
                                                    className=" flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 border-emerald-300 border hover:bg-emerald-200 text-emerald-600 dark:text-slate-200 dark:bg-slate-400 dark:hover px-2 py-1 text-xs"
                                                    onClick={setNewCover}
                                                ><LiaCheckSolid /></button>
                                            </div>
                                        }
                                        {showBtn && !processing && <div className="absolute top-2 right-2">
                                            <button
                                                title="Reset"
                                                type="button"
                                                onClick={handleResetImage}
                                                className=" flex items-center justify-center w-8 h-8 rounded-full bg-red-50 border-red-300 border hover:bg-red-100 text-red-600 dark:text-red-200 dark:bg-red-200 dark:hover px-2 py-1 text-xs"
                                            ><LiaTimesSolid/></button>
                                            </div>
                                        }
                                    </div>
                                }
                                <div className={previewUrl ? "hidden" : ""}>
                                    <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path 
                                            fillRule="evenodd" 
                                            clipRule="evenodd" 
                                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" 
                                        />
                                    </svg>
                                    <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                                        <label htmlFor={`file-upload-${name}`} className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500 focus:outline-none">
                                        <span>Upload a file</span>
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            id={`file-upload-${name}`}
                                            accept="image/*"
                                            className="sr-only focus:outline-none"
                                            onChange={handleImageChange}
                                        />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 2MB</p>
                                </div>
                            
                        </div>
                    </div>
                    {name && errors[name] && <ErrorMessage className="mt-1">This field is required.</ErrorMessage>}
                </div>
            )}
        />
    )
}

export default CoverImageUpload