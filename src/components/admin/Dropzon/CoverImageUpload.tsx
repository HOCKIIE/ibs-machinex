import React, { useEffect } from 'react';
import { LiaTimesSolid } from "react-icons/lia";
import { UseFormRegister, UseFormSetValue, UseFormStateReturn, UseFormWatch } from 'react-hook-form';
import { BlogFormProps } from '@/types/BlogType';
import { ErrorMessage } from '@/components/admin/Form/Validation';
import { set } from 'lodash';
import { FieldValues } from "react-hook-form";

interface CoverImageUploadFormValues {
    image: File | string | null;
}

interface CoverImageUploadProps<T extends FieldValues = FieldValues> {
    register: UseFormRegister<T>;
    watch: UseFormWatch<T>;
    setValue: UseFormSetValue<T>;
    defaultValue: CoverImageUploadFormValues["image"];
    errors: UseFormStateReturn<T>["errors"];
}

const CoverImageUpload =  <T extends FieldValues>({ register, setValue, defaultValue, errors }: CoverImageUploadProps<T>) => {

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [dragActive, setDragActive] = React.useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setValue("image" as Parameters<typeof setValue>[0], file as any, {
                shouldValidate: true,
                shouldTouch: true,
                shouldDirty: true,
            }); // ✅ make sure error gets cleared if valid
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(file));
            setValue("image" as Parameters<typeof setValue>[0], file as any, { shouldValidate: true });
        }
    };

    const handleResetImage = () => {
        setValue("image" as Parameters<typeof setValue>[0], null as any); // reset field
        setPreviewUrl(null); // reset preview
    };
    useEffect(() => {
        if (defaultValue) {
            if (typeof defaultValue === "string") {
                setPreviewUrl(`${defaultValue}`);
            } else if (defaultValue instanceof File) {
                setPreviewUrl(URL.createObjectURL(defaultValue));
            }
        } else {
            setPreviewUrl(null);
        }
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
                    {previewUrl ? (
                        <div className="relative">
                            <img src={previewUrl} alt="Preview" className="h-auto min-h-[300px] max-h-[300px] w-auto max-w-full rounded-md shadow" /> 
                            <button
                                title="Reset"
                                type="button"
                                onClick={handleResetImage}
                                className="absolute flex items-center justify-center top-2 right-2 w-8 h-8 rounded-full bg-red-50 border-red-300 border hover:bg-red-100 text-red-600 dark:text-red-200 dark:bg-red-2000 dark:hover px-2 py-1 text-xs"
                            ><LiaTimesSolid/></button>
                        </div>
                    ):(
                        <>
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
                                <input 
                                    type="file" 
                                    id="file-upload"
                                    accept="image/*"
                                    className="sr-only focus:outline-none"
                                    {...register("image" as Parameters<typeof register>[0], {
                                        required: true,
                                        validate: {
                                            required: (value) => value ? true : "This field is required.",
                                            fileType: (value) => {
                                                let file: File | null = null;
                                                if (value && typeof value === "object") {
                                                    // @ts-expect-error
                                                    if (typeof FileList !== "undefined" && value instanceof FileList) {
                                                        file = value[0];
                                                    // @ts-expect-error
                                                    } else if (typeof File !== "undefined" && value instanceof File) {
                                                        file = value;
                                                    }
                                                }
                                                return file && file.type.startsWith("image/") || "Only image files are allowed.";
                                            },
                                            fileSize: (value) => {
                                                let file: File | null = null;
                                                if (value && typeof value === "object") {
                                                    // @ts-expect-error
                                                    if (value instanceof FileList) {
                                                        file = value[0];
                                                    // @ts-expect-error
                                                    } else if (value instanceof File) {
                                                        file = value;
                                                    }
                                                }
                                                return file ? file.size <= 2 * 1024 * 1024 || "File size must be less than 2MB." : "This field is required.";
                                            },
                                        },

                                    })}
                                    onChange={handleImageChange}
                                />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs/5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 2MB</p>
                        </>
                    )}
                </div>
            </div>
            {errors?.image && <ErrorMessage className="mt-1">This field is required.</ErrorMessage>}
        </div>
    )
}

export default CoverImageUpload