/**
 * Subject Search 2.0 - IndexedDB Storage Engine
 * High-performance, promise-based IndexedDB wrapper for offline academic data storage.
 */

const DB_NAME = 'SubjectSearchDB';
const DB_VERSION = 2;

const STORES = {
    COURSES: 'courses',
    COLLEGES: 'colleges',
    CALENDAR: 'calendar',
    PREREQUISITES: 'prerequisites',
    USER_LIBRARY: 'userLibrary',
    PLANNER_TASKS: 'plannerTasks',
    REVIEWS: 'reviews',
    META: 'metadata'
};

class IndexedDBStorage {
    constructor() {
        this.db = null;
        this.initPromise = this.init();
    }

    async init() {
        if (typeof window === 'undefined' || !('indexedDB' in window)) {
            console.warn('[Cache] IndexedDB is not supported in this environment.');
            return null;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores if not existing
                if (!db.objectStoreNames.contains(STORES.COURSES)) {
                    const courseStore = db.createObjectStore(STORES.COURSES, { keyPath: 'id' });
                    courseStore.createIndex('code', 'code', { unique: false });
                    courseStore.createIndex('college', 'college', { unique: false });
                    courseStore.createIndex('major', 'major', { unique: false });
                    courseStore.createIndex('level', 'level', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.COLLEGES)) {
                    db.createObjectStore(STORES.COLLEGES, { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains(STORES.CALENDAR)) {
                    const calStore = db.createObjectStore(STORES.CALENDAR, { keyPath: 'id' });
                    calStore.createIndex('startDate', 'startDate', { unique: false });
                    calStore.createIndex('type', 'type', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.PREREQUISITES)) {
                    db.createObjectStore(STORES.PREREQUISITES, { keyPath: 'courseCode' });
                }

                if (!db.objectStoreNames.contains(STORES.USER_LIBRARY)) {
                    const libStore = db.createObjectStore(STORES.USER_LIBRARY, { keyPath: 'id' });
                    libStore.createIndex('type', 'type', { unique: false });
                    libStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.PLANNER_TASKS)) {
                    const taskStore = db.createObjectStore(STORES.PLANNER_TASKS, { keyPath: 'id' });
                    taskStore.createIndex('dueDate', 'dueDate', { unique: false });
                    taskStore.createIndex('courseCode', 'courseCode', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.REVIEWS)) {
                    const reviewStore = db.createObjectStore(STORES.REVIEWS, { keyPath: 'id' });
                    reviewStore.createIndex('courseCode', 'courseCode', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.META)) {
                    db.createObjectStore(STORES.META, { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error('[Cache] IndexedDB open error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getStore(storeName, mode = 'readonly') {
        await this.initPromise;
        if (!this.db) return null;
        const transaction = this.db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    async get(storeName, key) {
        try {
            const store = await this.getStore(storeName, 'readonly');
            if (!store) return null;
            return new Promise((resolve, reject) => {
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.error(`[Cache] Error getting ${key} from ${storeName}:`, e);
            return null;
        }
    }

    async getAll(storeName) {
        try {
            const store = await this.getStore(storeName, 'readonly');
            if (!store) return [];
            return new Promise((resolve, reject) => {
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.error(`[Cache] Error getAll from ${storeName}:`, e);
            return [];
        }
    }

    async set(storeName, value) {
        try {
            const store = await this.getStore(storeName, 'readwrite');
            if (!store) return false;
            return new Promise((resolve, reject) => {
                const req = store.put(value);
                req.onsuccess = () => resolve(true);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.error(`[Cache] Error setting in ${storeName}:`, e);
            return false;
        }
    }

    async setMany(storeName, items) {
        try {
            await this.initPromise;
            if (!this.db) return false;
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);

            items.forEach(item => store.put(item));

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => reject(transaction.error);
            });
        } catch (e) {
            console.error(`[Cache] Error batch setting in ${storeName}:`, e);
            return false;
        }
    }

    async delete(storeName, key) {
        try {
            const store = await this.getStore(storeName, 'readwrite');
            if (!store) return false;
            return new Promise((resolve, reject) => {
                const req = store.delete(key);
                req.onsuccess = () => resolve(true);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.error(`[Cache] Error deleting ${key} from ${storeName}:`, e);
            return false;
        }
    }

    async clear(storeName) {
        try {
            const store = await this.getStore(storeName, 'readwrite');
            if (!store) return false;
            return new Promise((resolve, reject) => {
                const req = store.clear();
                req.onsuccess = () => resolve(true);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.error(`[Cache] Error clearing ${storeName}:`, e);
            return false;
        }
    }
}

export { STORES, IndexedDBStorage };
export const idbStorage = new IndexedDBStorage();
export default idbStorage;
