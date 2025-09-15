"use client";

import React from 'react';
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ConfirmModalProps } from '@/types/ConfirmModal';
import { BsExclamationTriangle } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline, IoMdClose } from "react-icons/io";

const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
}

const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.5
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: "easeOut", // use a string value compatible with Framer Motion
        }
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        transition: {
            duration: 0.25,
            ease: "easeOut" // use a string value compatible with Framer Motion
        }
    },
};
const Spinner = () => <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent mr-2"></div>;

const ActionModal: React.FC<ConfirmModalProps> = ({isOpen, onAfterClose, closeModal, action, data}) => 
{
    const { confirm, progress, response, successProgress } = data ?? {};
    let bgClass;
    switch (response.status) {
        case true: bgClass = 'bg-emerald-50 dark:bg-emerald-500/30'; break;
        case false: bgClass = 'bg-amber-50 dark:bg-amber-500/30'; break;
        default : bgClass = 'bg-red-50 dark:bg-red-500/30'; break;
    }
    const onSuccess = () => {
        if (response.status && successProgress) successProgress();
        closeModal()
    }
    return (
        <AnimatePresence onExitComplete={onAfterClose}>
            {isOpen && (
            <motion.div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999">
                <motion.div 
                    className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 dark:bg-gray-600/50 backdrop-blur-[10px]"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={fadeVariants} 
                ></motion.div>
                <motion.div
                    className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                >
                    <button 
                        type="button"
                        title="Close"
                        onClick={closeModal}
                        className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                    >
                        <IoMdClose fontSize={26} />
                    </button>

                    <div className="text-center">
                        <div className="relative flex items-center justify-center z-1 mb-7">
                            <motion.span 
                                initial="hidden"
                                animate="visible"
                                variants={fadeVariants} 
                                className={`${bgClass} w-20 h-20 rounded-full flex items-center justify-center`}>
                                {response.status && <IoIosCheckmarkCircleOutline fontSize={42} className="text-emerald-600"/>}
                                {response.status == null  && <IoMdClose fontSize={42} className="text-red-600"/>}
                                { !response?.status && response?.status != null && <BsExclamationTriangle fontSize={42} className="text-yellow-600"/>}
                            </motion.span>
                        </div>
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">Warning Alert!</h4>
                        <motion.p 
                            className="text-md leading-6 text-gray-500 dark:text-gray-400"
                            initial="hidden"
                            animate="visible"
                            variants={fadeVariants} 
                        >
                            {   response.message 
                                ? response.message
                                : `Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.`
                            }
                        </motion.p>
                        <div className="flex items-center justify-center w-full gap-3 mt-7">
                            { action == "delete" && !response?.status && response?.status == null &&
                                <button 
                                    title="Okay"
                                    type="button" 
                                    onClick={confirm}
                                    disabled={progress?true:false} 
                                    className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-red-500 dark:bg-red-700 shadow-theme-xs hover:bg-red-600 dark:hover:bg-red-600 sm:w-auto"
                                >
                                {progress && <Spinner />} Okay, Got It
                                </button>
                            }
                            { response?.status && 
                                <motion.button 
                                    title="Okay"
                                    type="button" 
                                    onClick={onSuccess}
                                    className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-emerald-500 shadow-theme-xs hover:bg-emerald-600 sm:w-auto"
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeVariants} 
                                >
                                    Okay, Got It
                                </motion.button>
                            }
                            { !response?.status && response?.status != null &&
                                <motion.button 
                                    title="Okay"
                                    type="button" 
                                    onClick={closeModal}
                                    className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-yellow-500 shadow-theme-xs hover:bg-yellow-600 sm:w-auto"
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeVariants} 
                                >
                                    Close
                                </motion.button>
                            }
                        </div>
                    </div>
                </motion.div>
            </motion.div>)}
        </AnimatePresence>
    )
}

export default ActionModal;