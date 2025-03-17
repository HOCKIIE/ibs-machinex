"use client";

import React from 'react'
import { useEffect,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CancelButton from '../Button/CancelBotton';
// import Image from 'next/image';
import GalleryDropzone from '../Dropzon/GalleryDropzone';
import ProfileImageUpload from "../Dropzon/ProfileImageUpload";
import { ProductProps } from '@/types/ProductProps';


  
interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: ProductProps) => void;
    initialData?: ProductProps | null;
    title: string
}

const ProductModal = ({isOpen, onClose, onSave, initialData, title }:ProductModalProps) =>
{


    const [product, setProduct] = useState<ProductProps>();

    useEffect(() => {
        if (initialData) {
            setProduct(initialData);
        } 
    }, [initialData, isOpen]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product);
        onClose();
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <>
            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg min-w-[50vw] max-w-xl relative">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        ✕
                        </button>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="grid cols cols-1 gap-6 xl:grid-cols-2">
                                <div className="space-y-6">
                                    <div>
                                        <h4>Profile Image</h4>
                                        <div className='mt-3 border-2 border-dashed border-gray-500 dark:border-gray-700 p-6 rounded-lg'>
                                            <div className="flex justify-center items-center">
                                                <ProfileImageUpload currentImage={product.thumbnail} onImageChange={(image) => setProduct({ ...product, thumbnail: image ? URL.createObjectURL(image) : "" })}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4>Gallery</h4>
                                        <GalleryDropzone/>
                                    </div>
                                    
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="title">Product Name</label>
                                        <input
                                            id="title"
                                            type="text"
                                            name="title"
                                            placeholder="Product Name"
                                            defaultValue={product.title}
                                            onChange={handleChange}
                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                                            required
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="brand">Brand</label>
                                        <input
                                            id="brand"
                                            type="text"
                                            name="Brand"
                                            placeholder="Brand"
                                            defaultValue={product.brand}
                                            onChange={handleChange}
                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="category">Category</label>
                                        <input
                                            id="category"
                                            type="text"
                                            name="Category"
                                            placeholder="Product Name"
                                            defaultValue={product.category}
                                            onChange={handleChange}
                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="price">Price</label>
                                        <input
                                            id="price"
                                            type="number"
                                            name="price"
                                            placeholder="Price"
                                            defaultValue={product.price}
                                            onChange={handleChange}
                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="Description">Description</label>
                                        <textarea
                                            id="Description"
                                            name="Description"
                                            placeholder="Description"
                                            defaultValue={product.description}
                                            rows={7}
                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="Description">Detail</label>
                                        <textarea
                                            id="Description"
                                            name="Description"
                                            placeholder="Description"
                                            defaultValue={product.detail}
                                            rows={7}
                                            className="dark:bg-dark-900 shadow-theme-xs focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex gap-2 justify-center">
                                    <CancelButton title="Cancel" onClose={onClose}/>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md">
                                    {initialData ? "Update Product" : "Create Product"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
            </>
        )}
        </AnimatePresence>
    )
}

export default ProductModal;