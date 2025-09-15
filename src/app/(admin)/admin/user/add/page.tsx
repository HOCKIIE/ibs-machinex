"use client";
import React, { useState } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import UserForm from '@/components/admin/Form/UserForm';
import { UsersFormProps } from '@/types/UserType';
import useUserStore from '@/store/useUserStore';

const FormAdd = () => {
    const { createUser } = useUserStore();
    const [userState, setUserState] = useState<UsersFormProps>({
        id: "",
        role: "",
        title: "",
        contact_sale: "",
        name: "",
        phone: "",
        email: "",
        status: ""
    });

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        if (
            name === "image" &&
            event.target instanceof HTMLInputElement &&
            (event.target as HTMLInputElement).files &&
            (event.target as HTMLInputElement).files![0]
        ) {
            setUserState((prevState) => ({
                ...prevState,
                image: (event.target as HTMLInputElement).files![0],
            }));
        } else {
            setUserState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    const handleSubmit = async (data: UsersFormProps) => await createUser(data);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>
                    </div>
                </div>
        
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] md:w-2/3 xl:w-1/2">
                    <div className="px-5 py-4 sm:px-6 sm:py-5">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add User</h3>
                    </div>
                    <hr />
                    <UserForm 
                        itemState={userState}
                        setItemState={handleChange}
                        handleSubmit={handleSubmit}
                        type="create"
                    />
                </div>

            </div>
        </DefaultLayout>
    )
}

export default FormAdd