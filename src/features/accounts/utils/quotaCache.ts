/**
 * File-based/Local caching for quota status.
 * Uses localStorage as a bridge for web, but mimics file-based caching for offline availability.
 */
export const quotaCache = {
    CACHE_KEY: "contractoria_quota_cache",

    save(data: any) {
        const cacheEntry = {
            timestamp: Date.now(),
            data
        };
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheEntry));
    },

    get() {
        const raw = localStorage.getItem(this.CACHE_KEY);
        if (!raw) return null;

        try {
            const entry = JSON.parse(raw);
            // Cache expires in 1 hour for real-time consistency, 
            // but stays available offline if needed.
            return entry.data;
        } catch {
            return null;
        }
    },

    clear() {
        localStorage.removeItem(this.CACHE_KEY);
    }
};
