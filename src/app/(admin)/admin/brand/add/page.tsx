"use client";
import React, { useEffect, useRef } from 'react';
import { useForm, useWatch, Path  } from 'react-hook-form';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BrandForm from '@/components/admin/Form/BrandForm';
import useBrandStore from '@/store/useBrandStore';
import { BrandFormProps } from '@/types/BrandType';
import { deserialize } from '@/utils/slateHtmlConverter';
import { BackButton } from '@/components/admin/Button/BackButton';
import { isEqual } from '@/utils/utils';


const Page = () => {

    const { createData } = useBrandStore();
    const form = useForm<BrandFormProps>({
        mode: "onChange",
        criteriaMode: "all",
        defaultValues: {
            id: 0,
            image: null,
            title_th: "",
            title_en: "",
            title_ja: "",
            description_th: "",
            description_en: "",
            description_ja: "",
            detail_th: "",
            detail_en: "",
            detail_ja: "",
            descendant_th: "",
            descendant_en: "",
            descendant_ja: "",
            website: "",
            apiName: "",
            status: false,
            brands: [],
            category: [],
            categories: [],
            published_at: "",
            created_at: "",
            updated_at: ""
        }
    })
    const { setError } = form;

    function setStateChanged<K extends keyof BrandFormProps>(
        target: Partial<BrandFormProps>,
        key: K,
        value: BrandFormProps[K]
    ) {
        target[key] = value;
    }

    const handleSubmit = async (data: BrandFormProps) => {
        try{
            const req = await createData(data);
            const {status, statusCode, message, errors } = req;
            if (!status && errors) {
                Object.entries(errors).forEach(([field, message]) => {
                    const msg = Array.isArray(message) ? message[0] : message;
                    setError(field as Path<BrandFormProps>, { type: "server", message: msg});
                });
            }
        } catch (err) {
            console.error("🛑 Oops : ", err);
        }
    }

    const watched = useWatch({ control: form.control });
    const prevRef = useRef<Partial<BrandFormProps>>({});

    useEffect(() => {
        if (!watched) return;
        const changed: Partial<BrandFormProps> = {};
        (Object.keys(watched) as (keyof BrandFormProps)[]).forEach((key) => {
            let current = watched[key];
            const prev = prevRef.current[key];
            if (key === "image") {
                if (current instanceof FileList) {
                    current = current[0] ?? null;
                }
            }
            if (!isEqual(current, prev)) {
                setStateChanged(changed, key, current as BrandFormProps[typeof key]);
            }
        });
    }, [watched]);

    return (
    <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb /></div>
                </div>
            </div>
    
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <BackButton />
                </div>
                <hr />
                <BrandForm form={form} onSubmit={handleSubmit} type="create" />
            </div>
        </div>
    </DefaultLayout>
    )
}

export default Page