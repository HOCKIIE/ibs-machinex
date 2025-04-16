"use client";

import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmModalProps } from '@/types/ConfirmModal';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const Spinner = () => <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent mr-2"></div>;
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};
const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.5
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: "easeOut",
        }
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        transition: {
            duration: 0.25,
            ease: "easeOut"
        }
    },
};
const ConfirmModal: React.FC<ConfirmModalProps> = ({isOpen, onAfterClose, action, toggleModal, data}) =>
{
    const { confirm, progress, response } = data ?? {};


    return (
        <AnimatePresence onExitComplete={onAfterClose}>
            {isOpen && (
            <motion.div className="modal relative z-10">
                <motion.div 
                    className="fixed inset-0 bg-gray-500/75 transition-opacity"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    
                ></motion.div>
                <motion.div 
                    className="fixed inset-0 z-10 w-screen overflow-y-auto"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full ${response.status?`bg-emerald-100`:`bg-red-100`} sm:mx-0 sm:size-10`}>
                                        {response.status && <IoIosCheckmarkCircleOutline fontSize={28} className="text-emerald-500"/>}
                                        {response.status == null  &&
                                            <svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                            </svg>
                                        }
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-base font-semibold text-gray-900" id="modal-title">Deactivate account</h3>
                                        <div className="mt-2">
                                            {response.message && <p className="text-red-700">{response.message}</p>}
                                            {response?.status == null && <p className="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 flex justify-end sm:px-6">
                                { action == "delete" && !response?.status &&
                                    <>
                                        <button onClick={toggleModal} type="button" disabled={progress?true:false} className="mt-3 min-w-20 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto focus:ring-4 focus:ring-gray-500/20">Cancel</button>
                                        <button type="button" disabled={progress?true:false} onClick={confirm} className="min-w-20 inline-flex w-full justify-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto focus:bg-red-500 focus:ring-4 focus:ring-red-500/30">
                                            {progress && <Spinner />} Delete
                                        </button>
                                    </>
                                }
                                {response?.status && <button onClick={toggleModal} className="min-w-20 inline-flex w-full justify-center rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 sm:ml-3 sm:w-auto focus:bg-emerald-500 focus:ring-4 focus:ring-emerald-500/30">OK</button>}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>)}
        </AnimatePresence>
    )
}

export default ConfirmModal