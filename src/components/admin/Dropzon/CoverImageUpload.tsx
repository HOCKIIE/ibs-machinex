import React, { useEffect,useState } from 'react';
import { LiaTimesSolid } from "react-icons/lia";
import { UseFormSetValue, UseFormStateReturn, UseFormWatch, Controller, Path, FieldValues,UseFormReturn } from 'react-hook-form';
import { ErrorMessage } from '@/components/admin/Form/Validation';

interface CoverImageUploadFormValues {
    image: File | string | null;
}

interface CoverImageUploadProps<T extends FieldValues> {
    control: UseFormReturn<T>["control"];
    watch: UseFormWatch<T>;
    setValue: UseFormSetValue<T>;
    defaultValue: CoverImageUploadFormValues["image"];
    errors: UseFormStateReturn<T>["errors"];
}

const CoverImageUpload =  <T extends FieldValues>({ control, setValue, defaultValue, errors }: CoverImageUploadProps<T>) => {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        if (file instanceof File) {
            setValue("image" as Path<T>, file as unknown as T[keyof T], {
                shouldValidate: true,
                shouldTouch: true,
                shouldDirty: true,
        });
        }
        
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(file));
            setValue("image" as Path<T>,  file as unknown as T[keyof T] , { shouldValidate: true });
        }
    };

    const handleResetImage = () => {
        setValue("image" as Path<T>, "" as unknown as T[keyof T]);
        setPreviewUrl(null);
    };
    useEffect(() => {
        let objectUrl: string | null = null;

        if (defaultValue) {
            if (typeof defaultValue === "string") {
                setPreviewUrl(defaultValue);
            } else if (defaultValue instanceof File) {
                objectUrl = URL.createObjectURL(defaultValue);
                setPreviewUrl(objectUrl);
            }
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [defaultValue]);


    return (
        <div className="col-span-full">
            <label className="block text-sm/6 font-medium text-gray-900 dark:text-gray-400 h-full">Cover Image</label>
            <div 
                className={`h-full flex justify-center items-center rounded-lg border border-dashed ${errors?.image ? `border-red-400 dark:border-red-800` : `dark:border-gray-600 border-gray-900/25 h-50`} ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
            >
                <div className="text-center">
                        { previewUrl && 
                            <div className="relative">
                                <img src={previewUrl} alt="Preview" className="h-auto min-h-[300px] max-h-[300px] w-auto max-w-full rounded-md shadow" />
                                {/* <Image src={previewUrl} alt="Preview" width={300} height={300} className="h-auto min-h-[300px] max-h-[300px] w-auto max-w-full rounded-md shadow" />  */}
                                <button
                                    title="Reset"
                                    type="button"
                                    onClick={handleResetImage}
                                    className="absolute flex items-center justify-center top-2 right-2 w-8 h-8 rounded-full bg-red-50 border-red-300 border hover:bg-red-100 text-red-600 dark:text-red-200 dark:bg-red-2000 dark:hover px-2 py-1 text-xs"
                                ><LiaTimesSolid/></button>
                            </div>
                        }
                        <div className={previewUrl? "hidden" : ""}>
                            <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path 
                                    fillRule="evenodd" 
                                    clipRule="evenodd" 
                                    d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" 
                                />
                            </svg>
                            <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500 focus:outline-none">
                                <span>Upload a file</span>
                                <Controller
                                    name={"image" as Path<T>}
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
                                        <input 
                                            type="file" 
                                            id="file-upload"
                                            accept="image/*"
                                            className="sr-only focus:outline-none"
                                            onChange={handleImageChange}
                                        />)}
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs/5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 2MB</p>
                        </div>
                    
                </div>
            </div>
            {errors?.image && <ErrorMessage className="mt-1">This field is required.</ErrorMessage>}
        </div>
    )
}

export default CoverImageUpload