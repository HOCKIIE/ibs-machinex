"use client";
import React, { useRef, useEffect } from 'react';
import { useForm } from "react-hook-form";
// import { InputPassword } from './Inputs';
import CancelButton from '@/components/admin/Button/CancelBotton';
import CreateButton from '@/components/admin/Button/CreateButton';
import UpdateButton from '@/components/admin/Button/UpdateButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AdminContaxt';


const UserForm = ({
    itemState,
    setItemState: setData,
    handleSubmit,
    type
} : any) => {

    const { user } = useAuth();
    const password = useRef({});
    const router = useRouter();
    
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues: {
            role: itemState.role || "",
            title: itemState.title || "",
            name: itemState.name || "",
            phone: itemState.phone || "",
            email: itemState.email || "",
            password: "",
            password_confirmation: ""
        },
    });
    password.current = watch("password", "");

    const create = type === "create";
    const edit = type === "edit";


    const onCreate = async (data: any) => {
        handleSubmit(data);
    };
    const onEdit = async (formData: any) => {
        const modifiedData = { ...formData };
        if (!formData?.password) {
          delete modifiedData?.password;
        }
        delete modifiedData?.confirmPassword;
    
        handleSubmit(modifiedData);
    };

    const invalidClass = "border-rose-300 text-rose-600 border-rose-300 focus:border-rose-500 focus:ring-rose-500/40 dark:border-rose dark:border-rose-500";
    const validClass = "border-gray-300 text-gray-800 focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/70 dark:placeholder:text-white/20";
    const roleList = [{value:"super",title:"Super Administrator"},{value:"admin",title:"Administrator"},{value:"user",title:"User"}]

    // useEffect(() => {
    //     setTimeout(() => {
    //         const allow = role === "super" || role === "admin" || userId === id;
    //         !allow && router.push("/admin");
    //     }, 1000);
    // }, []);

    useEffect(() => {
        if (itemState.role) {
          reset({ 
            role: itemState.role,
            title: itemState.title,
            name: itemState.name,
            phone: itemState.phone,
            email: itemState.email,
        });
        }
    }, [itemState.role, itemState.title, itemState.name, itemState.phone, itemState.email, reset]);

    if(!user) return;

    return (
        <div>
            <form onSubmit={handleSubmitForm(type === "create" ? onCreate : onEdit)}>
                <div className="p-5 grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Role</label>
                            <select 
                                {...register("role", { required: true })}
                                onChange={setData}
                                defaultValue={itemState.role}
                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.role ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                            >
                                <option value="" hidden>Choose a role</option>
                                {roleList?.map(({value,title}, k: number) => (
                                    <option key={k} value={value}>{title}</option>
                                ))}
                                
                            </select>
                            {errors?.role?.type === "required" && (
                                <p className="text-xs text-rose-600 dark:text-rose-700 dark:text-rose-800">
                                    {create ? "This field is required." : "Recheck the field."}
                                </p>
                            )}

                        </div>
                    </div>
                    <div className="col-span-12">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                            <input 
                                {...register("title", { required: true })}
                                type="text" 
                                onChange={setData}
                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.title ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                placeholder="Title" />
                            {errors?.title?.type === "required" && (
                                <p className="text-xs text-rose-600 dark:text-rose-700">
                                    {create
                                    ? "This field is required."
                                    : "Recheck the field."}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-12">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Name</label>
                            <input 
                                {...register("name", { required: true })}
                                onChange={setData}
                                type="text" 
                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.name ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                placeholder="Name" />
                            {errors?.name?.type === "required" && (
                                <p className="text-xs text-rose-600 dark:text-rose-700">
                                    {create ? "This field is required." : "Recheck the field."}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-12">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
                            <input 
                                {...register("phone", { required: true })}
                                onChange={setData}
                                type="text" 
                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.phone ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                placeholder="Phone" />
                            {errors?.phone?.type === "required" && (
                                <p className="text-xs text-rose-600 dark:text-rose-700">
                                    {create ? "This field is required." : "Recheck the field."}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="col-span-12">
                        
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                            <input 
                                {...register("email", { required: true, maxLength: 100 })}
                                defaultValue={itemState?.email}
                                onChange={setData}
                                type="email" 
                                className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.email ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                placeholder="Email" />
                            {errors?.email?.type === "required" && (
                                <p className="text-xs text-rose-600 dark:text-rose-700">
                                    {create ? "This field is required." : "Recheck the field."}
                                </p>
                            )}
                        </div>
                    </div>
                    {user?.role == 'super' &&
                        <>
                            <div className="col-span-12">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
                                    <input 
                                        {...register("password", { required: create })}
                                        type="password" 
                                        className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.password ? `${invalidClass} `:`${validClass} `}focus:outline-none`}
                                        placeholder="Password" 
                                    />
                                    {errors.password?.type === "required" && 
                                        <p className="text-xs text-rose-600 dark:text-rose-700">{create ? "This field is required." : "Recheck the field."}</p>
                                    }
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="space-y-3">
                                    <label className="peer-invalid:text-rose-500 text-sm font-medium text-gray-700 dark:text-gray-400">Confrim Password</label>
                                    <input 
                                        {...register("password_confirmation", { 
                                            required: create,
                                            validate: (val: string) => {
                                                if (watch("password") != val) {
                                                return "Your passwords do no match";
                                                }
                                            },
                                        })}
                                        type="password"
                                        className={`dark:bg-dark-900 shadow-theme-xs ${errors.password_confirmation ? `focus:border-rose-500 border-reose-300 text-rose-600 border-rose-300 `:`focus:border-indigo-300 border-gray-300 text-gray-800 focus:ring-indigo-500/10 `}dark:focus:border-indigo-800 w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`} 
                                        placeholder="Confirm Password"
                                    />
                                    {errors.password_confirmation?.type === "validate" && (
                                    <p className="text-xs text-rose-600 dark:text-rose-700">
                                        Confirm Password doesn&apos;t match.
                                    </p>
                                    )}
                                    {errors.password_confirmation?.type === "required" && (
                                    <p className="text-xs text-rose-600 dark:text-rose-700">
                                        {create ? "This field is required." : "Recheck the field."}
                                    </p>
                                    )}
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex justify-end gap-3">
                        <CancelButton onClick={()=>router.push('/admin/user')}>Cancel</CancelButton>
                        {create && <CreateButton type="submit">Create</CreateButton>}
                        {edit && <UpdateButton>Update</UpdateButton>}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default UserForm;