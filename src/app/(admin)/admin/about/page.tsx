import React from 'react';
import "../custom.scss";
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import OwnerForm from '@/components/admin/Form/OwnerForm';
import AboutForm from '@/components/admin/Form/AboutForm';

const About = () => 
{   
    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="control-button mb-3">
                    <div className="flex justify-between">
                        <div><Breadcrumb /></div>                    
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <AboutForm />
                    </div>
                </div>
                <div className="grid grid-cols-1 mt-6">
                    <div className="col-span-12">
                        <OwnerForm />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default About