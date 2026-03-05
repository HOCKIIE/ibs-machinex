import { openDB } from 'idb'

export const BlogDraftDB = openDB('blog-drafts', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('drafts')) {
            db.createObjectStore('drafts')
        }
    },
})