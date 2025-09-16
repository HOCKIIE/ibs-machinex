"use client";

import React, { useState, useEffect, use, useRef  } from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import UserForm from '@/components/admin/Form/UserForm';
import { UsersFormProps } from '@/types/UserType';
import useUserStore from '@/store/useUserStore';

const EditUser = ({ params }: { params:  Promise<{ id: string }> }) => 
    {
    const {id} = use(params);
    const didFetchData = useRef(false);
    const { fetchUserById, updateUser, users } = useUserStore();
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
    
    const handleChange = (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
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
    const handleSubmit = async (data: UsersFormProps) => await updateUser(id, data);
    const fetchData = async () => await fetchUserById(id);

    useEffect(()=>{
        if (didFetchData.current) return;
        didFetchData.current = true;
        fetchData();
    });

    useEffect(() => {
        if (users?.length > 0) {
            setUserState({
                id: String(users[0]?.id),
                title: users[0]?.title,
                contact_sale: users[0]?.contact_sale,
                role: users[0]?.role,
                name: users[0]?.name,
                phone: users[0]?.phone,
                email: users[0]?.email,
                status: users[0]?.status,
            });
        }
    }, [users]);
    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb current={userState.name}/></div>
                    </div>
                </div>
        
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] md:w-2/3 xl:w-1/2">
                    <div className="px-5 py-4 sm:px-6 sm:py-5">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Edit User</h3>
                    </div>
                    <hr />
                    <UserForm 
                        itemState={userState}
                        setItemState={handleChange}
                        handleSubmit={handleSubmit}
                        type="edit"
                    />
                </div>

            </div>
        </DefaultLayout>
    )
}

export default EditUser