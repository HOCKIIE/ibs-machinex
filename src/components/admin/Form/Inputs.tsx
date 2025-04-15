import React from "react"
import { UseFormRegister  } from "react-hook-form";

interface PasswordErrors {
    email?: { type?: string };
    password?: { type?: string };
    confirmed?: boolean;
  }

interface PasswordType {
    create: boolean;
    register: UseFormRegister<{ password: string }>; // 👈 Specify the form data type
    errors: PasswordErrors;
}

export const InputPassword: React.FC<PasswordType> = ({ register, errors, create }) => 
{

    const invalidClass = "focus:border-rose-500 border-reose-300 text-rose-600 border-rose-300";
    const validClass = "focus:border-indigo-300 border-gray-300 text-gray-800 focus:ring-indigo-500/10";

    return <div className="space-y-3">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
        <input 
            id="password"
            type="password" 
            placeholder="Password"
            {...register("password", { required: true })}
            className={`dark:bg-dark-900 shadow-theme-xs w-full rounded-lg border bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 ${errors.confirmPassword ? `${invalidClass} `:`${validClass} `}dark:focus:border-indigo-800 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`}
        />
        {   errors?.password?.type === "required" 
            && <p className="text-xs text-rose-600">{create ? "This field is required." : "Recheck the field."}</p>
        }
    </div>
}