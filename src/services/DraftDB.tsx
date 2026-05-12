"use client";
import { openDB } from 'idb';

const STORES = ['blogs', 'brands'];

export const DraftDB = () => 
    typeof window !== 'undefined'
    ? openDB('drafts', 1, {
        upgrade(db) {
            STORES.forEach((store) => {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store);
                }
            });
        },
    })
    : null;