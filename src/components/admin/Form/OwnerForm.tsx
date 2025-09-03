"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useForm  } from "react-hook-form";
import { OwnerType } from '@/types/OwnerType';
import { EditButton, CancelButton, SaveButton } from '@/components/main/button/Buttons';
import useOwnerStore from '@/store/useOwnerStore';


const OwnerForm = () => 
{
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isEditContact, setEditContact] = useState<boolean>(false);
    const [map, setMap] = useState<string|''>('');
    const [tab, setTab] = useState<string>('th')
    const didFetchOwner = useRef<boolean>(false);
    const [itemState, setContactData] = useState<OwnerType>({
        id: "",
        logo:"",
        title_th: "",
        title_en: "",
        title_ja: "",
        address_th: "",
        address_en: "",
        address_ja: "",
        phone: "",
        mobile: "",
        email: "",
        gmap: ""
    });
    
    const { item, fetchData, updateData } = useOwnerStore();
    const {
        register,
        reset,
        formState: { errors }
    } = useForm();
    const EditContact = () => setEditContact(!isEditContact);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
    {
        const { name, value } = event.target;
        let newValue = value;
        
        if(name == 'gmap'){
            const newEl = document.createElement('div');
            newEl.innerHTML = value;
            const src = newEl.querySelector('iframe')?.getAttribute("src");
            if(iframeRef.current){
                iframeRef.current.src = src || '';
                setMap(src || '')
            }
            newValue = src || '';
            event.target.value = newValue;
        }else{
            newValue = value
        }
        setContactData((prevState) => ({ ...prevState,[name]: newValue }));
    };

    const languageTab = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        const currentTab =  ev.currentTarget.dataset['tab'];
        setTab(currentTab ?? 'th')
    }
    const CalcelEdit = () => {
        reset({
            logo: item?.logo,
            title_th: item?.title_th,
            title_en: item?.title_en,
            title_ja: item?.title_ja,
            address_th: item?.address_th,
            address_en: item?.address_en,
            address_ja: item?.address_ja,
            phone: item?.phone,
            mobile: item?.mobile,
            email: item?.email,
            gmap: item?.gmap
        });
        EditContact()
    }
    const saveChange = async(data: OwnerType) => await updateData(data);

    useEffect(() => {
        if(didFetchOwner.current) return;
        didFetchOwner.current = true;
        fetchData();
    });
    useEffect(() => {
        if (item && item.title_th) {
            const data = {
                id: item.id,
                logo: item.logo,
                title_th: item.title_th,
                title_en: item.title_en,
                title_ja: item.title_ja,
                address_th: item.address_th,
                address_en: item.address_en,
                address_ja: item.address_ja,
                phone: item.phone,
                mobile: item.mobile,
                email: item.email,
                gmap: item.gmap,
            };          
            setContactData(data);
            reset(data); // ✅ sync form input กับค่าที่โหลดมา
        }
    }, [item, reset]);
    

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Owner Data</h3>
                </div>
                <div>
                    <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6 dark:border-gray-800">
                        <div className="flex gap-1">
                            <button type="button" className={`py-2 px-4 text-sm rounded-lg ${tab=="th"?'bg-indigo-100 text-indigo-600':'bg-gray-50'}`} onClick={languageTab} data-tab="th">Thai</button>
                            <button type="button" className={`py-2 px-4 text-sm rounded-lg ${tab=="en"?'bg-indigo-100 text-indigo-600':'bg-gray-50'}`} onClick={languageTab} data-tab="en">English</button>
                            <button type="button" className={`py-2 px-4 text-sm rounded-lg ${tab=="ja"?'bg-indigo-100 text-indigo-600':'bg-gray-50'}`} onClick={languageTab} data-tab="ja">Japanese</button>
                        </div>
                        <div className="grid grid-cols-12 gap-5">
                            <div className={`col-span-12 xl:col-span-6 space-y-3 language-field${tab=="th"?'':' hidden'}`} tab-toggle="th">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Company Name</label>
                                        <span className="px-1 bg-indigo-200 text-indigo-600 rounded-md text-xs flex items-center">TH</span>
                                    </div>
                                    <input 
                                        {...register('title_th',{required:true})}
                                        type="text" 
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500" 
                                        placeholder="Company Name"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={`col-span-12 xl:col-span-6 space-y-3 language-field${tab=="en"?'':' hidden'}`} tab-toggle="en">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Company Name</label>
                                        <span className="px-1 bg-indigo-200 text-indigo-600 rounded-md text-xs flex items-center">EN</span>
                                    </div>
                                    <input 
                                        {...register('title_en',{required:true})}
                                        type="text" 
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500" 
                                        placeholder="Company Name"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={`col-span-12 xl:col-span-6 space-y-3 language-field${tab=="ja"?'':' hidden'}`} tab-toggle="ja">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Company Name</label>
                                        <span className="px-1 bg-indigo-200 text-indigo-600 rounded-md text-xs flex items-center">JA</span>
                                    </div>
                                    <input 
                                        {...register('title_ja',{required:true})}
                                        type="text" 
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500" 
                                        placeholder="Company Name"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 xl:col-span-6 space-y-3">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                                    <input 
                                        {...register('email',{required:true})}
                                        type="text" 
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500" 
                                        placeholder="Email"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={`col-span-12 md:col-span-6 language-field${tab=="th"?'':' hidden'}`} toggle-tab="th">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
                                        <span className="px-1 bg-indigo-200 text-indigo-600 rounded-md text-xs flex items-center">TH</span>
                                    </div>
                                    <textarea 
                                        {...register('address_th',{required:true})}
                                        rows={5}
                                        placeholder="Enter a description..."
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 font-normal placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors?.address_th?.type === "required" && (
                                        <p className="text-xs text-rose-600 dark:text-rose-700">This field is required.</p>
                                    )}
                                </div>
                            </div>
                            <div className={`col-span-12 md:col-span-6 language-field${tab=="en"?'':' hidden'}`} toggle-tab="en">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
                                        <span className="px-1 bg-indigo-200 text-indigo-600 rounded-md text-xs flex items-center">EN</span>
                                    </div>
                                    <textarea 
                                        {...register('address_en',{required:true})}
                                        rows={5}
                                        placeholder="Enter a description..."
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 font-normal placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors?.address_th?.type === "required" && (
                                        <p className="text-xs text-rose-600 dark:text-rose-700">This field is required.</p>
                                    )}
                                </div>
                            </div>
                            <div className={`col-span-12 md:col-span-6 language-field${tab=="ja"?'':' hidden'}`} toggle-tab="ja">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
                                        <span className="px-1 bg-indigo-200 text-indigo-600 rounded-md text-xs flex items-center">JA</span>
                                    </div>
                                    <textarea 
                                        {...register('address_ja',{required:true})}
                                        rows={5}
                                        placeholder="Enter a description..."
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 font-normal placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors?.address_th?.type === "required" && (
                                        <p className="text-xs text-rose-600 dark:text-rose-700">This field is required.</p>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 space-y-3">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Telephone</label>
                                    <input 
                                        {...register('phone',{required:true})}
                                        type="text" 
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500" 
                                        placeholder="Telephone" 
                                        onChange={handleChange}
                                        disabled={!isEditContact}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Mobile</label>
                                    <input 
                                        {...register('mobile')}
                                        type="text"
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500" 
                                        placeholder="Telephone"
                                        onChange={handleChange}
                                        disabled={!isEditContact}
                                    />
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="text-black font-bold text-xl xl:text-[36px]">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Google Map</label>
                                        <textarea 
                                            {...register('gmap')}
                                            rows={5}
                                            placeholder="Enter a description..."
                                            className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 font-normal placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500"
                                            onChange={handleChange}
                                            disabled={!isEditContact}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <iframe 
                                            ref={iframeRef} 
                                            className="w-full mt-3 rounded-xl overflow-hidden bg-gray-50"
                                            src={itemState.gmap ? itemState.gmap : map}
                                            // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.0617695789147!2d100.55523204113399!3d13.714708698203433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29fd4c61f02af%3A0xe0d19e4fc5356b1e!2sSSP%20Tower%202!5e0!3m2!1sth!2sth!4v1742971953317!5m2!1sth!2sth" 
                                            height="280" 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="flex justify-center gap-3">
                                    {   !isEditContact 
                                        ? <EditButton setEdit={EditContact}/>
                                        : (<><CancelButton setEdit={CalcelEdit}/> <SaveButton saveChange={() => saveChange(itemState)} /></>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OwnerForm