"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm  } from "react-hook-form";
import { ContactType } from '@/types/ContactType';
import { EditButton, CancelButton, SaveButton } from '@/components/main/button/Buttons';
import { useContactStore } from '@/store/useContactStore';
import toast from "react-hot-toast";


const ContactForm = () => 
{
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isEditContact, setEditContact] = useState<boolean>(false);
    const [map, setMap] = useState<string|''>('');
    const [contactData, setContactData] = useState<ContactType>({
        title: "",
        address: "",
        phone: "",
        mobile: "",
        email: "",
        gmap: ""
    });
    
    const { contact, getData, updateData, response } = useContactStore();
    const {
        register,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: contactData.title,
            address: contactData.address,
            phone: contactData.phone,
            mobile: contactData.mobile,
            email: contactData.email,
            gmap: contactData.gmap
        }
    });
    const fetchData = useCallback(async () => {
        await getData();
    }, [getData]);
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
    const CalcelEdit = () => {
        reset({
            title: contact?.title,
            address: contact?.address,
            phone: contact?.phone,
            mobile: contact?.mobile,
            email: contact?.email,
            gmap: contact?.gmap
        });
        EditContact()
    }
    const saveChange = async(data: ContactType) => await updateData(data);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => {
        if (contact && contact.title) {
            const data = {
                title: contact.title,
                address: contact.address,
                phone: contact.phone,
                mobile: contact.mobile,
                email: contact.email,
                gmap: contact.gmap,
            };          
            setContactData(data);
            reset(data); // ✅ sync form input กับค่าที่โหลดมา
        }
    }, [contact, reset]);
    useEffect(()=>{
        if (response && response.status) {
            if(response.action == "update"){
                toast.success(response.message);
                setTimeout(()=> { setEditContact(false); },1000);
            } else {
                toast.error(response.message);
            }
        }
    }, [response])

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Contact Data</h3>
                </div>
                <div>
                    <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6 dark:border-gray-800">
                        <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 space-y-3">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Company Name</label>
                                    <input 
                                        {...register('title',{required:true})}
                                        type="text" 
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500" 
                                        placeholder="Company Name"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <div className="text-black font-bold text-xl xl:text-[36px]">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
                                    <textarea 
                                        {...register('address',{required:true})}
                                        rows={5}
                                        placeholder="Enter a description..."
                                        className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 font-normal placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500"
                                        disabled={!isEditContact}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors?.address?.type === "required" && (
                                        <p className="text-xs text-rose-600 dark:text-rose-700">This field is required.</p>
                                    )}
                                </div>
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
                                            src={contactData.gmap ? contactData.gmap : map}
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
                                        : (<><CancelButton setEdit={CalcelEdit}/> <SaveButton saveChange={() => saveChange(contactData)} /></>)
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

export default ContactForm