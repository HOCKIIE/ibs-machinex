"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-99"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg w-full h-auto max-w-5xl max-h-[65%] mx-2 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ className,children }:{ className?: string; children: React.ReactNode; }) {
    return <div className={cn("p-6 space-y-4", className)}>{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col space-y-2">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
    return <div className="flex justify-end space-x-2 pt-4 border-t">{children}</div>;
}
