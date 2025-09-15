"use client"

import React from "react";
import DefaultLayout from "@/components/admin/layout/DefaultLayout";
import Breadcrumb from "@/components/admin/Breadcrumb/Breadcrumb";
import ProductForm from "@/components/admin/Form/ProductForm";
import { useRouter } from "next/navigation";
import useProductStore from "@/store/useProductStore";
import { ProductFormProps } from "@/types/ProductType";

export default function Page(){

    const router = useRouter();
    const { createData } = useProductStore();
    const itemState: ProductFormProps = {
        id: "",
        image: null,
        image_alt:"",
        thumbnail: "",
        title_th:"",
        title_en:"",
        title_ja:"",
        description_th:"",
        description_en:"",
        description_ja:"",
        detail_th:"",
        detail_en:"",
        detail_ja:"",
        isActive:false,
        color:"",
        quantity: 0,
        brand:[],
        category:[],
        categories:[],
        published_at:"",
        price: 0,
        created_at: "",
        updated_at: null
    };

    const handleSubmit = async (data: ProductFormProps) => await createData(data,router);

    return <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb /></div>
                </div>
            </div>
    
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new product</h3>
                </div>
                <hr />
                <ProductForm 
                    itemState={itemState}
                    onSubmit={handleSubmit}
                    type="create"
                />
            </div>
        </div>
    </DefaultLayout>
}