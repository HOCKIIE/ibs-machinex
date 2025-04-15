import React from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';

const Contact = () => {
  return (
    <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb /></div>                    
                </div>
            </div>
            <div>Contact</div>
        </div>
    </DefaultLayout>
  )
}

export default Contact