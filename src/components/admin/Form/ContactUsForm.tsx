"use client";
import React, { useRef,useState } from 'react';
import useContactUsStore from '@/store/useContactUsStore';
import { ContactUsType } from '@/types/ContactUsType';
import { useForm  } from "react-hook-form";
import { ErrorMessage } from './Validation';
import { useTranslations } from 'next-intl';

const ContactUsForm = ({
    source
}:{
    source:string;
}) => {
    const [response, setResponse] = useState<{status:boolean|null; message:string|null}>({ status: null, message: null });
    const t = useTranslations('ContactUsForm');
    const vt = useTranslations('Validation');
    const { createData } = useContactUsStore();
    const didSubmit = useRef(false);
    const {
        register,
        reset,
        handleSubmit: handleSubmitForm,
        formState: { errors }
    } = useForm<ContactUsType>();

    const invalidClass = "border-rose-300 text-rose-600 border-rose-300 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose dark:border-rose-500";
    const validClass = "border-gray-300 text-gray-800 focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/70 dark:placeholder:text-white/20";

    const onSubmit = async (data: ContactUsType) => {
        const res = await createData(data);
        if(res){
            setResponse({ status: res.status ?? null, message: res.message ?? null });
        }
        if(res?.status === true){
            if (didSubmit.current) return;
            didSubmit.current = true;
            reset();
        }
    };


    return (
    <>
        <form onSubmit={handleSubmitForm(onSubmit)}>
            <div className="grid gap-x-7 gap-y-3">
                <input type="hidden" {...register('source')} defaultValue={source}/>
                
                <div className="col-span-12 xl:col-span-6">
                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('firstName')}</label>
                        <input 
                            {...register('firstName',{required:true})}
                            type="text" 
                            id="first_name" 
                            className={`bg-white dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.firstName ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
                            placeholder={t('firstName')}
                        />
                        {errors?.firstName?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-6">
                    <div>
                        <label htmlFor="last_name" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('lastName')}</label>
                        <input 
                            {...register('lastName',{required:true})}
                            type="text" 
                            id="last_name" 
                            className={`bg-white dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.lastName ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
                            placeholder={t('lastName')}
                        />
                        {errors?.lastName?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('email')}</label>
                        <input 
                            {...register('email',{required:true})}
                            type="text" 
                            id="email" 
                            className={`bg-white dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.email ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
                            placeholder={t('email')}
                        />
                        {errors?.email?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-6">
                    <div>
                        <label htmlFor="telephone" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('telephone')}</label>
                        <input 
                            {...register('telephone',{required:true})}
                            type="text" 
                            id="telephone"
                            className={`bg-white dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.telephone ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
                            placeholder={t('telephone')}
                        />
                        {errors?.telephone?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                <div className="col-span-12">
                    <label htmlFor="company" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('company')}</label>
                    <input 
                        {...register('company',{required:true})}
                        type="text" 
                        id="company"
                        className={`bg-white dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.company ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
                        placeholder={t('company')}
                    />
                    {errors?.company?.type === "required" && (
                        <ErrorMessage>{vt('required')}</ErrorMessage>
                    )} 
                </div>
                <div className="col-span-12">
                    <div>
                        <label htmlFor="message" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('message')}</label>
                        <textarea
                            {...register('message',{required:true})}
                            rows={8}
                            id="message" 
                            className={`bg-white dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.message ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder={t('placeholder.message')}
                        ></textarea>
                        {errors?.message?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                {response?.status && (
                    <div className="col-span-12">
                        <p className={`text-sm p-4 rounded-lg border ${response.status ? 'bg-green-200 text-green-800 border-green-300' : 'bg-red-200 text-red-700 border-red-300'}`}>{response.status ? t('successMessage'): t('errorMessage')}</p>
                    </div>
                )}
                <div className="col-span-12">
                    <button type="submit" className="bg-red-700 text-white block p-3 rounded-md w-full" title="Submit">{t('submit')}</button>
                </div>
            </div>
        </form>
    </>
    )
}

export default ContactUsForm