"use client";
import React,{ useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BrandForm from '@/components/admin/Form/BrandForm';
import useBrandStore from '@/store/useBrandStore';
import { BrandFormProps } from '@/types/BrandType';
import { useRouter, useSearchParams } from 'next/navigation';
import { deserialize } from '@/utils/slateHtmlConverter';
import { BackButton } from '@/components/admin/Button/BackButton';
import Badge from '@/components/admin/ui/Badge';

const Page = ({ params }:{ params: {id : number} }) => {

    const { id } = params;
    const router = useRouter();
    const searchParams = useSearchParams();
    const didFetchData = useRef(false);
    const { items, fetchDataById, updateData } = useBrandStore();

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
            brands: [],
            categories: [],
            category: [],
            status: false,
            created_at: "", 
            updated_at: "",
            published_at: null
        }
    });
    const handleSubmit = async (data: BrandFormProps) => {
        const req = await updateData(id, data);
        const {status, message, errors} = req;
        console.log(message)
        const redirect = searchParams.get('redirect');
        // if(status && redirect){
        //     setTimeout(()=>{ router.push(redirect); },1000);
        // }
    }
    const formValues = form.watch();
    const fetchData = async () => { await fetchDataById(id); }
    useEffect(() => { if(didFetchData.current) return; didFetchData.current = true; fetchData(); });
    useEffect(() => {
        if (items.length > 0) {
            let descendant_th:string[] = [];
            let descendant_en:string[] = [];
            let descendant_ja:string[] = [];
            if(items[0].detail_th !== "" && items[0].descendant_th === null) {
                descendant_th = deserialize(items[0].detail_th);
            } 
            if(items[0].descendant_th) descendant_th = items[0].descendant_th;
            if(items[0].detail_en !== "" && items[0].descendant_en === null) {
                descendant_en = deserialize(items[0].detail_en);
            } 
            if(items[0].descendant_en) descendant_en = items[0].descendant_en;
            if(items[0].detail_ja !== "" && items[0].descendant_ja === null) {
                descendant_ja = deserialize(items[0].detail_ja);
            } 
            if(items[0].descendant_ja) descendant_ja = items[0].descendant_ja;
            form.reset({
                id: items[0].id ?? "",
                image: items[0].image ?? "",
                title_th: items[0].title_th ?? "",
                title_en: items[0].title_en ?? "",
                title_ja: items[0].title_ja ?? "",
                description_th: items[0].description_th ?? "",
                description_en: items[0].description_en ?? "",
                description_ja: items[0].description_ja ?? "",
                detail_th: items[0].detail_th ?? "",
                detail_en: items[0].detail_en ?? "",
                detail_ja: items[0].detail_ja ?? "",
                descendant_th: descendant_th,
                descendant_en: descendant_en,
                descendant_ja: descendant_ja,
                website: items[0].website ?? "",
                apiName: items[0].apiName ?? "",
                categories: items[0].categories ?? [],
                category: items[0].category ?? [],
                status: Boolean(items[0]?.status) ?? false,
                updated_at: items[0].updated_at ?? null,
                created_at: items[0].created_at ?? null,
                published_at: items[0].published_at ?? null
            });
        }
    }, [items]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb current={formValues.title_en}/></div>
                    </div>
                </div>
        
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="px-5 py-4 sm:px-6 sm:py-5">
                        <BackButton />
                    </div>
                    <hr />
                    <BrandForm form={form} onSubmit={handleSubmit} type="edit" />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page