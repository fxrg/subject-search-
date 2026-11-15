/**
 * Subject Search 2.0 - Centralized Cache Manager
 * Implements Stale-While-Revalidate, Request Deduplication, Versioning & Offline Resilience.
 */

import { idbStorage, STORES } from './indexeddb.js';
import { CONFIG } from '../core/config.js';

class CacheManager {
    constructor() {
        this.inFlightRequests = new Map();
        this.memoryCache = new Map();
        this.syncListeners = new Set();
    }

    /**
     * Stale-while-revalidate fetcher
     * @param {string} key - Cache identifier
     * @param {string} storeName - IndexedDB store
     * @param {Function} networkFetcher - Async function returning fresh data
     * @param {number} [ttlMs] - Time to live
     */
    async fetchWithSWR(key, storeName, networkFetcher, ttlMs = CONFIG.CACHE_EXPIRATION_MS) {
        // 1. Check in-memory cache first
        if (this.memoryCache.has(key)) {
            const memItem = this.memoryCache.get(key);
            if (Date.now() - memItem.timestamp < 30000) { // 30s fresh
                return memItem.data;
            }
        }

        // 2. Check IndexedDB persistent cache
        const cachedEntry = await idbStorage.get(storeName, key);
        const hasValidCache = cachedEntry && cachedEntry.data;
        const isStale = !cachedEntry || (Date.now() - (cachedEntry.cachedAt || 0) > ttlMs);

        // If we have cached data, return it immediately and revalidate in background if stale
        if (hasValidCache) {
            this.memoryCache.set(key, { data: cachedEntry.data, timestamp: Date.now() });

            if (isStale) {
                // Background revalidation
                this.revalidateInBackground(key, storeName, networkFetcher);
            }
            return cachedEntry.data;
        }

        // 3. No cache exists - must await network fetch (with deduplication)
        return this.deduplicateRequest(key, async () => {
            try {
                const freshData = await networkFetcher();
                if (freshData) {
                    await this.persistData(key, storeName, freshData);
                }
                return freshData;
            } catch (error) {
                console.warn(`[CacheManager] Network fetch failed for ${key}, checking fallback:`, error);
                if (cachedEntry && cachedEntry.data) {
                    return cachedEntry.data;
                }
                throw error;
            }
        });
    }

    /**
     * Deduplicates simultaneous requests to the same resource
     */
    async deduplicateRequest(key, fetchFn) {
        if (this.inFlightRequests.has(key)) {
            return this.inFlightRequests.get(key);
        }

        const promise = fetchFn().finally(() => {
            this.inFlightRequests.delete(key);
        });

        this.inFlightRequests.set(key, promise);
        return promise;
    }

    /**
     * Revalidate resource in the background without blocking UI
     */
    async revalidateInBackground(key, storeName, networkFetcher) {
        try {
            const freshData = await this.deduplicateRequest(key, networkFetcher);
            if (freshData) {
                await this.persistData(key, storeName, freshData);
                this.notifyDataUpdated(key, freshData);
            }
        } catch (e) {
            console.debug(`[CacheManager] Background revalidation failed for ${key} (offline or network error)`);
        }
    }

    /**
     * Persist data to memory and IndexedDB
     */
    async persistData(key, storeName, data) {
        const payload = {
            id: key,
            data: data,
            cachedAt: Date.now(),
            version: CONFIG.CACHE_VERSION
        };

        this.memoryCache.set(key, { data, timestamp: Date.now() });
        await idbStorage.set(storeName, payload);
    }

    /**
     * Register a listener for background data changes
     */
    onUpdate(listener) {
        this.syncListeners.add(listener);
        return () => this.syncListeners.delete(listener);
    }

    notifyDataUpdated(key, freshData) {
        this.syncListeners.forEach(listener => {
            try {
                listener(key, freshData);
            } catch (e) {
                console.error('[CacheManager] Error in update listener:', e);
            }
        });
    }

    /**
     * Invalidate specific key or whole store
     */
    async invalidate(storeName, key = null) {
        if (key) {
            this.memoryCache.delete(key);
            await idbStorage.delete(storeName, key);
        } else {
            this.memoryCache.clear();
            await idbStorage.clear(storeName);
        }
    }
}

export const cacheManager = new CacheManager();
export default cacheManager;
