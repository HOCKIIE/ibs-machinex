"use client"

import { useEffect, useRef, useState } from "react"
import { BlogDraftDB } from "@/services/BlogDraftDB"
import { BlogType } from "@/types/BlogType"

interface BlogDraft {
    [key: string]: any
    updatedAt?: number
}

export function useBlogDraftState({
    userId,
    draftId,
}: {
    userId: string
    draftId?: string
}) {

    const [draft, setDraft] = useState<BlogDraft | null>(null);
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
            if (!db) return;
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

    const getAll = async(): Promise<BlogType[]> => {
        const db = await BlogDraftDB
        if (!db) return [];
        const tx = db.transaction(["drafts"], "readonly")
        const store = tx.objectStore("drafts")

        const drafts: BlogType[] = []
        let cursor = await store.openCursor()

        while (cursor) {

            if ((cursor.key as string).startsWith(`${userId}:`)) {
                drafts.push(cursor.value);
            }

            cursor = await cursor.continue()
        }
        return drafts;
    }

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
                if (!db) return;
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
                if (!db) return;
                await db.delete("drafts",`${userId}:${draftId}`);
            } catch (err) {
                console.error("Delete draft error:", err);
            }
        },600);
    }

    return { draft, getAll, saveDraft, deleteDraft, loading }
}