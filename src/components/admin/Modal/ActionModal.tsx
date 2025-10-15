"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
    const { confirm, progress, successProgress, response } = data ?? {};
    const [message, setMessage] = useState<string>('Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.');
    const [title, setTitle] = useState<string>('Warning Alert!');
    const [spinner, setSpinner] = useState<boolean>(false);
    const [btnTitle, setBtnTitle] = useState<string>('Okay, Got It');
    const ErrorIcon = () => <IoMdClose fontSize={42} className="text-red-600"/>;
    const DefaultIcon = () => <BsExclamationTriangle fontSize={42} className="text-yellow-600"/>;
    const SuccessIcon = () => <IoIosCheckmarkCircleOutline fontSize={42} className="text-emerald-600"/>;
    const [icon, setIcon] = useState<JSX.Element | null>(<DefaultIcon/>);
    const successClass = 'bg-emerald-50 dark:bg-emerald-500/30';
    const errorClass = 'bg-amber-50 dark:bg-amber-500/30';
    const defaultClass = 'bg-red-50 dark:bg-red-500/30';
    const [className, setClassName] = useState<string>(defaultClass);
    const btnDanger = `bg-red-500 dark:bg-red-700 shadow-theme-xs hover:bg-red-600 dark:hover:bg-red-600`;
    const btnWarning = 'bg-yellow-500 dark:bg-yellow-700 shadow-theme-xs hover:bg-yellow-600 dark:hover:bg-yellow-600';
    const btnSuccess = 'bg-emerald-500 dark:bg-emerald-700 shadow-theme-xs hover:bg-emerald-600 dark:hover:bg-emerald-600';
    const [btnClassName, setBtnClassName] = useState<string>(btnWarning);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

    const closeModalHandler = useCallback(() => {
        setMessage('Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.');
        setBtnTitle('Okay, Got It');
        setBtnClassName(btnWarning);
        setClassName(errorClass);
        setIcon(DefaultIcon);
        setTitle('Warning Alert!');
        setSpinner(false);
        closeModal();
    },[]);
    const ProcessingHandler = async () => {
        setMessage('Processing your request. Please wait...');
        setBtnTitle('Processing...');
        setBtnClassName(btnDanger);
        setClassName(defaultClass);
        setIcon(DefaultIcon);
        setSpinner(true);
        if(confirm) await confirm();
    }
    const ErrorHandler = () => {
        setMessage(`Error ${response.statusCode}: ${response.message || 'Something went wrong! Please try again.'}`);
        setBtnClassName(btnDanger);
        setClassName(defaultClass);
        setIcon(ErrorIcon);
        setTitle('Opps!');
        setBtnTitle('Try Again');
        setSpinner(false);
    }
    const SuccessHandler = () => {
        setMessage(response.message || 'Action has been performed successfully.');
        setBtnTitle('Great');
        setBtnClassName(btnSuccess);
        setClassName(successClass);
        setIcon(SuccessIcon)
        setTitle('Success!');
        setDeleteSuccess(true);
        if(successProgress) successProgress();
    }
    const CloseModal = () => {
        closeModal();
    }
    useEffect(() => {
        if (response.statusCode != null && response.statusCode !== 200) {
            ErrorHandler();
        }
    }, [response.statusCode]);

    useEffect(() => {
        if (response.status === true && response.statusCode === 200) {
            SuccessHandler();
        }
    }, [response.status, response.statusCode]);
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
                        onClick={closeModalHandler}
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
                                className={`${className} w-20 h-20 rounded-full flex items-center justify-center`}>
                                {icon}
                            </motion.span>
                        </div>
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">{title}</h4>
                        <motion.p 
                            className="text-md leading-6 text-gray-500 dark:text-gray-400"
                            initial="hidden"
                            animate="visible"
                            variants={fadeVariants} 
                        >
                            {message}
                        </motion.p>
                        <div className="flex items-center justify-center w-full gap-3 mt-7">
                            { action == "delete" && !response?.status &&
                                <button 
                                    title="Okay"
                                    type="button" 
                                    onClick={!deleteSuccess?ProcessingHandler:CloseModal}
                                    disabled={progress?true:false} 
                                    className={`flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg ${btnClassName} sm:w-auto`}
                                >
                                {spinner && <Spinner />} {btnTitle}
                                </button>
                            }
                        </div>
                    </div>
                </motion.div>
            </motion.div>)}
        </AnimatePresence>
    )
}

export default ActionModal;