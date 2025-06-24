"use client"

import React ,{ useState, useRef } from "react";
import DefaultLayout from "@/components/admin/layout/DefaultLayout";
import Breadcrumb from "@/components/admin/Breadcrumb/Breadcrumb";
import ProductForm from "@/components/admin/Form/ProductForm";
import { useRouter } from "next/navigation";
import useProductStore from "@/store/useProductStore";
import { propductFormProps, ProductType } from "@/types/ProductType";
import { UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { debounce } from 'lodash';

export default function Page(){

    const router = useRouter();
    const { createData } = useProductStore();
    const [itemState, setItemState] = useState<Omit<ProductType,"id"|"created_at"|"deleted_at">>({
        image:"",
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
        brand:[],
        category:[],
        categories:[],
        published_at:"",
        price: 0,
        updated_at: ""
    });
    const { formState: { errors } } = useForm();
    const debouncedSetValueRef = useRef(
        debounce((
            name: keyof propductFormProps,
            value: string,
            setValue: UseFormSetValue<propductFormProps>,
            trigger: UseFormTrigger<propductFormProps>
        ) => {
            setValue(name, value, { shouldValidate: true });
            trigger(name);
        }, 500)
    );
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setValue: UseFormSetValue<propductFormProps>,
        trigger: UseFormTrigger<propductFormProps>
    ) => {
        const { name, value } = event.target;

        setItemState((prev) => ({ ...prev, [name]: value }));
        debouncedSetValueRef.current(name as keyof propductFormProps, value, setValue, trigger)
        
    };

    const handleSubmit = async (data: any) => {
        console.log("errors", errors);
        
        await createData(data,router);
    };

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
                    setItemState={handleChange}
                    onSubmit={handleSubmit}
                    type="create"
                />
            </div>
        </div>
    </DefaultLayout>
}