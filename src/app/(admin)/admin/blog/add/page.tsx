"use client";

import React,{ useState } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BlogForm from '@/components/admin/Form/BlogForm';
import { useRouter } from 'next/navigation';
import useBlogStore from '@/store/useBlogStore';


const page = () => {

    const router = useRouter();
    const { createData } = useBlogStore();
    const [userState, setUserState] = useState<UsersFormProps>({
        id: "",
        title_th: "",
        title_en: "",
        title_ja: "",
        description_th: "",
        description_en: "",
        description_ja: "",
        detail_th: "",
        detail_en: "",
        detail_ja: "",
        status: "",
        category: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value, files } = event.target;
        if (name === "image" && files && files[0]) {
        setUserState((prevState) => ({
            ...prevState,
            image: files[0],
        }));
        } else {
        setUserState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        }
    };

    const handleSubmit = async (data: any) => {
        await createData(data,router);
        // router.push("/admin/user");
    };

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
                        itemState={userState}
                        setItemState={handleChange}
                        handleSubmit={handleSubmit}
                        type="create"
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default page