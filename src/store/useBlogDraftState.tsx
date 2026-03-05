"use client"

import { useEffect, useRef, useState } from "react"
import { BlogDraftDB } from "@/services/BlogDraftDB"

interface BlogDraft {
    [key: string]: any
    updatedAt?: number
}

export function useBlogDraftState({
    userId,
    draftId,
}: {
    userId: string
    draftId: string
}) {

    const [draft, setDraft] = useState<BlogDraft | null>(null)
    const [loading, setLoading] = useState(true)
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    /* =======================
        LOAD (ครั้งเดียว)
    ======================= */
    useEffect(() => {
    let mounted = true

    const loadDraft = async () => {
        setLoading(true)
        const db = await BlogDraftDB
        let data = await db.get("drafts", `${userId}:${draftId}`)

        // ✅ ถ้ายังไม่มี draft ให้สร้างใหม่
        if (!data) {
            data = {
                id: null,
                userId,
                draftId,
                createdAt: Date.now(),
            }
        }

        if (mounted) {
            setDraft(data)
        }

        setLoading(false)
    }

    if (userId && draftId) {
        loadDraft()
    }

    return () => {
        mounted = false
    }
}, [userId, draftId])

    /* =======================
        SAVE (debounce)
    ======================= */
    const saveDraft = (nextDraft: BlogDraft) => {
        setDraft(nextDraft)
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current)
        }
        saveTimerRef.current = setTimeout(async () => {
            try{
                const db = await BlogDraftDB;
                await db.put(
                    "drafts",
                    { ...nextDraft, updatedAt: Date.now() },
                    `${userId}:${draftId}`
                )
            } catch(err) {
                console.error("Store draft error:", err);
            }
        }, 600)
    }

    const deleteDraft = () => {
        setDraft(null);
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current)
        }
        saveTimerRef.current = setTimeout(async () => {
            try {
                const db = await BlogDraftDB;
                await db.delete("drafts",`${userId}:${draftId}`);
            } catch (err) {
                console.error("Delete draft error:", err);
            }
        },600);
    }

    return { draft, saveDraft, deleteDraft, loading }
}