"use client";
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useForm, useWatch, Path  } from 'react-hook-form';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import BrandForm from '@/components/admin/Form/BrandForm';
import useBrandStore from '@/store/useBrandStore';
import { BrandFormProps } from '@/types/BrandType';
import { deserialize } from '@/utils/slateHtmlConverter';
import { BackButton } from '@/components/admin/Button/BackButton';
import { isEqual } from '@/utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { useDraftState } from '@/store/useDraftState';
import { useAuth } from '@/contexts/AdminContext';
import debounce from 'debounce';

const prefix = '/admin/brand';

const Page = () => {

    let draftId = useMemo(() => uuidv4(), []);
    const pathname = usePathname()
    const params = useSearchParams();
    if (params.get("draftId")) {
        draftId = params.get("draftId") as string;
    }
    const router = useRouter();
    const { user } = useAuth();
    const { createData } = useBrandStore();
    const [ draftState, setDraftState ] = useState<Partial<BrandFormProps>>({});
    const didFetchDreaft = useRef<boolean>(false);
    const { 
        draft,
        saveDraft,
        deleteDraft,
    } = useDraftState<BrandFormProps>({ userId: user?.id ? String(user.id) : "", draftId: draftId, tableName: "brands" });

    const form = useForm<BrandFormProps>({
        mode: "onChange",
        criteriaMode: "all",
        defaultValues: {
            id: 0,
            draftId: "",
            image: null,
            current: null,
            banner: null,
            currentBanner: null,
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
            if(status && req.data ){
                deleteDraft()
                const path = decodeURIComponent(`${prefix}/${req.data.id}?redirect=${prefix}}`);
                router.push(path);
            }
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
    
    const debouncedSave = useRef(
        debounce((data: Partial<BrandFormProps>) => { saveDraft(data as BrandFormProps) }, 500)
    ).current;
    const debouncedSetState = useRef(
        debounce((changed: Partial<BrandFormProps>) => { setDraftState((prev) => ({ ...prev, ...changed })) }, 500)
    ).current;
    
    useEffect(() => {
        if(draft && !params.get("draftId")) {
            const newPath = pathname.replace(pathname,`${pathname}?draftId=${draftId}`);
            router.push(newPath)
        }
    },[draft, params.get("draftId")]);

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
            if (Object.keys(changed).length > 0) {
                prevRef.current = { ...prevRef.current, ...changed };
                debouncedSetState(changed);
            }
            return () => {
                debouncedSetState.clear();
                debouncedSave.clear();
            };
        });
    }, [watched]);

    useEffect(() => {
        if (Object.keys(draftState).length === 0) return;
        debouncedSave(draftState);
        return () => debouncedSave.clear();
    }, [draftState]);

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
                image: draft.image instanceof File || typeof draft.image === "string" ? draft.image : null,
                current: typeof draft.current === "string" ? draft.current : null,
                banner: draft.banner instanceof File || typeof draft.banner === "string" ? draft.banner : null,
                currentBanner: typeof draft.currentBanner === "string" ? draft.currentBanner : null,
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
                website: draft.website,
                apiName: draft.apiName,
                status: draft.status,
                category: draft.category,
                categories: draft.categories,
                published_at: draft.published_at,
            });
            didFetchDreaft.current = true;
        }, [draft]);

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
                <BrandForm form={form} onSubmit={handleSubmit} type="create" draftId={draftId} />
            </div>
        </div>
    </DefaultLayout>
    )
}

export default Page