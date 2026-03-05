"use client"
import React,{ useEffect,useState,useRef } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BlogForm from '@/components/admin/Form/BlogForm';
import useBlogStore from '@/store/useBlogStore';
import { BlogFormProps } from '@/types/BlogType';
import Badge from '@/components/admin/ui/Badge';
import { useRouter } from 'next/navigation';


const Page = ({ params }: { params: { id: string } }) => 
{
    const { id } = params;
    const router = useRouter();
    const didFetchData = useRef(false);
    const { items, fetchDataById, updateData } = useBlogStore();
    const form = useForm<BlogFormProps>({
            mode: "onChange",
            criteriaMode: "all",
            defaultValues: {
                id: "",
                draftId: "",
                userId: "",
                image: null,
                title_th:  "",
                title_en: "",
                title_ja: "",
                description_th: "",
                description_en: "",
                description_ja: "",
                detail_th: "",
                detail_en: "",
                detail_ja: "",
                status: false,
                pathName: "",
                recommend: "",
                category: [],
                categories: [],
                published_at: "",
                created_at: "",
                updated_at: ""
            },
        });
    const handleSubmit = async (data: BlogFormProps) => {
        const req = await updateData(id, data);
        if(req && req.data){
            router.push(`/admin/blog`);
        }
    }
    const formValues = form.watch()
    const fetchData = async () => await fetchDataById(id);
    useEffect(() => { if(didFetchData.current) return; didFetchData.current = true; fetchData(); });
    useEffect(() => {
        if (items.length > 0) {
            form.reset({
                id: items[0].id ?? "",
                image: items[0].image ?? null,
                categories: items[0].categories ?? [],
                category: items[0].category ?? [],
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
                pathName: items[0].pathName ?? "",
                recommend: items[0].recommend ?? "",
                published_at: items[0].published_at ?? "",
                created_at: items[0].created_at ?? ""
            });
        }
    }, [items]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb current={formValues.title_th}/></div>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="px-5 py-4 sm:px-6 sm:py-5 flex justify-between">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Edit blog</h3>
                        <div className='flex gap-1'>
                            <span>Preview</span>
                            <div className='flex gap-1'>
                                <Badge href={`/th/blog/preview/${formValues.id}`} title="TH" variant="primary"/>
                                <Badge href={`/en/blog/preview/${formValues.id}`} title="EN" variant="primary"/>
                                <Badge href={`/ja/blog/preview/${formValues.id}`} title="JP" variant="primary"/>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <BlogForm form={form} onSubmit={handleSubmit} type="edit" />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page;