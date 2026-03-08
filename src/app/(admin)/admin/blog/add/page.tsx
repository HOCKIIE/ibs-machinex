"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BlogForm from '@/components/admin/Form/BlogForm';
import { BlogFormProps } from '@/types/BlogType';
import useBlogStore from '@/store/useBlogStore';
import { useRouter } from 'next/navigation';
import { useBlogDraftState } from '@/store/useBlogDraftState';
import { useAuth } from '@/contexts/AdminContext';
import { v4 as uuidv4 } from 'uuid';
import { usePathname, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { setBlogChanged, isEqual } from '@/utils/utils';
import debounce from 'debounce';

export default function Page(){

    let draftId = useMemo(() => uuidv4(), []);
    const pathname = usePathname()
    const params = useSearchParams();
    if (params.get("draftId")) {
        draftId = params.get("draftId") as string;
    }
    const router = useRouter();
    const { user } = useAuth();
    const { createData } = useBlogStore();
    const [draftState, setDraftState] = useState<Partial<BlogFormProps>>({});

    // Provide a default value for draft to avoid 'never' type
    const { 
        draft,
        saveDraft,
        deleteDraft,
    } = useBlogDraftState({ userId: user?.id ? String(user.id) : "", draftId: draftId });
    
    const handleSubmit = async (data: BlogFormProps) => {
        const req = await createData(data);
        if(req.status === true && req.data){
            deleteDraft()
            const path = decodeURIComponent(`/admin/blog/${req.data.id}?redirect=/admin/blog`);
            router.push(path);
        }
    }

    const form = useForm<BlogFormProps>({
        mode: "onChange",
        criteriaMode: "all",
        defaultValues: {
            id: 0,
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
    useEffect(() => {
        if (!draft) return;
        form.reset({
            id: draft.id,
            draftId: draftId,
            userId: user?.id ? String(user.id) : "",
            image: draft.image instanceof File || typeof draft.image === "string" ? draft.image : null,
            title_th: draft.title_th,
            title_en: draft.title_en,
            title_ja: draft.title_ja,
            description_th: draft.description_th,
            description_en: draft.description_en,
            description_ja: draft.description_ja,
            detail_th: draft.detail_th,
            detail_en: draft.detail_en,
            detail_ja: draft.detail_ja,
            status: draft.status,
            pathName: draft.pathName,
            recommend: draft.recommend,
            category: draft.category,
            categories: draft.categories,
            published_at: draft.published_at,
        }) 
    }, [draft]);

    useEffect(()=>{
        if(draft && !params.get("draftId")) {
            const newPath = pathname.replace(pathname,`${pathname}?draftId=${draftId}`);
            router.push(newPath)
        }
    },[draft, params.get("draftId")])

    const watched = useWatch({ control: form.control });
    const prevRef = useRef<Partial<BlogFormProps>>({}); 
    const debouncedSave = useRef(
        debounce((data: Partial<BlogFormProps>) => { saveDraft(data) }, 500)
    ).current;
    const debouncedSetState = useRef(
        debounce((changed: Partial<BlogFormProps>) => { setDraftState((prev) => ({ ...prev, ...changed })) }, 500)
    ).current;

    useEffect(() => {
        const changed: Partial<BlogFormProps> = {};
        (Object.keys(watched) as (keyof BlogFormProps)[]).forEach((key) => {
            let current = watched[key];
            const prev = prevRef.current[key];
            if (key === "image") {
                if (current instanceof FileList) {
                    current = current[0] ?? null;
                }
            }
            if (!isEqual(current, prev)) {
                setBlogChanged(changed, key, current);
            }
        });
        if (Object.keys(changed).length > 0) {
            prevRef.current = { ...prevRef.current, ...changed };
            debouncedSetState(changed);
        }
        return () => {
            debouncedSetState.clear();
            debouncedSave.clear();
        };
    }, [watched]);


    useEffect(() => {
        if (Object.keys(draftState).length === 0) return;
        debouncedSave(draftState);
        return () => debouncedSave.clear();
    }, [draftState]);

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
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new blog</h3>
                    </div>
                    <hr />
                    <BlogForm 
                        form={form}
                        onSubmit={handleSubmit}
                        type="create"
                        draftId={draftId}
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}