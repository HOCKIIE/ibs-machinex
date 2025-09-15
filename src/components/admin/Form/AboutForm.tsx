"use client";
import { inter } from "@/fonts/fonts";
import React, { useState, useRef, useEffect } from 'react';
import sanitizeHtml from "sanitize-html";
import { EditButton, CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { useForm, Controller } from "react-hook-form";
import { AboutType } from "@/types/AboutType";
import useAboutStore from "@/store/useAboutStore";
import { DefaultTab } from "../Tabs/Tabs";

const AboutForm = () => {

    const [isEditAbout, setEditAbout] = useState<boolean>(false);
    const [setfont, setFontState] = useState<boolean>(true);
    const [active, SetActive] = useState<string>('th');
    const didFetchData = useRef(false);

    const EditAbout = () => setEditAbout(!isEditAbout);
    const toggle = () => setFontState(!setfont);

    const [aboutData, setAboutData] = useState<AboutType>({
        id:"",
        detail_th: "",
        detail_en: "",
        detail_ja: ""
    });
    const { about, getData, updateData } = useAboutStore();
    const {
        handleSubmit: handleSubmitForm,
        reset,
        control
    } = useForm({
        defaultValues: {
            id: aboutData.id,
            detail_th: sanitizeHtml(aboutData.detail_th),
            detail_en: sanitizeHtml(aboutData.detail_en),
            detail_ja: sanitizeHtml(aboutData.detail_ja)
        },
    });


    const tabToggle = async (language: string): Promise<void> => {
        SetActive(language);
    }

    const CalcelEdit = () => {
        reset({
            detail_th: about?.detail_th,
            detail_en: about?.detail_en,
            detail_ja: about?.detail_ja
        });
        EditAbout()
    }
    const handleSubmit = async (formData: AboutType) => {
        const modifiedData = { ...formData };
        await updateData(modifiedData);
    }

    useEffect(()=>{ 
        if(didFetchData.current) return;
        didFetchData.current = true;
        getData();
    },[getData]);
    
    useEffect(() => {
        if (about) {
            const data = {
                id: about.detail_en,
                detail_th: about.detail_th,
                detail_en: about.detail_en,
                detail_ja: about.detail_ja,
            };          
            setAboutData(data);
            reset(data); // ✅ sync form input กับค่าที่โหลดมา
        }
    }, [about, reset]);
    
    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">About Data</h3>
                </div>
                <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6 dark:border-gray-800">
                    <div className="flex items-center gap-3 my-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 px-3">Detail :</label>
                        <button
                            type="button" 
                            onClick={toggle}
                            className={`px-2 focus:ring-2 ${setfont?`border-indigo-300 bg-indigo-200 border text-indigo-500 focus:ring-gray-500/20`:`bg-gray-200 border border-gray-300 text-gray-500 focus:ring-indigo-500/20`} rounded-lg text-[12px]`} 
                            defaultValue="inter">Inter Font
                        </button>
                    </div>
                    <form onSubmit={handleSubmitForm(handleSubmit)}>
                        <div className="border border-gray-100 rounded-lg focus:ring-1 focus:ring-indigo-300 focus:outline-none">
                            <DefaultTab active={active} toggle={tabToggle}/>
                            
                            <div className="tabs">
                                <div className={`tab-item${active=='th'?` active`:``}`} data-tab="th">
                                    <Controller
                                        name="detail_th"
                                        control={control}
                                        defaultValue={aboutData.detail_th}
                                        render={({ field }) => (
                                            <div
                                                contentEditable={isEditAbout}
                                                suppressContentEditableWarning={true}
                                                dangerouslySetInnerHTML={{ __html: field.value }}
                                                onBlur={(e) => field.onChange(e.currentTarget.innerHTML)}
                                                className={`p-3 min-h-[300px] ${setfont && inter.className}`}
                                            ></div> 
                                        )} 
                                    />
                                </div>
                                <div className={`tab-item${active=='en'?` active`:``}`} data-tab="en">
                                    <Controller
                                        name="detail_en"
                                        control={control}
                                        defaultValue={aboutData.detail_en}
                                        render={({ field }) => (
                                            <div 
                                                contentEditable={isEditAbout}
                                                suppressContentEditableWarning={true}
                                                dangerouslySetInnerHTML={{ __html: field.value }}
                                                onBlur={(e) => field.onChange(e.currentTarget.innerHTML)}
                                                className={`p-3 min-h-[300px] ${setfont && inter.className}`}
                                            ></div> 
                                        )}
                                    />
                                </div>
                                <div className={`tab-item${active=='ja'?` active`:``}`} data-tab="ja">
                                    <Controller
                                        name="detail_ja"
                                        control={control}
                                        defaultValue={aboutData.detail_th}
                                        render={({ field }) => (
                                            <div 
                                                contentEditable={isEditAbout}
                                                suppressContentEditableWarning={true}
                                                dangerouslySetInnerHTML={{ __html: field.value }}
                                                onBlur={(e) => field.onChange(e.currentTarget.innerHTML)}
                                                className={`p-3 min-h-[300px] ${setfont && inter.className}`}
                                            ></div>
                                        )}
                                    />
                                </div>
                            </div>
                            
                        </div>
                        <div className="flex justify-center gap-3 p-5">
                            {!isEditAbout && <EditButton setEdit={EditAbout} />}
                            {isEditAbout && <><CancelButton setEdit={CalcelEdit} /><SaveButton type="submit" /></>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AboutForm