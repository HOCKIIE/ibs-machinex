"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BlogForm from '@/components/admin/Form/BlogForm';
import { BlogFormProps } from '@/types/BlogType';
import useBlogStore from '@/store/useBlogStore';
import { useDraftState } from '@/store/useDraftState';
import { useAuth } from '@/contexts/AdminContext';
import { v4 as uuidv4 } from 'uuid';
import { useForm, useWatch,Path } from 'react-hook-form';
import { setStateChanged, isEqual } from '@/utils/utils';
import { deserialize } from '@/utils/slateHtmlConverter';
import { BackButton } from '@/components/admin/Button/BackButton';
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
    const [ draftState, setDraftState ] = useState<Partial<BlogFormProps>>({});
    const didFetchDreaft = useRef<boolean>(false);
    const { 
        draft,
        saveDraft,
        deleteDraft,
    } = useDraftState<BlogFormProps>({ userId: user?.id ? String(user.id) : "", draftId: draftId, tableName: "blogs" });

    const form = useForm<BlogFormProps>({
        mode: "onChange",
        criteriaMode: "all",
        defaultValues: {
            id: 0,
            draftId: "",
            userId: "",
            image_th: null,
            image_en: null,
            image_ja: null,
            title_th:  "",
            title_en: "",
            title_ja: "",
            description_th: "",
            description_en: "",
            description_ja: "",
            detail_th: "",
            detail_en: "",
            detail_ja: "",
            descendant_th: [],
            descendant_en: [],
            descendant_ja: [],
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
    const { setError } = form;

    const handleSubmit = async (data: BlogFormProps) => {
        try{
            const req = await createData(data);
            const {status, statusCode, message, errors } = req;
            if(status && req.data ){
                deleteDraft()
                const path = decodeURIComponent(`/admin/blog/${req.data.id}?redirect=/admin/blog`);
                router.push(path);
            }
            if (!status && errors) {
                Object.entries(errors).forEach(([field, message]) => {
                    const msg = Array.isArray(message) ? message[0] : message;
                    setError(field as Path<BlogFormProps>, { type: "server", message: msg});
                });
            }
        } catch (err) {
            console.error("🛑 Oops : ", err);
        }
    }
    useEffect(() => {
        if(!draft) return;
        if(didFetchDreaft.current) return;
        let descendant_th:string[] = [];
        let descendant_en:string[] = [];
        let descendant_ja:string[] = [];
        if(draft.detail_th !== "" && draft.descendant_th === null) {
            descendant_th = deserialize(draft.detail_th);
        } 
        if(draft.descendant_th) descendant_th = draft.descendant_th;
        if(draft.detail_en !== "" && draft.descendant_en === null) {
            descendant_en = deserialize(draft.detail_en);
        } 
        if(draft.descendant_en) descendant_en = draft.descendant_en;
        if(draft.detail_ja !== "" && draft.descendant_ja === null) {
            descendant_ja = deserialize(draft.detail_ja);
        }
        if(draft.descendant_ja) descendant_ja = draft.descendant_ja;
        form.reset({
            id: draft.id,
            draftId: draftId,
            userId: user?.id ? String(user.id) : "",
            image_th: draft.image_th instanceof File || typeof draft.image_th === "string" ? draft.image_th : null,
            image_en: draft.image_en instanceof File || typeof draft.image_en === "string" ? draft.image_en : null,
            image_ja: draft.image_ja instanceof File || typeof draft.image_ja === "string" ? draft.image_ja : null,
            title_th: draft.title_th,
            title_en: draft.title_en,
            title_ja: draft.title_ja,
            description_th: draft.description_th,
            description_en: draft.description_en,
            description_ja: draft.description_ja,
            detail_th: draft.detail_th,
            detail_en: draft.detail_en,
            detail_ja: draft.detail_ja,
            descendant_th: descendant_th,
            descendant_en: descendant_en,
            descendant_ja: descendant_ja,
            status: draft.status,
            pathName: draft.pathName,
            recommend: draft.recommend,
            category: draft.category,
            categories: draft.categories,
            published_at: draft.published_at,
        });
        didFetchDreaft.current = true;
    }, [draft]);

    useEffect(() => {
        if(draft && !params.get("draftId")) {
            const newPath = pathname.replace(pathname,`${pathname}?draftId=${draftId}`);
            router.push(newPath)
        }
    },[draft, params.get("draftId")])

    const watched = useWatch({ control: form.control });
    const prevRef = useRef<Partial<BlogFormProps>>({}); 
    const debouncedSave = useRef(
        debounce((data: Partial<BlogFormProps>) => { saveDraft(data as BlogFormProps) }, 500)
    ).current;
    const debouncedSetState = useRef(
        debounce((changed: Partial<BlogFormProps>) => { setDraftState((prev) => ({ ...prev, ...changed })) }, 500)
    ).current;

    useEffect(() => {
        const changed: Partial<BlogFormProps> = {};
        (Object.keys(watched) as (keyof BlogFormProps)[]).forEach((key) => {
            let current = watched[key];
            const prev = prevRef.current[key];
            if (key === "image_th" || key === "image_en" || key === "image_ja") {
                if (current instanceof FileList) {
                    current = current[0] ?? null;
                }
            }
            if (!isEqual(current, prev)) {
                setStateChanged(changed, key, current as BlogFormProps[typeof key]);
            }
            if (Object.keys(changed).length > 0) {
                prevRef.current = { ...prevRef.current, ...changed };
                debouncedSetState(changed);
            }
        });
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
                    <div className="flex p-4">
                        <BackButton />
                        {/* <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new blog</h3> */}
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