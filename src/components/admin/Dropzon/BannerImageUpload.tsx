import React, { useEffect,useState,useRef } from 'react';
import { LiaCheckSolid, LiaTimesSolid } from "react-icons/lia";
import { UseFormSetValue, UseFormStateReturn, UseFormWatch, Controller, Path, FieldValues,UseFormReturn } from 'react-hook-form';
import { ErrorMessage } from '@/components/admin/Form/Validation';
import { LangBadge } from '../ui/LangBadge';
import Cropper from "react-easy-crop";

interface BannerImageUploadFormValues {
    banner: File | string | null;
}

interface BannerImageUploadProps<T extends FieldValues> {
    name?:string;
    control: UseFormReturn<T>["control"];
    watch: UseFormWatch<T>;
    current: string | null;
    setValue: UseFormSetValue<T>;
    defaultValue: BannerImageUploadFormValues["banner"];
    errors: UseFormStateReturn<T>["errors"];
    lang?: string;
    width?: string;
    height?: string;
    label?: string;
}

const BannerImageUpload =  <T extends FieldValues>({ name, control, current, setValue, defaultValue, errors, lang, width, height, label }: BannerImageUploadProps<T>) => 
{
    const containerRef = useRef<HTMLDivElement>(null);
    const [processing, setProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [maxHeight, setMaxHeight] = useState<string>("max-h-[300px]");
    const [minHeight, setMinHeight] = useState<string>("min-h-[300px]");
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showRemove, setShowRemove] = useState(false);
    const thisRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try{
            const file = event.target.files?.[0];
            if (!file) return;
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setImageSrc(objectUrl);
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

    const getCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const image = new Image();
        image.src = imageSrc;

        await new Promise((resolve) => (image.onload = resolve));

        const canvas = document.createElement("canvas");
        canvas.width = 1320;
        canvas.height = 263;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            1320,
            263
        );

        return new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/jpeg");
        });
    };

    const handleCropSave = async () => {
        const croppedBlob = await getCroppedImage();
        if (!croppedBlob) return;

        const file = new File([croppedBlob], "cropped-banner.jpg", {
            type: "image/jpeg",
        });
        setPreviewUrl(URL.createObjectURL(file));
        setImageSrc(null)
        
        // set เข้า form
        setValue(name as Path<T>, file as unknown as T[keyof T]);
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

    const SetCurrentHandler = () => {
        console.log('current banner: ',current);
        setProcessing(false);
        setShowRemove(false);
        setImageSrc(null);
        if(current as string) {
            setValue(name as Path<T>, current as unknown as T[keyof T]);
            setPreviewUrl(current);
            fileInputRef.current!.value = "";
        }
    }

    const processImage = () => {
        setProcessing(true);
        setShowRemove(false);
    }

    const setNewCover = async () => {
        setProcessing(false);
        handleCropSave();
        setShowRemove(true);
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
    }, [height]);

    return (
        <Controller
            name={name as Path<T>}
            control={control}   // 👈 ต้องรับ control มาจาก props ด้วย
            rules={{
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
                <div className="w-full" id={name} ref={thisRef}>
                    {label &&
                        <div className='flex mb-3'>
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-400 h-full">{label} </label>{lang && <LangBadge lang={lang} />}
                        </div>
                    }
                    <div 
                        ref={containerRef}
                        className={`relative w-full h-[246px] ${minHeight} aspect-1320/263 flex justify-center items-center rounded-lg border border-dashed ${name && errors[name] ? `border-red-400 dark:border-red-800` : `dark:border-gray-600 border-gray-900/25`} ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} overflow-hidden`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onMouseEnter={()=>setShowRemove(true)} onMouseLeave={()=>setShowRemove(false)}
                    >

                        { previewUrl &&
                            <div className="relative">
                                <img src={previewUrl} alt="Preview" className={`h-auto ${minHeight} ${maxHeight} w-auto max-w-full rounded-md shadow`} />
                                {showRemove && !processing && <div className="absolute top-2 right-2">
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
                        {imageSrc && (
                            <>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1320 / 263}
                                    showGrid={false}
                                    objectFit="cover"
                                    onCropChange={(c) => setCrop({ x: 0, y: c.y })} // 👈 ล็อค X = 0
                                    onCropComplete={(_, croppedAreaPixels) => {
                                        setCroppedAreaPixels(croppedAreaPixels);
                                    }}
                                    onZoomChange={setZoom}
                                    classes={{
                                        cropAreaClassName: "rounded-lg",
                                    }}
                                />
                                <div className="action-button absolute bottom-2 right-2 flex gap-2">
                                    <button
                                        title="Reset"
                                        type="button"
                                        onClick={SetCurrentHandler}
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-red-300 border-red-400 border-2 hover:bg-red-400 text-red-700 dark:text-red-200 dark:bg-red-2000 dark:hover p-2 ease-in-out duration-300"
                                    ><LiaTimesSolid size={25}/></button>
                                    <button 
                                        title="Save" 
                                        type="button" 
                                        className=" flex items-center justify-center w-8 h-8 rounded-full bg-emerald-200 border-emerald-400 border-2 hover:bg-emerald-400 text-emerald-700 dark:text-slate-200 dark:bg-slate-400 dark:hover p-2 ease-in-out duration-300"
                                        onClick={setNewCover}
                                    ><LiaCheckSolid fontWeight={400}/></button>
                                </div>
                            </>
                        )}
                        
                        <div className={previewUrl ? "hidden" : "text-center"}>
                            <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path 
                                    fillRule="evenodd" 
                                    clipRule="evenodd" 
                                    d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" 
                                />
                            </svg>
                            {width && height && <p className="mt-4 flex text-sm/6">Auto crop at {width.replace('px', '')} x {height.replace('px', '')} pixel</p>}
                            <div className="flex text-sm/6 text-gray-600 dark:text-gray-400">
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
            )}
        />
    )
}

export default BannerImageUpload