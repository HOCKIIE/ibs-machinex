import React from 'react';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';

const Blog = () => {
    interface Blog {
        id: number;
        name: string;
        description: string;
        image: string;
        color: string;
        category: string;
        price: string;
    }

    const blogs: Blog[] = [];
    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"> */}
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                Our blogs
                                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                            </caption>
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">No.</th>
                                    <th scope="col" className="px-6 py-3">
                                        Blog name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Color
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.length > 0 && blogs.map((item, index) => (
                                    <tr key={index} className="bg-white dark:bg-gray-800">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <img className="w-10 h-10 rounded-full" src={item.image} alt={item.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{item.color}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{item.category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{item.price}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {blogs.length == 0 && 
                                    <tr>
                                        <td className="px-6 py-3 text-center" colSpan={5}>No item</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    {/* </div> */}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Blog