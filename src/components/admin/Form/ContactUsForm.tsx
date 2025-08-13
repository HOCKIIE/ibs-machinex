"use client";
import React, { useState, useRef } from 'react';
import useContactUsStore from '@/store/useContactUsStore';
import { useForm  } from "react-hook-form";
import { ErrorMessage } from './Validation';
import { useTranslations } from 'next-intl';

const ContactUsForm = () => {
    const t = useTranslations('ContactUsForm');
    const vt = useTranslations('Validation');
    const { createData } = useContactUsStore();
    const [status, setStatus] = useState(false);
    const [message, setMessage] = useState<string>('');
    const didSubmit = useRef(false);
    const [contactData, setContactData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    });
    const {
        register,
        reset,
        handleSubmit: handleSubmitForm,
        formState: { errors }
    } = useForm({
        defaultValues: {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            message: contactData.message,
        }
    });

    const invalidClass = "border-rose-300 text-rose-600 border-rose-300 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose dark:border-rose-500";
    const validClass = "border-gray-300 text-gray-800 focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/70 dark:placeholder:text-white/20";

    const onSubmit = async (data: any) => {
        const res = await createData(data);
        setStatus(res.status);
        if(res.status === true){
            if (didSubmit.current) return;
            didSubmit.current = true;
            setMessage(t('successMessage'));
            reset();
        }else{
            setMessage(t('errorMessage'));
        }
    };


    return (
    <>
        <form onSubmit={handleSubmitForm(onSubmit)}>
            <div className="grid gap-7">
                {didSubmit.current 
                    && status === true
                    && <div className="col-span-12"><div className={`${status === true ? `bg-green-100 text-green-800`:`bg-red-100 text-red-800`} p-4 rounded-md`}>
                        {status == true ? `Success!, `: `Failed!, `}{message}
                    </div></div>
                }
                <div className="col-span-12 xl:col-span-6">
                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('firstName')}</label>
                        <input 
                            {...register('firstName',{required:true})}
                            type="text" 
                            id="first_name" 
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.firstName ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
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
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.lastName ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
                            placeholder={t('lastName')}
                        />
                        {errors?.lastName?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                <div className="col-span-12">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('email')}</label>
                        <input 
                            {...register('email',{required:true})}
                            type="text" 
                            id="email" 
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.email ? `${invalidClass} `:`${validClass} `}focus:outline-none`} 
                            placeholder={t('email')}
                        />
                        {errors?.email?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                <div className="col-span-12">
                    <div>
                        <label htmlFor="message" className="block mb-2 text-sm text-gray-900 dark:text-white">{t('message')}</label>
                        <textarea
                            {...register('message',{required:true})}
                            rows={8}
                            id="message" 
                            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.message ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            placeholder={t('message')}
                        ></textarea>
                        {errors?.message?.type === "required" && (
                            <ErrorMessage>{vt('required')}</ErrorMessage>
                        )} 
                    </div>
                </div>
                <div className="col-span-12">
                    <button type="submit" className="bg-red-700 text-white block p-3 rounded-md w-full" title="Submit">{t('submit')}</button>
                </div>
            </div>
        </form>
    </>
    )
}

export default ContactUsForm