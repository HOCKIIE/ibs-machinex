"use client";

import { motion } from "framer-motion";
import { UseFormSetValue, UseFormStateReturn, UseFormWatch, Controller, Path, FieldValues, UseFormReturn } from 'react-hook-form';

interface Props<T extends FieldValues> { 
    name: string;
    control: UseFormReturn<T>["control"];
    className?: string;
    label?: string;
}
const Checkbox = <T extends FieldValues>({ name, control, className, label }: Props<T>) => {
    return (
        <Controller
            name={name as Path<T>}
            control={control}
            render={({ field }) => {
                const isChecked = Boolean(field.value);
                return (
                <label className={`flex items-center cursor-pointer${className?` ${className}`:''}`}>
                    <input type="checkbox" value="1" checked={isChecked} onChange={(e) => field.onChange(e.target.checked)} className="hidden" />
                    <motion.div
                        className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${isChecked ? "bg-indigo-500 border-indigo-500" : "border-gray-300"}`}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {isChecked && (
                            <motion.svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a 1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                            </motion.svg>
                        )}
                    </motion.div>
                    {label && <span className="ml-2 text-gray-700">{label}</span>}
                </label>
            )}}>
        </Controller>
    );
}

export default Checkbox;