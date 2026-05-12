"use client"

import { useEffect, useRef, useState } from "react"
import { DraftDB } from "@/services/DraftDB"
import { BlogType } from "@/types/BlogType"
import { FieldValues } from "react-hook-form"

export function useDraftState<T extends FieldValues>({
    userId,
    draftId,
    tableName,
}: {
    userId: string
    draftId?: string
    tableName: string;
}) {

    const [draft, setDraft] = useState<T | null>();
    const [loading, setLoading] = useState(true)
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let mounted = true;
        const loadDraft = async () => {
            setLoading(true)
            try {
                const db = await DraftDB();
                if (db === null) return;
                let data = await db.get(tableName, `${userId}:${draftId}`)
    
                if (!data) {
                    data = {
                        id: null,
                        userId,
                        draftId,
                        createdAt: Date.now(),
                    }
                }
                if (mounted) setDraft(data);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false)
            }
        }
        if (userId && draftId) loadDraft();
        return () => { mounted = false; }

    }, [userId, draftId]);

    const getAll = async(): Promise<BlogType[]> => 
    {
        const db = await DraftDB();
        if (db === null) return [];
        const tx = db.transaction([tableName], "readonly")
        const store = tx.objectStore(tableName)

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
    const saveDraft = (nextDraft: T) => {
        setDraft(nextDraft)
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current)
        }
        saveTimerRef.current = setTimeout(async () => {
            try{
                const db = await DraftDB();
                if (db === null) return;
                await db.put(
                    tableName,
                    { ...nextDraft, updatedAt: Date.now() },
                    `${userId}:${draftId}`
                )
            } catch(err) {
                console.error("Store draft error:", err);
            }
        }, 600)
    }

    const deleteDraft = () => {
        setDraft(undefined);
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current)
        }
        saveTimerRef.current = setTimeout(async () => {
            try {
                const db = await DraftDB();
                if (db === null) return;
                await db.delete(tableName,`${userId}:${draftId}`);
            } catch (err) {
                console.error("Delete draft error:", err);
            }
        },600);
    }

    return { draft, getAll, saveDraft, deleteDraft, loading }
}