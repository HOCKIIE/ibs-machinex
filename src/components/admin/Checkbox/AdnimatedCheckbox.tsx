"use client";

import { useState } from "react";
import { motion } from "framer-motion";


interface Props { 
    label?: string;
    className?: string;
    selectAll?: boolean;
    checked?: boolean;
    onChange?: () => void;
}

export default function AnimatedCheckbox({ checked, onChange, className, label }: Props) {
    // const [checked, setChecked] = useState(false);

    return (
        <label className={`flex items-center cursor-pointer${className?` ${className}$`:''}`}>
            <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
            <motion.div
                className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {checked && (
                    <motion.svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a 1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </motion.svg>
                )}
            </motion.div>
            {label && <span className="ml-2 text-gray-700">{label}</span>}
        </label>
    );
}