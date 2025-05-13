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


const Page = ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = use(params);
    const router = useRouter();
    const { data, fetchDataById, updateData } = useBlogStore();
    const [blogState, setBlogState] = useState<BlogType>({
        id: "",
        image: "",
        category: "",
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        detail_th: ``,
        detail_en: ``,
        detail_ja: ``,
        status: false,
        created_at:"",
        updated_at:"",
        published_at:""
    });

    const { formState: { errors },reset } = useForm();

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
        await updateData(id, data, router);
    };

    

    const fetchData = async () => {
        await fetchDataById(id);
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    

    useEffect(() => {
        if (data.length > 0) {
            console.log(data);
            setBlogState({
                image: data[0].image,
                category: data[0].category,
                title_th: data[0].title_th,
                title_en: data[0].title_en,
                title_ja: data[0].title_ja,
                description_th: data[0].description_th,
                description_en: data[0].description_en,
                description_ja: data[0].description_ja,
                detail_th: data[0].detail_th,
                detail_en: data[0].detail_en,
                detail_ja: data[0].detail_ja,
                status: data[0].status,
            });
        }
      }, [data]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>
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
                        type="create"
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page;