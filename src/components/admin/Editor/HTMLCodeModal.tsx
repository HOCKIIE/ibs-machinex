"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { Textarea } from "@/components/admin/ui/textarea";

interface HTMLCodeModalProps {
    open: boolean;
    initialHTML: string;
    onClose: () => void;
    onSave: (html: string) => void;
}

export default function HTMLCodeModal({
    open,
    initialHTML,
    onClose,
    onSave,
}: HTMLCodeModalProps) {
    const [html, setHtml] = useState(initialHTML);

    useEffect(() => {
        if (open) setHtml(initialHTML);
    }, [open, initialHTML]);
    
    const handleSave = () => {
        onSave(html);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Edit HTML Code</DialogTitle>
                </DialogHeader>
                <Textarea
                    value={html ?? ''}
                    onChange={(e) => setHtml(e.target.value)}
                    className="min-h-[500px] font-mono text-sm w-full focus:ring focus:ring-indigo-300 border border-gray-400 rounded-sm outline-none"
                />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
