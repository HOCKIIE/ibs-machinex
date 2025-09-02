"use client"
import React,{ useEffect,useState,useRef,use } from 'react';
import { UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BlogForm from '@/components/admin/Form/BlogForm';
import useBlogStore from '@/store/useBlogStore';
import { BlogFormProps, BlogType } from '@/types/BlogType';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';


const Page = ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = use(params);
    const router = useRouter();
    const { items, fetchDataById, updateData } = useBlogStore();
    const [blogState, setBlogState] = useState<BlogType>({
        id: "",
        image: "",
        categories: [],
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        detail_th: ``,
        detail_en: ``,
        detail_ja: ``,
        updated_at: "",
        pathName: "",
        status: false, // Add default value for status
        published_at: "", // Add default value for published_at
        created_at: "", // Add default value for created_at
    });

    const { reset } = useForm();

    const debouncedSetValueRef = useRef(
        debounce((
            name: keyof BlogFormProps,
            value: string,
            setValue: UseFormSetValue<BlogFormProps>,
            trigger: UseFormTrigger<BlogFormProps>
        ) => {
            setValue(name, value, { shouldValidate: true });
            trigger(name);
        }, 500)
    );

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setValue: UseFormSetValue<BlogFormProps>,
        trigger: UseFormTrigger<BlogFormProps>
    ) => {
        const { name, value } = event.target;
        setBlogState((prev) => ({ ...prev, [name]: value }));
        debouncedSetValueRef.current(name as keyof BlogFormProps, value, setValue, trigger)
    };

    const handleSubmit = async (data: any) => {
        console.log(data);
        await updateData(id, data, router);
    };

    const fetchData = React.useCallback(async () => {
        await fetchDataById(id);
    }, [fetchDataById, id]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    

    useEffect(() => {
        if (items.length > 0) {
            setBlogState({
                id: items[0].id ?? "",
                image: items[0].image ?? "",
                categories: items[0].categories ?? [],
                title_th: items[0].title_th ?? "",
                title_en: items[0].title_en ?? "",
                title_ja: items[0].title_ja ?? "",
                description_th: items[0].description_th ?? "",
                description_en: items[0].description_en ?? "",
                description_ja: items[0].description_ja ?? "",
                detail_th: items[0].detail_th ?? "",
                detail_en: items[0].detail_en ?? "",
                detail_ja: items[0].detail_ja ?? "",
                updated_at: items[0].updated_at ?? "",
                status: items[0].status ?? false,
                pathName: items[0].pathName ?? false,
                published_at: items[0].published_at ?? "",
                created_at: items[0].created_at ?? ""
            });
        }
        // @ts-expect-error: items may have a status property from API response
        if(items.status === true) {
        // @ts-expect-error: items may have a message property from API response
            toast.success(items.message);
        }
        
    }, [items, reset]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb current={blogState.title_th}/></div>
                    </div>
                </div>
        
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="px-5 py-4 sm:px-6 sm:py-5">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new blog</h3>
                    </div>
                    <hr />
                    <BlogForm 
                        itemState={blogState}
                        setItemState={handleChange}
                        onSubmit={handleSubmit}
                        type="edit"
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page;