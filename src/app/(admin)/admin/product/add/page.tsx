import DefaultLayout from "@/components/admin/layout/DefaultLayout";
import Breadcrumb from "@/components/admin/Breadcrumb/Breadcrumb";

export default function Page(){
    return <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb /></div>
                </div>
            </div>
    
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Add a new product</h3>
                </div>
                <hr />
            </div>
        </div>
    </DefaultLayout>
}